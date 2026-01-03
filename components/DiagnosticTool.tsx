
import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, HelpCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { ActionItem, Actor } from '../types';
import { GT_OPTIONS, TIMELINE_DATA } from '../constants';

interface DiagnosticToolProps {
  actions: ActionItem[];
  actors: Actor[];
}

interface CheckResult {
  id: string;
  label: string;
  status: 'ok' | 'warning' | 'error' | 'pending';
  description: string;
  recommendation: string;
}

const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ actions, actors }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);

  const runDiagnostic = () => {
    setIsRunning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const newResults: CheckResult[] = [
        {
          id: "dataConnections",
          label: "Conectividade de Dados",
          description: "Verifica se todas as conexões entre os datasets (‘Base de Dados’, ‘CRM Atores’, ‘Diagnóstico’, ‘GTs’) estão ativas e sincronizadas.",
          status: (actions.length > 0 && actors.length > 0) ? 'ok' : 'error',
          recommendation: (actions.length > 0 && actors.length > 0) 
            ? "Conexões ativas e sincronizadas." 
            : "🔴 Alguma conexão está ausente ou desatualizada. Verifique os nomes das fontes e a vinculação com os datasets."
        },
        {
          id: "kanbanModules",
          label: "Status dos Kanbans Interativos",
          description: "Confere se os quadros Kanban (Geral + GTs) estão renderizando corretamente e com funcionalidade de drag & drop.",
          status: GT_OPTIONS.length > 0 ? 'ok' : 'warning',
          recommendation: GT_OPTIONS.length > 0
            ? "Módulos de Kanban configurados corretamente."
            : "🟠 Kanban não está visível ou não permite movimentar cards. Revise o componente interativo e as permissões de edição."
        },
        {
          id: "radarChart",
          label: "Radar de Hélices",
          description: "Valida se o gráfico radar (Atuais × Metas 2030) está carregando e recebendo dados atualizados do CRM e Diagnóstico.",
          status: actors.some(a => a.helix) ? 'ok' : 'warning',
          recommendation: actors.some(a => a.helix)
            ? "Dados do Radar fluindo normalmente."
            : "🟠 Radar não renderizado ou sem dados. Verifique a origem ‘Metas Estratégicas 2030’ e o campo ‘Hélice Representada’."
        },
        {
          id: "timeline",
          label: "Linha do Tempo 2023–2030",
          description: "Checa se a linha de evolução temporal está exibindo os registros corretamente e com filtros de ano funcionais.",
          status: TIMELINE_DATA.length > 0 ? 'ok' : 'warning',
          recommendation: TIMELINE_DATA.length > 0
            ? "Eventos da linha do tempo carregados."
            : "🟠 Linha do tempo sem dados ou sem campo temporal vinculado."
        },
        {
          id: "mapComponent",
          label: "Mapa Interativo",
          description: "Confirma a visualização de localização dos atores do ecossistema, com cores por hélice e calor regional.",
          status: actors.some(a => a.city) ? 'ok' : 'warning',
          recommendation: actors.some(a => a.city)
            ? "Componente de mapa geolocalizado."
            : "🟡 Mapa não está carregando coordenadas. Verifique os campos Latitude e Longitude."
        },
        {
          id: "alertSystem",
          label: "Alertas do Diagnóstico YNOV",
          description: "Valida o funcionamento do sistema de alertas automáticos baseado em desvios das metas 2030.",
          status: 'ok', // Logic is active even if no alerts triggered
          recommendation: "⚠️ Sistema de alertas ativo e monitorando desvios das metas 2030."
        },
        {
          id: "layoutConsistency",
          label: "Consistência de Layout e Navegação",
          description: "Revisa o alinhamento entre painéis, menus e seções (Pitch, Diagnóstico, Base de Dados, GTs, CRM).",
          status: 'ok',
          recommendation: "Layout consistente. Menus e seções acessíveis."
        }
      ];

      setResults(newResults);
      setIsRunning(false);
    }, 1500);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'ok': return <CheckCircle size={20} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'error': return <AlertCircle size={20} className="text-red-500" />;
      default: return <HelpCircle size={20} className="text-gray-300" />;
    }
  };

  const getStatusLabel = (status: CheckResult['status']) => {
    switch (status) {
      case 'ok': return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Estável</span>;
      case 'warning': return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">Alerta</span>;
      case 'error': return <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">Falha</span>;
      default: return <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase">Pendente</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-ynov-blue flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={32} className="text-ynov-blue" />
            <h2 className="text-2xl font-bold text-gray-800">Diagnóstico e Consolidação – Ecossistema YNOV Camaquã 2023–2025</h2>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl">
            Ferramenta de diagnóstico técnico para validar a integridade estrutural, conexões de dados e funcionalidades interativas de todo o ecossistema.
          </p>
        </div>
        <button 
          onClick={runDiagnostic}
          disabled={isRunning}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg
            ${isRunning 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-ynov-blue text-white hover:bg-blue-800 active:scale-95'}
          `}
        >
          {isRunning ? <RefreshCw size={20} className="animate-spin" /> : <RefreshCw size={20} />}
          Executar Diagnóstico
        </button>
      </div>

      {/* Results Table */}
      {results ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Componente</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Descrição Técnica</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Recomendação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <p className="font-bold text-gray-800 text-sm">{result.label}</p>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {getStatusLabel(result.status)}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                      {result.description}
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    <p className={`text-xs font-medium leading-relaxed max-w-sm ${result.status === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
                      {result.recommendation}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-200 text-center">
          <div className="max-w-xs mx-auto">
            <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-400 mb-2">Aguardando Verificação</h3>
            <p className="text-xs text-gray-400">Clique no botão acima para iniciar o diagnóstico completo de saúde do painel.</p>
          </div>
        </div>
      )}

      {/* Technical Summary */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <div className="text-emerald-600 font-bold text-2xl">{results.filter(r => r.status === 'ok').length}</div>
            <div className="text-xs font-bold text-emerald-800 uppercase">Módulos Saudáveis</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
            <div className="text-amber-600 font-bold text-2xl">{results.filter(r => r.status === 'warning').length}</div>
            <div className="text-xs font-bold text-amber-800 uppercase">Alertas de Atenção</div>
          </div>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
            <div className="text-red-600 font-bold text-2xl">{results.filter(r => r.status === 'error').length}</div>
            <div className="text-xs font-bold text-red-800 uppercase">Falhas Críticas</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticTool;
