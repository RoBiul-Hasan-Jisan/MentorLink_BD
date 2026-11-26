'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { INITIAL_EVIDENCE, INITIAL_LEVELS, type EvKey, type RoleKey } from './data';

// Shared by the phone preview in the hero, the Readiness demo and the Mentor match demo.
type Demo = {
  role: RoleKey; setRole: (r: RoleKey) => void;
  lv: Record<string, number>; setLevel: (k: string, v: number) => void;
  ev: Record<string, EvKey>; setEvidence: (k: string, v: EvKey) => void;
  langs: Record<string, boolean>; toggleLang: (k: string) => void;
  slots: Record<string, boolean>; toggleSlot: (k: string) => void;
};
const Ctx = createContext<Demo | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleKey>('da');
  const [lv, setLv] = useState(INITIAL_LEVELS);
  const [ev, setEv] = useState(INITIAL_EVIDENCE);
  const [langs, setLangs] = useState<Record<string, boolean>>({ bn: true, en: true });
  const [slots, setSlots] = useState<Record<string, boolean>>({ 'sat-m': true, 'wed-e': true });
  const value: Demo = {
    role, setRole,
    lv, setLevel: (k, v) => setLv((s) => ({ ...s, [k]: v })),
    ev, setEvidence: (k, v) => setEv((s) => ({ ...s, [k]: v })),
    langs, toggleLang: (k) => setLangs((s) => ({ ...s, [k]: !s[k] })),
    slots, toggleSlot: (k) => setSlots((s) => ({ ...s, [k]: !s[k] })),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo(): Demo {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDemo must be used inside DemoProvider');
  return v;
}
