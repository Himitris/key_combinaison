import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Character, Position, Enemy, Attack } from '../types';
import { generateRandomPosition, isInRange, createEnemy } from '../utils/enemyUtils';
import { calculateAttackPosition } from '../utils/animationUtils';
import { KitingArenaControls } from './KitingArenaControls';

interface KitingArenaProps {
  onKeyPress: (key: string) => void;
}

// Default Constants
const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 450;
const CHARACTER_SIZE = 30;
const DEFAULT_ATTACK_RANGE = 120;
const MOVEMENT_SPEED = 240; // pixels per second
const ENEMY_COUNT = 5;
const ATTACK_DURATION = 400; // milliseconds
const ENEMY_SPEED = 50; // pixels per second

// Colors
const COLORS = {
  background: '#001c29',
  grid: '#033146',
  character: '#4dd0e1',
  characterBorder: '#0097a7',
  characterRange: 'rgba(77, 208, 225, 0.15)',
  characterRangeBorder: 'rgba(77, 208, 225, 0.5)',
  enemy: '#f44336',
  enemyBorder: '#d32f2f',
  enemyHit: '#ff7043',
  attackProjectile: '#ffeb3b',
  attackTrail: 'rgba(255, 235, 59, 0.4)',
  moveTarget: 'rgba(77, 208, 225, 0.6)',
  moveTargetRing: 'rgba(77, 208, 225, 0.3)',
  targetLine: 'rgba(77, 208, 225, 0.3)',
  cursor: 'rgba(255, 215, 0, 0.7)',
};

