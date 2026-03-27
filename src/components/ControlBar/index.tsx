import { AREAS, REGIOES } from '../../constants/vagas';

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
  onRefresh: () => void;
  onClearCache: () => void;
}

export function ControlBar({
  busca, setBusca,
  filtroArea, setFiltroArea,
  filtroRegiao, setFiltroRegiao,
  mostrarRejeitadas, setMostrarRejeitadas,
  loading, onRefresh, onClearCache
}: ControlBarProps) {
  return (
    <div className="control-bar">
      <div className="filter-row">
        <div className="search-group">
          <input 
            type="text" 
            placeholder="🔍 Pesquisar por título, empresa ou tech..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Tecnologia</span>
          <div className="filter-options">
            <button onClick={() => setFiltroArea(null)} className={`filter-btn ${filtroArea === null ? 'active' : ''}`}>Todas</button>
            {AREAS.map(area => (
              <button key={area} onClick={() => setFiltroArea(area)} className={`filter-btn ${filtroArea === area ? 'active' : ''}`}>{area}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Localização</span>
          <div className="filter-options">
            <button onClick={() => setFiltroRegiao(null)} className={`filter-btn ${filtroRegiao === null ? 'active' : ''}`}>Qualquer</button>
            {REGIOES.map(regiao => (
              <button key={regiao} onClick={() => setFiltroRegiao(regiao)} className={`filter-btn ${filtroRegiao === regiao ? 'active' : ''}`}>{regiao}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="actions-row">
        <div className="left-actions">
          <button onClick={() => setMostrarRejeitadas(!mostrarRejeitadas)} className={`status-toggle ${mostrarRejeitadas ? 'active' : ''}`}>
            {mostrarRejeitadas ? "👁️ Ocultar Recusadas" : "🙈 Mostrar Recusadas"}
          </button>
          <button className="clear-cache-btn" onClick={onClearCache}>
            🗑️ Limpar Cache
          </button>
        </div>
        
        <button onClick={onRefresh} className="refresh-btn" disabled={loading}>
          {loading ? "⚙️ Sincronizando..." : "🚀 Buscar Novas Vagas"}
        </button>
      </div>
    </div>
  );
}
