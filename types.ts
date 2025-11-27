export enum SportType {
  FOOTBALL = 'Futebol',
  BASKETBALL = 'Basquete',
  VOLLEYBALL = 'Vôlei'
}

export enum AnalysisMode {
  PLAYER = 'JOGADOR',
  TEAM = 'TIME',
  PLAYER_COMPARE = 'X1 (COMPARAR)',
  MATCHUP = 'PREVISÃO DE JOGO',
  SCOUT = 'SCOUTING'
}

export interface Attributes {
  defense: number;
  attack: number;
  physical: number;
  mentality: number;
  technique: number;
  talent: number;
}

export interface Reference {
  title: string;
  url: string;
}

export interface AnalyzedEntity {
  entityName: string;
  role: string;
  team: string;
  age?: number;
  imageUrl?: string;
  overallScore: number;
  attributes: Attributes;
  justification: string; // Markdown formatted text
  keyMetrics: string[];
  references?: Reference[];
}

export interface PlayerComparison {
  playerA: AnalyzedEntity;
  playerB: AnalyzedEntity;
  winner: string;
  comparisonAnalysis: string;
  references?: Reference[];
}

export interface MatchupPrediction {
  teamA: AnalyzedEntity;
  teamB: AnalyzedEntity;
  predictedScore: string;
  analysis: string;
  references?: Reference[];
}

export interface ScoutSuggestion {
  targetAttribute: string;
  suggestedPlayer: string;
  currentTeam: string;
  reasoning: string;
  viabilityScore: number;
  imageUrl?: string;
  references?: Reference[];
}