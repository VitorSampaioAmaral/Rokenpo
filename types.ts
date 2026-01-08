
export type Move = 'rock' | 'paper' | 'scissors';

export enum ClassType {
  WARRIOR = 'Warrior',
  MAGE = 'Mage',
  ROGUE = 'Rogue',
  CLERIC = 'Cleric'
}

export type EnemyArchetype = 'BRUTE' | 'TACTICIAN' | 'STALKER' | 'CHAOTIC' | 'PREDICTABLE';

export type RuneTier = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

export interface Ability {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export interface Rune {
  id: string;
  name: string;
  description: string;
  tier: RuneTier;
  effect: string;
}

export interface Player {
  class: ClassType;
  hearts: number;
  maxHearts: number;
  energy: number;
  maxEnergy: number;
  armor: number;
  shields: number;
  maxShields: number;
  gold: number;
  runes: Rune[];
  level: number;
  exp: number;
  nextLevelExp: number;
}

export interface Enemy {
  name: string;
  type: 'monster' | 'miniboss' | 'megaboss';
  hearts: number;
  maxHearts: number;
  armor: number;
  bleedTurns: number;
  stunned: boolean;
  archetype: EnemyArchetype;
  description: string;
  image: string;
  difficulty: number;
}

export interface GameState {
  view: 'start' | 'class-select' | 'dungeon' | 'combat' | 'levelup' | 'gameover' | 'victory' | 'campfire' | 'merchant';
  player: Player | null;
  currentEnemy: Enemy | null;
  floor: number;
  logs: string[];
}
