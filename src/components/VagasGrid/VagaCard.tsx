import { useState } from 'react';
import type { Vaga } from '../../types/vaga';

interface VagaCardProps {
  vaga: Vaga;
  onUpdateStatus: (id: number, status: string) => void;
  abaAtiva: string;
  activeResumeKeywords?: string;
}

export function VagaCard({ vaga, onUpdateStatus, abaAtiva, activeResumeKeywords }: VagaCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isRJ = vaga.localizacao.toLowerCase().includes("rio") || vaga.localizacao.toLowerCase().includes("rj");
  
  // Extrai highlights e insight do texto da IA
  const [highlights, insight] = vaga.insights ? vaga.insights.split('|').map(s => s.trim()) : ["", ""];

  // Lógica de Gap Analysis
  const resumeKeywords = activeResumeKeywords?.toLowerCase().split(',').map(k => k.trim()) || [];
  const jobKeywords = vaga.keywords_ats?.split(',').map(k => k.trim()) || [];

  return (
    <div className={`vaga-card ${isRJ ? 'highlight-rj' : ''} ${vaga.match_score && vaga.match_score >= 80 ? 'hot-match' : ''}`}>
      {vaga.match_score && vaga.match_score > 0 && (
        <div className="ai-badge" title={`Match Score: ${vaga.match_score}%`}>
          <div className="ai-score-circle" style={{ 
            background: `conic-gradient(var(--primary) ${vaga.match_score}%, rgba(255,255,255,0.1) 0)` 
          }}>
            <span>{vaga.match_score}%</span>
          </div>
        </div>
      )}

      <div className="vaga-header">
        <div className="header-left">
          <span className="area-tag">{vaga.area}</span>
          {highlights && (
             <div className="tech-highlights">
               {highlights.split('•').map((h, i) => {
                 const text = h.trim();
                 const isProfile = text.startsWith('👤');
                 return (
                   <span key={i} className={`tech-tag ${isProfile ? 'profile-tag' : ''}`}>
                     {text}
                   </span>
                 );
               })}
             </div>
          )}
        </div>
        <span className={`status-badge status-${vaga.status.toLowerCase()}`}>
          {vaga.status === "Novo" && "✨ Novo"}
          {vaga.status === "Candidatado" && "🎯 Aplicado"}
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

      {insight && (
        <div className="ai-insights">
          <p>🤖 {insight}</p>
        </div>
      )}

      {vaga.keywords_ats && (
        <div className="ats-report">
          <h4>Relatório de ATS (Keywords)</h4>
          <div className="keywords-list">
            {jobKeywords.map((kw, i) => {
              const hasKeyword = resumeKeywords.some(rk => rk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rk));
              return (
                <span 
                  key={i} 
                  className={`keyword-pill ${hasKeyword ? 'match' : 'missing'}`}
                  title={hasKeyword ? "Presente no seu currículo" : "Faltando no seu currículo"}
                >
                  {hasKeyword ? '✅ ' : '⚠️ '}{kw}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {vaga.descricao_completa && (
        <div className="description-section">
          <button 
            className="toggle-desc-btn" 
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? "🔼 Ocultar Detalhes" : "🔽 Ver Descrição Completa"}
          </button>
          {showFullDesc && (
            <div className="full-description animate-fade-in">
              <pre>{vaga.descricao_completa}</pre>
            </div>
          )}
        </div>
      )}
      
      <div className="card-footer">
        <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="apply-link">
          Ver Vaga <span>→</span>
        </a>
        
        <div className="status-actions">
          {vaga.status !== "Candidatado" && (
            <button className="action-btn accept" onClick={() => onUpdateStatus(vaga.id, "Candidatado")} title="Mover para Candidaturas">✓</button>
          )}
          {vaga.status !== "Rejeitado" && abaAtiva !== 'candidaturas' && (
            <button className="action-btn reject" onClick={() => onUpdateStatus(vaga.id, "Rejeitado")} title="Ocultar Vaga">✕</button>
          )}
          {vaga.status !== "Novo" && (
            <button className="action-btn reset" onClick={() => onUpdateStatus(vaga.id, "Novo")} title="Voltar para Disponíveis">↺</button>
          )}
        </div>
      </div>
    </div>
  );
}
