
import React, { useState, useEffect } from 'react';
import { Menu, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { SectionId, ActionItem, Actor } from './types';
import { INITIAL_ACTIONS, INITIAL_ACTORS } from './constants';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Database from './components/Database';
import Actors from './components/Actors';
import Governance from './components/Governance';
import WorkingGroups from './components/WorkingGroups';
import Agenda from './components/Agenda';
import Impacts from './components/Impacts';
import Evidence from './components/Evidence';
import DiagnosticTool from './components/DiagnosticTool';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SectionId>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'local' | 'cloud'>('local');
  
  // Central State for the "Living Database"
  const [actions, setActions] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('ynov_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  // Central State for "Actors CRM"
  const [actors, setActors] = useState<Actor[]>(() => {
    const saved = localStorage.getItem('ynov_actors');
    return saved ? JSON.parse(saved) : INITIAL_ACTORS;
  });

  // Função para buscar dados do Google Sheets (Simulada para integração futura)
  const syncWithGoogleSheets = async () => {
    setIsSyncing(true);
    try {
      // Aqui entrará a chamada para sua API na Vercel: fetch('/api/sheets')
      // Por enquanto, simulamos um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se houvesse uma API real, faríamos:
      // const response = await fetch('/api/data');
      // const data = await response.json();
      // setActions(data.actions);
      // setActors(data.actors);
      
      console.log("Sincronização com Google Sheets preparada.");
      setDbStatus('local'); // Mudará para 'cloud' quando a API estiver ativa
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Salva no LocalStorage sempre que houver mudança (Persistência Local)
  useEffect(() => {
    localStorage.setItem('ynov_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('ynov_actors', JSON.stringify(actors));
  }, [actors]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview actions={actions} setActiveTab={setActiveTab} />;
      case 'database': return <Database actions={actions} setActions={setActions} />;
      case 'actors': return <Actors actors={actors} setActors={setActors} setActiveTab={setActiveTab} />;
      case 'governance': return <Governance actions={actions} setActions={setActions} />;
      case 'gts': return <WorkingGroups actions={actions} setActions={setActions} />;
      case 'agenda': return <Agenda actions={actions} setActions={setActions} />;
      case 'impacts': return <Impacts actions={actions} actors={actors} />;
      case 'evidence': return <Evidence actions={actions} />;
      case 'diagnostic': return <DiagnosticTool actions={actions} actors={actors} />;
      default: return <Overview actions={actions} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F9FB] overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Main Header with Sync Status */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600">
                <Menu size={24} />
             </button>
             <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-ynov-blue animate-pulse"></span>
                Painel de Gestão YNOV
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase transition-all ${
               dbStatus === 'cloud' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
             }`}>
                {dbStatus === 'cloud' ? <Cloud size={14} /> : <CloudOff size={14} />}
                {dbStatus === 'cloud' ? 'Google Sheets Ativo' : 'Modo Offline (Local)'}
             </div>
             <button 
                onClick={syncWithGoogleSheets}
                disabled={isSyncing}
                className="p-2 text-gray-400 hover:text-ynov-blue hover:bg-gray-50 rounded-lg transition-all"
                title="Sincronizar com Nuvem"
             >
                <RefreshCw size={18} className={isSyncing ? 'animate-spin text-ynov-blue' : ''} />
             </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-12 min-h-full flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
