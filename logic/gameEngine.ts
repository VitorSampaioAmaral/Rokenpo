
import { Move, Enemy, EnemyArchetype } from '../types';
import { MOVES } from '../constants';

export const resolveClash = (playerMove: Move, enemyMove: Move): 'win' | 'loss' | 'tie' => {
  if (playerMove === enemyMove) return 'tie';
  if (
    (playerMove === 'rock' && enemyMove === 'scissors') ||
    (playerMove === 'paper' && enemyMove === 'rock') ||
    (playerMove === 'scissors' && enemyMove === 'paper')
  ) {
    return 'win';
  }
  return 'loss';
};

export const getEnemyMove = (enemy: Enemy, turnCount: number): Move => {
  const { archetype } = enemy;
  const rand = Math.random();

  if (enemy.stunned) return MOVES[Math.floor(Math.random() * 3)]; // Embora stun devesse pular o turno, aqui gera move aleatório (logic handle later)

  switch (archetype) {
    case 'BRUTE': // Favors Rock
      return rand < 0.60 ? 'rock' : (rand < 0.80 ? 'paper' : 'scissors');
    case 'TACTICIAN': // Favors Paper
      return rand < 0.60 ? 'paper' : (rand < 0.80 ? 'rock' : 'scissors');
    case 'STALKER': // Favors Scissors
      return rand < 0.60 ? 'scissors' : (rand < 0.80 ? 'paper' : 'rock');
    case 'PREDICTABLE': // Cycles R-P-S
      return MOVES[turnCount % 3];
    case 'CHAOTIC':
    default:
      return MOVES[Math.floor(Math.random() * 3)];
  }
};
