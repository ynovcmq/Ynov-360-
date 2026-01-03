
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
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
  
  // Central State for the "Living Database"
  const [actions, setActions] = useState<ActionItem[]>(INITIAL_ACTIONS);
  // Central State for "Actors CRM"
  const [actors, setActors] = useState<Actor[]>(INITIAL_ACTORS);

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
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden shadow-sm z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-ynov-blue rounded flex items-center justify-center text-white font-bold text-xs">Y</div>
             <span className="font-bold text-gray-800">YNOV Camaquã</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-ynov-blue">
            <Menu size={24} />
          </button>
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