export const KitingArena: React.FC<KitingArenaProps> = ({ onKeyPress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  
  // Controls state
  const [attackRange, setAttackRange] = useState<number>(DEFAULT_ATTACK_RANGE);
  const [targetMode, setTargetMode] = useState<'closest-to-player' | 'closest-to-cursor'>('closest-to-player');
  
  // Game state
  const [cursorPosition, setCursorPosition] = useState<Position>({ x: 0, y: 0 });
  const [character, setCharacter] = useState<Character>({
    position: { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 },
    targetPosition: null,
    isAttackRangeVisible: false,
  });
  
  const [enemies, setEnemies] = useState<Enemy[]>(() => 
    Array.from({ length: ENEMY_COUNT }, () => 
      createEnemy(generateRandomPosition(ARENA_WIDTH, ARENA_HEIGHT))
    )
  );
  
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [moveEffects, setMoveEffects] = useState<{position: Position, timeCreated: number}[]>([]);
  const [keyCombination, setKeyCombination] = useState<string[]>([]);
  const [attackOnPath, setAttackOnPath] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);

  // Handle mouse movement to track cursor position
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPosition({ x, y });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickPosition = { x, y };
    
    if (e.button === 2) { // Right click - Move
      setCharacter(prev => ({
        ...prev,
        targetPosition: clickPosition,
        isAttackRangeVisible: false,
      }));
      
      // Add move effect
      setMoveEffects(prev => [...prev, {
        position: clickPosition,
        timeCreated: Date.now()
      }]);
      
      // Reset attack on path mode
      setAttackOnPath(false);
      setIsAttacking(false);
      
      setKeyCombination(['right click']);
      onKeyPress('MouseRight');
    } else if (e.button === 0) { // Left click - Attack or Move+Attack
      if (character.isAttackRangeVisible) {
        // Find enemies in range
        const enemiesInRange = enemies.filter(enemy => 
          isInRange(character.position, enemy.position, attackRange)
        );
        
        if (enemiesInRange.length > 0) {
          // Pick the target based on targeting mode
          let targetEnemy;
          
          if (targetMode === 'closest-to-player') {
            // Get the closest enemy to the player
            targetEnemy = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(character.position, closest.position);
              const currentDist = distanceBetween(character.position, current.position);
              return currentDist < closestDist ? current : closest;
            });
          } else {
            // Get the closest enemy to the cursor
            targetEnemy = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(clickPosition, closest.position);
              const currentDist = distanceBetween(clickPosition, current.position);
              return currentDist < closestDist ? current : closest;
            });
          }
          
          // Attack the selected enemy
          setAttacks(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            position: { ...character.position },
            targetPosition: { ...targetEnemy.position },
            progress: 0,
          }]);
          
          setEnemies(prev => prev.map(e => 
            e.id === targetEnemy.id ? { ...e, isBeingAttacked: true, health: e.health - 25 } : e
          ));
          
          setIsAttacking(true);
          
          setKeyCombination(['q', 'left click']);
          onKeyPress('MouseLeft');
        } else {
          // Move and attack any enemy encountered on path
          setCharacter(prev => ({
            ...prev,
            targetPosition: clickPosition,
            isAttackRangeVisible: true, // Keep attack mode active
          }));
          
          // Enable attack-on-path mode
          setAttackOnPath(true);
          setIsAttacking(false);
          
          // Add move effect
          setMoveEffects(prev => [...prev, {
            position: clickPosition,
            timeCreated: Date.now()
          }]);
          
          setKeyCombination(['q', 'left click']);
          onKeyPress('MouseLeft');
        }
      } else {
        // If attack range is not visible, just move to the location
        setCharacter(prev => ({
          ...prev,
          targetPosition: clickPosition,
        }));
        
        setMoveEffects(prev => [...prev, {
          position: clickPosition,
          timeCreated: Date.now()
        }]);
        
        // Reset attack on path mode
        setAttackOnPath(false);
        setIsAttacking(false);
        
        setKeyCombination(['left click']);
        onKeyPress('MouseLeft');
      }
    }
  }, [character.position, character.isAttackRangeVisible, enemies, onKeyPress, attackRange, targetMode]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'q') {
      setCharacter(prev => ({
        ...prev,
        isAttackRangeVisible: true,
      }));
      setKeyCombination(['q']);
      onKeyPress('q');
    }
  }, [onKeyPress]);

  // Helper function to calculate distance between two points
  const distanceBetween = (p1: Position, p2: Position): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const updateCharacterPosition = useCallback((deltaTime: number) => {
    // Don't move if attacking
    if (isAttacking) return;
    
    setCharacter(prev => {
      if (!prev.targetPosition) return prev;

      const dx = prev.targetPosition.x - prev.position.x;
      const dy = prev.targetPosition.y - prev.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 1) {
        // Reached destination
        return {
          ...prev,
          targetPosition: null,
        };
      }

      const speed = (MOVEMENT_SPEED * deltaTime) / 1000;
      const ratio = Math.min(speed / distance, 1);
      
      const newPosition = {
        x: prev.position.x + dx * ratio,
        y: prev.position.y + dy * ratio,
      };
      
      // Check if we should auto-attack enemies on path
      if (attackOnPath && prev.isAttackRangeVisible) {
        // Find enemies in range of the new position
        const enemiesInRange = enemies.filter(enemy => 
          isInRange(newPosition, enemy.position, attackRange)
        );
        
        if (enemiesInRange.length > 0) {
          // Pick the target based on targeting mode
          let targetEnemy;
          
          if (targetMode === 'closest-to-player') {
            // Get the closest enemy to the player
            targetEnemy = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(newPosition, closest.position);
              const currentDist = distanceBetween(newPosition, current.position);
              return currentDist < closestDist ? current : closest;
            });
          } else {
            // Get the closest enemy to the cursor
            targetEnemy = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(cursorPosition, closest.position);
              const currentDist = distanceBetween(cursorPosition, current.position);
              return currentDist < closestDist ? current : closest;
            });
          }
          
          // Attack the selected enemy
          setAttacks(currentAttacks => [...currentAttacks, {
            id: Math.random().toString(36).substr(2, 9),
            position: { ...newPosition },
            targetPosition: { ...targetEnemy.position },
            progress: 0,
          }]);
          
          setEnemies(currentEnemies => currentEnemies.map(e => 
            e.id === targetEnemy.id ? { ...e, isBeingAttacked: true, health: e.health - 25 } : e
          ));
          
          // Stop movement and set attacking state
          setIsAttacking(true);
          
          // Stop here and don't update position
          return {
            ...prev,
            position: newPosition,
            targetPosition: null, // Stop movement
          };
        }
      }
      
      return {
        ...prev,
        position: newPosition,
      };
    });
  }, [enemies, attackOnPath, isAttacking, attackRange, targetMode, cursorPosition]);

  const updateEnemies = useCallback((deltaTime: number) => {
    setEnemies(prev => 
      prev.map(enemy => {
        // Move toward character if not being attacked
        if (!enemy.isBeingAttacked && enemy.health > 0) {
          const dx = character.position.x - enemy.position.x;
          const dy = character.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 30) { // Don't get too close
            const speed = (ENEMY_SPEED * deltaTime) / 1000;
            const ratio = Math.min(speed / distance, 1);
            
            return {
              ...enemy,
              position: {
                x: enemy.position.x + dx * ratio,
                y: enemy.position.y + dy * ratio,
              }
            };
          }
        }
        
        // Reset attack state after a short time
        if (enemy.isBeingAttacked) {
          return {
            ...enemy,
            isBeingAttacked: false,
          };
        }
        
        return enemy;
      }).filter(enemy => enemy.health > 0) // Remove dead enemies
    );
  }, [character.position]);

  const updateAttacks = useCallback((deltaTime: number) => {
    setAttacks(prev => {
      const updatedAttacks = prev.map(attack => ({
        ...attack,
        progress: Math.min(attack.progress + (deltaTime / ATTACK_DURATION), 1),
      }));
      
      // Remove completed attacks and reset isAttacking state
      const completedAttacks = updatedAttacks.filter(attack => attack.progress >= 1);
      if (completedAttacks.length > 0 && isAttacking) {
        setIsAttacking(false);
      }
      
      // Keep only in-progress attacks
      return updatedAttacks.filter(attack => attack.progress < 1);
    });
    
    // Update move effects (fade out after 1 second)
    setMoveEffects(prev => 
      prev.filter(effect => Date.now() - effect.timeCreated < 1000)
    );
  }, [isAttacking]);

  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < ARENA_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ARENA_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < ARENA_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ARENA_WIDTH, y);
      ctx.stroke();
    }

    // Draw move effects (clicking location)
    moveEffects.forEach(effect => {
      const age = Date.now() - effect.timeCreated;
      const opacity = 1 - (age / 1000);
      const size = 20 + (age / 50);
      
      // Outer ring
      ctx.beginPath();
      ctx.arc(
        effect.position.x,
        effect.position.y,
        size,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = COLORS.moveTargetRing.replace(')', `, ${opacity})`);
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner dot
      ctx.beginPath();
      ctx.arc(
        effect.position.x,
        effect.position.y,
        5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = COLORS.moveTarget.replace(')', `, ${opacity})`);
      ctx.fill();
    });

    // Draw path to target if moving and not attacking
    if (character.targetPosition && !isAttacking) {
      ctx.beginPath();
      ctx.moveTo(character.position.x, character.position.y);
      ctx.lineTo(character.targetPosition.x, character.targetPosition.y);
      
      // If in attack-on-path mode, draw a different style line
      if (attackOnPath) {
        ctx.strokeStyle = 'rgba(255, 70, 70, 0.4)';
        ctx.setLineDash([8, 4]);
      } else {
        ctx.strokeStyle = COLORS.targetLine;
        ctx.setLineDash([5, 5]);
      }
      
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw attack range if visible
    if (character.isAttackRangeVisible) {
      ctx.beginPath();
      ctx.arc(
        character.position.x,
        character.position.y,
        attackRange,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = COLORS.characterRangeBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = COLORS.characterRange;
      ctx.fill();
    }

    // Draw enemies
    enemies.forEach(enemy => {
      // Health bar background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(
        enemy.position.x - CHARACTER_SIZE / 2,
        enemy.position.y - CHARACTER_SIZE / 2 - 10,
        CHARACTER_SIZE,
        5
      );
      
      // Health bar
      ctx.fillStyle = enemy.health > 50 ? '#4CAF50' : '#F44336';
      ctx.fillRect(
        enemy.position.x - CHARACTER_SIZE / 2,
        enemy.position.y - CHARACTER_SIZE / 2 - 10,
        (CHARACTER_SIZE * enemy.health) / 100,
        5
      );
      
      // Enemy body
      ctx.beginPath();
      ctx.arc(
        enemy.position.x,
        enemy.position.y,
        CHARACTER_SIZE / 2.5,
        0,
        Math.PI * 2
      );
      
      if (enemy.isBeingAttacked) {
        ctx.fillStyle = COLORS.enemyHit;
      } else {
        ctx.fillStyle = COLORS.enemy;
      }
      
      ctx.fill();
      ctx.strokeStyle = COLORS.enemyBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Highlight enemies in attack range if in attack mode
      if (character.isAttackRangeVisible && !isAttacking) {
        if (isInRange(character.position, enemy.position, attackRange)) {
          // Find which enemy would be targeted based on target mode
          const enemiesInRange = enemies.filter(e => 
            isInRange(character.position, e.position, attackRange)
          );
          
          let targetEnemyId = '';
          
          if (targetMode === 'closest-to-player' && enemiesInRange.length > 0) {
            // Get the closest enemy to the player
            const closestToPlayer = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(character.position, closest.position);
              const currentDist = distanceBetween(character.position, current.position);
              return currentDist < closestDist ? current : closest;
            });
            targetEnemyId = closestToPlayer.id;
          } else if (targetMode === 'closest-to-cursor' && enemiesInRange.length > 0) {
            // Get the closest enemy to the cursor
            const closestToCursor = enemiesInRange.reduce((closest, current) => {
              const closestDist = distanceBetween(cursorPosition, closest.position);
              const currentDist = distanceBetween(cursorPosition, current.position);
              return currentDist < closestDist ? current : closest;
            });
            targetEnemyId = closestToCursor.id;
          }
          
          // Highlight the enemy that would be targeted
          if (enemy.id === targetEnemyId) {
            ctx.beginPath();
            ctx.arc(
              enemy.position.x,
              enemy.position.y,
              CHARACTER_SIZE / 2 + 5,
              0,
              Math.PI * 2
            );
            ctx.strokeStyle = COLORS.cursor;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw a targeting line from character to this enemy
            ctx.beginPath();
            ctx.moveTo(character.position.x, character.position.y);
            ctx.lineTo(enemy.position.x, enemy.position.y);
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    });

    // Draw attacks
    attacks.forEach(attack => {
      const position = calculateAttackPosition(
        attack.position,
        attack.targetPosition,
        attack.progress
      );
      
      // Draw attack trail
      ctx.beginPath();
      ctx.moveTo(attack.position.x, attack.position.y);
      ctx.lineTo(position.x, position.y);
      ctx.strokeStyle = COLORS.attackTrail;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw attack projectile
      ctx.beginPath();
      ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.attackProjectile;
      ctx.fill();
      
      // Add a glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.attackProjectile;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw character
    // Character highlight/shadow
    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      CHARACTER_SIZE / 2 + 3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(77, 208, 225, 0.3)';
    ctx.fill();
    
    // Character body
    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      CHARACTER_SIZE / 2,
      0,
      Math.PI * 2
    );
    
    // Change character color if in attack-on-path mode or attacking
    if (isAttacking) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Gold when attacking
    } else if (attackOnPath) {
      ctx.fillStyle = 'rgba(255, 152, 0, 0.8)'; // Orange when in attack-move mode
    } else {
      ctx.fillStyle = COLORS.character;
    }
    
    ctx.fill();
    ctx.strokeStyle = COLORS.characterBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // If in cursor targeting mode, draw a small cursor indicator
    if (targetMode === 'closest-to-cursor' && character.isAttackRangeVisible) {
      ctx.beginPath();
      ctx.arc(
        cursorPosition.x,
        cursorPosition.y,
        4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = COLORS.cursor;
      ctx.fill();
      
      // Crosshair lines
      ctx.beginPath();
      ctx.moveTo(cursorPosition.x - 8, cursorPosition.y);
      ctx.lineTo(cursorPosition.x + 8, cursorPosition.y);
      ctx.moveTo(cursorPosition.x, cursorPosition.y - 8);
      ctx.lineTo(cursorPosition.x, cursorPosition.y + 8);
      ctx.strokeStyle = COLORS.cursor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [character, enemies, attacks, moveEffects, attackOnPath, isAttacking, attackRange, targetMode, cursorPosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      const deltaTime = lastFrameTimeRef.current ? timestamp - lastFrameTimeRef.current : 0;
      lastFrameTimeRef.current = timestamp;

      updateCharacterPosition(deltaTime);
      updateEnemies(deltaTime);
      updateAttacks(deltaTime);
      drawScene(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawScene, updateCharacterPosition, updateEnemies, updateAttacks]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Respawn enemies when they're all defeated
  useEffect(() => {
    if (enemies.length === 0) {
      // Reset attack mode
      setAttackOnPath(false);
      setIsAttacking(false);
      
      setEnemies(
        Array.from({ length: ENEMY_COUNT }, () =>
          createEnemy(generateRandomPosition(ARENA_WIDTH, ARENA_HEIGHT))
        )
      );
    }
  }, [enemies]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <KitingArenaControls 
        attackRange={attackRange}
        setAttackRange={setAttackRange}
        targetMode={targetMode}
        setTargetMode={setTargetMode}
      />
      
      {/* Arena */}
      <div className="rounded-lg overflow-hidden relative">
        {/* Instructions overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded z-10 text-sm">
          <p>🖱️ Right-click: Move</p>
          <p>⌨️ Press Q: Show Attack Range</p>
          <p>🖱️ Left-click after Q: Attack enemy (stops movement)</p>
          <p className="mt-2 italic text-xs">Target priority: {targetMode === 'closest-to-player' ? 'Closest to player' : 'Closest to cursor'}</p>
        </div>
        
        <canvas
          ref={canvasRef}
          width={ARENA_WIDTH}
          height={ARENA_HEIGHT}
          onMouseDown={handleClick}
          onMouseMove={handleMouseMove}
          onContextMenu={(e) => e.preventDefault()}
          className="border border-gray-300 rounded-lg w-full h-full bg-black"
        />
        
        {/* Visual key combination indicator */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white p-3 rounded flex items-center gap-2">
          {keyCombination.includes('q') && (
            <>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">Q</div>
            </>
          )}
          
          {keyCombination.includes('q') && keyCombination.includes('left click') && (
            <>
              <span className="text-yellow-400">+</span>
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-yellow-400">=</span>
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </>
          )}
          
          {keyCombination.includes('right click') && (
            <>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L21 8.5L21 15.5L12 21L3 15.5L3 8.5L12 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-yellow-400">=</span>
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
            </>
          )}
        </div>
        
        {/* Mode indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded z-10">
          <div className="flex items-center gap-2">
            {character.isAttackRangeVisible && !isAttacking && (
              <span className="px-2 py-1 bg-indigo-600 rounded text-xs font-bold">Attack Mode Ready</span>
            )}
            {isAttacking && (
              <span className="px-2 py-1 bg-yellow-600 rounded text-xs font-bold">Attacking</span>
            )}
            {attackOnPath && !isAttacking && (
              <span className="px-2 py-1 bg-amber-600 rounded text-xs font-bold">Move + Attack</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};