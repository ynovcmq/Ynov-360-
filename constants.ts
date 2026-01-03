
import { 
  LayoutDashboard, 
  Database, 
  Users, 
  Kanban, 
  Calendar, 
  BarChart3, 
  FolderOpen,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { NavItem, ActionItem, Actor, TimelineEvent, GTType, StatusType, HelixType, ActivityType } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Início | Pitch YNOV', icon: LayoutDashboard },
  { id: 'database', label: 'Base de Dados', icon: Database },
  { id: 'actors', label: 'Atores/Hélices', icon: UserCheck },
  { id: 'governance', label: 'Governança', icon: Kanban },
  { id: 'gts', label: 'GTs (Grupos)', icon: Users },
  { id: 'agenda', label: 'Agenda & Eventos', icon: Calendar },
  { id: 'impacts', label: 'Impactos & Evolução', icon: BarChart3 },
  { id: 'evidence', label: 'Evidências', icon: FolderOpen },
  { id: 'diagnostic', label: 'Saúde do Painel', icon: ShieldCheck },
];

export const GT_OPTIONS: GTType[] = [
  'Varejo', 
  'Agro & Sustentabilidade', 
  'Educação', 
  'Indústria', 
  'Talentos Criativos', 
  'Governo e Políticas Públicas'
];

export const STATUS_OPTIONS: StatusType[] = [
  'Planejada', 'Em andamento', 'Concluída'
];

export const HELIX_OPTIONS: HelixType[] = [
  'Governo', 'Empresa', 'Academia', 'Sociedade'
];

export const ACTIVITY_TYPES: ActivityType[] = [
  'Agenda', 'Evento', 'Missão Técnica', 'Visita', 'Reunião', 'Capacitação'
];

export const PARTICIPATION_OPTIONS = [
  'Evento', 'Hackathon', 'Workshop', 'Missão', 'Reunião', 'Outros'
];

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: '1',
    activity: 'Hackathon YNOV 2024',
    activityType: 'Evento',
    responsible: 'Secretaria de Educação / IFSUL',
    description: 'Maratona de inovação focada em soluções urbanas.',
    date: '2024-05-10',
    endDate: '2024-05-12',
    status: 'Concluída',
    gt: 'Educação',
    helix: 'Academia',
    location: 'IFSUL Camaquã',
    peopleInvolved: 120,
    impactIndirect: 5000,
    results: '15 protótipos gerados e 3 startups em fase de pré-incubação.',
    lastUpdate: '2024-05-15'
  },
  {
    id: '2',
    activity: 'Inova Varejo Digital',
    activityType: 'Capacitação',
    responsible: 'Sindilojas Costa Doce',
    description: 'Capacitação para digitalização de pequenos comércios.',
    date: '2024-10-01',
    endDate: '2024-12-20',
    status: 'Em andamento',
    gt: 'Varejo',
    helix: 'Empresa',
    location: 'Sindilojas',
    peopleInvolved: 50,
    impactIndirect: 200,
    results: 'Em progresso.',
    lastUpdate: '2024-10-20'
  }
];

export const INITIAL_ACTORS: Actor[] = [
  {
    id: 'a1',
    name: 'João Carlos Silva',
    birthDate: '1985-04-12',
    phone: '(51) 98888-7777',
    email: 'joao.silva@camaqua.rs.gov.br',
    organization: 'Prefeitura Municipal',
    role: 'Secretário Adjunto',
    gt: 'Governo e Políticas Públicas',
    helix: 'Governo',
    socialLinks: 'https://linkedin.com/in/joaosilva',
    address: 'Rua Olavo Bilac, 123',
    city: 'Camaquã / RS',
    participatedIn: ['Reunião', 'Evento'],
    notes: 'Liderança ativa no GT Governo.',
    lastUpdate: '2024-11-01'
  },
  {
    id: 'a2',
    name: 'Mariana Oliveira',
    birthDate: '1992-08-25',
    phone: '(51) 99999-1111',
    email: 'mariana.edu@ifsul.edu.br',
    organization: 'IFSUL',
    role: 'Coordenadora Pedagógica',
    gt: 'Educação',
    helix: 'Academia',
    socialLinks: 'https://instagram.com/mariana_edu',
    address: 'Av. Brasil, 450',
    city: 'Camaquã / RS',
    participatedIn: ['Hackathon', 'Workshop'],
    notes: 'Ponto focal para o Hackathon 2024.',
    lastUpdate: '2024-11-05'
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  { year: '2023', title: 'Marco Legal', description: 'Aprovação da Lei de Inovação nº 2.064.' },
  { year: '2024', title: 'Hackathon YNOV', description: 'Primeira maratona de inovação municipal.' },
  { year: '2025', title: 'Camaquã Summit', description: 'Evento regional de tecnologia e negócios.' },
];

export const SURVEY_DATA = [
  { category: 'Networking', count: 45 },
  { category: 'Conhecimento', count: 32 },
  { category: 'Visibilidade', count: 28 },
  { category: 'Apoio/Fomento', count: 15 },
  { category: 'Outros', count: 10 },
];

export const SOCIAL_DATA = [
  { platform: 'Instagram', reach: 15400 },
  { platform: 'LinkedIn', reach: 4200 },
  { platform: 'Mídia Local', reach: 25000 },
  { platform: 'Eventos', reach: 8500 },
];

export const COUNCIL_MEMBERS = [
  { name: 'João Silva', role: 'Presidente', institution: 'Prefeitura Municipal', helix: 'Governo' },
  { name: 'Maria Oliveira', role: 'Vice-Presidente', institution: 'ACIC', helix: 'Empresa' },
  { name: 'Dr. Roberto Santos', role: 'Conselheiro', institution: 'IFSUL', helix: 'Academia' },
  { name: 'Ana Pereira', role: 'Secretária', institution: 'Coletivo Criativo', helix: 'Sociedade' },
];

export const PROJECTS_DATA = [
  {
    id: 'p1',
    type: 'Projeto',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
    title: 'Incubadora Tecnológica',
    year: '2024',
    gt: 'Indústria',
    description: 'Estruturação da primeira incubadora de base tecnológica da região.',
    results: ['5 startups incubadas', 'R$ 200k captados']
  }
];
