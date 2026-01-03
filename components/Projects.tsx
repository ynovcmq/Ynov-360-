import React, { useState } from 'react';
import { PROJECTS_DATA } from '../constants';
import { Filter, Calendar, Tag } from 'lucide-react';

const Projects: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const types = ['all', ...Array.from(new Set(PROJECTS_DATA.map(p => p.type)))];

  const filteredProjects = filterType === 'all' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                 <h2 className="text-2xl font-bold text-gray-800">Projetos e Ações</h2>
                 <p className="text-gray-500 text-sm">O que estamos construindo juntos.</p>
            </div>
           
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={18} className="text-gray-400 mr-1" />
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`
                            px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                            ${filterType === t 
                                ? 'bg-ynov-blue text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
                        `}
                    >
                        {t === 'all' ? 'Todos' : t}
                    </button>
                ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-ynov-blue">
                            {project.year}
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-ynov-green uppercase tracking-wider">{project.gt}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-ynov-blue transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {project.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100">
                             <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Resultados:</h4>
                             <ul className="space-y-1">
                                {project.results.map((res, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-ynov-yellow mt-1.5">•</span>
                                        {res}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Projects;