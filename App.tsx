
import React, { useState, useEffect } from 'react';
import { GameState, Player, Enemy, ClassType, Move, EnemyArchetype, Rune, Ability } from './types';
import { CLASS_BIOS, CLASS_ABILITIES_LIST, RUNES_POOL, MOVES, PALETTE, PLAYER_SPRITES, ENEMY_SPRITES, ENEMY_DATABASE, getRuneSprite, UI_ICONS } from './constants';
import { resolveClash, getEnemyMove } from './logic/gameEngine';

const PixelArt: React.FC<{ 
  data: number[][], 
  size?: number, 
  animate?: 'float' | 'wobble' | 'pulse',
  holographic?: boolean,
  className?: string
}> = ({ data, size = 5, animate, holographic, className }) => {
  if (!data || !data[0]) return null;
  const rows = data.length;
  const cols = data[0].length;
  return (
    <div 
      className={`grid relative ${animate ? `animate-${animate}` : ''} ${holographic ? 'holographic-shine' : ''} ${className}`}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, 1fr)`, 
        width: cols * size, 
        height: rows * size,
        imageRendering: 'pixelated'
      }}
    >
      {data.flat().map((c, i) => (
        <div key={i} style={{ backgroundColor: PALETTE[c] }} className="w-full h-full" />
      ))}
    </div>
  );
};

const ResourceRow: React.FC<{ icon: string, current: number, max: number, color: string }> = ({ icon, current, max, color }) => (
  <div className="flex items-center gap-3 w-full mb-2">
    <PixelArt data={UI_ICONS[icon]} size={3} />
    <div className="flex-1 h-4 bg-gray-900 border-2 border-white/10 relative overflow-hidden">
      <div 
        className={`h-full transition-all duration-300 ${color}`} 
        style={{ width: `${Math.max(0, Math.min(100, (current / max) * 100))}%` }} 
      />
    </div>
    <span className="text-[13px] font-bold opacity-80 w-14 text-right tracking-tighter">{Math.floor(current)}/{max}</span>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    view: 'start',
    player: null,
    currentEnemy: null,
    floor: 1,
    logs: ['Abismo Profundo']
  });

  const [levelUpRunes, setLevelUpRunes] = useState<Rune[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [activeAbilityEffect, setActiveAbilityEffect] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setState(prev => ({ ...prev, logs: [msg, ...prev.logs].slice(0, 5) }));
  };

  const calculateNextLevelExp = (level: number) => Math.floor(10 * Math.pow(level, 1.5));

  const initPlayer = (type: ClassType) => {
    setState(prev => ({
      ...prev,
      player: {
        class: type,
        hearts: 3,
        maxHearts: 3,
        energy: 100, // Começa com mana máxima
        maxEnergy: 100,
        armor: type === ClassType.WARRIOR ? 2 : 0,
        shields: 3,
        maxShields: 3,
        gold: 0,
        runes: [],
        level: 1,
        exp: 0,
        nextLevelExp: calculateNextLevelExp(1)
      },
      view: 'dungeon'
    }));
  };

  const spawnEnemy = async () => {
    const archetypes: EnemyArchetype[] = ['BRUTE', 'TACTICIAN', 'STALKER'];
    const arch = archetypes[Math.floor(Math.random() * archetypes.length)];
    const isBossFloor = ENEMY_DATABASE.BOSSES[state.floor];
    let enemyName = isBossFloor ? isBossFloor.name : ENEMY_DATABASE[arch][Math.floor(Math.random() * ENEMY_DATABASE[arch].length)];
    let enemyArch = isBossFloor ? isBossFloor.archetype : arch;

    const enemy: Enemy = {
      name: enemyName,
      type: isBossFloor ? (state.floor === 20 ? 'megaboss' : 'miniboss') : 'monster',
      hearts: isBossFloor ? 10 + state.floor : 3 + Math.floor(state.floor / 3),
      maxHearts: isBossFloor ? 10 + state.floor : 3 + Math.floor(state.floor / 3),
      armor: isBossFloor ? 5 : 0,
      bleedTurns: 0,
      stunned: false,
      archetype: enemyArch,
      description: "",
      image: '',
      difficulty: state.floor
    };

    setState(prev => ({ ...prev, currentEnemy: enemy, view: 'combat' }));
    setTurnCount(0);
    setActiveAbilityEffect(null);
  };

  const executeAbility = (ability: Ability) => {
    if (!state.player) return;
    if (state.player.energy < ability.cost) return;

    let newP = { ...state.player };
    let newE = state.currentEnemy ? { ...state.currentEnemy } : null;
    newP.energy -= ability.cost;

    addLog(`USOU ${ability.name.toUpperCase()}`);

    switch (ability.effect) {
      case 'warrior_guard':
        newP.armor += 4;
        break;
      case 'mage_flare':
        if (newE) newE.hearts -= 3;
        break;
      case 'rogue_stealth':
        newP.shields = Math.min(newP.maxShields, newP.shields + 1);
        break;
      case 'cleric_transfuse':
        newP.hearts = Math.min(newP.maxHearts, newP.hearts + newP.armor);
        newP.armor = 0;
        break;
      case 'cleric_prayer':
        newP.hearts = Math.min(newP.maxHearts, newP.hearts + 1);
        newP.shields = Math.min(newP.maxShields, newP.shields + 2);
        break;
      default:
        setActiveAbilityEffect(ability.effect);
        break;
    }

    setState(prev => ({ ...prev, player: newP, currentEnemy: newE }));
  };

  const handleClash = (pMove: Move) => {
    if (!state.player || !state.currentEnemy) return;
    let eMove = getEnemyMove(state.currentEnemy, turnCount);
    let result = resolveClash(pMove, eMove);

    setShake(true);
    setTimeout(() => setShake(false), 150);

    let newPlayer = { ...state.player };
    let newEnemy = { ...state.currentEnemy };
    let pDamage = 0;
    let eDamage = 0;

    const hasRune = (effect: string) => newPlayer.runes.some(r => r.effect === effect);

    if (activeAbilityEffect === 'mage_deny' && result === 'loss') {
      result = 'tie';
      setActiveAbilityEffect(null);
    }

    if (result === 'win') {
      const currentStreak = winStreak + 1;
      setWinStreak(currentStreak);

      if (currentStreak % 2 === 0 && newPlayer.shields < newPlayer.maxShields) {
        newPlayer.shields++;
        addLog("ESCUDO RECUPERADO!");
      }

      eDamage = 1 + (hasRune('flat_dmg_1') ? 1 : 0);
      
      if (activeAbilityEffect === 'warrior_smash' && pMove === 'rock') {
        eDamage += 5; newEnemy.armor = Math.max(0, newEnemy.armor - 5); setActiveAbilityEffect(null);
      }
      if (activeAbilityEffect === 'rogue_mercy' && pMove === 'scissors') {
        newEnemy.bleedTurns = 6; setActiveAbilityEffect(null);
      }
      
      if (pMove === 'paper' && hasRune('paper_energy')) newPlayer.energy = Math.min(newPlayer.maxEnergy, newPlayer.energy + 10);
      if (hasRune('streak_scaling')) eDamage *= (1 + (currentStreak * 0.2));
      
      addLog(`VITÓRIA: ${pMove.toUpperCase()}`);
    } else if (result === 'loss') {
      setWinStreak(0);
      pDamage = 1 + (hasRune('heavy_hitter') ? 2 : 0);
      addLog(`DERROTA: ${eMove.toUpperCase()}`);
      setActiveAbilityEffect(null);
    } else {
      setWinStreak(0);
      if (newPlayer.shields > 0) {
        newPlayer.shields--;
        addLog(`EMPATE: ESCUDO -1`);
      } else {
        pDamage = 1;
        addLog(`EMPATE CRUEL: VIDA -1`);
      }
      setActiveAbilityEffect(null);
    }

    if (eDamage > 0) {
      if (newEnemy.armor > 0) { const abs = Math.min(newEnemy.armor, eDamage); newEnemy.armor -= abs; eDamage -= abs; }
      newEnemy.hearts -= Math.floor(eDamage);
    }
    if (pDamage > 0) {
      setFlash(true); setTimeout(() => setFlash(false), 50);
      if (newPlayer.armor > 0) { const abs = Math.min(newPlayer.armor, pDamage); newPlayer.armor -= abs; pDamage -= abs; }
      newPlayer.hearts -= Math.floor(pDamage);
    }
    if (newEnemy.bleedTurns > 0) { newEnemy.hearts -= 1; newEnemy.bleedTurns -= 1; }

    if (newPlayer.hearts <= 0) {
      if (hasRune('cheat_death')) {
        newPlayer.hearts = newPlayer.maxHearts; newPlayer.runes = newPlayer.runes.filter(r => r.effect !== 'cheat_death');
        addLog("RENASCEU!");
      } else { setState(prev => ({ ...prev, player: newPlayer, view: 'gameover' })); return; }
    }

    if (newEnemy.hearts <= 0) {
      newPlayer.exp += state.floor * 5; newPlayer.gold += 10 + state.floor;
      if (newPlayer.exp >= newPlayer.nextLevelExp) {
        const selection = []; const avail = RUNES_POOL.filter(r => !newPlayer.runes.some(o => o.id === r.id));
        for (let i = 0; i < 3; i++) if (avail.length > 0) selection.push(avail.splice(Math.floor(Math.random() * avail.length), 1)[0]);
        setLevelUpRunes(selection); setState(prev => ({ ...prev, player: newPlayer, view: 'levelup' }));
      } else {
        const nextF = state.floor + 1;
        setState(prev => ({ ...prev, player: newPlayer, view: nextF % 3 === 0 ? 'campfire' : 'dungeon', floor: nextF }));
      }
    } else {
      setState(prev => ({ ...prev, player: newPlayer, currentEnemy: newEnemy }));
    }
    setTurnCount(prev => prev + 1);
  };

  const StatusDisplay = () => state.player ? (
    <div className="w-44 bg-gray-950/95 border-r-4 border-white/20 p-3 flex flex-col gap-3 overflow-hidden shrink-0">
      <div className="flex flex-col items-center mb-3">
        <PixelArt data={PLAYER_SPRITES[state.player.class]} size={4.5} animate="pulse" />
        <span className="text-[14px] font-black text-red-500 uppercase mt-2 tracking-widest leading-none">{state.player.class}</span>
      </div>
      <ResourceRow icon="HEART" current={state.player.hearts} max={state.player.maxHearts} color="bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
      <ResourceRow icon="MANA" current={state.player.energy} max={state.player.maxEnergy} color="bg-purple-600 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
      <ResourceRow icon="SHIELD" current={state.player.shields} max={state.player.maxShields} color="bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      <ResourceRow icon="XP" current={state.player.exp} max={state.player.nextLevelExp} color="bg-blue-800" />
      <div className="flex items-center gap-3 mt-1 opacity-90">
        <PixelArt data={UI_ICONS.GOLD} size={2} />
        <span className="text-[13px] font-black text-yellow-500">{state.player.gold}G</span>
      </div>
      <div className="text-[11px] opacity-40 mt-1 leading-normal uppercase font-black tracking-tight">
        NÍVEL {state.player.level}<br/>
        ANDAR {state.floor}<br/>
        DEFESA {state.player.armor}
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {state.player.runes.map(r => (
          <div key={r.id} className="w-7 h-7 border-2 border-white/20 flex items-center justify-center bg-black/60 hover:border-white transition-colors cursor-help" title={r.name}>
            <PixelArt data={getRuneSprite(r.id)} size={0.7} />
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className={`h-screen w-screen bg-black text-white flex transition-all duration-300 overflow-hidden ${shake ? 'shake' : ''}`}>
      {flash && <div className="fixed inset-0 bg-red-600/40 z-[100] pointer-events-none" />}
      <StatusDisplay />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {state.view === 'start' && (
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] italic">NODES OF ABYSS</h1>
            <p className="text-[14px] tracking-[0.6em] opacity-40 italic uppercase font-bold">A Ascensão das Almas Perdidas</p>
            <button onClick={() => setState(prev => ({...prev, view: 'class-select'}))} className="px-14 py-6 border-8 border-white hover:bg-white hover:text-black font-black text-xl transition-all active:scale-90 retro-border">INICIAR JORNADA</button>
          </div>
        )}

        {state.view === 'class-select' && (
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            {(Object.keys(PLAYER_SPRITES) as ClassType[]).map(type => (
              <button key={type} onClick={() => initPlayer(type)} className="border-4 border-white/10 p-5 hover:border-white hover:bg-white/5 transition-all flex flex-col items-center gap-4 group">
                <PixelArt data={PLAYER_SPRITES[type]} size={5} animate="wobble" className="group-hover:scale-110 transition-transform" />
                <span className="font-black text-[16px] tracking-widest">{type.toUpperCase()}</span>
                <span className="text-[11px] opacity-40 text-center leading-relaxed font-bold">{CLASS_BIOS[type]}</span>
              </button>
            ))}
          </div>
        )}

        {state.view === 'combat' && state.currentEnemy && (
          <div className="flex flex-col items-center gap-8 w-full max-w-xl">
            <div className="text-center w-full max-w-md">
               <h2 className={`text-xl font-black uppercase tracking-[0.2em] mb-3 ${state.currentEnemy.type !== 'monster' ? 'text-yellow-500 animate-pulse' : 'text-red-600'}`}>{state.currentEnemy.name}</h2>
               <ResourceRow icon="HEART" current={state.currentEnemy.hearts} max={state.currentEnemy.maxHearts} color="bg-red-900 shadow-[0_0_12px_rgba(153,27,27,0.6)]" />
            </div>
            <PixelArt data={ENEMY_SPRITES[state.currentEnemy.archetype] || ENEMY_SPRITES.CHAOTIC} size={10} animate="float" />
            <div className="flex gap-5">
              {MOVES.map(m => (
                <button key={m} onClick={() => handleClash(m)} className="w-24 h-24 border-4 border-white/20 hover:border-white hover:bg-white/10 flex flex-col items-center justify-center transition-all active:scale-90 shadow-lg">
                  <span className="text-4xl mb-2">{m === 'rock' ? '🪨' : m === 'paper' ? '📜' : '⚔️'}</span>
                  <span className="text-[11px] font-black tracking-widest">{m.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {state.player && CLASS_ABILITIES_LIST[state.player.class].map(ability => (
                <button 
                  key={ability.id}
                  onClick={() => executeAbility(ability)} 
                  disabled={state.player!.energy < ability.cost} 
                  className={`text-[11px] border-4 border-purple-500 px-6 py-3 font-black uppercase tracking-widest disabled:opacity-20 transition-all ${activeAbilityEffect === ability.effect ? 'bg-purple-900 animate-pulse text-white shadow-[0_0_20px_rgba(168,139,246,0.4)]' : 'text-purple-500 hover:bg-purple-900/20'}`}
                >
                  {ability.name} <span className="opacity-60">({ability.cost}M)</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {state.view === 'levelup' && (
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-black text-blue-500 italic tracking-tighter animate-pulse">ALMA ELEVADA</h2>
            <div className="flex gap-4">
              {levelUpRunes.map(rune => (
                <button key={rune.id} onClick={() => {
                  const newP = {...state.player!}; newP.runes.push(rune); newP.level++; newP.exp -= newP.nextLevelExp; newP.nextLevelExp = calculateNextLevelExp(newP.level);
                  if (rune.effect === 'max_hp_2') { newP.maxHearts += 2; newP.hearts += 2; }
                  setState(prev => ({...prev, player: newP, view: state.floor % 3 === 0 ? 'campfire' : 'dungeon', floor: state.floor + 1}));
                }} className="border-4 border-white/10 p-5 hover:border-white transition-all w-40 flex flex-col items-center gap-4 bg-gray-950/40">
                  <PixelArt data={getRuneSprite(rune.id)} size={2.5} holographic />
                  <span className="text-[12px] font-black tracking-tight">{rune.name.toUpperCase()}</span>
                  <p className="text-[10px] opacity-40 leading-normal font-bold">{rune.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {state.view === 'campfire' && (
          <div className="text-center space-y-8">
            <h2 className="text-6xl font-black text-orange-500 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">FOGO DAS CINZAS</h2>
            <div className="flex flex-col gap-5 max-w-xs mx-auto">
              <button onClick={() => {
                const newP = {...state.player!}; newP.hearts = Math.min(newP.maxHearts, newP.hearts + 2);
                setState(prev => ({...prev, player: newP, view: 'merchant'}));
              }} className="border-4 border-white/20 px-10 py-5 text-[14px] font-black hover:bg-orange-900/20 hover:border-orange-500 uppercase transition-all">Recuperar Alma (+2 HP)</button>
              <button onClick={() => {
                const newP = {...state.player!}; newP.shields = newP.maxShields;
                setState(prev => ({...prev, player: newP, view: 'merchant'}));
              }} className="border-4 border-white/20 px-10 py-5 text-[14px] font-black hover:bg-blue-900/20 hover:border-blue-500 uppercase transition-all">Reparar Escudos (Máximo)</button>
            </div>
          </div>
        )}

        {state.view === 'merchant' && (
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-black text-yellow-500 uppercase tracking-tighter">MERCADOR CÍNICO</h2>
            <p className="text-[14px] opacity-40 italic font-bold max-w-md mx-auto">"O preço da sobrevivência é apenas uma formalidade."</p>
            <button onClick={() => setState(prev => ({...prev, view: 'dungeon'}))} className="px-14 py-6 border-4 border-white text-[16px] font-black hover:bg-white hover:text-black transition-all">PROSSEGUIR PARA O ESCURO</button>
          </div>
        )}

        {state.view === 'gameover' && (
          <div className="text-center space-y-8">
            <h1 className="text-9xl font-black text-red-900 italic tracking-tighter drop-shadow-2xl animate-pulse">CAIU</h1>
            <p className="text-lg opacity-50 uppercase tracking-[0.6em] font-bold">A escuridão é o seu novo lar.</p>
            <button onClick={() => window.location.reload()} className="px-16 py-6 border-8 border-red-900 text-xl font-black hover:bg-red-900 transition-all shadow-2xl">REASCENDER DO PÓ</button>
          </div>
        )}

        {state.view === 'dungeon' && (
          <div className="flex flex-col items-center gap-6">
            <button onClick={spawnEnemy} className="w-40 h-40 border-8 border-white/10 hover:border-white hover:bg-red-900/20 flex items-center justify-center text-7xl transition-all active:scale-90 shadow-[0_0_40px_rgba(255,255,255,0.1)]">💀</button>
            <span className="text-[14px] opacity-20 tracking-[0.8em] uppercase font-black animate-pulse">ANDAR {state.floor}</span>
          </div>
        )}

        <div className="absolute bottom-6 left-6 flex flex-col-reverse gap-2 opacity-70">
          {state.logs.map((log, i) => (
            <p key={i} className={`text-[12px] font-black ${i === 0 ? 'text-white translate-x-2' : 'text-gray-600'} transition-all`}>{`> ${log}`}</p>
          ))}
        </div>
      </main>

      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; background: black; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes wobble { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-wobble { animation: wobble 2s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .holographic-shine::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
          animation: shine 2s linear infinite; pointer-events: none;
        }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        * { image-rendering: pixelated; }
        .retro-border {
          box-shadow: 4px 4px 0 #000, 8px 8px 0 #fff;
        }
      `}</style>
    </div>
  );
};

export default App;
