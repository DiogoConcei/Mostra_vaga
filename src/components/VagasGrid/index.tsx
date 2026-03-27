import type { Vaga } from '../../types/vaga';
import { VagaCard } from './VagaCard';

interface VagasGridProps {
  vagas: Vaga[];
  loading: boolean;
  abaAtiva: string;
  onUpdateStatus: (id: number, status: string) => void;
  activeResumeKeywords?: string;
}

export function VagasGrid({ vagas, loading, abaAtiva, onUpdateStatus, activeResumeKeywords }: VagasGridProps) {
  if (loading && vagas.length === 0) {
    return <p className="status-msg">Procurando oportunidades... (Isso pode levar alguns minutos)</p>;
  }

  if (vagas.length === 0) {
    return (
      <p className="status-msg">
        {abaAtiva === 'candidaturas' 
          ? "Você ainda não tem candidaturas ativas. Volte para a aba de 'Disponíveis' e comece a aplicar!" 
          : "Nenhuma oportunidade encontrada. Ajuste os filtros ou busque por novas vagas."}
      </p>
    );
  }

  return (
    <main>
      <div className="vagas-grid">
        {vagas.map(vaga => (
          <VagaCard 
            key={vaga.id} 
            vaga={vaga} 
            onUpdateStatus={onUpdateStatus} 
            abaAtiva={abaAtiva}
            activeResumeKeywords={activeResumeKeywords}
          />
        ))}
      </div>
    </main>
  );
}
