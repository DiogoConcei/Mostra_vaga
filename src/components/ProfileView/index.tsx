import { useRef, useState } from 'react';
import { useResumes } from '../../hooks/useResumes';
import type { Curriculo } from '../../types/vaga';

export function ProfileView() {
  const { resumes, loading, uploadResume, toggleResume, deleteResume } = useResumes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingResume, setViewingResume] = useState<Curriculo | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadResume(e.target.files[0]);
    }
  };

  const activeResumes = resumes.filter(r => r.is_active);

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-grid">
        {/* Upload Section */}
        <div className="profile-card upload-section">
          <h2>📄 Gerenciar Currículos</h2>
          <p>Ative até <strong>2 currículos</strong> para que a IA compare o melhor perfil com cada vaga.</p>
          
          <div 
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-content">
              <span className="upload-icon">📤</span>
              <p>{loading ? "Processando..." : "Clique ou arraste seu currículo aqui"}</p>
              <span className="file-hint">PDF ou DOCX (Max 5MB)</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx"
              style={{ display: 'none' }}
            />
          </div>

          {activeResumes.length > 0 && (
            <div className="active-resume-info">
              <span className="pulse-dot"></span>
              <p>Ativos: <strong>{activeResumes.map(r => r.nome).join(", ")}</strong></p>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="profile-card list-section">
          <h2>📚 Meus Documentos</h2>
          {resumes.length === 0 ? (
            <div className="empty-resumes">
              <p>Você ainda não enviou nenhum currículo.</p>
            </div>
          ) : (
            <div className="resume-list">
              {resumes.map(resume => (
                <div key={resume.id} className={`resume-item ${resume.is_active ? 'active' : ''}`}>
                  <div className="resume-info">
                    <span className="doc-icon">{resume.nome.endsWith('.pdf') ? '📕' : '📘'}</span>
                    <div className="resume-meta">
                      <span className="resume-name">{resume.nome}</span>
                      <span className="resume-date">Enviado em: {new Date(resume.data_upload).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="resume-actions">
                    <button 
                      className="btn-view" 
                      onClick={() => setViewingResume(resume)}
                      title="Ver como a IA lê seu currículo (Visão ATS)"
                    >
                      👁️ ATS
                    </button>
                    <button 
                      className={`btn-activate ${resume.is_active ? 'active' : ''}`} 
                      onClick={() => toggleResume(resume.id)}
                      title={resume.is_active ? "Desativar" : "Ativar para Match"}
                    >
                      {resume.is_active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => deleteResume(resume.id)}
                      title="Excluir currículo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Visão ATS */}
      {viewingResume && (
        <div className="modal-overlay" onClick={() => setViewingResume(null)}>
          <div className="modal-content ats-view" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🤖 Visão ATS: {viewingResume.nome}</h3>
              <button className="btn-close" onClick={() => setViewingResume(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="ats-hint">Este é o texto bruto que o InternHunt utiliza para os cálculos semânticos.</p>
              <pre className="ats-text-preview">
                {viewingResume.texto_extraido || "Nenhum texto extraído."}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="ats-explanation">
        <h3>🤖 Como funciona o Multi-Perfil?</h3>
        <p>
          Ao ativar dois currículos, a IA do <strong>InternHunt</strong> calculará a compatibilidade da vaga com 
          ambos os perfis simultaneamente. O <strong>Match Score</strong> exibido será sempre o do perfil que tiver a 
          melhor afinidade com a descrição, garantindo que você não perca oportunidades por ter um perfil versátil.
        </p>
      </div>
    </div>
  );
}
