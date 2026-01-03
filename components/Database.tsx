
import React, { useState } from 'react';
import { GT_OPTIONS, STATUS_OPTIONS, HELIX_OPTIONS, ACTIVITY_TYPES } from '../constants';
import { ActionItem, GTType, StatusType, HelixType, ActivityType } from '../types';
// Add Target to the import list from lucide-react
import { Search, Plus, Download, Edit2, Trash2, MapPin, Users, FileSpreadsheet, X, Calendar, ClipboardCheck, Target } from 'lucide-react';

interface DatabaseProps {
  actions: ActionItem[];
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

const Database: React.FC<DatabaseProps> = ({ actions, setActions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGT, setSelectedGT] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<ActionItem> = {
    gt: 'Educação',
    helix: 'Sociedade',
    activityType: 'Agenda',
    activity: '',
    description: '',
    status: 'Planejada',
    responsible: '',
    peopleInvolved: 0,
    impactIndirect: 0,
    location: '',
    results: '',
    date: new Date().toISOString().split('T')[0],
    endDate: ''
  };
  const [formData, setFormData] = useState<Partial<ActionItem>>(initialFormState);

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.activity.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          action.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGT = selectedGT === 'all' || action.gt === selectedGT;
    const matchesStatus = selectedStatus === 'all' || action.status === selectedStatus;
    const matchesType = selectedType === 'all' || action.activityType === selectedType;
    return matchesSearch && matchesGT && matchesStatus && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString('pt-BR');
    
    if (editingId) {
      setActions(prev => prev.map(item => item.id === editingId ? { ...item, ...formData, lastUpdate: timestamp } as ActionItem : item));
    } else {
      const newItem: ActionItem = {
        ...formData as ActionItem,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdate: timestamp,
      };
      setActions(prev => [...prev, newItem]);
    }
    closeForm();
  };

  const handleEdit = (action: ActionItem) => {
    setFormData(action);
    setEditingId(action.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      setActions(prev => prev.filter(a => a.id !== id));
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const exportCSV = () => {
    const headers = ["Título", "GT", "Tipo", "Status", "Início", "Fim", "Responsável", "Direto", "Indireto", "Local", "Resultados"];
    const rows = filteredActions.map(a => [
      a.activity, a.gt, a.activityType, a.status, a.date, a.endDate || '', a.responsible, a.peopleInvolved, a.impactIndirect, a.location, a.results || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ynov_atividades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardCheck className="text-ynov-blue" />
            Base de Dados do Ecossistema
          </h2>
          <p className="text-gray-500 text-sm">Registro centralizado e gestão de entregas.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm">
                <FileSpreadsheet size={18} />
                Importar
            </button>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-ynov-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm"
            >
                <Plus size={18} />
                Nova Atividade
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar atividade ou responsável..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ynov-blue/20 text-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
            value={selectedGT}
            onChange={(e) => setSelectedGT(e.target.value)}
        >
            <option value="all">Todos GTs</option>
            {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
        </select>
        <select 
            className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
        >
            <option value="all">Todos Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-2">
            <select 
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="all">Todos Tipos</option>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button 
                onClick={exportCSV}
                className="p-2 text-gray-500 hover:text-ynov-blue border border-gray-200 rounded-lg bg-white" 
                title="Exportar CSV"
            >
                <Download size={18} />
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Atividade</th>
                <th className="p-4">GT / Tipo</th>
                <th className="p-4">Datas</th>
                <th className="p-4">Pessoas</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 text-sm">{action.activity}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{action.responsible}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-ynov-blue">{action.gt}</span>
                        <span className="text-gray-400 italic">{action.activityType}</span>
                      </div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <Calendar size={12} className="text-gray-400" />
                            {new Date(action.date).toLocaleDateString('pt-BR')}
                            {action.endDate && ` - ${new Date(action.endDate).toLocaleDateString('pt-BR')}`}
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-emerald-600" title="Pessoas Envolvidas (Direto)">
                                <Users size={12} />
                                {action.peopleInvolved}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600" title="Pessoas Impactadas (Indireto)">
                                <Target size={12} />
                                {action.impactIndirect}
                            </div>
                        </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={action.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(action)} className="text-gray-300 hover:text-ynov-blue transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(action.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 italic">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                    {editingId ? 'Editar Atividade' : 'Registrar Nova Atividade'}
                </h3>
                <p className="text-xs text-gray-500">Preencha os dados da iniciativa do ecossistema.</p>
              </div>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Título da Atividade</label>
                    <input required type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" 
                        placeholder="Ex: Workshop Agro Digital"
                        value={formData.activity} onChange={e => setFormData({...formData, activity: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">GT Responsável</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.gt} onChange={e => setFormData({...formData, gt: e.target.value as GTType})}>
                       {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                     </select>
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Atividade</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.activityType} onChange={e => setFormData({...formData, activityType: e.target.value as ActivityType})}>
                       {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Data de Início</label>
                     <input required type="date" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Data de Conclusão (Opcional)</label>
                     <input type="date" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as StatusType})}>
                       {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hélice Principal</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.helix} onChange={e => setFormData({...formData, helix: e.target.value as HelixType})}>
                       {HELIX_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Responsável (Entidade/Nome)</label>
                     <input required type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.responsible} onChange={e => setFormData({...formData, responsible: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Local da Atividade</label>
                     <input type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                        placeholder="Ex: IFSUL, Auditório ACIC"
                       value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pessoas Envolvidas (Direto)</label>
                     <input type="number" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.peopleInvolved} onChange={e => setFormData({...formData, peopleInvolved: parseInt(e.target.value) || 0})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Impacto (Indireto/Est.)</label>
                     <input type="number" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.impactIndirect} onChange={e => setFormData({...formData, impactIndirect: parseInt(e.target.value) || 0})} />
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Descrição / Resumo</label>
                     <textarea className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none resize-none bg-white" rows={3}
                        placeholder="Descreva brevemente a iniciativa..."
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Resultados / Entregas</label>
                     <textarea className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none resize-none bg-white" rows={2}
                        placeholder="Quais foram os principais marcos ou produtos entregues?"
                        value={formData.results} onChange={e => setFormData({...formData, results: e.target.value})}></textarea>
                  </div>
               </div>
               
               <div className="pt-4 flex gap-4">
                  <button type="button" onClick={closeForm} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-[2] bg-ynov-blue text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10">
                    {editingId ? 'Salvar Alterações' : 'Concluir Registro'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const styles: Record<string, string> = {
    'Planejada': 'bg-amber-50 text-amber-700 border-amber-100',
    'Em andamento': 'bg-blue-50 text-blue-700 border-blue-100',
    'Concluída': 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
};

export default Database;
