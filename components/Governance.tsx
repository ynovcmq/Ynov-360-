
import React, { useState } from 'react';
import { STATUS_OPTIONS, GT_OPTIONS, HELIX_OPTIONS } from '../constants';
import { ActionItem, StatusType, GTType, HelixType } from '../types';
import { MoreHorizontal, Plus, X, BarChart3, TrendingUp, Calendar, Users, Edit3, Trash2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

interface GovernanceProps {
  actions: ActionItem[];
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

const COLORS = ['#003366', '#00B37E', '#FFD166', '#EF4444', '#8B5CF6', '#EC4899'];

const columnColors: Record<StatusType, string> = {
  'Planejada': '#F5B041',
  'Em andamento': '#5DADE2',
  'Concluída': '#58D68D'
};

const Governance: React.FC<GovernanceProps> = ({ actions, setActions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionItem | null>(null);
  
  // -- Metrics Calculation --
  const totalActions = actions.length;
  const totalPeople = actions.reduce((acc, curr) => acc + (curr.peopleInvolved || 0), 0);
  const concludedActions = actions.filter(a => a.status === 'Concluída').length;
  const completionRate = totalActions > 0 ? Math.round((concludedActions / totalActions) * 100) : 0;
  const activeGTs = new Set(actions.map(a => a.gt)).size;

  // -- Chart Data --
  const pieData = GT_OPTIONS.map(gt => ({
    name: gt,
    value: actions.filter(a => a.gt === gt).length
  })).filter(d => d.value > 0);

  const barData = GT_OPTIONS.map(gt => {
    const gtActions = actions.filter(a => a.gt === gt);
    return {
      name: gt,
      Planejada: gtActions.filter(a => a.status === 'Planejada').length,
      'Em andamento': gtActions.filter(a => a.status === 'Em andamento').length,
      Concluída: gtActions.filter(a => a.status === 'Concluída').length,
    };
  });

  // -- Handlers --
  const updateStatus = (id: string, newStatus: StatusType) => {
    setActions(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const handleOpenModal = (action?: ActionItem) => {
    setEditingCard(action || null);
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
      status: formData.get('status') as StatusType,
      helix: formData.get('helix') as HelixType,
      gt: formData.get('gt') as GTType,
      peopleInvolved: parseInt(formData.get('peopleInvolved') as string) || 0,
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

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Governança Integrada</h2>
            <p className="text-gray-500 text-sm">Visão executiva e gestão de entregas de todo o ecossistema.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-ynov-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus size={18} />
            Registrar Entrega
          </button>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricWidget icon={BarChart3} label="Ações Totais" value={totalActions} color="bg-blue-50 text-ynov-blue" />
          <MetricWidget icon={Users} label="Impacto Direto" value={totalPeople.toLocaleString()} color="bg-green-50 text-ynov-green" />
          <MetricWidget icon={TrendingUp} label="Taxa de Conclusão" value={`${completionRate}%`} color="bg-yellow-50 text-yellow-700" />
          <MetricWidget icon={Calendar} label="GTs Ativos" value={`${activeGTs}/6`} color="bg-gray-100 text-gray-700" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Status por GT</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                      <Tooltip />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="Concluída" stackId="a" fill="#58D68D" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Em andamento" stackId="a" fill="#5DADE2" />
                      <Bar dataKey="Planejada" stackId="a" fill="#F5B041" radius={[4, 0, 0, 4]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição de Esforço</h3>
             <div className="h-64 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px' }} />
                   </RePieChart>
                {/* Fixed line 154: replaced '享用' with 'ResponsiveContainer' */}
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Painel de Governança Geral (GTs)</h3>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {STATUS_OPTIONS.map(status => (
              <div key={status} className="flex-1 min-w-[300px] bg-gray-50/50 rounded-xl p-4 border-t-4" style={{ borderTopColor: columnColors[status] }}>
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-700 text-sm uppercase">{status}</h4>
                    <span className="bg-white px-2 py-0.5 rounded shadow-sm text-xs font-bold text-gray-400">
                        {actions.filter(a => a.status === status).length}
                    </span>
                 </div>
                 <div className="space-y-3">
                    {actions.filter(a => a.status === status).map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="text-[9px] font-bold text-ynov-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                                    {task.gt}
                                 </span>
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(task)} className="text-gray-400 hover:text-ynov-blue"><Edit3 size={12} /></button>
                                 </div>
                             </div>
                             <h5 className="text-sm font-bold text-gray-800 mb-1 leading-snug">{task.activity}</h5>
                             <p className="text-[11px] text-gray-500 line-clamp-2">{task.description}</p>
                             
                             <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{task.responsible}</span>
                                <select 
                                    className="text-[10px] bg-white border-none outline-none font-bold text-gray-400 cursor-pointer"
                                    value={task.status}
                                    onChange={(e) => updateStatus(task.id, e.target.value as StatusType)}
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                        </div>
                    ))}
                 </div>
              </div>
            ))}
          </div>
       </div>

       {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{editingCard ? 'Editar Entrega' : 'Nova Entrega Governança'}</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                <form onSubmit={handleSaveCard} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                            <input required name="activity" type="text" defaultValue={editingCard?.activity} className="w-full border rounded-lg p-2 text-sm outline-none bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GT Vinculado</label>
                                <select name="gt" defaultValue={editingCard?.gt || 'Educação'} className="w-full border rounded-lg p-2 text-sm outline-none bg-white">
                                    {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hélice</label>
                                <select name="helix" defaultValue={editingCard?.helix || 'Sociedade'} className="w-full border rounded-lg p-2 text-sm outline-none bg-white">
                                    {HELIX_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select name="status" defaultValue={editingCard?.status || 'Planejada'} className="w-full border rounded-lg p-2 text-sm outline-none bg-white">
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                                <input required name="date" type="date" defaultValue={editingCard?.date || new Date().toISOString().split('T')[0]} className="w-full border rounded-lg p-2 text-sm outline-none bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
                            <input required name="responsible" type="text" defaultValue={editingCard?.responsible} className="w-full border rounded-lg p-2 text-sm outline-none bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Impacto Direto</label>
                            <input name="peopleInvolved" type="number" defaultValue={editingCard?.peopleInvolved || 0} className="w-full border rounded-lg p-2 text-sm outline-none bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                            <textarea name="description" rows={2} defaultValue={editingCard?.description} className="w-full border rounded-lg p-2 text-sm outline-none resize-none bg-white"></textarea>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-ynov-blue text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md mt-4">
                        Salvar Registro
                    </button>
                </form>
            </div>
         </div>
       )}
    </div>
  );
};

const MetricWidget = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xl md:text-2xl font-bold text-gray-800 leading-none">{value}</p>
      <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase mt-1">{label}</p>
    </div>
  </div>
);

export default Governance;
