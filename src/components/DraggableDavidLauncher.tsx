import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';

const STORAGE_KEY = 'david_launcher_position_v1';

type Pos = { x: number; y: number };

function clampPosition(x: number, y: number): Pos {
  const margin = 8;
  const width = 190;
  const height = 54;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(Math.max(margin, x), maxX),
    y: Math.min(Math.max(margin, y), maxY),
  };
}

function loadPosition(): Pos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y)) {
        return clampPosition(parsed.x, parsed.y);
      }
    }
  } catch {}
  return clampPosition(window.innerWidth - 210, window.innerHeight - 88);
}

export function DraggableDavidLauncher() {
  const [position, setPosition] = useState<Pos>(() => loadPosition());
  const [dragging, setDragging] = useState(false);
  const pointerRef = useRef<{ id: number; dx: number; dy: number; moved: boolean } | null>(null);

  useEffect(() => {
    const handleResize = () => setPosition((p) => clampPosition(p.x, p.y));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const save = (p: Pos) => {
    setPosition(p);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      id: event.pointerId,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = pointerRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const next = clampPosition(event.clientX - drag.dx, event.clientY - drag.dy);
    if (Math.abs(next.x - position.x) > 2 || Math.abs(next.y - position.y) > 2) drag.moved = true;
    setPosition(next);
  };

  const finishDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = pointerRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
    save(position);
    pointerRef.current = null;
    setDragging(false);
  };

  const onClick = () => {
    if (pointerRef.current?.moved) return;
    window.dispatchEvent(new CustomEvent('david:open-workbench'));
  };

  return (
    <button
      type="button"
      aria-label="Talk to David. Drag to move."
      title="Tap to talk to David · drag me anywhere"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClick={onClick}
      className={`fixed z-50 flex items-center gap-2 px-4 py-3 bg-phosphor text-theme-bg font-display uppercase tracking-wider font-bold text-sm terminal-border select-none touch-none ${dragging ? 'opacity-80' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: dragging ? 'grabbing' : 'grab',
        boxShadow: '0 0 8px rgba(var(--color-phosphor),0.18)',
        willChange: dragging ? 'transform' : 'auto',
      }}
    >
      <MessageSquare size={16} />
      <span>TALK TO DAVID</span>
      <span aria-hidden="true" className="opacity-50 text-[10px]">↕↔</span>
    </button>
  );
}
