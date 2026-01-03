
import React from 'react';
import { ActionItem } from '../types';
import { Link2, FileText, Image, FolderOpen } from 'lucide-react';

interface EvidenceProps {
  actions: ActionItem[];
}

const Evidence: React.FC<EvidenceProps> = ({ actions }) => {
  // Use 'socialLinks' instead of 'evidenceLink' as per types.ts
  const actionsWithLinks = actions.filter(a => a.socialLinks && a.socialLinks.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Banco de Evidências</h2>
                <p className="text-gray-500 text-sm">Repositório de materiais, reportagens e documentos do ecossistema.</p>
            </div>
            <button className="bg-ynov-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                <FolderOpen size={16} />
                Enviar Arquivo
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionsWithLinks.map(action => (
                <div key={action.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <Link2 className="text-gray-400 group-hover:text-ynov-blue" size={24} />
                        </div>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold uppercase">
                            {action.gt}
                        </span>
                    </div>
                    
                    {/* Use 'activity' instead of 'title' */}
                    <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{action.activity}</h4>
                    {/* Use 'date' instead of 'startDate' */}
                    <p className="text-xs text-gray-500 mb-4 flex-1">
                        Evidência vinculada à ação realizada em {new Date(action.date).toLocaleDateString('pt-BR')}.
                    </p>

                    <a 
                        href={action.socialLinks} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-auto block text-center py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-ynov-blue hover:border-ynov-blue transition-colors"
                    >
                        Acessar Link
                    </a>
                </div>
            ))}
            
            {/* Add placeholders for demo if empty */}
            {actionsWithLinks.length === 0 && (
                <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
                    Nenhuma evidência cadastrada ainda. Adicione links no campo "Redes Sociais" das ações.
                </div>
            )}
        </div>
    </div>
  );
};

export default Evidence;
