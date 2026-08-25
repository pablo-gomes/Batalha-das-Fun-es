import React, { useState, useEffect } from 'react';
import { Creature, MathChallenge, Skill, InventoryItem, CombatLog } from '../types';
import { CombatHUD } from './CombatHUD';
import { PixelSprite } from './PixelSprite';
import { MathDialogueBox } from './MathDialogueBox';
import { generateMathChallenge, generateEnemyDefenseChallenge, calculatePrecision } from '../utils/mathEngine';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Flame, X, AlertTriangle, Trophy, Star, Skull, PartyPopper } from 'lucide-react';
import battleBackground from '../../fundo_do_jogo.png';

interface BattleSceneProps {
  playerCreature: Creature;
  enemyCreature: Creature;
  items: InventoryItem[];
  onVictory: (updatedPlayer: Creature, earnedXp: number, earnedCoins: number, updatedItems: InventoryItem[]) => void;
  onDefeat: (updatedItems: InventoryItem[]) => void;
  onOpenCodex: () => void;
  onTriggerEvolution: (creature: Creature) => void;
}

export const BattleScene: React.FC<BattleSceneProps> = ({
  playerCreature: initialPlayer,
  enemyCreature: initialEnemy,
  items: initialItems,
  onVictory,
  onDefeat,
  onOpenCodex,
  onTriggerEvolution
}) => {
  const [player, setPlayer] = useState<Creature>({ ...initialPlayer });
  const [enemy, setEnemy] = useState<Creature>({ ...initialEnemy });
  const [items, setItems] = useState<InventoryItem[]>([...initialItems]);

  const [activeMenu, setActiveMenu] = useState<'main' | 'skills' | 'items' | 'challenge' | 'graph_inspect'>('main');
  const [currentChallenge, setCurrentChallenge] = useState<MathChallenge | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isDefenseTurn, setIsDefenseTurn] = useState<boolean>(false);
  const [turnMessage, setTurnMessage] = useState<string>(`Um ${initialEnemy.name} selvagem apareceu! O que ${initialPlayer.name} fará?`);
  
  // Animation and visual effects states
  const [isPlayerAttacking, setIsPlayerAttacking] = useState<boolean>(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState<boolean>(false);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [isEnemyHit, setIsEnemyHit] = useState<boolean>(false);
  const [isPlayerDefending, setIsPlayerDefending] = useState<boolean>(false);
  
  // Floating Damage Popups
  const [floatingDamage, setFloatingDamage] = useState<{
    text: string;
    type: 'crit' | 'normal' | 'miss' | 'heal' | 'combo';
    target: 'player' | 'enemy';
  } | null>(null);

  // Active buffs/shields
  const [damageMultiplier, setDamageMultiplier] = useState<number>(1);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [isBattleOver, setIsBattleOver] = useState<boolean>(false);

  // Start BGM on load if enabled
  useEffect(() => {
    sound.startBgm();
    return () => {
      // Keep running or manage
    };
  }, []);

  const triggerFloatingText = (text: string, type: 'crit' | 'normal' | 'miss' | 'heal' | 'combo', target: 'player' | 'enemy') => {
    setFloatingDamage({ text, type, target });
    setTimeout(() => {
      setFloatingDamage(null);
    }, 1400);
  };

  // Player selects an action
  const handleSelectAction = (action: 'attack_menu' | 'defend' | 'skills' | 'items' | 'analyze' | 'switch') => {
    if (action === 'defend') {
      setIsPlayerDefending(true);
      setShieldActive(true);
      setPlayer(prev => ({
        ...prev,
        currentEnergy: Math.min(prev.maxEnergy, prev.currentEnergy + 10)
      }));
      setTurnMessage(`${player.name} assumiu postura defensiva (+10 MP)!`);
      sound.playShield();
      // Proceed to enemy turn after 1.2s
      setTimeout(() => {
        startEnemyTurn();
      }, 1200);
    }
  };

  // Player picks a mathematical skill to cast
  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    // Deduct energy
    setPlayer(prev => ({
      ...prev,
      currentEnergy: Math.max(0, prev.currentEnergy - skill.energyCost)
    }));

    // Generate math challenge for this concept
    const challenge = generateMathChallenge(skill.concept, player.level >= 10 ? 'dificil' : player.level >= 5 ? 'medio' : 'facil');
    setCurrentChallenge(challenge);
    setActiveMenu('challenge');
  };

  // Player uses an item
  const handleUseItem = (item: InventoryItem) => {
    if (item.amount <= 0) return;

    // Deduct item count
    setItems(prev => prev.map(it => it.id === item.id ? { ...it, amount: it.amount - 1 } : it));

    if (item.type === 'heal_hp') {
      setPlayer(prev => ({
        ...prev,
        currentHp: Math.min(prev.maxHp, prev.currentHp + item.value)
      }));
      triggerFloatingText(`+${item.value} HP`, 'heal', 'player');
      setTurnMessage(`Usou ${item.name}! Recuperou ${item.value} HP!`);
      sound.playCorrect(false);
    } else if (item.type === 'restore_energy') {
      setPlayer(prev => ({
        ...prev,
        currentEnergy: Math.min(prev.maxEnergy, prev.currentEnergy + item.value)
      }));
      triggerFloatingText(`+${item.value} MP`, 'heal', 'player');
      setTurnMessage(`Usou ${item.name}! Recuperou ${item.value} Energia!`);
      sound.playCorrect(false);
    } else if (item.type === 'damage_boost') {
      setDamageMultiplier(2);
      setTurnMessage(`Usou ${item.name}! Próximo ataque causará DANO DOBRADO (2x)!`);
      sound.playShield();
    } else if (item.type === 'shield') {
      setShieldActive(true);
      setTurnMessage(`Usou ${item.name}! Escudo ativo para reduzir o próximo golpe!`);
      sound.playShield();
    } else if (item.type === 'formula_book') {
      onOpenCodex();
      return;
    }

    setActiveMenu('main');
  };

  // PLAYER SUBMITS MATH ANSWER
  const handleSubmitAnswer = (answer: string | number) => {
    if (!currentChallenge) return;

    if (isDefenseTurn) {
      // Resolving defensive challenge!
      handleDefensiveAnswer(answer);
    } else {
      // Resolving attack challenge!
      handleAttackAnswer(answer);
    }
  };

  // Resolving Attack
  const handleAttackAnswer = (answer: string | number) => {
    if (!currentChallenge || !selectedSkill) return;

    const precision = calculatePrecision(currentChallenge, answer);
    const isSuccess = precision.rating !== 'FALHA' && precision.accuracyPercentage > 0;

    // Attack Animation
    setIsPlayerAttacking(true);
    sound.playAttack(player.element);

    setTimeout(() => {
      setIsPlayerAttacking(false);

      if (isSuccess) {
        // Combo increment
        const newCombo = player.comboCount + 1;
        sound.playCombo(newCombo);
        
        // Status evolution check during battle
        let newStatus = player.statusCondition;
        if (newCombo >= 10 && player.stage < 3) {
          // Trigger in-battle evolution!
          onTriggerEvolution(player);
        } else if (newCombo >= 5) {
          newStatus = 'avancado';
        } else if (newCombo >= 3) {
          newStatus = 'concentrado';
        }

        // Damage Calculation
        const comboBonus = 1 + (newCombo * 0.1);
        const statusBonus = newStatus === 'avancado' ? 1.25 : newStatus === 'concentrado' ? 1.1 : 1.0;
        
        const rawDamage = ((2 * player.level / 5 + 2) * selectedSkill.basePower * (player.attack / Math.max(1, enemy.defense)) / 50 + 2);
        const totalDamage = Math.round(rawDamage * precision.damageMultiplier * comboBonus * statusBonus * damageMultiplier);

        setDamageMultiplier(1); // reset buff

        // Enemy takes hit
        setIsEnemyHit(true);
        if (precision.isExact) {
          sound.playCrit();
          triggerFloatingText(`💥 CRÍTICO! -${totalDamage} (${precision.accuracyPercentage}%)`, 'crit', 'enemy');
        } else {
          sound.playHit();
          triggerFloatingText(`-${totalDamage} (${precision.accuracyPercentage}%)`, 'normal', 'enemy');
        }

        const newEnemyHp = Math.max(0, enemy.currentHp - totalDamage);
        setEnemy(prev => ({ ...prev, currentHp: newEnemyHp }));
        setPlayer(prev => ({ 
          ...prev, 
          comboCount: newCombo,
          statusCondition: newStatus,
          currentEnergy: Math.min(prev.maxEnergy, prev.currentEnergy + 5) // +5 MP on hit
        }));

        setTurnMessage(`${precision.message} ${player.name} desferiu ${totalDamage} de dano! COMBO x${newCombo}`);

        setTimeout(() => {
          setIsEnemyHit(false);

          if (newEnemyHp <= 0) {
            handleEnemyDefeated();
          } else {
            // Enemy Turn
            setTimeout(() => {
              startEnemyTurn();
            }, 1000);
          }
        }, 800);
      } else {
        // Failed / wrong answer
        sound.playWrong();
        triggerFloatingText('FALHOU! 0 DANO', 'miss', 'enemy');
        setPlayer(prev => ({ ...prev, comboCount: 0, statusCondition: null }));
        setTurnMessage(`[X] ${precision.message} O ataque de ${player.name} falhou! Combo zerado.`);

        setTimeout(() => {
          startEnemyTurn();
        }, 1200);
      }
    }, 400);

    setActiveMenu('main');
    setCurrentChallenge(null);
  };

  // ENEMY ATTACK & PLAYER DEFENSIVE MECHANIC
  const startEnemyTurn = () => {
    if (enemy.currentHp <= 0 || isBattleOver) return;

    setTurnMessage(`[!] ${enemy.name} está preparando um ataque quadrático! Responda rápido para defender!`);
    
    // Generate reactive defensive challenge
    const defenseChallenge = generateEnemyDefenseChallenge(enemy.level);
    setCurrentChallenge(defenseChallenge);
    setIsDefenseTurn(true);
  };

  const handleDefensiveAnswer = (answer: string | number) => {
    if (!currentChallenge) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const precision = calculatePrecision(currentChallenge, answer);
    setIsEnemyAttacking(true);
    sound.playAttack(enemy.element);

    setTimeout(() => {
      setIsEnemyAttacking(false);

      // Base enemy damage
      const baseEnemyDmg = ((2 * enemy.level / 5 + 2) * 30 * (enemy.attack / Math.max(1, player.defense)) / 50 + 2);
      
      let finalDamage = 0;
      if (precision.isExact || precision.rating === 'PERFEITO') {
        // DEFESA PERFEITA!
        sound.playShield();
        finalDamage = 0;
        triggerFloatingText('DEFESA PERFEITA! (0 Dano)', 'heal', 'player');
        setTurnMessage(`DEFESA PERFEITA! ${player.name} calculou a trajetória e bloqueou todo o ataque!`);
      } else if (precision.rating === 'ALTA') {
        finalDamage = Math.round(baseEnemyDmg * 0.35);
        sound.playHit();
        setIsPlayerHit(true);
        triggerFloatingText(`BLOQUEIO PARCIAL (-${finalDamage})`, 'normal', 'player');
        setTurnMessage(`Boa defesa! Dano do ataque inimigo reduzido para apenas ${finalDamage}!`);
      } else {
        // Weak or failed defense
        finalDamage = Math.round(baseEnemyDmg * (shieldActive ? 0.6 : 1.1));
        sound.playHit();
        setIsPlayerHit(true);
        triggerFloatingText(`GOLPE RECEBIDO (-${finalDamage})`, 'crit', 'player');
        setTurnMessage(`[X] Defesa falhou! ${player.name} sofreu ${finalDamage} de dano!`);
      }

      setShieldActive(false);
      setIsPlayerDefending(false);

      const newPlayerHp = Math.max(0, player.currentHp - finalDamage);
      setPlayer(prev => ({ ...prev, currentHp: newPlayerHp }));

      setTimeout(() => {
        setIsPlayerHit(false);
        setIsDefenseTurn(false);
        setCurrentChallenge(null);

        if (newPlayerHp <= 0) {
          handlePlayerDefeated();
        } else {
          setActiveMenu('main');
        }
      }, 900);
    }, 400);
  };

  const handleEnemyDefeated = () => {
    setIsBattleOver(true);
    sound.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const earnedXp = Math.round(enemy.level * 45 + (player.comboCount * 10));
    const earnedCoins = Math.round(enemy.level * 25);

    setTurnMessage(`${enemy.name} foi derrotado! Você ganhou +${earnedXp} XP e +${earnedCoins} Moedas!`);

    // Level up calculation
    let updatedPlayer = { ...player };
    updatedPlayer.xp += earnedXp;
    if (updatedPlayer.xp >= updatedPlayer.xpToNextLevel) {
      updatedPlayer.level += 1;
      updatedPlayer.xp -= updatedPlayer.xpToNextLevel;
      updatedPlayer.xpToNextLevel = Math.round(updatedPlayer.xpToNextLevel * 1.3);
      updatedPlayer.maxHp += 8;
      updatedPlayer.currentHp = updatedPlayer.maxHp;
      updatedPlayer.attack += 3;
      updatedPlayer.defense += 2;
      sound.playLevelUp();
      setTurnMessage(`SUBIU DE NÍVEL! ${player.name} agora é Nível ${updatedPlayer.level}!`);
    }

    setTimeout(() => {
      onVictory(updatedPlayer, earnedXp, earnedCoins, items);
    }, 2800);
  };

  const handlePlayerDefeated = () => {
    setIsBattleOver(true);
    sound.playWrong();
    setTurnMessage(`${player.name} não resistiu aos cálculos do adversário...`);
    setTimeout(() => {
      onDefeat(items);
    }, 2200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-1.5 sm:p-3 select-none min-h-[500px] sm:min-h-[580px]">
      {/* 1. RETRO GAME BOY POKÉMON BATTLE SCREEN */}
      <div 
        className="w-full h-72 min-[420px]:h-80 sm:h-96 bg-white border-3 sm:border-4 border-black rounded-lg sm:rounded-xl relative overflow-hidden shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-2 min-[420px]:p-3 sm:p-4 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${battleBackground})` }}
      >
        
        {/* Classic Ground Lines */}
        <div className="absolute top-32 sm:top-36 right-0 w-44 sm:w-64 h-0.5 bg-black" />
        <div className="absolute bottom-14 sm:bottom-16 left-0 w-48 sm:w-72 h-0.5 bg-black" />

        {/* TOP ROW: Opponent HUD (Left) & Opponent Sprite (Right) */}
        <div className="w-full flex items-start justify-between z-10 gap-1">
          <div className="pt-0.5">
            <CombatHUD creature={enemy} isPlayer={false} />
          </div>

          <div className="relative pr-1 sm:pr-8 pt-0.5 gb-sprite-mono shrink-0">
            {/* Responsive Sprite Container */}
            <div className="w-24 h-24 min-[420px]:w-28 min-[420px]:h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              <PixelSprite 
                creature={enemy} 
                isPlayerBackView={false} 
                isAttacking={isEnemyAttacking}
                isHit={isEnemyHit}
                size={135} 
              />
            </div>

            {/* Floating Damage Popup on Enemy */}
            {floatingDamage && floatingDamage.target === 'enemy' && (
              <div className={`absolute top-0 right-1 sm:right-6 z-30 font-pixel text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border-2 border-black shadow-[2px_2px_0_#000] animate-bounce whitespace-nowrap ${
                floatingDamage.type === 'crit' ? 'bg-black text-white font-black' : 'bg-white text-black font-bold'
              }`}>
                {floatingDamage.text}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Player Back Sprite (Left) & Player HUD (Right) */}
        <div className="w-full flex items-end justify-between z-10 pb-0.5 gap-1">
          <div className="relative pl-1 sm:pl-8 gb-sprite-mono shrink-0">
            {/* Responsive Sprite Container */}
            <div className="w-24 h-24 min-[420px]:w-32 min-[420px]:h-32 sm:w-40 sm:h-40 flex items-center justify-center">
              <PixelSprite 
                creature={player} 
                isPlayerBackView={true} 
                isAttacking={isPlayerAttacking}
                isHit={isPlayerHit}
                isDefending={isPlayerDefending}
                size={145} 
              />
            </div>

            {/* Floating Damage Popup on Player */}
            {floatingDamage && floatingDamage.target === 'player' && (
              <div className={`absolute top-0 left-1 sm:left-6 z-30 font-pixel text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border-2 border-black shadow-[2px_2px_0_#000] animate-bounce whitespace-nowrap ${
                floatingDamage.type === 'heal' ? 'bg-white text-black font-bold' : 'bg-black text-white font-bold'
              }`}>
                {floatingDamage.text}
              </div>
            )}
          </div>

          <div className="pr-0.5">
            <CombatHUD creature={player} isPlayer={true} />
          </div>
        </div>
      </div>

      {/* 2. THE MATHEMATICAL COMMAND / DIALOGUE INTERFACE */}
      <div className="w-full mt-2 sm:mt-3">
        <MathDialogueBox
          playerCreature={player}
          enemyCreature={enemy}
          currentChallenge={currentChallenge}
          isDefenseTurn={isDefenseTurn}
          selectedSkill={selectedSkill}
          items={items}
          turnMessage={turnMessage}
          onSelectAction={handleSelectAction}
          onSelectSkill={handleSelectSkill}
          onUseItem={handleUseItem}
          onSubmitAnswer={handleSubmitAnswer}
          onOpenCodex={onOpenCodex}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>
    </div>
  );
};
