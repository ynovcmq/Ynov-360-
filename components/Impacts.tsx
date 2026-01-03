
import React, { useMemo } from 'react';
import { 
    BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ActionItem, Actor, HelixType } from '../types';
import { SURVEY_DATA, SOCIAL_DATA, GT_OPTIONS } from '../constants';
import { Users, FileText, Target, Share2, TrendingUp, Activity, Heart, ShieldCheck, AlertTriangle, Map as MapIcon } from 'lucide-react';

interface ImpactsProps {
  actions: ActionItem[];
  actors: Actor[];
}

const HELIX_COLORS: Record<string, string> = {
  'Governo': '#1565C0',
  'Empresa': '#43A047',
  'Academia': '#F57C00',
  'Sociedade': '#8E24AA'
};

const Impacts: React.FC<ImpactsProps> = ({ actions, actors }) => {
    
    // --- Data Processing for "Evolução da Quádrupla Hélice" ---

    const helixMapping: Record<HelixType, string> = {
        'Governo': 'Governo',
        'Empresa': 'Empresas',
        'Academia': 'Academia',
        'Sociedade': 'Sociedade Civil'
    };

    const targets2030: Record<string, number> = {
        'Governo': 20,
        'Empresas': 300,
        'Academia': 80,
        'Sociedade Civil': 150
    };

    // 1. Radar Data: Current vs Meta 2030
    const radarData = useMemo(() => Object.entries(helixMapping).map(([key, label]) => {
        const currentCount = actors.filter(a => a.helix === key).length;
        return {
            subject: label,
            A: currentCount,
            B: targets2030[label],
            fullMark: targets2030[label] * 1.2
        };
    }), [actors]);

    // 2. Line Chart Data: Evolution grouped by Helix (Mocked historical data for visualization)
    const evolutionData = [
        { year: '2023', Governo: 2, Empresas: 15, Academia: 5, Sociedade: 10 },
        { year: '2024', Governo: 5, Empresas: 45, Academia: 12, Sociedade: 28 },
        { year: '2025', 
          Governo: actors.filter(a => a.helix === 'Governo').length || 8, 
          Empresas: actors.filter(a => a.helix === 'Empresa').length || 62, 
          Academia: actors.filter(a => a.helix === 'Academia').length || 18, 
          Sociedade: actors.filter(a => a.helix === 'Sociedade').length || 42 
        },
        { year: '2027 (Proj.)', Governo: 12, Empresas: 180, Academia: 45, Sociedade: 90 },
        { year: '2030 (Meta)', Governo: 20, Empresas: 300, Academia: 80, Sociedade: 150 },
    ];

    // 3. Concentration Map Data (By City/Region)
    const concentrationData = useMemo(() => {
        // Fix: Explicitly cast Array.from result to string[] to resolve 'unknown' type inference on city
        const cities = Array.from(new Set(actors.map(a => a.city || 'Camaquã / RS'))) as string[];
        return cities.map(city => ({
            name: city.split('/')[0].trim(),
            count: actors.filter(a => a.city === city).length,
            governo: actors.filter(a => a.city === city && a.helix === 'Governo').length,
            empresas: actors.filter(a => a.city === city && a.helix === 'Empresa').length,
            academia: actors.filter(a => a.city === city && a.helix === 'Academia').length,
            sociedade: actors.filter(a => a.city === city && a.helix === 'Sociedade').length,
        }));
    }, [actors]);

    // 4. Alerts Logic
    const alerts = useMemo(() => {
        return Object.entries(helixMapping).map(([key, label]) => {
            const current = actors.filter(a => a.helix === key).length;
            const target = targets2030[label];
            const percent = (current / target) * 100;
            const deviation = 100 - percent;
            return { helix: label, percent, deviation, isAlert: percent < 80 };
        }).filter(a => a.isAlert);
    }, [actors]);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            
            {/* Dashboard Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Evolução da Quádrupla Hélice</h2>
                <p className="text-gray-500 mt-1">
                    Ecossistema YNOV Camaquã (Progresso 2023–2030)
                </p>
            </div>

            {/* Radar & Line Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Radar Chart (Left 55%) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ShieldCheck className="text-ynov-blue" size={20} />
                            Radar de Progresso das Hélices
                        </h3>
                        <p className="text-xs text-gray-500">Comparativo Atores Atuais vs Metas 2030.</p>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Radar
                                    name="Atores Atuais (2025)"
                                    dataKey="A"
                                    stroke="#1E88E5"
                                    strokeWidth={3}
                                    fill="#1E88E5"
                                    fillOpacity={0.7}
                                />
                                <Radar
                                    name="Metas 2030"
                                    dataKey="B"
                                    stroke="#F9A825"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent"
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart (Right 45%) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="text-ynov-green" size={20} />
                            Evolução Histórica (2023–2030)
                        </h3>
                        <p className="text-xs text-gray-500">Acompanhamento temporal por Hélice.</p>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="Governo" stroke={HELIX_COLORS['Governo']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Empresas" stroke={HELIX_COLORS['Empresa']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Academia" stroke={HELIX_COLORS['Academia']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Sociedade" stroke={HELIX_COLORS['Sociedade']} strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Map / Heatmap Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <MapIcon className="text-ynov-blue" size={20} />
                            Mapa de Concentração Territorial
                        </h3>
                        <p className="text-xs text-gray-500">Distribuição geográfica dos atores cadastrados.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Visual Mock of a Region Grid/Heatmap */}
                    <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                        {/* Simulating a heatmap on a grid */}
                        <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-full max-w-lg aspect-square">
                            {Array.from({length: 100}).map((_, i) => {
                                const active = Math.random() > 0.85;
                                const intensity = active ? (Math.random() > 0.5 ? 'bg-ynov-blue' : 'bg-blue-300') : 'bg-white';
                                return <div key={i} className={`rounded-sm transition-all duration-1000 ${intensity}`}></div>
                            })}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white text-center">
                                <MapIcon className="mx-auto mb-2 text-ynov-blue" size={32} />
                                <p className="text-sm font-bold text-gray-800">Área Urbana de Camaquã</p>
                                <p className="text-[10px] text-gray-500">Visualização de Densidade (Heatmap)</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase">Concentração por Localidade</h4>
                        {concentrationData.map((city, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-700 text-sm">{city.name}</span>
                                    <span className="bg-blue-50 text-ynov-blue text-[10px] px-2 py-0.5 rounded-full font-bold">{city.count} atores</span>
                                </div>
                                <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100">
                                    <div className="bg-blue-600" style={{ width: `${(city.governo/city.count)*100}%` }} />
                                    <div className="bg-green-600" style={{ width: `${(city.empresas/city.count)*100}%` }} />
                                    <div className="bg-orange-500" style={{ width: `${(city.academia/city.count)*100}%` }} />
                                    <div className="bg-purple-600" style={{ width: `${(city.sociedade/city.count)*100}%` }} />
                                </div>
                            </div>
                        ))}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                            <p className="text-[10px] text-blue-700 leading-relaxed italic">
                                * Os dados de localização são extraídos automaticamente do campo "Endereço" e "Cidade" no CRM de Atores.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-white rounded-full text-red-600 shadow-sm">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Alertas do Diagnóstico YNOV</h3>
                        <div className="space-y-2">
                            {alerts.map((alert, idx) => (
                                <p key={idx} className="text-sm text-red-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                    ⚠️ A hélice <strong>{alert.helix}</strong> está com <strong>{alert.deviation.toFixed(1)}%</strong> abaixo da meta proporcional de 2030.
                                </p>
                            ))}
                        </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-lg">
                        Ver Plano de Ação
                    </button>
                </div>
            )}

            {/* Existing Legacy KPIs & Charts for completeness */}
            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Métricas de Engajamento e Alcance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="text-red-500" size={18} />
                            <h4 className="font-bold text-gray-700">Pertencimento</h4>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-gray-800">7.8</span>
                            <span className="text-gray-400 mb-1">/10</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Nível de engajamento percebido em pesquisas.</p>
                     </div>
                     <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Comunicação Digital</h4>
                        <div className="h-32">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SOCIAL_DATA}>
                                    <XAxis dataKey="platform" tick={{fontSize: 10}} hide />
                                    <Tooltip />
                                    <Bar dataKey="reach" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                             </ResponsiveContainer>
                        </div>
                     </div>
                </div>
            </div>

        </div>
    );
};

export default Impacts;
