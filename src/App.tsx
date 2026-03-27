import './App.css';
import { useVagas } from './hooks/useVagas';
import { useResumes } from './hooks/useResumes';
import { useVagaFilters } from './hooks/useVagaFilters';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { VagasGrid } from './components/VagasGrid';
import { ProfileView } from './components/ProfileView';

function App() {
  const { vagas, loading, refreshVagas, updateStatus, clearCache } = useVagas();
  const { activeResumeKeywords } = useResumes();
  
  const {
    abaAtiva, setAbaAtiva,
    busca, setBusca,
    filtroArea, setFiltroArea,
    filtroRegiao, setFiltroRegiao,
    mostrarRejeitadas, setMostrarRejeitadas,
    filteredVagas,
    stats
  } = useVagaFilters(vagas);

  return (
    <div className="container">
      <Header 
        abaAtiva={abaAtiva} 
        setAbaAtiva={setAbaAtiva}
        contagemDisponiveis={stats.disponiveis}
        contagemCandidaturas={stats.candidaturas}
      />
      
      {abaAtiva !== 'perfil' ? (
        <>
          <ControlBar 
            busca={busca} setBusca={setBusca}
            filtroArea={filtroArea} setFiltroArea={setFiltroArea}
            filtroRegiao={filtroRegiao} setFiltroRegiao={setFiltroRegiao}
            mostrarRejeitadas={mostrarRejeitadas} setMostrarRejeitadas={setMostrarRejeitadas}
            loading={loading}
            onRefresh={refreshVagas}
            onClearCache={clearCache}
          />

          <VagasGrid 
            vagas={filteredVagas} 
            loading={loading} 
            abaAtiva={abaAtiva} 
            onUpdateStatus={updateStatus}
            activeResumeKeywords={activeResumeKeywords}
          />
        </>
      ) : (
        <ProfileView />
      )}
    </div>
  );
}

export default App;
