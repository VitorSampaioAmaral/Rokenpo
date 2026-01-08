
import { ClassType, Rune, Move, EnemyArchetype, Ability } from './types';

export const PALETTE = [
  'transparent', // 0
  '#f8fafc',     // 1: Branco Gelo
  '#475569',     // 2: Cinza Escuro
  '#020617',     // 3: Preto Abissal
  '#ef4444',     // 4: Vermelho Sangue
  '#f59e0b',     // 5: Ouro Velho
  '#8b5cf6',     // 6: Roxo Vazio
  '#3b82f6',     // 7: Azul Soul
  '#22c55e',     // 8: Verde Veneno
  '#fb7185',     // 9: Rosa Brilho (Highlight Vida)
  '#a78bfa',     // 10: Lilás Brilho (Highlight Mana)
  '#7dd3fc'      // 11: Azul Brilho (Highlight Shield)
];

export const UI_ICONS: Record<string, number[][]> = {
  HEART: [
    [0,0,4,4,0,4,4,0],
    [0,4,9,4,4,4,4,4],
    [4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4],
    [0,4,4,4,4,4,4,0],
    [0,0,4,4,4,4,0,0],
    [0,0,0,4,4,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  MANA: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,6,10,1,0,0],
    [0,1,6,6,6,6,1,0],
    [0,1,6,10,6,6,1,0],
    [0,1,6,6,6,6,1,0],
    [0,1,6,6,10,6,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  SHIELD: [
    [0,1,1,1,1,1,1,0],
    [1,11,7,7,7,7,1,1],
    [1,7,11,7,7,7,7,1],
    [1,7,7,7,7,7,7,1],
    [0,1,7,7,7,7,1,0],
    [0,0,1,7,7,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,0]
  ],
  XP: [
    [0,0,0,5,5,0,0,0],
    [0,0,5,5,5,5,0,0],
    [5,5,5,1,1,5,5,5],
    [0,5,5,5,5,5,5,0],
    [0,0,5,5,5,5,0,0],
    [0,5,5,0,0,5,5,0],
    [5,5,0,0,0,0,5,5],
    [0,0,0,0,0,0,0,0]
  ],
  GOLD: [
    [0,0,1,1,1,1,0,0],
    [0,1,5,5,5,5,1,0],
    [1,5,5,1,1,5,5,1],
    [1,5,1,5,5,1,5,1],
    [1,5,5,1,1,5,5,1],
    [0,1,5,5,5,5,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0]
  ]
};

export const CLASS_ABILITIES_LIST: Record<ClassType, Ability[]> = {
  [ClassType.WARRIOR]: [
    { id: 'w1', name: "Impacto Esmagador", description: "40 Mana: Próxima PEDRA causa +5 dano e quebra Armadura.", cost: 40, effect: "warrior_smash" },
    { id: 'w2', name: "Barreira de Ferro", description: "30 Mana: Ganha 4 de Armadura imediatamente.", cost: 30, effect: "warrior_guard" }
  ],
  [ClassType.MAGE]: [
    { id: 'm1', name: "Negação Arcana", description: "50 Mana: Transforma derrota em EMPATE.", cost: 50, effect: "mage_deny" },
    { id: 'm2', name: "Explosão Astral", description: "35 Mana: Causa 3 de dano direto ignorando armadura.", cost: 35, effect: "mage_flare" }
  ],
  [ClassType.ROGUE]: [
    { id: 'r1', name: "Golpe Cruel", description: "40 Mana: Próxima TESOURA aplica Sangramento x6.", cost: 40, effect: "rogue_mercy" },
    { id: 'r2', name: "Passo das Sombras", description: "30 Mana: Recupera 1 Escudo.", cost: 30, effect: "rogue_stealth" }
  ],
  [ClassType.CLERIC]: [
    { id: 'c1', name: "Transfusão", description: "30 Mana: Converte Armadura em Cura.", cost: 30, effect: "cleric_transfuse" },
    { id: 'c2', name: "Prece de Luz", description: "60 Mana: Recupera 1 de Vida e 2 Escudos.", cost: 60, effect: "cleric_prayer" }
  ]
};

// Mantido para compatibilidade se necessário, mas usaremos a lista acima
export const CLASS_ABILITIES = CLASS_ABILITIES_LIST;

export const CLASS_BIOS: Record<ClassType, string> = {
  [ClassType.WARRIOR]: "Uma tumba de ferro. Foco: Pedra.",
  [ClassType.MAGE]: "Sussurros do vazio. Foco: Papel.",
  [ClassType.ROGUE]: "Sombra letal. Foco: Tesoura.",
  [ClassType.CLERIC]: "Fé inabalável. Foco: Sustento."
};

export const RUNES_POOL: Rune[] = [
  { id: 'f1', tier: 'F', name: 'Marcas do Novato', effect: 'max_hp_2', description: '+2 HP Máximo.' },
  { id: 'f2', tier: 'F', name: 'Couro Batido', effect: 'start_armor_2', description: 'Inicia com 2 Armadura.' },
  { id: 'f3', tier: 'F', name: 'Essência Pura', effect: 'flat_dmg_1', description: '+1 Dano base.' },
  { id: 'f4', tier: 'F', name: 'Medalhão', effect: 'gold_boost', description: '+20% Ouro.' },
  { id: 'f5', tier: 'F', name: 'Vontade', effect: 'energy_start_10', description: 'Inicia com 10 Mana.' },
  { id: 'e1', tier: 'E', name: 'Vigor', effect: 'streak_heal', description: 'Curar 1 HP em streak.' },
  { id: 'e2', tier: 'E', name: 'Pedra Lascada', effect: 'rock_glass', description: 'Pedra +2 dano.' },
  { id: 'e3', tier: 'E', name: 'Olhar Firme', effect: 'crit_10', description: '10% Crítico.' },
  { id: 'e4', tier: 'E', name: 'Drenagem', effect: 'lifesteal_15', description: 'Roubo de vida.' },
  { id: 'e5', tier: 'E', name: 'Pergaminho', effect: 'paper_shred', description: 'Papel quebra armor.' },
  { id: 'd1', tier: 'D', name: 'Sutileza', effect: 'paper_energy', description: 'Papel restaura Mana.' },
  { id: 'd2', tier: 'D', name: 'Força Bruta', effect: 'heavy_hitter', description: '+4 Dano / +2 Tomado.' },
  { id: 'd3', tier: 'D', name: 'Aura', effect: 'tie_energy', description: 'Mana em Empate.' },
  { id: 'd4', tier: 'D', name: 'Escudo', effect: 'first_hit_shield', description: 'Bloqueia 1º golpe.' },
  { id: 'd5', tier: 'D', name: 'Elixir', effect: 'revive_10', description: 'Sobrevive com 1 HP.' },
  { id: 'c1', tier: 'C', name: 'Bênção', effect: 'after_tie_buff', description: 'Buff pós empate.' },
  { id: 'c2', tier: 'C', name: 'Defesa', effect: 'armor_on_win', description: 'Armor em vitórias.' },
  { id: 'c3', tier: 'C', name: 'Dança', effect: 'scissors_bleed', description: 'Tesoura sangra.' },
  { id: 'c4', tier: 'C', name: 'Chamado', effect: 'energy_on_kill', description: 'Mana ao matar.' },
  { id: 'c5', tier: 'C', name: 'Resiliência', effect: 'hearts_to_armor', description: 'HP -> Armor.' },
  { id: 'b1', tier: 'B', name: 'Eco', effect: 'thorns_30', description: 'Reflete 30% dano.' },
  { id: 'b2', tier: 'B', name: 'Mão Ligeira', effect: 'energy_loss_reduction', description: 'Mana na derrota.' },
  { id: 'b3', tier: 'B', name: 'Sede', effect: 'bleed_heal', description: 'Cura via Sangue.' },
  { id: 'b4', tier: 'B', name: 'Equilíbrio', effect: 'all_stats_1', description: 'All Stats +1.' },
  { id: 'a1', tier: 'A', name: 'Pressão', effect: 'streak_scaling', description: 'Dano escalável.' },
  { id: 'a2', tier: 'A', name: 'Adaptação', effect: 'loss_reduction', description: 'Defesa pós derrota.' },
  { id: 'a3', tier: 'A', name: 'Desafio', effect: 'low_hp_power', description: 'Dano triplo com 1 HP.' },
  { id: 's1', tier: 'S', name: 'Vazio', effect: 'energy_save', description: 'Mana evita morte.' },
  { id: 's2', tier: 'S', name: 'Alquimia', effect: 'damage_to_energy', description: 'Dano -> Mana.' },
  { id: 's3', tier: 'S', name: 'Pacto', effect: 'blood_deal', description: 'Dano x2 / Lose HP.' },
  { id: 'sp1', tier: 'S+', name: 'Espelho', effect: 'perfect_reflect', description: 'Reflete 100% dano.' },
  { id: 'sp2', tier: 'S+', name: 'Fenda', effect: 'cheat_death', description: 'Renasce Full HP.' }
];

export const ENEMY_DATABASE: Record<string, any> = {
  BRUTE: ['Gárgula', 'Colosso', 'Devorador', 'Titã'],
  TACTICIAN: ['Monge', 'Marionete', 'Vidente', 'Arquivista'],
  STALKER: ['Lâmina', 'Sombra', 'Carrasco', 'Tecelão'],
  BOSSES: {
    5: { name: 'Guardião de Bronze', archetype: 'PREDICTABLE' },
    10: { name: 'Palhaço de Sangue', archetype: 'CHAOTIC' },
    15: { name: 'Magnus Guardian', archetype: 'TACTICIAN' },
    20: { name: 'Shattered Avatar', archetype: 'CHAOTIC' }
  }
};

export const getRuneSprite = (id: string): number[][] => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sprite: number[][] = [];
  const color = id.startsWith('sp') ? 5 : id.startsWith('s') ? 6 : id.startsWith('a') ? 4 : 2;
  for (let y = 0; y < 8; y++) {
    const row: number[] = [];
    for (let x = 0; x < 8; x++) {
      const isFilled = ((seed * (x * y + 1)) % 10) > 6 && (x > 1 && x < 6 && y > 1 && y < 6);
      row.push(isFilled ? color : 0);
    }
    sprite.push(row);
  }
  return sprite;
};

export const MOVES: Move[] = ['rock', 'paper', 'scissors'];

export const PLAYER_SPRITES: Record<ClassType, number[][]> = {
  [ClassType.WARRIOR]: [[0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[0,1,3,1,1,3,1,0],[0,1,1,1,1,1,1,0],[2,1,1,1,1,1,1,2],[2,2,1,1,1,1,2,2],[0,2,2,0,0,2,2,0],[0,2,2,0,0,2,2,0]],
  [ClassType.MAGE]: [[0,0,0,6,6,0,0,0],[0,0,6,1,1,6,0,0],[0,6,1,1,1,1,6,0],[0,6,1,1,1,1,6,0],[0,0,6,1,1,6,0,0],[0,0,0,6,6,0,0,0],[0,0,6,6,6,6,0,0],[0,6,6,0,0,6,6,0]],
  [ClassType.ROGUE]: [[0,0,3,3,3,3,0,0],[0,3,1,1,1,1,3,0],[0,3,1,4,4,1,3,0],[0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[4,0,1,1,1,1,0,4],[4,0,3,0,0,3,0,4],[0,0,3,0,0,3,0,0]],
  [ClassType.CLERIC]: [[0,0,0,5,5,0,0,0],[0,0,5,1,1,5,0,0],[0,5,1,5,5,1,5,0],[0,5,1,5,5,1,5,0],[0,0,5,1,1,5,0,0],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,1,1,0,0,1,1,0]]
};

export const ENEMY_SPRITES: Record<EnemyArchetype, number[][]> = {
  'BRUTE': [[0,0,2,2,2,2,2,2,2,2,0,0],[0,2,2,2,2,2,2,2,2,2,2,0],[2,2,3,3,2,2,2,2,3,3,2,2],[2,2,3,3,2,2,2,2,3,3,2,2],[2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,4,4,4,4,2,2,2,2],[2,2,2,4,4,4,4,4,4,2,2,2],[0,2,2,2,2,2,2,2,2,2,2,0],[0,2,2,2,2,2,2,2,2,2,2,0],[0,0,3,3,3,0,0,3,3,3,0,0]],
  'TACTICIAN': [[0,0,0,0,1,1,1,1,0,0,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,1,1,3,1,1,3,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0],[0,7,7,1,1,1,1,1,1,7,7,0],[0,7,7,1,1,1,1,1,1,7,7,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,1,1,1,1,1,1,0,0,0],[0,0,0,1,1,0,0,1,1,0,0,0],[0,0,0,7,7,0,0,7,7,0,0,0]],
  'STALKER': [[0,0,0,0,0,3,3,0,0,0,0,0],[0,0,0,0,3,1,1,3,0,0,0,0],[0,0,0,0,3,4,4,3,0,0,0,0],[0,0,0,3,1,1,1,1,3,0,0,0],[0,0,3,1,1,1,1,1,1,3,0,0],[0,4,1,1,1,3,3,1,1,1,4,0],[0,0,3,1,1,0,0,1,1,3,0,0],[0,0,0,3,3,0,0,3,3,0,0,0],[0,0,0,4,4,0,0,4,4,0,0,0],[0,0,0,4,4,0,0,4,4,0,0,0]],
  'CHAOTIC': [[0,0,6,6,0,0,0,6,0,0,0,0],[0,6,1,1,6,0,6,1,6,0,0,0],[0,6,3,1,1,6,1,1,6,0,0,0],[0,0,6,1,1,1,1,6,0,0,0,0],[0,6,1,6,6,1,1,6,0,6,6,0],[0,6,1,1,1,6,6,1,6,1,6,0],[0,0,6,6,1,1,1,1,1,1,6,0],[0,0,0,6,1,6,0,6,1,6,0,0],[0,0,6,6,0,0,0,0,6,6,0,0]],
  'PREDICTABLE': [[0,0,0,2,2,2,2,2,2,0,0,0],[0,0,2,1,1,1,1,1,1,2,0,0],[0,2,1,3,3,1,1,3,3,1,2,0],[0,2,1,3,3,1,1,3,3,1,2,0],[0,2,1,1,1,5,5,1,1,1,2,0],[0,2,1,1,5,5,5,5,1,1,2,0],[0,0,2,1,1,1,1,1,1,2,0,0],[0,0,0,2,2,2,2,2,2,0,0,0],[0,0,0,3,3,0,0,3,3,0,0,0],[0,0,0,3,3,0,0,3,3,0,0,0]]
};
