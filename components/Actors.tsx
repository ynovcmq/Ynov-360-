
import React, { useState } from 'react';
import { GT_OPTIONS, PARTICIPATION_OPTIONS, HELIX_OPTIONS } from '../constants';
import { Actor, GTType, HelixType, SectionId } from '../types';
import { 
  Search, Plus, Download, Edit2, Trash2, Mail, Phone, MapPin, 
  Building2, UserPlus, X, Instagram, Linkedin, ExternalLink, 
  Layers, Link2, Eye 
} from 'lucide-react';

interface ActorsProps {
  actors: Actor[];
  setActors: React.Dispatch<React.SetStateAction<Actor[]>>;
  setActiveTab?: (id: SectionId) => void;
}

const Actors: React.FC<ActorsProps> = ({ actors, setActors, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGT, setSelectedGT] = useState<string>('all');
  const [selectedHelix, setSelectedHelix] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<Actor> = {
    name: '',
    birthDate: '',
    phone: '',
    email: '',
    organization: '',
    role: '',
    gt: 'Educação',
    helix: 'Sociedade',
    socialLinks: '',
    address: '',
    city: 'Camaquã / RS',
    participatedIn: [],
    notes: ''
  };
  const [formData, setFormData] = useState<Partial<Actor>>(initialFormState);

  const entities = Array.from(new Set(actors.map(a => a.organization))).sort();

  const filteredActors = actors.filter(actor => {
    const matchesSearch = actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          actor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          actor.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGT = selectedGT === 'all' || actor.gt === selectedGT;
    const matchesHelix = selectedHelix === 'all' || actor.helix === selectedHelix;
    const matchesEntity = selectedEntity === 'all' || actor.organization === selectedEntity;
    return matchesSearch && matchesGT && matchesHelix && matchesEntity;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString('pt-BR');
    
    if (editingId) {
      setActors(prev => prev.map(item => item.id === editingId ? { ...item, ...formData, lastUpdate: timestamp } as Actor : item));
    } else {
      const newItem: Actor = {
        ...formData as Actor,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdate: timestamp,
      };
      setActors(prev => [...prev, newItem]);
    }
    closeForm();
  };

  const handleEdit = (actor: Actor) => {
    setFormData(actor);
    setEditingId(actor.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja remover este ator da base de dados?')) {
      setActors(prev => prev.filter(a => a.id !== id));
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleParticipationToggle = (opt: string) => {
    const current = formData.participatedIn || [];
    if (current.includes(opt)) {
        setFormData({...formData, participatedIn: current.filter(c => c !== opt)});
    } else {
        setFormData({...formData, participatedIn: [...current, opt]});
    }
  };

  const exportActorsCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "Entidade", "Cargo", "GT", "Hélice", "Cidade", "Participação"];
    const rows = filteredActors.map(a => [
      a.name, a.email, a.phone, a.organization, a.role, a.gt, a.helix, a.city, a.participatedIn.join(";")
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ynov_atores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getHelixColor = (helix: HelixType) => {
    switch(helix) {
      case 'Governo': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Empresa': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Academia': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Sociedade': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-ynov-green" />
            Atores/Hélices
          </h2>
          <p className="text-gray-500 text-sm">Base de contatos e inteligência de rede da Quádrupla Hélice.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={exportActorsCSV}
                className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm"
            >
                <Download size={18} />
                Exportar CSV/XLSX
            </button>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-ynov-green hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm"
            >
                <UserPlus size={18} />
                Cadastrar Novo Ator
            </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Buscar por nome, e-mail, entidade..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ynov-blue/20 text-sm bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select 
                    className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
                    value={selectedHelix}
                    onChange={(e) => setSelectedHelix(e.target.value)}
                >
                    <option value="all">Hélice Representada</option>
                    {HELIX_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select 
                    className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
                    value={selectedGT}
                    onChange={(e) => setSelectedGT(e.target.value)}
                >
                    <option value="all">GT de Atuação</option>
                    {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                </select>
                <select 
                    className="flex-1 min-w-[140px] px-3 py-2 border border-gray-200 rounded-lg bg-white text-xs focus:outline-none"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                >
                    <option value="all">Entidade / Empresa</option>
                    {entities.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
        </div>
      </div>

      {/* CRM Grid / Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Ator / Cargo</th>
                <th className="p-4">Hélice / GT</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Organização</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActors.length > 0 ? (
                filteredActors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
                            {actor.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{actor.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{actor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold w-fit uppercase ${getHelixColor(actor.helix)}`}>
                            {actor.helix === 'Empresa' ? 'Empresas' : actor.helix === 'Sociedade' ? 'Sociedade Civil' : actor.helix}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                            <Layers size={10} className="text-gray-400" />
                            {actor.gt}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-gray-300" />
                            {actor.email}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-300" />
                            {actor.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <Building2 size={12} className="text-gray-300" />
                            <span className="font-medium text-gray-700">{actor.organization}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                            <MapPin size={10} />
                            {actor.city}
                        </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {setActiveTab && (
                            <button 
                                onClick={() => setActiveTab('database')} 
                                title="Ver Atividades deste GT"
                                className="p-1.5 text-gray-300 hover:text-ynov-blue hover:bg-blue-50 rounded transition-colors"
                            >
                                <Eye size={16} />
                            </button>
                        )}
                        <button onClick={() => handleEdit(actor)} className="p-1.5 text-gray-300 hover:text-ynov-blue hover:bg-blue-50 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(actor.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                    Nenhum ator cadastrado na base com os filtros selecionados.
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
                    {editingId ? 'Editar Perfil do Ator' : 'Cadastrar Novo Integrante'}
                </h3>
                <p className="text-xs text-gray-500">Mantenha a base de contatos do ecossistema atualizada.</p>
              </div>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome Completo</label>
                    <input required type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-ynov-blue/20 outline-none bg-white" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Hélice Representada</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.helix} onChange={e => setFormData({...formData, helix: e.target.value as HelixType})}>
                       <option value="Governo">Governo</option>
                       <option value="Empresa">Empresas</option>
                       <option value="Academia">Academia</option>
                       <option value="Sociedade">Sociedade Civil</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">GT de Atuação</label>
                     <select className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.gt} onChange={e => setFormData({...formData, gt: e.target.value as GTType})}>
                       {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Telefone / WhatsApp</label>
                     <input required type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                        placeholder="(00) 00000-0000"
                       value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">E-mail</label>
                     <input required type="email" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Entidade / Empresa</label>
                     <input required type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cargo ou Função</label>
                     <input type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Data de Nascimento</label>
                     <input type="date" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Redes Sociais (URL)</label>
                     <input type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                        placeholder="Ex: https://instagram.com/usuario"
                       value={formData.socialLinks} onChange={e => setFormData({...formData, socialLinks: e.target.value})} />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Endereço</label>
                     <input type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cidade / UF</label>
                     <input type="text" className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none bg-white"
                       value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Participou de:</label>
                     <div className="flex flex-wrap gap-2">
                        {PARTICIPATION_OPTIONS.map(opt => (
                            <button 
                                key={opt}
                                type="button"
                                onClick={() => handleParticipationToggle(opt)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                                    formData.participatedIn?.includes(opt) 
                                    ? 'bg-ynov-green text-white border-ynov-green' 
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-ynov-green hover:text-ynov-green'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                     </div>
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Observações Internas</label>
                     <textarea className="w-full border-gray-200 border rounded-lg px-3 py-2.5 text-sm outline-none resize-none bg-white" rows={3}
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                  </div>
               </div>
               
               <div className="pt-4 flex gap-4">
                  <button type="button" onClick={closeForm} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white">
                    Descartar
                  </button>
                  <button type="submit" className="flex-[2] bg-ynov-green text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">
                    {editingId ? 'Salvar Perfil' : 'Confirmar Cadastro'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actors;
