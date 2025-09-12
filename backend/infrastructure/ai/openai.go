package ai

import (
	"context"
	"fmt"

	"devfolio-backend/infrastructure/config"
	"github.com/sashabaranov/go-openai"
)

type OpenAIClient struct {
	client *openai.Client
	model  string
}

func NewOpenAIClient(cfg *config.Config) *OpenAIClient {
	client := openai.NewClient(cfg.AI.OpenAIAPIKey)
	return &OpenAIClient{
		client: client,
		model:  cfg.AI.OpenAIModel,
	}
}

func (ai *OpenAIClient) GeneratePortfolioContent(ctx context.Context, userInfo map[string]interface{}) (string, error) {
	prompt := ai.buildPrompt(userInfo)
	
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
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no content generated")
	}

	return resp.Choices[0].Message.Content, nil
}

func (ai *OpenAIClient) GenerateProjectDescription(ctx context.Context, projectName, techStack string) (string, error) {
	prompt := fmt.Sprintf("Generate a professional project description for a project named '%s' using technologies: %s. Make it engaging and highlight the technical challenges and solutions.", projectName, techStack)
	
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
		return "", fmt.Errorf("failed to generate project description: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no description generated")
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