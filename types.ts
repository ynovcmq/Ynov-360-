
import { LucideIcon } from 'lucide-react';

export type SectionId = 'overview' | 'database' | 'actors' | 'governance' | 'gts' | 'agenda' | 'impacts' | 'evidence' | 'diagnostic';

export interface NavItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

export type GTType = 
  | 'Varejo' 
  | 'Agro & Sustentabilidade' 
  | 'Educação' 
  | 'Indústria' 
  | 'Talentos Criativos' 
  | 'Governo e Políticas Públicas';

export type StatusType = 'Planejada' | 'Em andamento' | 'Concluída';

export type HelixType = 'Governo' | 'Empresa' | 'Academia' | 'Sociedade';

export type HelixLabel = 'Governo' | 'Empresas' | 'Academia' | 'Sociedade Civil';

export type ActivityType = 'Agenda' | 'Evento' | 'Missão Técnica' | 'Visita' | 'Reunião' | 'Capacitação';

export interface ActionItem {
  id: string;
  activity: string;      // Título da Atividade
  activityType: ActivityType; // Tipo de Atividade
  responsible: string;   // Responsável
  description: string;   // Descrição
  date: string;          // Data de Início
  endDate?: string;      // Data de Conclusão
  status: StatusType;    // Status Atual
  gt: GTType;            // GT
  helix: HelixType;      // Hélice
  location: string;      // Local
  peopleInvolved: number; // Pessoas Envolvidas
  impactIndirect: number; // Pessoas Impactadas (estimativa)
  targetAudience?: string; 
  comments?: string;      
  results?: string;       // Resultados / Entregas
  socialLinks?: string;  
  image?: string;        
  lastUpdate: string;
}

export interface Actor {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  organization: string;
  role: string;
  gt: GTType;
  helix: HelixType; // Hélice Representada
  socialLinks: string;
  address: string;
  city: string;
  participatedIn: string[]; // Evento, Hackathon, Workshop, etc.
  notes: string;
  lastUpdate: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
  fullMark?: number; 
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}
