import React from 'react';
import { Target, Lightbulb, Map, Zap } from 'lucide-react';

const Vision2030: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Visão 2030</h2>
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                    Consolidar Camaquã como referência em inovação sustentável no Sul do Brasil, 
                    criando um ambiente fértil para novos negócios, retenção de talentos e qualidade de vida.
                </p>
            </div>
            <Target className="absolute top-10 right-10 text-gray-800 w-64 h-64 opacity-20 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-ynov-yellow">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Map size={24} className="text-ynov-blue" />
                    Pilares Estratégicos
                </h3>
                <ul className="space-y-6">
                    <li className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-ynov-blue font-bold">1</div>
                        <div>
                            <h4 className="font-bold text-gray-800">Educação Empreendedora</h4>
                            <p className="text-sm text-gray-600 mt-1">Inserir lógica de programação e empreendedorismo em 100% das escolas municipais.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-ynov-green font-bold">2</div>
                        <div>
                            <h4 className="font-bold text-gray-800">Agro 4.0</h4>
                            <p className="text-sm text-gray-600 mt-1">Digitalizar a cadeia produtiva local e fomentar agritechs.</p>
                        </div>
                    </li>
                     <li className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 text-yellow-600 font-bold">3</div>
                        <div>
                            <h4 className="font-bold text-gray-800">Cidades Inteligentes</h4>
                            <p className="text-sm text-gray-600 mt-1">Serviços públicos 100% digitais e integrados.</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-ynov-green">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Zap size={24} className="text-ynov-yellow" />
                    Metas Quantitativas
                </h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Startups Incubadas</span>
                            <span className="font-bold text-gray-900">12 / 100</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-ynov-blue" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Talentos Capacitados</span>
                            <span className="font-bold text-gray-900">5.000 / 20.000</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-ynov-green" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-700">Empresas Conectadas</span>
                            <span className="font-bold text-gray-900">60 / 500</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-ynov-yellow" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <h4 className="font-bold text-gray-800 mb-2">Tem uma ideia para o futuro?</h4>
                    <button className="text-sm bg-ynov-blue text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 w-full">
                        <Lightbulb size={16} />
                        Enviar Sugestão
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Vision2030;