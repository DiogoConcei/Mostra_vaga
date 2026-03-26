import { useState, useEffect } from 'react'
import './App.css'

interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  link: string;
  localizacao: string;
  area: string;
  data_postagem: string;
  status: string;
}

function App() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroArea, setFiltroArea] = useState<string | null>(null);
  const [filtroRegiao, setFiltroRegiao] = useState<string | null>(null);
  const [mostrarRejeitadas, setMostrarRejeitadas] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'disponiveis' | 'candidaturas'>('disponiveis');

  const API_URL = "http://localhost:8000";

  const fetchVagas = async (area: string | null = null) => {
    setLoading(true);
    try {
      const url = area ? `${API_URL}/vagas?area=${area}` : `${API_URL}/vagas`;
      const response = await fetch(url);
      const data = await response.json();
      setVagas(data);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarVagas = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/vagas/atualizar`, { method: 'POST' });
      fetchVagas(filtroArea);
    } catch (error) {
      console.error("Erro ao atualizar vagas:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_URL}/vagas/${id}/status?status=${status}`, { method: 'PATCH' });
      fetchVagas(filtroArea);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  useEffect(() => {
    fetchVagas();
  }, []);

  const areas = ["Dados", "Front-end", "Back-end", "Full-stack"];
  const regioes = ["Rio de Janeiro", "Remoto", "Outros"];

  const filtrarVagas = (vaga: Vaga) => {
    if (abaAtiva === 'candidaturas') {
      if (vaga.status !== "Candidatado") return false;
    } else {
      if (vaga.status === "Candidatado") return false;
      if (!mostrarRejeitadas && vaga.status === "Rejeitado") return false;
    }

    if (filtroArea && vaga.area !== filtroArea) return false;

    if (filtroRegiao) {
      const loc = vaga.localizacao.toLowerCase();
      const isRJ = loc.includes("rio") || loc.includes("rj");
      const isRemoto = loc.includes("remoto");

      if (filtroRegiao === "Rio de Janeiro" && !isRJ) return false;
      if (filtroRegiao === "Remoto" && !isRemoto) return false;
      if (filtroRegiao === "Outros" && (isRJ || isRemoto)) return false;
    }

    return true;
  };

  const contagemDisponiveis = vagas.filter(v => v.status !== "Candidatado" && (mostrarRejeitadas || v.status !== "Rejeitado")).length;
  const contagemCandidaturas = vagas.filter(v => v.status === "Candidatado").length;

  return (
    <div className="container">
      <header>
        <h1>InternHunt 🤖</h1>
        <p>Monitoramento avançado de vagas tech para estudantes</p>
        
        <div className="main-tabs">
          <button 
            className={`tab-btn ${abaAtiva === 'disponiveis' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('disponiveis')}
          >
            📋 Disponíveis <span>{contagemDisponiveis}</span>
          </button>
          <button 
            className={`tab-btn ${abaAtiva === 'candidaturas' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('candidaturas')}
          >
            🎯 Em Andamento <span>{contagemCandidaturas}</span>
          </button>
        </div>
      </header>
        
      <div className="control-bar">
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">Tecnologia</span>
            <button onClick={() => setFiltroArea(null)} className={`filter-btn ${filtroArea === null ? 'active' : ''}`}>Todas</button>
            {areas.map(area => (
              <button key={area} onClick={() => setFiltroArea(area)} className={`filter-btn ${filtroArea === area ? 'active' : ''}`}>{area}</button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-label">Localização</span>
            <button onClick={() => setFiltroRegiao(null)} className={`filter-btn ${filtroRegiao === null ? 'active' : ''}`}>Qualquer</button>
            {regioes.map(regiao => (
              <button key={regiao} onClick={() => setFiltroRegiao(regiao)} className={`filter-btn ${filtroRegiao === regiao ? 'active' : ''}`}>{regiao}</button>
            ))}
          </div>
        </div>

        <div className="actions-row">
          {abaAtiva === 'disponiveis' ? (
            <button onClick={() => setMostrarRejeitadas(!mostrarRejeitadas)} className={`status-toggle ${mostrarRejeitadas ? 'active' : ''}`}>
              {mostrarRejeitadas ? "👁️ Ocultar Recusadas" : "🙈 Mostrar Recusadas"}
            </button>
          ) : <div></div>}
          
          <button onClick={atualizarVagas} className="refresh-btn" disabled={loading}>
            {loading ? "⚙️ Sincronizando..." : "🚀 Buscar Novas Vagas"}
          </button>
        </div>
      </div>

      <main>
        {loading && <p className="status-msg">Procurando oportunidades... (Isso pode levar alguns minutos)</p>}
        {!loading && vagas.filter(filtrarVagas).length === 0 && (
          <p className="status-msg">
            {abaAtiva === 'candidaturas' 
              ? "Você ainda não tem candidaturas ativas. Volte para a aba de 'Disponíveis' e comece a aplicar!" 
              : "Nenhuma oportunidade encontrada. Ajuste os filtros ou busque por novas vagas."}
          </p>
        )}
        
        <div className="vagas-grid">
          {vagas
            .filter(filtrarVagas)
            .map(vaga => {
              const isRJ = vaga.localizacao.toLowerCase().includes("rio") || vaga.localizacao.toLowerCase().includes("rj");
              return (
                <div key={vaga.id} className={`vaga-card ${isRJ ? 'highlight-rj' : ''}`}>
                  <div className="vaga-header">
                    <span className="area-tag">{vaga.area}</span>
                    <span className={`status-badge status-${vaga.status.toLowerCase()}`}>
                      {vaga.status === "Novo" && "✨ Novo"}
                      {vaga.status === "Candidatado" && "🎯 Em Andamento"}
                      {vaga.status === "Rejeitado" && "❌ Recusado"}
                    </span>
                  </div>
                  
                  <h3>{vaga.titulo}</h3>
                  
                  <div className="vaga-details">
                    <p className="empresa">🏢 {vaga.empresa}</p>
                    <p className={`local ${isRJ ? 'highlight' : ''}`}>
                      📍 {vaga.localizacao} {isRJ && "🔥"}
                    </p>
                  </div>
                  
                  <div className="card-footer">
                    <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="apply-link">
                      🔗 Acessar Vaga
                    </a>
                    
                    <div className="status-actions">
                      {vaga.status !== "Candidatado" && (
                        <button className="action-btn accept" onClick={() => updateStatus(vaga.id, "Candidatado")} title="Mover para Candidaturas">✓</button>
                      )}
                      {vaga.status !== "Rejeitado" && abaAtiva !== 'candidaturas' && (
                        <button className="action-btn reject" onClick={() => updateStatus(vaga.id, "Rejeitado")} title="Ocultar Vaga">✕</button>
                      )}
                      {vaga.status !== "Novo" && (
                        <button className="action-btn reset" onClick={() => updateStatus(vaga.id, "Novo")} title="Voltar para Disponíveis">↺</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  )
}

export default App
