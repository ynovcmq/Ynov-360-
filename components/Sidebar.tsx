
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { SectionId } from '../types';

interface SidebarProps {
  activeTab: SectionId;
  setActiveTab: (id: SectionId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 flex flex-col
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-center bg-ynov-blue text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">YNOV</h1>
              <p className="text-xs font-light text-ynov-yellow mt-1">Camaquã 2030</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-ynov-blue/10 text-ynov-blue border-l-4 border-ynov-blue' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-ynov-blue'}
                      `}
                    >
                      <Icon size={20} className={isActive ? 'text-ynov-blue' : 'text-gray-400'} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <a 
              href="https://www.instagram.com/ynovcamaqua/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-ynov-green hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold transition-colors shadow-sm mb-4 block text-center"
            >
              Quero Participar
            </a>
            <p className="text-xs text-gray-400 text-center">
              Ecossistema de Inovação<br/>
              &copy; {new Date().getFullYear()} YNOV
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;