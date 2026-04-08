import { useState, useMemo } from 'react';
import type { Vaga, TabAtiva } from '../types/vaga';

export function useVagaFilters(vagas: Vaga[]) {
  const [abaAtiva, setAbaAtiva] = useState<TabAtiva>('disponiveis');
  const [busca, setBusca] = useState("");
  const [filtroArea, setFiltroArea] = useState<string | null>(null);
  const [filtroRegiao, setFiltroRegiao] = useState<string | null>(null);
  const [mostrarRejeitadas, setMostrarRejeitadas] = useState(false);

  const filteredVagas = useMemo(() => {
    return vagas.filter(vaga => {
      // Tab filter
      if (abaAtiva === 'candidaturas') {
        if (vaga.status !== "Candidatado") return false;
      } else {
        if (vaga.status === "Candidatado") return false;
        if (!mostrarRejeitadas && vaga.status === "Rejeitado") return false;
      }

      // Tech filter
      if (filtroArea && vaga.area !== filtroArea) return false;

      // Search filter with Fuzzy/Synonym support
      if (busca) {
        const termo = busca.toLowerCase().trim();
        
        // Mapeamento de Sinônimos (Fuzzy Light)
        const sinonimos: Record<string, string[]> = {
          "js": ["javascript", "node", "typescript", "ts"],
          "javascript": ["js", "typescript", "ts"],
          "ts": ["typescript", "js", "javascript"],
          "python": ["py", "django", "fastapi", "flask", "pandas", "dados"],
          "dados": ["data", "sql", "python", "pandas", "bi", "analytics"],
          "dev": ["desenvolvedor", "software", "web", "programador", "engineer"],
          "react": ["frontend", "front", "web", "js", "javascript", "native"],
          "web": ["frontend", "backend", "fullstack", "react", "html", "css", "js"],
          "estagio": ["intern", "estagiário", "estagiaria", "aprendiz"],
          "jr": ["junior", "júnior", "trainee", "entry"],
          "rj": ["rio", "janeiro"]
        };

        const termosParaBuscar = [termo];
        if (sinonimos[termo]) {
          termosParaBuscar.push(...sinonimos[termo]);
        }

        const match = termosParaBuscar.some(t => 
          vaga.titulo.toLowerCase().includes(t) ||
          vaga.empresa.toLowerCase().includes(t) ||
          vaga.area.toLowerCase().includes(t) ||
          (vaga.keywords_ats && vaga.keywords_ats.toLowerCase().includes(t))
        );

        if (!match) return false;
      }

      // Region filter
      if (filtroRegiao) {
        const loc = vaga.localizacao?.toLowerCase() || "";
        const mod = vaga.modalidade?.toLowerCase() || "";
        
        const isRJ = loc.includes("rio") || loc.includes("rj") || loc.includes("niterói") || loc.includes("caxias");
        const isRemoto = loc.includes("remoto") || mod.includes("remoto");

        if (filtroRegiao === "Rio de Janeiro" && !isRJ) return false;
        if (filtroRegiao === "Remoto" && !isRemoto) return false;
        if (filtroRegiao === "Outros" && (isRJ || isRemoto)) return false;
      }

      return true;
    });
  }, [vagas, abaAtiva, mostrarRejeitadas, filtroArea, busca, filtroRegiao]);

  const stats = useMemo(() => ({
    disponiveis: vagas.filter(v => v.status !== "Candidatado" && (mostrarRejeitadas || v.status !== "Rejeitado")).length,
    candidaturas: vagas.filter(v => v.status === "Candidatado").length
  }), [vagas, mostrarRejeitadas]);

  return {
    abaAtiva, setAbaAtiva,
    busca, setBusca,
    filtroArea, setFiltroArea,
    filtroRegiao, setFiltroRegiao,
    mostrarRejeitadas, setMostrarRejeitadas,
    filteredVagas,
    stats
  };
}
