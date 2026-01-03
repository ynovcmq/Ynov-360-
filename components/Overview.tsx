
import React, { useState } from 'react';
import { TIMELINE_DATA } from '../constants';
import { SectionId, ActionItem } from '../types';
import { 
  ArrowRight, Rocket, Users, Landmark, Building2, GraduationCap,
  X, Trophy, Globe, ChevronRight, Instagram, ExternalLink, Zap, Gamepad2, ChevronLeft
} from 'lucide-react';

interface OverviewProps {
  actions: ActionItem[];
  setActiveTab: (id: SectionId) => void;
}

const PDF_BASE64 = "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgNTk1LjI4IDg0MS44OSBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSC4gIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9FMSA0IDAgUgogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagoKNSAwIG9iago8PAogIC9MZW5ndGggMjIzCj4+CnN0cmVhbQpCVAovRTEgMjQgVGYKNjAgNzUwIFRECihZTk9WIC0gTW92aW1lbnRvIHBlbGEgSW5vdmFjYW8gZGUgQ2FtYXF1YSkgVGoKRVQKQlQKL0UxIDEyIFRmCjYwIDcwMCBVEQooRXN0ZSBlLSB1bSBhcnF1aXZvIFBERiBkZSBleGVtcGxvIHBhcmEgbyBEYXNoYm9hcmQgWU5PVi4pIFRqCkVUCkJUCi9FMSIDEyIFRmCjYwIDY4AgVEQooFN1YnN0aXR1YSBlc3RlIGFyZ3Vpdm8gcGVsbyBQaXRjaCBEZWNrIHJlYWwgbm8gY29kaWdvLikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDE1NyAwMDAwMCBuIAowMDAwMDAwMjY5IDAwMDAwIG4gCjAwMDAwMDAzNTYgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNjMwCiUlRU9GCg==";

const YNOV_BANNER_IMG = "https://storage.googleapis.com/download/storage/v1/b/app-assets/o/file_0000000058bc71f5ab41d2bbc99cab81?alt=media";

const TOUR_STEPS = [
  {
    title: "Bem-vindo ao YNOV 🌍",
    text: "Você está prestes a conhecer o Ecossistema de Inovação de Camaquã. Aqui, inovação é verbo coletivo — e você faz parte disso!",
    icon: Globe
  },
  {
    title: "A Força da Quádrupla Hélice 🔄",
    text: "Governo, Empresas, Academia e Sociedade conectados por um propósito: transformar ideias em impacto real no território.",
    icon: Users
  },
  {
    title: "O Movimento YNOV 🚀",
    text: "Mais de 200 ações desde 2023, 5 mil pessoas impactadas, projetos em todas as áreas — do agro à educação, do varejo à indústria criativa.",
    icon: Rocket
  },
  {
    title: "Como Participar 💡",
    text: "Participe dos GTs, cadastre-se como ator do ecossistema, proponha projetos e acompanhe as entregas no painel de governança.",
    icon: Landmark
  },
  {
    title: "Pronto para cocriar o futuro? 🤝",
    text: "Junte-se ao movimento. Comece agora sua jornada no ecossistema de inovação de Camaquã!",
    icon: Zap
  }
];

