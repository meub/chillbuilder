# Chillbuilder

A web-based character creator and play manager for **Chill 2nd Edition**, the classic horror RPG by Mayfair Games.

Inspired by [Pathbuilder 2e](https://pathbuilder2e.com/) — Chillbuilder aims to make character creation fast and intuitive while also serving as a live stats tracker during gameplay.

## Features

### Character Creation
- **From-scratch character building** using the 100 CIP (Character Insight Points) budget system
- Configurable CIP totals: 85 (low-power), 100 (standard), or 125 (action horror)
- Full support for all **8 basic abilities** (AGL, DEX, LCK, PCN, PER, STA, STR, WPR) with automatic CIP cost calculation
- **118 narrow skills and 15 broad skills** from the Core Rules and Companion, with formula display, descriptions, and automatic base score computation
- Skill catalog with **ability filter** (multi-select with AND/OR mode) and search
- **Encouraged/discouraged skill modifiers** — halve or double CIP costs per CM rules
- Complete catalog of **Edges** and **Drawbacks** with CIP costs/bonuses
- **The Art** — SAVE campaign disciplines (4 schools with prerequisite enforcement) and the Companion's build-your-own-spell system with potency sliders
- **Psionic Abilities** from the Companion
- **Luck Points** with Gritty / Standard / Wild modes and Good Fortune/Misfortune edge modifiers
- Automatic **derived stat calculation** (Movement, Sprinting, Unskilled Melee, Sensing the Unknown, Wounds)
- **Strike Rank table** — pre-calculated L/H/C result bands for all combat skills
- Background details: age, height/weight, education, profession, social status, personal history
- CIP budget tracker in sidebar with **amber/red warnings** when over budget
- **Tooltips** throughout — hover abilities, skills, edges, drawbacks, and derived stats for rules details and formulas

### Dice Rolling
- **d100 roller** for ability and skill checks with animated spin effect
- **Difficulty modifiers** — Easy (+15), Average (0), Difficult (-15), Very Difficult (-25)
- **Result levels** — Colossal, High, Medium, Low, Failure, Botch (roll 100) with color-coded badges
- **Initiative roller** — 4 + 1D10 with dedicated modal
- **Cryptographic randomness** via Web Crypto API with rejection sampling for true uniform distribution
- **Keyboard shortcuts** — Enter to roll, Escape to close

### Play Management
- Track **Current Stamina** and **Current Willpower** as they change during play
- **Wound tracking** with visual wound boxes that auto-sync when abilities change
- **Luck Points tracker** with mode-aware starting values
- Quick reference for skill scores and strike ranks during sessions

### Data & UI
- **JSON export/import** for sharing and backup
- **Printable character sheet** / Save as PDF via browser print
- **localStorage persistence** — characters saved automatically
- **Multiple characters** with duplicate and delete
- **Dark and light themes** with toggle (persisted to localStorage)
- **Responsive design** — hamburger menu sidebar on mobile/tablet
- **Undo toast** on skill, edge, drawback, and discipline removal

## Tech Stack
- **React 19** + **TypeScript**
- **Vite** for fast builds
- **Zustand** for state management with localStorage persistence
- **Radix UI** for accessible tooltips, dialogs, and primitives
- **CSS Modules** + CSS custom properties for styling
- Purely **client-side** — no server, no account needed

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

## Feature Ideas

### Rules Accuracy
- Discipline CIP cost display with school multiplier (2nd school doubles, 3rd triples, etc.)
- Spell CIP cost display (3 CIP per spell) in sidebar and Art tab
- Psionic level selector for leveled disciplines (S/T/M toggle)

### Usability
- Sort owned skills alphabetically or by category
- Collapse/expand skill categories in the catalog
- Drag to reorder equipment items
- Per-tab character notes (e.g., notes on specific edges or skills)
- Styled confirmation modal for character deletion

### Visual Polish
- Empty state illustrations for tabs with no data
- Skill score badge colors (green for high, amber for mid, etc.)
- CIP breakdown pie/bar chart in sidebar
- Tab badge counts showing number of skills/edges/etc on each tab label

### Advanced
- Character comparison — side-by-side view of two characters
- Preset templates — quick-start characters (Investigator, Occultist, Soldier, etc.)
- Session log — track STA/WPR/wound changes over time during play

## License

This is a fan-made tool. Chill is a trademark of Mayfair Games Inc. This project is not affiliated with or endorsed by Mayfair Games.
