
import React, { useMemo } from 'react';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ActionItem, Actor, HelixType } from '../types';
import { SOCIAL_DATA } from '../constants';
import { TrendingUp, ShieldCheck, Map as MapIcon, AlertTriangle, Heart } from 'lucide-react';

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

const Impacts: React.FC<ImpactsProps> = ({ actions = [], actors = [] }) => {
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

    const radarData = useMemo(() => Object.entries(helixMapping).map(([key, label]) => {
        const currentCount = actors.filter(a => a.helix === key).length;
        const targetValue = targets2030[label] || 1;
        return {
            subject: label,
            A: currentCount,
            B: targetValue,
            fullMark: targetValue * 1.2
        };
    }), [actors]);

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

    const concentrationData = useMemo(() => {
        const cities = Array.from(new Set(actors.map(a => a.city || 'Camaquã / RS'))) as string[];
        return cities.map(city => ({
            name: city.split('/')[0].trim(),
            count: actors.filter(a => a.city === city).length || 1,
            governo: actors.filter(a => a.city === city && a.helix === 'Governo').length,
            empresas: actors.filter(a => a.city === city && a.helix === 'Empresa').length,
            academia: actors.filter(a => a.city === city && a.helix === 'Academia').length,
            sociedade: actors.filter(a => a.city === city && a.helix === 'Sociedade').length,
        }));
    }, [actors]);

    const alerts = useMemo(() => {
        return Object.entries(helixMapping).map(([key, label]) => {
            const current = actors.filter(a => a.helix === key).length;
            const target = targets2030[label] || 1;
            const percent = (current / target) * 100;
            const deviation = 100 - percent;
            return { helix: label, percent, deviation, isAlert: percent < 80 };
        }).filter(a => a.isAlert);
    }, [actors]);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Evolução da Quádrupla Hélice</h2>
                <p className="text-gray-500 mt-1">Ecossistema YNOV Camaquã (Progresso 2023–2030)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                        <ShieldCheck className="text-ynov-blue" size={20} />
                        Radar de Progresso das Hélices
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 10, fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
                                <Tooltip />
                                <Radar name="Atores Atuais" dataKey="A" stroke="#1E88E5" strokeWidth={3} fill="#1E88E5" fillOpacity={0.6} />
                                <Radar name="Metas 2030" dataKey="B" stroke="#F9A825" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                        <TrendingUp className="text-ynov-green" size={20} />
                        Evolução Histórica (2023–2030)
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                                <Line type="monotone" dataKey="Governo" stroke={HELIX_COLORS['Governo']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Empresas" stroke={HELIX_COLORS['Empresa']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Academia" stroke={HELIX_COLORS['Academia']} strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="Sociedade" stroke={HELIX_COLORS['Sociedade']} strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                    <MapIcon className="text-ynov-blue" size={20} />
                    Concentração Territorial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[300px] flex items-center justify-center">
                         <div className="grid grid-cols-10 gap-1 w-full max-w-md aspect-square">
                            {Array.from({length: 100}).map((_, i) => (
                                <div key={i} className={`rounded-sm ${Math.random() > 0.85 ? 'bg-ynov-blue/40' : 'bg-white'}`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {concentrationData.map((city, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 p-3 rounded-lg">
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
                    </div>
                </div>
            </div>

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
                                    Hélice <strong>{alert.helix}</strong> está <strong>{alert.deviation.toFixed(1)}%</strong> abaixo da meta.
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Impacts;
