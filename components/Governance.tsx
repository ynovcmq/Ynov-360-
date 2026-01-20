
import React, { useState } from 'react';
import { STATUS_OPTIONS, GT_OPTIONS, HELIX_OPTIONS } from '../constants';
import { ActionItem, StatusType, GTType, HelixType } from '../types';
import { BarChart3, TrendingUp, Calendar, Users, Edit3, Plus, X } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
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

const Governance: React.FC<GovernanceProps> = ({ actions = [], setActions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ActionItem | null>(null);
  
  const totalActions = actions.length;
  const totalPeople = actions.reduce((acc, curr) => acc + (curr.peopleInvolved || 0), 0);
  const concludedActions = actions.filter(a => a.status === 'Concluída').length;
  const completionRate = totalActions > 0 ? Math.round((concludedActions / totalActions) * 100) : 0;
  const activeGTs = new Set(actions.map(a => a.gt)).size;

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

  const updateStatus = (id: string, newStatus: StatusType) => {
    setActions(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const handleOpenModal = (action?: ActionItem) => {
    setEditingCard(action || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Governança Integrada</h2>
            <p className="text-gray-500 text-sm">Visão executiva e gestão de entregas.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-ynov-blue text-white px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Registrar Entrega
          </button>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricWidget icon={BarChart3} label="Ações Totais" value={totalActions} color="bg-blue-50 text-ynov-blue" />
          <MetricWidget icon={Users} label="Impacto Direto" value={totalPeople.toLocaleString()} color="bg-green-50 text-ynov-green" />
          <MetricWidget icon={TrendingUp} label="Taxa Conclusão" value={`${completionRate}%`} color="bg-yellow-50 text-yellow-700" />
          <MetricWidget icon={Calendar} label="GTs Ativos" value={`${activeGTs}/6`} color="bg-gray-100 text-gray-700" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[350px] flex flex-col">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Status por GT</h3>
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[350px] flex flex-col">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição de Esforço</h3>
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Kanban Geral do Ecossistema</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {STATUS_OPTIONS.map(status => (
              <div key={status} className="flex-1 min-w-[280px] bg-gray-50/50 rounded-xl p-4 border-t-4" style={{ borderTopColor: columnColors[status] }}>
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-700 text-sm uppercase">{status}</h4>
                    <span className="bg-white px-2 py-0.5 rounded shadow-sm text-xs font-bold text-gray-400">
                        {actions.filter(a => a.status === status).length}
                    </span>
                 </div>
                 <div className="space-y-3">
                    {actions.filter(a => a.status === status).map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                             <div className="flex justify-between items-start mb-2">
                                 <span className="text-[9px] font-bold text-ynov-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                                    {task.gt}
                                 </span>
                             </div>
                             <h5 className="text-sm font-bold text-gray-800 mb-1 leading-snug">{task.activity}</h5>
                             <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[10px] text-gray-400 font-medium truncate max-w-[100px]">{task.responsible}</span>
                                <select 
                                    className="text-[10px] bg-white border-none outline-none font-bold text-gray-400"
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
