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
  const [showATSModal, setShowATSModal] = useState(false);
  const local = (vaga.localizacao || "").toLowerCase();
  const isRJ = local.includes("rio") || local.includes("rj");
  
  // Extrai highlights e insight do texto da IA
  const [rawHighlights, insight] = vaga.insights ? vaga.insights.split('|').map(s => s.trim()) : ["", ""];
  
  // Separa tech tags de profile tags
  const highlightItems = rawHighlights.split('•').map(h => h.trim()).filter(h => h !== "");
  const profileTag = highlightItems.find(h => h.startsWith('👤'));
  const techTags = highlightItems.filter(h => !h.startsWith('👤'));

  // Lógica de Gap Analysis
  const resumeKeywords = activeResumeKeywords?.toLowerCase().split(',').map(k => k.trim()) || [];
  const jobKeywords = vaga.keywords_ats?.split(',').map(k => k.trim()) || [];

  const handleCardClick = () => {
    window.open(vaga.link, '_blank', 'noopener,noreferrer');
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className={`vaga-card ${isRJ ? 'highlight-rj' : ''} ${vaga.match_score && vaga.match_score >= 80 ? 'hot-match' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {vaga.match_score && vaga.match_score > 0 && (
        <div className="ai-badge" title={`Match Score: ${vaga.match_score}%`}>
          <div className="ai-score-circle" style={{ 
            background: `conic-gradient(var(--primary) ${vaga.match_score}%, rgba(255,255,255,0.05) 0)` 
          }}>
            <span>{vaga.match_score}%</span>
          </div>
        </div>
      )}

      <div className="vaga-header">
        <div className="header-left">
          <span className="area-tag">{vaga.area}</span>
          {techTags.length > 0 && (
             <div className="tech-highlights">
               {techTags.map((h, i) => (
                 <span key={i} className="tech-tag">
                   {h}
                 </span>
               ))}
             </div>
          )}
        </div>
        <span className={`status-badge status-${(vaga.status || 'novo').toLowerCase()}`}>
          {vaga.status === "Novo" && "✨ Novo"}
          {vaga.status === "Candidatado" && "🎯 Aplicado"}
          {vaga.status === "Rejeitado" && "❌ Recusado"}
        </span>
      </div>
      
      <h3>{vaga.titulo}</h3>
      
      <div className="vaga-details">
        <p className="empresa">🏢 {vaga.empresa}</p>
        <div className="location-group">
          <p className={`local ${isRJ ? 'highlight' : ''}`}>
            📍 {vaga.localizacao} {isRJ && "🔥"}
          </p>
          {vaga.modalidade && (
            <span className={`modality-tag ${(vaga.modalidade || 'presencial').toLowerCase()}`}>
              {vaga.modalidade === "Remoto" && "🌍 "}
              {vaga.modalidade === "Híbrido" && "🌗 "}
              {vaga.modalidade === "Presencial" && "🏢 "}
              {vaga.modalidade}
            </span>
          )}
        </div>
      </div>

      {(insight || profileTag) && (
        <div className="ai-insights">
          {profileTag && <span className="tech-tag profile-tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{profileTag}</span>}
          <p>🤖 {insight}</p>
          
          {vaga.keywords_ats && (
            <button 
              className="btn-ats-modal" 
              onClick={(e) => { e.stopPropagation(); setShowATSModal(true); }}
            >
              📊 Ver Relatório ATS
            </button>
          )}
        </div>
      )}

      {showATSModal && (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); setShowATSModal(false); }}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Relatório de ATS (Palavras-chave)</h3>
              <button className="btn-close" onClick={() => setShowATSModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="ats-hint" style={{ marginBottom: '1.5rem' }}>
                A IA comparou seu currículo ativo com a descrição desta vaga para identificar lacunas.
              </p>
              <div className="keywords-list">
                {jobKeywords.map((kw, i) => {
                  const hasKeyword = resumeKeywords.some(rk => rk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rk));
                  return (
                    <span 
                      key={i} 
                      className={`keyword-pill ${hasKeyword ? 'match' : 'missing'}`}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {hasKeyword ? '✅ ' : '⚠️ '}{kw}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {vaga.descricao_completa && (
        <div className="description-section" onClick={stopProp}>
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
        <span className="apply-link">
          Abrir Vaga <span>↗</span>
        </span>
        
        <div className="status-actions" onClick={stopProp}>
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
