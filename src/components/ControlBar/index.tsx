import { AREAS, REGIOES } from '../../constants/vagas';
import type { SortOrder } from '../../hooks/useVagas';

interface ControlBarProps {
  busca: string;
  setBusca: (val: string) => void;
  filtroArea: string | null;
  setFiltroArea: (val: string | null) => void;
  filtroRegiao: string | null;
  setFiltroRegiao: (val: string | null) => void;
  mostrarRejeitadas: boolean;
  setMostrarRejeitadas: (val: boolean) => void;
  loading: boolean;
  isScraping: boolean;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onRefresh: () => void;
  onClearCache: () => void;
}

export function ControlBar({
  busca, setBusca,
  filtroArea, setFiltroArea,
  filtroRegiao, setFiltroRegiao,
  mostrarRejeitadas, setMostrarRejeitadas,
  loading, isScraping, sortOrder, onSortChange, onRefresh, onClearCache
}: ControlBarProps) {
  return (
    <div className="control-bar">
      {isScraping && (
        <div className="scraping-indicator animate-pulse">
          <span className="spinner">🔄</span>
          <span>A busca de vagas está rodando no servidor. Novas vagas aparecerão automaticamente em breve.</span>
        </div>
      )}
      <div className="filter-row">
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Ex: Python, Rio de Janeiro, Estágio..." 
            className="search-input"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Área</span>
          <div className="filter-options">
            <button 
              className={`filter-btn ${filtroArea === null ? 'active' : ''}`}
              onClick={() => setFiltroArea(null)}
            >Todas</button>
            {AREAS.map(area => (
              <button 
                key={area}
                className={`filter-btn ${filtroArea === area ? 'active' : ''}`}
                onClick={() => setFiltroArea(area)}
              >{area}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Região</span>
          <div className="filter-options">
            <button 
              className={`filter-btn ${filtroRegiao === null ? 'active' : ''}`}
              onClick={() => setFiltroRegiao(null)}
            >Qualquer</button>
            {REGIOES.map(reg => (
              <button 
                key={reg}
                className={`filter-btn ${filtroRegiao === reg ? 'active' : ''}`}
                onClick={() => setFiltroRegiao(reg)}
              >{reg}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="actions-row">
        <div className="left-actions">
          <button 
            className={`status-toggle ${mostrarRejeitadas ? 'active' : ''}`}
            onClick={() => setMostrarRejeitadas(!mostrarRejeitadas)}
          >
            {mostrarRejeitadas ? "👀 Exibindo Rejeitadas" : "🙈 Ocultando Rejeitadas"}
          </button>
          
          <div className="sort-group">
            <span className="filter-label" style={{ marginRight: '10px' }}>Ordenar por:</span>
            <button 
              className={`filter-btn ${sortOrder === 'date' ? 'active' : ''}`}
              onClick={() => onSortChange('date')}
            >📅 Data</button>
            <button 
              className={`filter-btn ${sortOrder === 'score' ? 'active' : ''}`}
              onClick={() => onSortChange('score')}
            >🎯 Match</button>
          </div>

          <button onClick={onClearCache} className="clear-cache-btn">🗑️ Limpar Cache</button>
        </div>
        
        <button onClick={onRefresh} className="refresh-btn" disabled={loading}>
          {loading ? "⚙️ Sincronizando..." : "🚀 Buscar Novas Vagas"}
        </button>
      </div>
    </div>
  );
}
