# Chillbuilder

A web-based character creator and play manager for **Chill 2nd Edition**, the classic horror RPG by Mayfair Games.

Inspired by [Pathbuilder 2e](https://pathbuilder2e.com/) — Chillbuilder aims to make character creation fast and intuitive while also serving as a live stats tracker during gameplay.

## Features

### Character Creation
- **From-scratch character building** using the 100 CIP (Character Insight Points) budget system
- Configurable CIP totals: 85 (low-power), 100 (standard), or 125 (action horror)
- Full support for all **8 basic abilities** (AGL, DEX, LCK, PCN, PER, STA, STR, WPR) with automatic CIP cost calculation
- **Both Broad and Narrow skill systems** from the Core Rules and Companion book, with 100+ skills and automatic base score computation
- Complete catalog of **Edges** (advantages) and **Drawbacks** with CIP costs/bonuses
- **The Art** — both the SAVE campaign school/discipline system (Communicative, Incorporeal, Protective, Restorative) and the Companion's build-your-own-spell system
- **Psionic Abilities** from the Companion
- **Luck Points** system with Gritty/Wild/Central Character variants
- Automatic **derived stat calculation** (Movement, Sprinting, Unskilled Melee, Sensing the Unknown, Wounds, Initiative)
- Background details: age, height/weight, education, profession, social status, personal history
- Soft CIP budget validation — warnings when over/under budget, never blocks saving

### Play Management
- Track **Current Stamina** and **Current Willpower** as they change during play
- **Wound tracking** with visual wound boxes
- Skill advancement and discipline progression
- Quick reference for skill scores and strike ranks during sessions

### Data Management
- **JSON export/import** for sharing and backup
- **Printable character sheet** view matching the feel of the official sheet
- **localStorage persistence** — your characters are saved automatically in your browser
- Manage multiple characters

## Tech Stack
- **React** + **TypeScript**
- **Vite** for fast builds
- Purely **client-side** — no server, no account needed
- **localStorage** for persistence
- Dark theme with modern, polished UI

## Source Material

Rules data is drawn from two official Chill 2nd Edition books:

- **Chill 2nd Edition Core Rules** (MFG 650) — by David Ladyman, 1990 Mayfair Games
- **Chill Companion (Revised)** (MFG 669) — by Ray Winninger, 1991 Mayfair Games

## Development

### Architecture

```
src/
├── components/          # React UI components
│   ├── layout/          # App shell, sidebar, tabs
│   ├── tabs/            # One component per tab
│   │   ├── AbilitiesTab
│   │   ├── SkillsTab
│   │   ├── EdgesDrawbacksTab
│   │   ├── TheArtTab
│   │   ├── DerivedStatsTab
│   │   ├── BackgroundTab
│   │   └── EquipmentTab
│   ├── shared/          # Reusable UI components
│   └── print/           # Printable character sheet
├── data/                # Static game data (skills, edges, drawbacks, disciplines)
├── models/              # TypeScript types and interfaces
├── hooks/               # Custom React hooks
├── utils/               # Calculation helpers, CIP math, derived stats
├── store/               # State management (character state, localStorage sync)
└── styles/              # Global styles, theme, CSS modules
```

### Data Model (Key Types)

```typescript
// Core character state
interface Character {
  id: string;
  name: string;
  background: Background;
  abilities: Abilities;            // AGL, DEX, LCK, PCN, PER, STA, STR, WPR
  currentStamina: number;          // Mutable during play
  currentWillpower: number;        // Mutable during play
  skills: CharacterSkill[];        // Skill + level (S/T/M)
  skillSystem: 'broad' | 'narrow' | 'mixed';
  edges: CharacterEdge[];          // Edge + purchase count
  drawbacks: CharacterDrawback[];  // Drawback + details
  disciplines: CharacterDiscipline[];  // Art disciplines (SAVE system)
  spells: Spell[];                 // Custom spells (Companion system)
  psionicDisciplines: PsionicDiscipline[];
  wounds: boolean[];               // Wound box tracking
  equipment: EquipmentItem[];
  luckPoints: number;              // Current luck points
  cipBudget: 85 | 100 | 125;
  notes: string;
}

interface Abilities {
  AGL: number;  // 10-90
  DEX: number;
  LCK: number;
  PCN: number;
  PER: number;
  STA: number;
  STR: number;
  WPR: number;
}
```

### Implementation Plan

#### Phase 1: Foundation
- [ ] Project scaffolding (Vite + React + TypeScript)
- [ ] Dark theme and layout shell (sidebar + tabbed main area)
- [ ] Character data model and state management
- [ ] localStorage persistence with auto-save
- [ ] Character list view (create, select, delete characters)

#### Phase 2: Core Character Creation
- [ ] **Abilities Tab** — score inputs (10-90), CIP cost display, current STA/WPR tracking
- [ ] **Skills Tab** — searchable/filterable skill list, broad/narrow toggle, level selectors, auto-computed base scores
- [ ] **Edges & Drawbacks Tab** — browsable catalog, purchase/remove, CIP cost/bonus tracking
- [ ] **Background Tab** — name, age, height/weight, education, profession, social status, personal history, handedness

#### Phase 3: Magic & Psionics
- [ ] **The Art Tab** — SAVE campaign disciplines (4 schools, S/T/M levels, prerequisite enforcement)
- [ ] **The Art Tab** — Companion spell builder (causes + effects + potency calculator)
- [ ] **The Art Tab** — Psionic abilities (requires Psionic Ability edge)

#### Phase 4: Derived Stats & Polish
- [ ] **Derived Stats Tab** — auto-calculated Movement, Sprinting, Unskilled Melee, Sensing the Unknown, Wounds, Initiative
- [ ] **Equipment Tab** — basic equipment list with notes
- [ ] CIP budget tracker in sidebar with warnings
- [ ] Luck Points tracker

#### Phase 5: Export & Print
- [ ] JSON export/import
- [ ] Printable character sheet layout
- [ ] Final UI polish and responsiveness

## License

This is a fan-made tool. Chill is a trademark of Mayfair Games Inc. This project is not affiliated with or endorsed by Mayfair Games.
