import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Character, Position, Enemy, Attack } from '../types';
import { generateRandomPosition, isInRange, createEnemy } from '../utils/enemyUtils';
import { calculateAttackPosition } from '../utils/animationUtils';

interface KitingArenaProps {
  onKeyPress: (key: string) => void;
}

const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 400;
const CHARACTER_SIZE = 30;
const ATTACK_RANGE = 100;
const MOVEMENT_SPEED = 200; // pixels per second
const ENEMY_COUNT = 5;
const ATTACK_DURATION = 500; // milliseconds

export const KitingArena: React.FC<KitingArenaProps> = ({ onKeyPress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  
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

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickPosition = { x, y };
    
    if (e.button === 2) { // Right click
      setCharacter(prev => ({
        ...prev,
        targetPosition: clickPosition,
        isAttackRangeVisible: false,
      }));
      onKeyPress('MouseRight');
    } else if (e.button === 0) { // Left click
      setCharacter(prev => ({
        ...prev,
        targetPosition: clickPosition,
      }));
      
      // Find enemies in range and initiate attacks
      enemies.forEach(enemy => {
        if (isInRange(character.position, enemy.position, ATTACK_RANGE)) {
          setAttacks(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            position: { ...character.position },
            targetPosition: { ...enemy.position },
            progress: 0,
          }]);
          
          setEnemies(prev => prev.map(e => 
            e.id === enemy.id ? { ...e, isBeingAttacked: true } : e
          ));
        }
      });
      
      onKeyPress('MouseLeft');
    }
  }, [character.position, enemies, onKeyPress]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'q') {
      setCharacter(prev => ({
        ...prev,
        isAttackRangeVisible: true,
      }));
      onKeyPress('q');
    }
  }, [onKeyPress]);

  const updateCharacterPosition = useCallback((deltaTime: number) => {
    setCharacter(prev => {
      if (!prev.targetPosition) return prev;

      const dx = prev.targetPosition.x - prev.position.x;
      const dy = prev.targetPosition.y - prev.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 1) return prev;

      const speed = (MOVEMENT_SPEED * deltaTime) / 1000;
      const ratio = Math.min(speed / distance, 1);
      
      return {
        ...prev,
        position: {
          x: prev.position.x + dx * ratio,
          y: prev.position.y + dy * ratio,
        },
      };
    });
  }, []);

  const updateAttacks = useCallback((deltaTime: number) => {
    setAttacks(prev => {
      const updatedAttacks = prev.map(attack => ({
        ...attack,
        progress: Math.min(attack.progress + (deltaTime / ATTACK_DURATION), 1),
      }));
      
      // Remove completed attacks
      return updatedAttacks.filter(attack => attack.progress < 1);
    });
    
    // Update enemies based on attack completion
    setEnemies(prev => prev.filter(enemy => {
      const attackCompleted = attacks.some(attack => 
        attack.progress >= 1 && 
        isInRange(attack.targetPosition, enemy.position, 10)
      );
      return !attackCompleted;
    }));
  }, [attacks]);

  const drawScene = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Draw background grid
    ctx.strokeStyle = '#eee';
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

    // Draw attack range if visible
    if (character.isAttackRangeVisible) {
      ctx.beginPath();
      ctx.arc(
        character.position.x,
        character.position.y,
        ATTACK_RANGE,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.fill();
    }

    // Draw enemies
    enemies.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(
        enemy.position.x,
        enemy.position.y,
        CHARACTER_SIZE / 3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = enemy.isBeingAttacked ? '#ff4444' : '#ff6666';
      ctx.fill();
      ctx.strokeStyle = '#cc0000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw attacks
    attacks.forEach(attack => {
      const position = calculateAttackPosition(
        attack.position,
        attack.targetPosition,
        attack.progress
      );
      
      ctx.beginPath();
      ctx.arc(position.x, position.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffff00';
      ctx.fill();
      
      // Draw attack trail
      ctx.beginPath();
      ctx.moveTo(attack.position.x, attack.position.y);
      ctx.lineTo(position.x, position.y);
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw character
    ctx.beginPath();
    ctx.arc(
      character.position.x,
      character.position.y,
      CHARACTER_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [character, enemies, attacks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      const deltaTime = lastFrameTimeRef.current ? timestamp - lastFrameTimeRef.current : 0;
      lastFrameTimeRef.current = timestamp;

      updateCharacterPosition(deltaTime);
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
  }, [drawScene, updateCharacterPosition, updateAttacks]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Respawn enemies when they're all defeated
  useEffect(() => {
    if (enemies.length === 0) {
      setEnemies(
        Array.from({ length: ENEMY_COUNT }, () =>
          createEnemy(generateRandomPosition(ARENA_WIDTH, ARENA_HEIGHT))
        )
      );
    }
  }, [enemies]);

  return (
    <canvas
      ref={canvasRef}
      width={ARENA_WIDTH}
      height={ARENA_HEIGHT}
      onMouseDown={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className="border border-gray-300 rounded-lg shadow-md bg-white"
    />
  );
};