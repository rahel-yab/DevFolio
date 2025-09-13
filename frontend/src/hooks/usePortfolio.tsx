"use client";
import { useState, useCallback } from "react";
import { apiService, Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from "../services/api";

interface UsePortfolioReturn {
  portfolios: Portfolio[];
  isLoading: boolean;
  error: string | null;
  fetchUserPortfolios: () => Promise<void>;
  fetchPortfolio: (id: string) => Promise<Portfolio | null>;
  createPortfolio: (data: CreatePortfolioRequest) => Promise<Portfolio | null>;
  updatePortfolio: (id: string, data: UpdatePortfolioRequest) => Promise<Portfolio | null>;
  deletePortfolio: (id: string) => Promise<void>;
}

export const usePortfolio = (): UsePortfolioReturn => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPortfolios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userPortfolios = await apiService.getUserPortfolios();
      setPortfolios(Array.isArray(userPortfolios) ? userPortfolios : []);
    } catch (err) {
      setError("Failed to fetch portfolios");
      setPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPortfolio = useCallback(async (id: string): Promise<Portfolio | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const portfolio = await apiService.getPortfolio(id);
      return portfolio;
    } catch (err) {
      setError("Failed to fetch portfolio");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPortfolio = useCallback(async (data: CreatePortfolioRequest): Promise<Portfolio | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const portfolio = await apiService.createPortfolio(data);
      setPortfolios(prev => [...prev, portfolio]);
      return portfolio;
    } catch (err) {
      setError("Failed to create portfolio");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePortfolio = useCallback(async (id: string, data: UpdatePortfolioRequest): Promise<Portfolio | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const portfolio = await apiService.updatePortfolio(id, data);
      setPortfolios(prev => prev.map(p => p.id === id ? portfolio : p));
      return portfolio;
    } catch (err) {
      setError("Failed to update portfolio");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePortfolio = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.deletePortfolio(id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError("Failed to delete portfolio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    portfolios,
    isLoading,
    error,
    fetchUserPortfolios,
    fetchPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
};
