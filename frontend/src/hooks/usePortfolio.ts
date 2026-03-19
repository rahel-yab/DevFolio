"use client";

import { useCallback, useState } from 'react';
import { apiService, Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from '../services/api';

export const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPortfolios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userPortfolios = await apiService.getUserPortfolios();
      // Ensure we always have an array
      setPortfolios(Array.isArray(userPortfolios) ? userPortfolios : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolios');
      setPortfolios([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPortfolio = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const portfolio = await apiService.getPortfolio(id);
      setCurrentPortfolio(portfolio);
      return portfolio;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPortfolio = useCallback(async (portfolioData: CreatePortfolioRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPortfolio = await apiService.createPortfolio(portfolioData);
      setPortfolios(prev => [...prev, newPortfolio]);
      return newPortfolio;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePortfolio = useCallback(async (id: string, updates: UpdatePortfolioRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPortfolio = await apiService.updatePortfolio(id, updates);
      setPortfolios(prev => 
        prev.map(p => p.id === id ? updatedPortfolio : p)
      );
      if (currentPortfolio?.id === id) {
        setCurrentPortfolio(updatedPortfolio);
      }
      return updatedPortfolio;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPortfolio]);

  const deletePortfolio = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
      if (currentPortfolio?.id === id) {
        setCurrentPortfolio(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPortfolio]);

  const enhanceWithAI = useCallback(async (portfolioId: string, fields: string[], context?: unknown) => {
    setIsLoading(true);
    setError(null);
    try {
      const enhancedPortfolio = await apiService.enhanceWithAI(portfolioId, fields, context);
      setPortfolios(prev => 
        prev.map(p => p.id === portfolioId ? enhancedPortfolio : p)
      );
      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(enhancedPortfolio);
      }
      return enhancedPortfolio;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance portfolio with AI');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPortfolio]);

  return {
    portfolios,
    currentPortfolio,
    isLoading,
    error,
    fetchUserPortfolios,
    fetchPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    enhanceWithAI,
    setCurrentPortfolio,
  };
};
