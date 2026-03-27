import { useState, useEffect, useCallback, useMemo } from 'react';
import { API_URL } from '../constants/vagas';
import type { Curriculo } from '../types/vaga';

export function useResumes() {
  const [resumes, setResumes] = useState<Curriculo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/curriculos`);
      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error("Erro ao buscar currículos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResume = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log(`[Frontend] Enviando ${file.name}...`);
      const response = await fetch(`${API_URL}/curriculos/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("[Frontend] Erro do servidor:", errorDetail);
        throw new Error(`Falha no upload: ${response.status}`);
      }

      const result = await response.json();
      console.log("[Frontend] Sucesso:", result.message);
      
      // Força uma atualização da lista
      await fetchResumes();
      
    } catch (error) {
      console.error("[Frontend] Erro capturado:", error);
      alert(`Erro ao enviar currículo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleResume = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/curriculos/${id}/toggle`, { method: 'PATCH' });
      if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Erro ao alterar status do currículo");
        return;
      }
      await fetchResumes();
    } catch (error) {
      console.error("Erro ao alternar currículo:", error);
    }
  };

  const deleteResume = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este currículo?")) return;
    try {
      await fetch(`${API_URL}/curriculos/${id}`, { method: 'DELETE' });
      await fetchResumes();
    } catch (error) {
      console.error("Erro ao deletar currículo:", error);
    }
  };

  const activeResumeKeywords = useMemo(() => {
    return resumes
      .filter(r => r.is_active)
      .map(r => r.texto_extraido)
      .join(" ");
  }, [resumes]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  return {
    resumes,
    activeResumeKeywords,
    loading,
    uploadResume,
    toggleResume,
    deleteResume,
    refreshResumes: fetchResumes
  };
}
