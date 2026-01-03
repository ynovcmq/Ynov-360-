import React from 'react';
import { COUNCIL_MEMBERS } from '../constants';
import { ScrollText, Gavel, FileText } from 'lucide-react';

const Council: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
       {/* Header */}
       <div className="bg-white p-8 rounded-xl shadow-sm border-l-4 border-ynov-blue">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Conselho Municipal de Inovação</h2>
        <p className="text-gray-600">
          O órgão deliberativo que garante a continuidade e a transparência das ações do ecossistema, unindo a Quádrupla Hélice.
        </p>
      </div>

      {/* Docs and Legal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ynov-blue text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Gavel size={28} className="text-ynov-yellow" />
              <h3 className="text-xl font-bold">Marco Legal</h3>
            </div>
            <p className="text-sm text-gray-200 mb-4">
              Lei de Inovação nº 2.064/2023. Estabelece incentivos, fundo municipal e o sistema de inovação.
            </p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 py-2 rounded text-sm font-semibold transition-colors">
            Acessar Lei Completa
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4 text-gray-800">
              <ScrollText size={28} className="text-ynov-blue" />
              <h3 className="text-xl font-bold">Resoluções</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Repositório oficial de atas, editais e resoluções publicadas pelo conselho.
            </p>
            <button className="text-ynov-blue hover:underline text-sm font-semibold text-left">
              Ver pasta do Drive &rarr;
            </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-4 text-gray-800">
              <FileText size={28} className="text-ynov-green" />
              <h3 className="text-xl font-bold">Transparência</h3>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reuniões realizadas</span>
                    <span className="font-bold text-gray-800">24</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resoluções emitidas</span>
                    <span className="font-bold text-gray-800">12</span>
                </div>
            </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Conselheiros Titulares</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                        <th className="p-4 font-semibold">Nome</th>
                        <th className="p-4 font-semibold">Função</th>
                        <th className="p-4 font-semibold">Instituição</th>
                        <th className="p-4 font-semibold">Representação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {COUNCIL_MEMBERS.map((member, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-800">{member.name}</td>
                            <td className="p-4 text-gray-600">{member.role}</td>
                            <td className="p-4 text-gray-600">{member.institution}</td>
                            <td className="p-4">
                                <span className={`
                                    px-2 py-1 rounded-full text-xs font-bold
                                    ${member.helix === 'Governo' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${member.helix === 'Empresa' ? 'bg-gray-100 text-gray-700' : ''}
                                    ${member.helix === 'Academia' ? 'bg-green-100 text-green-700' : ''}
                                    ${member.helix === 'Sociedade' ? 'bg-yellow-100 text-yellow-800' : ''}
                                `}>
                                    {member.helix}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Council;