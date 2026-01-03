
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
// Import ActivityType to satisfy the ActionItem interface requirements
import { ActionItem, GTType, HelixType, ActivityType } from '../types';
import { GT_OPTIONS, HELIX_OPTIONS } from '../constants';

interface AgendaProps {
  actions: ActionItem[];
  setActions?: React.Dispatch<React.SetStateAction<ActionItem[]>>;
}

const Agenda: React.FC<AgendaProps> = ({ actions, setActions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGT, setSelectedGT] = useState<string>('');

  // Modal Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Evento',
    gt: 'Educação',
    helix: 'Sociedade',
    description: ''
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const setMonth = (m: number) => setCurrentDate(new Date(year, m, 1));
  const setYear = (y: number) => setCurrentDate(new Date(y, month, 1));

  // Filter Actions for Calendar
  const getEventsForDay = (day: number) => {
    return actions.filter(action => {
      // Use 'date' property as per ActionItem interface
      const actionDateString = action.date;
      if (!actionDateString) return false;
      
      const targetDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return actionDateString === targetDateString;
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setActions) return;

    // Define activityType property to fix the interface error
    const newAction: ActionItem = {
      id: Math.random().toString(36).substr(2, 9),
      activity: newEvent.title,
      activityType: newEvent.type as ActivityType,
      date: newEvent.date,
      gt: newEvent.gt as GTType,
      helix: newEvent.helix as HelixType,
      description: newEvent.description,
      status: 'Planejada',
      responsible: 'Colaborador',
      location: 'A definir',
      peopleInvolved: 0,
      impactIndirect: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
    };

    setActions(prev => [...prev, newAction]);
    setIsModalOpen(false);
    // Reset form
    setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Evento',
        gt: 'Educação',
        helix: 'Sociedade',
        description: ''
    });
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('pt-BR', { month: 'long' }));
  const years = [2023, 2024, 2025, 2026];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Agenda & Eventos</h2>
          <p className="text-gray-500 text-sm">Calendário de atividades do ecossistema YNOV.</p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-ynov-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
                <Plus size={16} />
                Novo Evento
            </button>
            <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <CalendarIcon size={16} />
                Sincronizar Google
            </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="text-lg font-bold text-gray-800 capitalize w-48 text-center">
                {monthName} {year}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight size={20} className="text-gray-600" />
            </button>
        </div>

        <div className="flex gap-2">
            <select 
                value={month} 
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white capitalize"
            >
                {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
            </select>
            <select 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         {/* Week Days Header */}
         <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {weekDays.map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase">
                    {day}
                </div>
            ))}
         </div>
         
         {/* Days Grid */}
         <div className="grid grid-cols-7 auto-rows-fr">
            {blanksArray.map((_, idx) => (
                <div key={`blank-${idx}`} className="h-32 border-b border-r border-gray-100 bg-gray-50/30"></div>
            ))}
            
            {daysArray.map(day => {
                const dayEvents = getEventsForDay(day);
                const isToday = 
                    day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();

                return (
                    <div key={day} className={`h-32 border-b border-r border-gray-100 p-2 relative group hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50/30' : ''}`}>
                        <div className={`text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-ynov-blue text-white' : 'text-gray-700'}`}>
                            {day}
                        </div>
                        
                        <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                            {dayEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    className={`
                                        text-[10px] px-1.5 py-1 rounded border truncate cursor-pointer
                                        bg-blue-50 text-blue-700 border-blue-100
                                    `}
                                    title={event.activity}
                                >
                                    {event.activity}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
         </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Novo Evento na Agenda</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAddEvent} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border rounded p-2 text-sm bg-white"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input 
                                required
                                type="date" 
                                className="w-full border rounded p-2 text-sm bg-white"
                                value={newEvent.date}
                                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select 
                                className="w-full border rounded p-2 text-sm bg-white"
                                value={newEvent.type}
                                onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                            >
                                <option value="Evento">Evento</option>
                                <option value="Agenda">Atividade</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GT Vinculado</label>
                            <select 
                                className="w-full border rounded p-2 text-sm bg-white"
                                value={newEvent.gt}
                                onChange={e => setNewEvent({...newEvent, gt: e.target.value})}
                            >
                                 {GT_OPTIONS.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hélice</label>
                            <select 
                                className="w-full border rounded p-2 text-sm bg-white"
                                value={newEvent.helix}
                                onChange={e => setNewEvent({...newEvent, helix: e.target.value})}
                            >
                                 {HELIX_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea 
                            className="w-full border rounded p-2 text-sm bg-white" 
                            rows={3}
                            value={newEvent.description}
                            onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-ynov-blue hover:bg-blue-800 text-white font-bold py-2 rounded-lg transition-colors">
                            Adicionar à Agenda
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
