import type { TabAtiva } from '../../types/vaga';

interface HeaderProps {
  abaAtiva: TabAtiva;
  setAbaAtiva: (tab: TabAtiva) => void;
  contagemDisponiveis: number;
  contagemCandidaturas: number;
}

export function Header({ abaAtiva, setAbaAtiva, contagemDisponiveis, contagemCandidaturas }: HeaderProps) {
  return (
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
        <button 
          className={`tab-btn ${abaAtiva === 'perfil' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('perfil')}
        >
          🤖 Meu Perfil
        </button>
      </div>
    </header>
  );
}
