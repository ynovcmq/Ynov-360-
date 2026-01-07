
import React, { useState } from 'react';
import { GT_OPTIONS, STATUS_OPTIONS, HELIX_OPTIONS } from '../constants';
import { ActionItem, StatusType, GTType, HelixType } from '../types';
import { 
  Users, Sprout, Factory, ShoppingBag, Palette, Scale, GraduationCap, 
  MoreHorizontal, Plus, Calendar, Target, Edit3, Trash2, X, Clock
} from 'lucide-react';

interface WorkingGroupsProps {
  actions: ActionItem[];
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

const iconMap: Record<string, React.ElementType> = {
  'Educação': GraduationCap, 
  'Agro & Sustentabilidade': Sprout, 
  'Indústria': Factory, 
  'Varejo': ShoppingBag, 
  'Talentos Criativos': Palette, 
  'Governo e Políticas Públicas': Scale
};

// Column colors from JSON spec
const columnColors: Record<StatusType, string> = {
  'Planejada': '#F5B041',
  'Em andamento': '#5DADE2',
  'Concluída': '#58D68D'
};

const WorkingGroups: React.FC<WorkingGroupsProps> = ({ actions, setActions }) => {
  const [activeGT, setActiveGT] = useState<GTType>(GT_OPTIONS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionItem | null>(null);

  const gtActions = actions.filter(a => a.gt === activeGT);
  const CurrentIcon = iconMap[activeGT] || Users;

  const handleOpenModal = (action?: ActionItem) => {
    if (action) setEditingCard(action);
    else setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const actionData: Partial<ActionItem> = {
      activity: formData.get('activity') as string,
      responsible: formData.get('responsible') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      endDate: formData.get('endDate') as string,
      status: formData.get('status') as StatusType,
      helix: formData.get('helix') as HelixType,
      targetAudience: formData.get('targetAudience') as string,
      peopleInvolved: parseInt(formData.get('peopleInvolved') as string) || 0,
      comments: formData.get('comments') as string,
      gt: activeGT,
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    if (editingCard) {
      setActions(prev => prev.map(a => a.id === editingCard.id ? { ...editingCard, ...actionData } : a));
    } else {
      const newItem: ActionItem = {
        ...actionData as ActionItem,
        id: Math.random().toString(36).substr(2, 9),
        location: 'Camaquã',
        impactIndirect: 0
      };
      setActions(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm('Deseja excluir este card?')) {
      setActions(prev => prev.filter(a => a.id !== id));
    }
  };

  const updateStatus = (id: string, newStatus: StatusType) => {
    setActions(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* GT Selector */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
            {GT_OPTIONS.map(gt => {
                const Icon = iconMap[gt] || Users;
                const isActive = activeGT === gt;
                return (
                    <button
                        key={gt}
                        onClick={() => setActiveGT(gt)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-semibold
                            ${isActive 
                                ? 'bg-ynov-blue text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                        `}
                    >
                        <Icon size={16} />
                        {gt}
                    </button>
                )
            })}
        </div>

        {/* Dashboard Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-ynov-blue flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <CurrentIcon className="text-ynov-blue" size={24} />
                    </div>
                    GT {activeGT}
                </h2>
                <p className="text-gray-500 text-sm mt-1 ml-14">Quadro Kanban Interativo de Gestão.</p>
            </div>
            <button 
                onClick={() => handleOpenModal()}
                className="bg-ynov-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
                <Plus size={18} />
                Novo Card
            </button>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-[900px] pb-4">
                {STATUS_OPTIONS.map(status => (
                    <div key={status} className="flex-1 bg-gray-100/40 rounded-xl p-4 border border-gray-200/50">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b-2" style={{ borderColor: columnColors[status] }}>
                             <h3 className="font-bold text-sm uppercase flex items-center gap-2 text-gray-700">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: columnColors[status] }}></div>
                                {status}
                             </h3>
                             <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
                                {gtActions.filter(a => a.status === status).length}
                             </span>
                        </div>
                        
                        <div className="space-y-4">
                            {gtActions.filter(a => a.status === status).map(action => (
                                <div 
                                    key={action.id} 
                                    className="bg-white p-4 rounded-xl shadow-sm border-l-4 hover:shadow-md transition-all group cursor-default"
                                    style={{ borderLeftColor: columnColors[status] }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-1.5 py-0.5 rounded">
                                            {action.helix}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenModal(action)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-ynov-blue">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteCard(action.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{action.activity}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{action.description}</p>
                                    
                                    <div className="space-y-1.5 pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Users size={12} />
                                            <span className="font-medium truncate">{action.responsible}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Target size={12} />
                                            <span className="truncate">{action.targetAudience || 'Geral'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                            <Clock size={12} />
                                            <span>{new Date(action.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Inline Status Mover */}
                                    <div className="mt-3 flex gap-1">
                                        {STATUS_OPTIONS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(action.id, s)}
                                                title={`Mover para ${s}`}
                                                className={`flex-1 h-1.5 rounded-full transition-all ${action.status === s ? '' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                style={{ backgroundColor: action.status === s ? columnColors[s] : undefined }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {gtActions.filter(a => a.status === status).length === 0 && (
                                <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white/50">
                                    Nenhuma atividade
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Modal Interativo */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">
                            {editingCard ? 'Editar Card' : 'Novo Card de Atividade'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveCard} className="p-6 overflow-y-auto space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título da Atividade</label>
                                <input required name="activity" type="text" defaultValue={editingCard?.activity} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" placeholder="Ex: Hackathon 2025" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                                <input required name="responsible" type="text" defaultValue={editingCard?.responsible} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" placeholder="Nome ou Instituição" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Público Alvo</label>
                                <input name="targetAudience" type="text" defaultValue={editingCard?.targetAudience} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" placeholder="Ex: Estudantes, Lojistas" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <textarea name="description" rows={3} defaultValue={editingCard?.description} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none resize-none bg-white" placeholder="Detalhes da iniciativa..."></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data de Início</label>
                                <input required name="date" type="date" defaultValue={editingCard?.date || new Date().toISOString().split('T')[0]} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Previsão Conclusão</label>
                                <input name="endDate" type="date" defaultValue={editingCard?.endDate} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select name="status" defaultValue={editingCard?.status || 'Planejada'} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 bg-white outline-none">
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hélice Relacionada</label>
                                <select name="helix" defaultValue={editingCard?.helix || 'Sociedade'} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 bg-white outline-none">
                                    {HELIX_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Impacto (Pessoas)</label>
                                <input name="peopleInvolved" type="number" defaultValue={editingCard?.peopleInvolved || 0} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 outline-none bg-white" />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observações</label>
                                <input name="comments" type="text" defaultValue={editingCard?.comments} className="w-full border rounded-lg p-2.5 text-sm text-gray-900 outline-none bg-white" placeholder="Notas internas..." />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 bg-white text-gray-900">
                                Cancelar
                            </button>
                            <button type="submit" className="flex-2 bg-ynov-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg">
                                {editingCard ? 'Salvar Alterações' : 'Criar Card'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default WorkingGroups;
