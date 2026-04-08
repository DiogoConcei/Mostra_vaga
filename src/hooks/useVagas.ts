import { useState, useEffect, useCallback } from 'react';
import type { Vaga } from '../types/vaga';

const API_URL = "http://localhost:8000";
const CACHE_KEY = 'vagas_cache';
const SORT_KEY = 'vagas_sort_order';

export type SortOrder = 'date' | 'score';

export function useVagas() {
  const [vagas, setVagas] = useState<Vaga[]>(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (localStorage.getItem(SORT_KEY) as SortOrder) || 'date';
  });
  const [loading, setLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const applySort = useCallback((data: Vaga[], order: SortOrder) => {
    const sorted = [...data];
    if (order === 'score') {
      sorted.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    } else {
      // Ordenação por ID (mais recentes primeiro)
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  }, []);

  const changeSortOrder = (newOrder: SortOrder) => {
    setSortOrder(newOrder);
    localStorage.setItem(SORT_KEY, newOrder);
    setVagas(prev => applySort(prev, newOrder));
  };

  const checkScraperStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/scraper/status`);
      const status = await response.json();
      setIsScraping(status.is_running);
      return status.is_running;
    } catch (error) {
      console.error("Erro ao verificar status do scraper:", error);
      return false;
    }
  }, []);

  const fetchVagas = useCallback(async () => {
    if (vagas.length === 0) setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/vagas`);
      const data: Vaga[] = await response.json();
      
      const sortedData = applySort(data, sortOrder);
      
      setVagas(sortedData);
      localStorage.setItem(CACHE_KEY, JSON.stringify(sortedData));
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setLoading(false);
    }
  }, [vagas.length, sortOrder, applySort]);

  const refreshVagas = async () => {
    if (isScraping) return;
    
    setIsScraping(true);
    try {
      const res = await fetch(`${API_URL}/vagas/atualizar`, { method: 'POST' });
      const data = await res.json();
      
      if (data.is_running) {
        const interval = setInterval(async () => {
          const running = await checkScraperStatus();
          if (!running) {
            clearInterval(interval);
            fetchVagas();
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setIsScraping(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_URL}/vagas/${id}/status?status=${status}`, { method: 'PATCH' });
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
    checkScraperStatus();
  }, [fetchVagas, checkScraperStatus]);

  return { 
    vagas, 
    loading, 
    isScraping,
    sortOrder,
    changeSortOrder,
    refreshVagas, 
    updateStatus, 
    clearCache 
  };
}