const Overview: React.FC<OverviewProps> = ({ actions, setActiveTab }) => {
  const [activeHelixModal, setActiveHelixModal] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  
  const totalImpact = actions.reduce((acc, curr) => acc + (curr.peopleInvolved || 0) + (curr.impactIndirect || 0), 0);
  const finishedActions = actions.filter(a => a.status === 'Concluída').length;
  const partnerCount = new Set(actions.map(a => a.responsible)).size;

  const handleNextStep = () => {
    if (currentTourStep < TOUR_STEPS.length - 1) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      setIsTourOpen(false);
      setCurrentTourStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1);
    }
  };

  const HELIX_DATA = [
    {
      id: "helice_governo",
      icon: Landmark,
      title: "Governo",
      subtitle: "Leis e Fomento",
      colorClass: "bg-blue-100 text-blue-700",
      summary: "Cria políticas públicas, leis e programas que fomentam a inovação local.",
      popup: {
        title: "🏛 Governo — Leis e Fomento",
        text: "O setor público atua como facilitador, criando ambientes regulatórios e políticas de incentivo que estimulam a inovação.",
        targetTab: 'gts' as SectionId,
        buttonText: "Ver GT Governo e Políticas Públicas"
      }
    },
    {
      id: "helice_empresas",
      icon: Building2,
      title: "Empresas",
      subtitle: "Investimento e Mercado",
      colorClass: "bg-teal-100 text-teal-700",
      summary: "Transformam ideias em valor econômico e social através da inovação.",
      popup: {
        title: "💼 Empresas — Investimento e Mercado",
        text: "As empresas são o motor da inovação. Elas aplicam novas ideias e investem em soluções.",
        targetTab: 'gts' as SectionId,
        buttonText: "Ver GT Comércio & Varejo"
      }
    },
    {
      id: "helice_academia",
      icon: GraduationCap,
      title: "Academia",
      subtitle: "Talento e Pesquisa",
      colorClass: "bg-orange-100 text-orange-700",
      summary: "Forma talentos e aplica conhecimento científico à inovação prática.",
      popup: {
        title: "🎓 Academia — Talento e Pesquisa",
        text: "Universidades e escolas técnicas são a base do conhecimento.",
        targetTab: 'gts' as SectionId,
        buttonText: "Ver GT Educação & Talentos"
      }
    },
    {
      id: "helice_sociedade",
      icon: Users,
      title: "Sociedade",
      subtitle: "Demandas e Uso",
      colorClass: "bg-red-100 text-red-700",
      summary: "Identifica desafios e coconstrói soluções com impacto social real.",
      popup: {
        title: "🤝 Sociedade — Demandas e Uso",
        text: "A sociedade é o centro. Cidadãos ajudam a identificar problemas reais.",
        targetTab: 'gts' as SectionId,
        buttonText: "Ver GT Agro & Sustentabilidade"
      }
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* RESTORED: Professional Hero Section with Interactive Tour Button */}
      <div className="relative rounded-[24px] overflow-hidden shadow-2xl bg-ynov-blue min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {!imageError ? (
            <img 
              src={YNOV_BANNER_IMG} 
              alt="YNOV Banner" 
              className="w-full h-full object-cover opacity-60"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ynov-blue via-blue-900 to-indigo-950 opacity-100">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ynov-blue via-ynov-blue/40 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 md:p-16 text-center md:text-left w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-ynov-yellow/20 text-ynov-yellow px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-ynov-yellow/30">
              <Zap size={14} />
              Camaquã 2030
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1]">
              Movimento pela <span className="text-ynov-yellow">Inovação</span> de Camaquã
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">
              Conectando governo, empresas, academia e sociedade civil para transformar o futuro da nossa região.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => setIsTourOpen(true)}
                className="bg-[#0047AB] hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl active:scale-95"
              >
                <Gamepad2 size={20} />
                Tour Interativo YNOV
              </button>
              <button 
                onClick={() => setActiveTab('impacts')}
                className="bg-white text-ynov-blue px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-ynov-yellow hover:text-ynov-blue transition-all shadow-xl active:scale-95"
              >
                Explorar Ecossistema
                <ArrowRight size={20} />
              </button>
              <a 
                href={PDF_BASE64}
                download="YNOV_Pitch_Deck.pdf"
                className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
              >
                <Rocket size={20} />
                Pitch Deck
              </a>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                <Instagram size={32} className="mx-auto text-ynov-yellow mb-2" />
                <p className="text-xs text-blue-200 mb-3">Siga no Instagram</p>
                <a 
                  href="https://www.instagram.com/ynovcamaqua/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-ynov-blue px-4 py-2 rounded-lg text-xs font-black hover:scale-105 transition-transform inline-block"
                >
                  @ynovcamaqua
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Quick View Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-ynov-blue/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-ynov-blue">
                    <Trophy size={24} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Entregas Realizadas</p>
                    <p className="text-3xl font-black text-gray-800">{finishedActions}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-ynov-green/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl text-ynov-green">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Impacto Alcançado</p>
                    <p className="text-3xl font-black text-gray-800">{totalImpact.toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-ynov-yellow/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
                    <Globe size={24} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parceiros Ativos</p>
                    <p className="text-3xl font-black text-gray-800">{partnerCount}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Quádrupla Hélice Selector Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
            <h3 className="text-2xl font-bold text-gray-800">A Quádrupla Hélice</h3>
            <button 
                onClick={() => setActiveTab('impacts')}
                className="text-ynov-blue font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm"
            >
                Ver Evolução Estratégica <ChevronRight size={18} />
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HELIX_DATA.map((helix) => {
                const Icon = helix.icon;
                return (
                    <div 
                        key={helix.id}
                        onClick={() => setActiveHelixModal(helix.id)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${helix.colorClass}`}>
                            <Icon size={24} />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-1">{helix.title}</h4>
                        <p className="text-xs text-gray-500 font-medium mb-3">{helix.subtitle}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{helix.summary}</p>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Historical Journey Timeline */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Nossa Jornada</h3>
        <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 md:-translate-x-1/2"></div>
            <div className="space-y-12">
                {TIMELINE_DATA.map((event, idx) => (
                    <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-ynov-blue md:-translate-x-1/2 z-10 flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-ynov-blue"></div>
                        </div>
                        <div className="flex-1 ml-12 md:ml-0 w-full">
                            <div className={`bg-gray-50/50 p-6 rounded-2xl border border-gray-100 inline-block text-left w-full md:max-w-md ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'} hover:bg-white hover:shadow-sm transition-all`}>
                                <span className="text-ynov-blue font-black text-xl mb-1 block">{event.year}</span>
                                <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                            </div>
                        </div>
                        <div className="flex-1 hidden md:block"></div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Interactive Tour Modal */}
      {isTourOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0b0b0b] text-[#f1f1f1] rounded-[14px] shadow-2xl w-full max-w-[70%] overflow-hidden border border-white/10 animate-scale-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-ynov-blue/30 rounded-xl text-ynov-yellow">
                    {React.createElement(TOUR_STEPS[currentTourStep].icon, { size: 32 })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{TOUR_STEPS[currentTourStep].title}</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Passo {currentTourStep + 1} de {TOUR_STEPS.length}</p>
                  </div>
                </div>
                <button onClick={() => setIsTourOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="min-h-[120px] mb-12">
                <p className="text-xl text-gray-300 leading-relaxed">
                  {TOUR_STEPS[currentTourStep].text}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                  {TOUR_STEPS.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 transition-all duration-300 rounded-full ${idx === currentTourStep ? 'w-8 bg-ynov-yellow' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  {currentTourStep > 0 && (
                    <button 
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <ChevronLeft size={20} />
                      Anterior
                    </button>
                  )}
                  <button 
                    onClick={handleNextStep}
                    className="bg-ynov-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40"
                  >
                    {currentTourStep === TOUR_STEPS.length - 1 ? 'Finalizar' : 'Próximo'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helix Detail Modal */}
      {activeHelixModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                {(() => {
                    const helix = HELIX_DATA.find(h => h.id === activeHelixModal);
                    if (!helix) return null;
                    const Icon = helix.icon;
                    return (
                        <>
                            <div className="p-8 pb-0 flex justify-between items-start">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${helix.colorClass}`}>
                                    <Icon size={32} />
                                </div>
                                <button onClick={() => setActiveHelixModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{helix.popup.title}</h3>
                                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-8">
                                    {helix.popup.text}
                                </div>
                                <button 
                                    onClick={() => {
                                        setActiveTab(helix.popup.targetTab);
                                        setActiveHelixModal(null);
                                    }}
                                    className="w-full bg-ynov-blue text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                                >
                                    {helix.popup.buttonText}
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
