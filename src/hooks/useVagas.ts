import { useState, useEffect, useCallback } from 'react';
import type { Vaga } from '../types/vaga';

const API_URL = "http://localhost:8000";
const CACHE_KEY = 'vagas_cache';

export function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const fetchVagas = useCallback(async () => {
    // Only show loading if we don't have data yet
    if (vagas.length === 0) setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/vagas`);
      const data: Vaga[] = await response.json();
      
      // Ordenação por Match Score (Maior para Menor)
      const sortedData = data.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      
      setVagas(sortedData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(sortedData));
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setLoading(false);
    }
  }, [vagas.length]);

  const refreshVagas = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/vagas/atualizar`, { method: 'POST' });
      await fetchVagas();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_URL}/vagas/${id}/status?status=${status}`, { method: 'PATCH' });
      // Optimistic update
      setVagas(prev => prev.map(v => v.id === id ? { ...v, status: status as any } : v));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    window.location.reload();
  };

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  return { 
    vagas, 
    loading, 
    refreshVagas, 
    updateStatus, 
    clearCache 
  };
}
