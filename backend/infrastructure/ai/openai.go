package ai

import (
	"context"
	"fmt"
	"strings"

	"devfolio-backend/infrastructure/config"
	"github.com/sashabaranov/go-openai"
)

type OpenAIClient struct {
	client *openai.Client
	model  string
	apiKey string
}

func NewOpenAIClient(cfg *config.Config) *OpenAIClient {
	client := openai.NewClient(cfg.AI.OpenAIAPIKey)
	return &OpenAIClient{
		client: client,
		model:  cfg.AI.OpenAIModel,
		apiKey: cfg.AI.OpenAIAPIKey,
	}
}

func (ai *OpenAIClient) GeneratePortfolioContent(ctx context.Context, userInfo map[string]interface{}) (string, error) {
	prompt := ai.buildPrompt(userInfo)

	if strings.TrimSpace(ai.apiKey) == "" {
		return ai.localPortfolioContent(userInfo), nil
	}

	resp, err := ai.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: ai.model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are an expert portfolio builder. Generate professional, engaging portfolio content based on the user's information. Focus on highlighting achievements, skills, and experience in a compelling way.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			MaxTokens:   1000,
			Temperature: 0.7,
		},
	)

	if err != nil {
		return ai.localPortfolioContent(userInfo), nil
	}

	if len(resp.Choices) == 0 {
		return ai.localPortfolioContent(userInfo), nil
	}

	return resp.Choices[0].Message.Content, nil
}

func (ai *OpenAIClient) GenerateProjectDescription(ctx context.Context, projectName, techStack string) (string, error) {
	prompt := fmt.Sprintf("Generate a professional project description for a project named '%s' using technologies: %s. Make it engaging and highlight the technical challenges and solutions.", projectName, techStack)

	if strings.TrimSpace(ai.apiKey) == "" {
		return ai.localProjectDescription(projectName, techStack), nil
	}

	resp, err := ai.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: ai.model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a technical writer specializing in project descriptions for developer portfolios.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			MaxTokens:   300,
			Temperature: 0.6,
		},
	)

	if err != nil {
		return ai.localProjectDescription(projectName, techStack), nil
	}

	if len(resp.Choices) == 0 {
		return ai.localProjectDescription(projectName, techStack), nil
	}

	return resp.Choices[0].Message.Content, nil
}

func (ai *OpenAIClient) buildPrompt(userInfo map[string]interface{}) string {
	prompt := "Generate enhanced portfolio content based on the following information:\n\n"
	
	for key, value := range userInfo {
		prompt += fmt.Sprintf("%s: %v\n", key, value)
	}
	
	prompt += "\nPlease enhance this information to create compelling portfolio content that highlights the person's strengths, achievements, and potential. Focus on professional language and quantifiable achievements where possible."
	
	return prompt
}

func (ai *OpenAIClient) localPortfolioContent(userInfo map[string]interface{}) string {
	name := strings.TrimSpace(fmt.Sprint(userInfo["name"]))
	title := strings.TrimSpace(fmt.Sprint(userInfo["title"]))
	bio := strings.TrimSpace(fmt.Sprint(userInfo["bio"]))
	skills := strings.TrimSpace(fmt.Sprint(userInfo["skills"]))

	var builder strings.Builder
	if name != "" || title != "" {
		builder.WriteString(strings.TrimSpace(name + " is a " + title + ". "))
	}
	if bio != "" && bio != "<nil>" {
		builder.WriteString(strings.TrimSpace(bio))
		if !strings.HasSuffix(strings.TrimSpace(bio), ".") {
			builder.WriteString(".")
		}
		builder.WriteString(" ")
	}
	if skills != "" && skills != "[]" {
		builder.WriteString("Key strengths include ")
		builder.WriteString(strings.Trim(skills, "[]"))
		builder.WriteString(", with an emphasis on practical execution, strong collaboration, and shipping polished work.")
	} else {
		builder.WriteString("This portfolio highlights practical experience, thoughtful execution, and a focus on delivering clear results.")
	}

	return strings.TrimSpace(builder.String())
}

func (ai *OpenAIClient) localProjectDescription(projectName, techStack string) string {
	projectName = strings.TrimSpace(projectName)
	techStack = strings.TrimSpace(techStack)
	if techStack == "" {
		return fmt.Sprintf("%s is a hands-on project focused on solving a real user or workflow problem with a reliable, production-minded implementation.", projectName)
	}

	return fmt.Sprintf("%s is a production-minded project built with %s, focused on solving a real problem with a clear developer experience and maintainable implementation.", projectName, techStack)
}
