# Chillbuilder

A web-based character creator and play manager for Chill 2nd Edition RPG. Similar in spirit to [Pathbuilder](https://pathbuilder2e.com/) but for the Chill horror RPG system.

## Tech Stack
- **React + TypeScript** (Vite)
- Purely client-side, **localStorage** persistence
- JSON import/export + printable character sheet
- Dark theme, modern UI (nicer than Pathbuilder)

## Project Decisions
- Supports both **character creation** and **ongoing play management** (track Current STA/WPR, wounds, skill advancement)
- Character creation uses the **"from scratch" 100 CIP method** only (not templates or profession-based)
- Data pulled from **both Core Rules and Companion** books
- CIP budget is **soft-enforced** — show warnings, don't block saving
- CIP total options: 85 (low-power), 100 (standard), 125 (action horror)

## UI Layout
Tabs: **Abilities | Skills | Edges & Drawbacks | The Art | Derived Stats | Background | Equipment**

Left sidebar shows character summary (name, CIP budget/spent, key stats).

## Architecture

```
src/
├── components/          # React UI components
│   ├── layout/          # App shell, sidebar, tabs
│   ├── tabs/            # One component per tab (7 tabs)
│   ├── shared/          # Reusable UI components (inputs, selectors, cards)
│   └── print/           # Printable character sheet
├── data/                # Static game data (skills, edges, drawbacks, disciplines, spells)
├── models/              # TypeScript types and interfaces
├── hooks/               # Custom React hooks (useCharacter, useLocalStorage, useCipBudget)
├── utils/               # Calculation helpers (CIP math, derived stats, skill formulas)
├── store/               # State management (character state, localStorage sync)
└── styles/              # Global styles, theme, CSS modules
```

### State Management
- Single `Character` object as the core state
- All derived values (skill scores, CIP totals, derived stats) computed from base state
- Auto-save to localStorage on every change
- Multiple character support with a character list/selector

### Key Data Model

```typescript
interface Character {
  id: string;
  name: string;
  background: Background;           // age, height, weight, education, profession, etc.
  abilities: Abilities;              // AGL, DEX, LCK, PCN, PER, STA, STR, WPR (10-90)
  currentStamina: number;            // Mutable during play
  currentWillpower: number;          // Mutable during play
  skills: CharacterSkill[];          // Skill reference + level (S/T/M)
  skillSystem: 'broad' | 'narrow' | 'mixed';
  edges: CharacterEdge[];            // Edge reference + purchase count
  drawbacks: CharacterDrawback[];    // Drawback reference + severity/details
  disciplines: CharacterDiscipline[];// SAVE Art disciplines (school + level)
  spells: Spell[];                   // Companion custom spells (causes + effects)
  psionicDisciplines: PsionicDiscipline[];
  wounds: boolean[];                 // Wound box tracking (checked = wounded)
  equipment: EquipmentItem[];
  luckPoints: number;                // Current luck points in play
  cipBudget: 85 | 100 | 125;
  notes: string;
}
```

### CIP Calculation
Total CIPs spent = sum of:
- Abilities: each ability score / 5 (rounded down)
- Skills: per skill system costs (narrow: 1/3/7, martial arts: 2/6/14; broad: varies)
- Edges: per edge cost table
- Drawbacks: subtract CIP bonus from total
- Art disciplines: per school cost (1st school 1/3/7, 2nd doubles, etc.)
- Companion spells: 3 CIPs each
- Psionic disciplines: 4/6/8 CIPs (leveled) or 6 CIPs (flat)

## Implementation Plan

### Phase 1: Foundation
- Project scaffolding (Vite + React + TypeScript)
- Dark theme and layout shell (sidebar + tabbed main area)
- Character data model and state management
- localStorage persistence with auto-save
- Character list view (create, select, delete)

### Phase 2: Core Character Creation
- Abilities Tab — score inputs (10-90), CIP cost display, current STA/WPR tracking
- Skills Tab — searchable/filterable skill list, broad/narrow toggle, level selectors, auto-computed base scores
- Edges & Drawbacks Tab — browsable catalog, purchase/remove, CIP tracking
- Background Tab — name, age, height/weight, education, profession, social status, personal history, handedness

### Phase 3: Magic & Psionics
- The Art Tab — SAVE campaign disciplines (4 schools, S/T/M levels, prerequisites)
- The Art Tab — Companion spell builder (causes + effects + potency calculator)
- The Art Tab — Psionic abilities

### Phase 4: Derived Stats & Polish
- Derived Stats Tab — auto-calculated Movement, Sprinting, Unskilled Melee, Sensing the Unknown, Wounds
- Equipment Tab — basic equipment list
- CIP budget tracker sidebar with warnings
- Luck Points tracker

### Phase 5: Export & Print
- JSON export/import
- Printable character sheet layout
- Final UI polish and responsiveness

---

## Chill 2nd Edition Rules Reference

### Eight Basic Abilities
Scores range 10–90 (average 50 for humans). Cost: 1 CIP per 5 points of ability score.

| Ability | Abbr | Description |
|---------|------|-------------|
| Agility | AGL | Movement, climbing, dodging, combat positioning |
| Dexterity | DEX | Hand-eye coordination, ranged combat, fine manipulation |
| Luck | LCK | Random fortune, avoiding death (PCs only — NPCs/creatures don't have Luck) |
| Perception | PCN | Noticing details, sensing danger, awareness |
| Personality | PER | Social impression, persuasion, intimidation |
| Stamina | STA | Physical endurance, hit points, damage resistance |
| Strength | STR | Physical power, melee damage, carrying capacity |
| Willpower | WPR | Mental resilience, resist fear, power the Art |

**Current Stamina & Current Willpower** — mutable values tracked during play. Start equal to base score, fluctuate with damage/healing/Art use.

### Derived Stats
| Stat | Formula |
|------|---------|
| Movement | floor(AGL / 3) + 20 |
| Sprinting Speed | AGL + 50 (distance in feet per round while sprinting) |
| Unskilled Melee Score | (AGL + STR) / 2 + 4 |
| Sensing the Unknown | floor(PCN / 5) + 20 (base; modified by Evil Sense edge) |
| Initiative | roll-based (4 + 1D10 typically) |
| Wounds | Based on STR+STA: characters have boxes to track (typically around 3-5) |

### Skills

Skills have a **Base Score** derived from ability averages, and a **Skill Score** = Base + level bonus, where Student=+15, Teacher=+30, Master=+50.

The Companion introduces **Broad vs Narrow** skill systems. The app should support both.

#### Narrow Skill Costs (CIPs)
- Standard skills: Student 1, Teacher +2 (total 3), Master +4 (total 7)
- Martial Arts: Student 2, Teacher +4 (total 6), Master +8 (total 14)

#### Broad Skill Costs (CIPs)
Each broad skill has unique costs — see data below.

#### Combat Skills (Narrow)

| Skill | Type | Formula | Unskilled |
|-------|------|---------|-----------|
| Blackjack/Club/Mace | Melee | (AGL + STR) / 2 | Yes: +4 |
| Boxing | Melee | (AGL + STR) / 2 | Yes: +4 |
| Dagger/Knife | Melee | (AGL + STR) / 2 | Yes: +4 |
| Machete | Melee | (AGL + STR) / 2 | Yes: +4 |
| Polearm | Melee | (AGL + STR) / 2 | Yes: +4 |
| Rapier | Melee | (AGL + STR) / 2 | Yes: +4 |
| Spear | Melee | (AGL + STR) / 2 | Yes: +4 |
| Sword (One-handed) | Melee | (AGL + STR) / 2 | Yes: +4 |
| Sword (Two-handed) | Melee | (AGL + STR) / 2 | Yes: +4 |
| Wrestling | Melee | (AGL + STR) / 2 | Yes: +4 |
| Martial Arts | Melee | (AGL + DEX + STR + WPR) / 4 | No |
| Pistol | Firearms | DEX | N/A |
| Rifle | Firearms | DEX | N/A |
| Submachine Gun | Firearms | DEX | N/A |
| Automatic Weapon | Firearms | DEX | N/A |
| Bow (Long & Short) | Bow | (DEX + STR) / 2 | Yes: +4 |
| Crossbow | Bow | (DEX + STR) / 2 | Yes: +4 |
| Bola | Entangler | (AGL + DEX + STR) / 3 | Yes: +10 |
| Lasso | Entangler | (AGL + DEX + STR) / 3 | Yes: +10 |
| Whip | Entangler | (AGL + DEX + STR) / 3 | Yes: +10 |
| Axe/Tomahawk (Thrown) | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Boomerang | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Dagger/Knife (Thrown) | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Javelin | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Spear (Thrown) | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Unbalanced Objects (Thrown) | Thrown | (DEX + STR) / 2 | Yes: +5 |
| Slingshot | Ranged | (DEX + WPR) / 2 | Yes: (DEX+STR)+4 |
| Dodge | Combat | (AGL + LCK) / 2 | Yes: +4 |

#### Non-Combat Skills (Narrow)

| Skill | Formula | Info? | New? |
|-------|---------|-------|------|
| Accounting | (PCN + WPR) / 2 | [I] | |
| Acrobatics | (AGL + PCN + STA) / 3 | | |
| Acting | (PCN + PER + WPR) / 3 | | |
| Acupuncture | (DEX + PCN + STA + WPR) / 4 | | New |
| Administration | WPR | | New |
| Ancient Language [each] | (PCN + WPR) / 2 | [I] | |
| Animal Training | (AGL + PCN + PER) / 3 | | |
| Anthropology/Archaeology | (PCN + WPR) / 2 | [I] | |
| Antiques | (LCK + PCN) / 2 | [I] | |
| Architecture | (DEX + PCN) / 2 | | New |
| Art Criticism | (PCN + WPR) / 2 | [I] | |
| Astrology | (LCK + PCN + WPR) / 3 | | New |
| Astronomy | (PCN + WPR) / 2 | [I] | |
| Beast Riding | (AGL + PCN + PER) / 3 | | New |
| Bicycle | (DEX + PCN) / 2 | | New |
| Biology | (PCN + WPR) / 2 | [I] | |
| Botany | (PCN + WPR) / 2 | [I] | |
| Calligraphy | (DEX + PCN) / 2 | | New |
| Carpentry | (DEX + PCN) / 2 | | New |
| Cartography/Geography | (PCN + WPR) / 2 | [I] | |
| Charm | (PCN + WPR) / 2 | | New |
| Chemistry | (PCN + WPR) / 2 | [I] | |
| Chiropractic | (DEX + PCN + STA + WPR) / 4 | | New |
| Climbing | (AGL + PCN + STA + STR) / 4 | | |
| Comparative Religion | (PCN + WPR) / 2 | [I] | |
| Computer | (PCN + WPR) / 2 | [I] | |
| Contemporary Language [each] | (PCN + WPR) / 2 | | |
| Creative Writing | (LCK + PCN + PER) / 3 | | New |
| Dance | (PCN + PER + WPR) / 3 | | New |
| Disguise | (DEX + PCN + PER) / 3 | | |
| Driving | (DEX + PCN) / 2 | | |
| Electronics | (DEX + PCN) / 2 | | |
| Explosives | (DEX + PCN) / 2 | | |
| Familiarity Skills | (LCK + PCN + WPR) / 3 | | |
| Farming | (LCK + PCN + WPR) / 3 | | New |
| Filching | (DEX + LCK + PCN) / 3 | | |
| Filmmaking | (PCN + PER + WPR) / 3 | | New |
| Firearms (general) | DEX | | |
| First Aid | (DEX + PCN + STA + WPR) / 4 | | |
| Fishing | (LCK + PCN + WPR) / 3 | | New |
| Forensics | (PCN + WPR) / 2 | [I] | |
| Forgery/Graphology | (DEX + PCN) / 2 | | New |
| Gambling | (LCK + PCN + PER) / 3 | | |
| General Practice | (DEX + PCN + STA + WPR) / 4 | | New |
| Geology | (PCN + WPR) / 2 | [I] | |
| Heavy Weapons | (DEX + PCN) / 2 | | |
| History | (PCN + WPR) / 2 | [I] | |
| Hunting | (LCK + PCN + WPR) / 3 | | New |
| Hypnotism | (LCK + PCN) / 2 | | |
| Intimidation | PER | | New |
| Investigation | (LCK + PCN + STA) / 3 | | |
| Journalism | (LCK + PCN + PER) / 3 | [I] | |
| Law | (LCK + PCN + PER + WPR) / 4 | | New |
| Legend/Lore | (PCN + WPR) / 2 | [I] | |
| Lip Reading | (PCN + WPR) / 2 | | |
| Lockpicking | (DEX + PCN) / 2 | | |
| Magic Tricks | (DEX + PCN + PER) / 3 | | New |
| Masonry | (DEX + PCN) / 2 | | New |
| Mathematics | (PCN + WPR) / 2 | [I] | |
| Mechanics | (DEX + PCN) / 2 | | |
| Medical Fields [each] | (DEX + PCN + STA + WPR) / 4 | | |
| Musicianship | (PCN + PER + WPR) / 3 | | New |
| Occult Lore | (LCK + PCN + WPR) / 3 | | New |
| Painting | (DEX + PCN) / 2 | | |
| Persuasion | PER | | New |
| Photography | (DEX + PCN) / 2 | | |
| Physics | (PCN + WPR) / 2 | [I] | |
| Plumbing | (DEX + PCN) / 2 | | New |
| Poetry | (LCK + PCN + PER) / 3 | | New |
| Police Procedures | (LCK + PCN + STA) / 3 | | New |
| Psychiatry | (LCK + PCN + PER + WPR) / 4 | [I] | |
| Ritual Magic | (LCK + PCN + WPR) / 3 | | New |
| Running | Current STA | | |
| Savoir-Faire | (LCK + PCN + PER + WPR) / 4 | | |
| Sculpting | (DEX + PCN) / 2 | | New |
| Seafaring | (DEX + PCN) / 2 | | |
| Semaphore | (DEX + PCN + WPR) / 3 | | New |
| Sign Language | (DEX + PCN + WPR) / 3 | | |
| Singing | (PCN + PER + WPR) / 3 | | New |
| Skating | (AGL + PCN + STA) / 3 | | New |
| Spacecraft | (DEX + PCN) / 2 | | New |
| Sports [each] | (AGL + PCN + STA) / 3 | | |
| Stealth | (AGL + LCK + PCN) / 3 | | |
| Surgery | (DEX + PCN + STA + WPR) / 4 | | |
| Survival | (LCK + PCN + STA + STR + WPR) / 5 | | |
| Swimming | Current STA | | |
| Tracking | (LCK + PCN + WPR) / 3 | | |
| Trivia | (LCK + PCN) / 2 | | |
| Veterinary Medicine | (DEX + PCN + STA + WPR) / 4 | | New |
| Zoology | (PCN + WPR) / 2 | [I] | |

#### Broad Skills

| Broad Skill | Formula | CIP Cost [S, T, M] | Encompasses |
|-------------|---------|---------------------|-------------|
| Art | (PCN + PER) / 2 | 2, 6, 14 | Acting, Dance, Visual Arts, Writing/Journalism |
| Athletics | (PCN + WPR) / 2 | 2, 6, 14 | Acrobatics, Running, Sports, Swimming |
| Business | (LCK + PCN + PER) / 3 | 2, 6, 14 | Accounting, Administration |
| Charisma | PER | 3, 9, 21 | Charm, Intimidation, Persuasion |
| Detective | (LCK + PER + STA) / 3 | 3, 9, 21 | Investigation, Law, Police Procedures |
| Exotic Weapons | (AGL + DEX + STR) / 3 | 2, 6, 14 | Bola, Boomerang, Lasso, Whips |
| Medicine | (DEX + PCN) / 2 | 5, 15, 35 | First Aid, Psychiatry, Surgery |
| Melee Combat | (AGL + STR) / 2 | 2, 6, 14 | All melee weapons + Wrestling |
| Military Science | (DEX + PCN) / 2 | 2, 6, 14 | Cartography/Geography, Explosives, Heavy Weapons |
| Missile Weapons | (DEX + PCN) / 2 | 2, 6, 14 | Axe Thrown, Bow, Spear |
| Nature Lore | (LCK + PCN + STA) / 3 | 3, 9, 21 | Animal Training, Beast Riding, Survival, Tracking |
| Scholar | PCN | 6, 18, 42 | Anthropology, Antiques, History, Legend/Lore, Occult Lore, Languages |
| Science | PCN | 4, 12, 28 | Biology, Botany, Chemistry, Computer, Electronics, Forensics, Geology, Mechanics, Physics, Zoology |
| Thievery | (DEX + PCN) / 2 | 3, 9, 21 | Filching, Forgery, Lockpicking, Stealth |
| Vehicles | (DEX + PCN) / 2 | 2, 6, 14 | Driving, Piloting, Seafaring, Spacecraft |

### Edges (Advantages)

Cost in CIPs. Asterisk (*) = can purchase multiple times.

| Edge | Cost | Max | Description |
|------|------|-----|-------------|
| Absolute Direction | 1 | 1 | Always knows which way is north |
| Ambidexterity | 2 | 1 | Use both hands equally |
| Animal Empathy | 3 | 1 | Natural understanding of animals, +1 to Animal Handling skill level |
| Attractive* | 1 | 3 | +5 per purchase to Charm/Persuasion vs opposite sex |
| Central Character | 1 | 1 | Can be selected as central character (Luck rules) |
| Concentration | 2 | 1 | +10 to Fear Check Target |
| Connoisseur | 2 | 1 | +10 to Charm/Persuasion when discussing fine things |
| Courage | 2 | 3max | +10 per purchase to Target for Fear Checks |
| Destiny | 1 | 1 | +10 or -10 (beneficial) to rolls toward destiny; CM approval required |
| Disease Resistance | 2 | 2max | +1 result level to resist disease per purchase |
| Eidetic Memory | 2 | 1 | +2 Perception Checks to remember things |
| Equipment* | 1 | — | Start with a piece of restricted equipment |
| Evil Sense | 8 | 1 | Improves Sensing the Unknown divisor (5→4→3→2) |
| Good Fortune* | 2 | — | +10 Luck Points per purchase per scenario |
| Improved Stamina Recovery | 4 | 1 | +1 STA recovered per round |
| Improved Willpower Recovery | 4 | 1 | +10 WPR per sleep cycle |
| Improved Wound Recovery | 4 | 1 | +1 additional Wound Box per day healed |
| Information Source | 1 | — | A contact for specific information |
| Keen Hearing | 1 | 1 | +10 to hearing-related checks |
| Keen Smell and Taste | 1 | 1 | +10 to smell/taste checks |
| Keen Vision | 1 | 1 | +10 to vision checks |
| Night Vision | 3 | 1 | See at night at 1/2 normal range |
| Pet | var | 1 | Special trained pet (1-10 CIPs depending on animal) |
| Poison Resistance | 2 | 2max | +1 result level to resist poison per purchase |
| Premonitions* | 4 | — | Once per scenario per purchase, ask CM about consequences of an action |
| Privilege* | 1 | — | License, press pass, concealed carry, etc. |
| Psionic Ability* | 8 | — | Access to psionic disciplines (prerequisite for psionics) |
| Reflective* | 2 | — | Benefits with Resolve rules |
| Specialty* | 2 | — | +10 to a narrow sub-field of a skill |
| Wealth | 1 | — | +1 Salary Level |

### Drawbacks

Grant CIP bonuses. Asterisk (*) = can take multiple times.

| Drawback | CIP Bonus | Max | Description |
|----------|-----------|-----|-------------|
| Addiction* | 2/3/4/5 | 4 | Must pass WPR check daily; severity increases with purchases |
| Age | 3 | 1 | Over 45 or under 16; periodic ability checks |
| Blindness | 10 | 1 | Blind; all visual skills at 1/5 |
| Cowardice* | 3 | 3max | +10 penalty to Fear Check Target per purchase |
| Crippled | 3 or 5 | 1 | Half movement (3 CIP) or 1/3 movement (5 CIP) |
| Curiosity | 1 | 1 | Compelled to investigate |
| Dependent | 2 | — | Someone who depends on the character |
| Flashbacks | 2 or 4 | 1 | Stressful visions; must pass WPR to act |
| Gothic Romance | 2 or 3 | 1 | Romantic entanglement |
| Hunted | 2 | 1 | Pursued by a creature of the Unknown |
| Illiteracy | 2 | 1 | Cannot read |
| Impulsiveness | 1 | 1 | Act first, think later |
| Misfortune* | 1 per | — | -10 Luck Points per purchase per scenario |
| Obsession | 1/2/3/4 | 1 | Fixated on an elusive goal |
| One Arm | 3 | 1 | Missing an arm |
| One Hand | 1 | 1 | Missing a hand |
| Outsider | 2 | 1 | Shunned/exiled by society |
| Overconfidence | 1 | 1 | Believes can handle anything alone |
| Phobia | 1/2/3/5 | — | Fear of something (1=minor, 2=standard, 3=extreme, 5=extreme + Dead Things/Darkness) |
| Poor* | 1 | — | -1 Salary Level per purchase |
| Poor Hearing | 2 | 1 | Hearing checks at 1/2 |
| Poor Night Vision | 1 | 1 | See at night at 1/2 normal distance |
| Poor Taste and Smell | 1 | 1 | Taste/smell checks at 1/2 |
| Poor Vision | 2 | 1 | Vision checks at 1/2 |
| Poor Vision (Correctable) | 1 | 1 | Nearsighted but correctable with glasses |
| Psychological Flaw* | 1/2/3/4 | — | Moral/psychological quirk; more susceptible to fear/intimidation |
| Psychological Illness | 5 | 1 | Severe mental illness |
| Sadism | 1 | 1 | Must pass WPR check to avoid harming others |
| Split Personality | 4 | 1 | Two distinct personalities |
| Strange Appearance | 3 | 1 | Obviously inhuman or mutilated |
| Weak Stomach | 3 | 1 | Must pass WPR when witnessing gore |
| Won't Harm | 1 | 1 | Won't harm living things |
| Won't Kill | 1 | 1 | Won't kill (less restrictive than Won't Harm) |

### The Art (Core Rules — SAVE Campaign)

Four schools, each with multiple disciplines at Student/Teacher/Master levels.

**Prerequisites:**
- Communicative: PER ≥ 60
- Incorporeal: STA ≥ 60
- Protective: LCK ≥ 60
- Restorative: STR ≥ 60

**Discipline costs:** Buying disciplines in one school costs standard CIPs. A second school doubles cost. Third school triples. Fourth quadruples.
- 1 school: Student 1, Teacher +2, Master +4 (total 7 per discipline)
- Each additional school multiplies the above

**Discipline Score** = average of the two school abilities, then roll against that.

#### Communicative School (PCN + PER)
| Discipline | Cost | Roll Req | Range | Description |
|-----------|------|----------|-------|-------------|
| Clairvoyant/Prescient Dream | 1D10 WPR | — | Self | See dreams about current situation |
| Sensing the Unknown | N/A | PCN-based | Area | Sense presence of the Unknown |
| Telepathic Empathy | 1D10 WPR | G | Sight | Read emotions of another |
| Telepathic Sending | 2D10 WPR | G | 1 Mind | Send mental message |

#### Incorporeal School (PCN + PER)
| Discipline | Cost | Roll Req | Range | Description |
|-----------|------|----------|-------|-------------|
| Incorporeal Attack | 1D10 WPR | Spec | Area | Attack incorporeal creatures |
| Leave the Body | 1D10 + 1D10 WPR | G | Self | Astral projection |
| Seance | 1D10 WPR | — | Touch | Contact the dead |
| Mental Shield | — | — | Sight | Shield from Evil Way disciplines |

#### Protective School (PCN + LCK)
| Discipline | Cost | Roll Req | Range | Description |
|-----------|------|----------|-------|-------------|
| Raise Perception | 2D10 WPR | G | Sight | Boost Perception of others |
| Sphere of Protection | 2D10 WPR | G | 10-20ft radius | Protective barrier |

#### Restorative School (PCN + STR)
| Discipline | Cost | Roll Req | Range | Description |
|-----------|------|----------|-------|-------------|
| Feat of Strength | 1D10 WPR | G | Self | Superhuman strength temporarily |
| Restore Stamina | 1D10 WPR | G | Touch | Heal STA damage |
| Restore Willpower | 1D10 WPR | G | Touch | Restore WPR |

### The Art (Companion — Generalized Magic System)

An alternative build-your-own-spell system. Requires the **Ritual Magic** skill. Each spell costs **3 CIPs** at character creation.

Spells are built from **Causes** (Ritual duration, Materials cost, Assistants, Subsidiary Activities) and **Effects** (Range, Duration, Area of Effect, Fatigue, End Result). Each has a Potency rating 1–10.

**Casting Check Modifier** = based on (Pc + Pe + Pm) where Pc = total cause Potency, Pe = total effect Potency (negative), Pm = magic factor (1-10).

#### Cause Potency Tables

**Ritual Duration:**
| Potency | Duration |
|---------|----------|
| 1 | None/Immediate |
| 2 | 15 minutes |
| 3 | 1 hour |
| 4 | 12 hours |
| 5 | 1 day |
| 6 | 1 week |
| 7 | 1 month |
| 8 | 1 year |
| 9 | 1 decade |
| 10 | A lifetime (70+ years) |

**Materials Cost:**
| Potency | Cost |
|---------|------|
| 1 | None |
| 2 | $10 |
| 3 | $100 |
| 4 | $1,000 |
| 5 | $10,000 |
| 6 | $100,000 |
| 7 | $1,000,000 |
| 8 | $10,000,000 |
| 9 | $100,000,000 |
| 10 | $1,000,000,000 |

**Assistants:**
| Potency | Required |
|---------|----------|
| 1 | None |
| 2 | 1 |
| 3 | 2 |
| 4 | 5 |
| 5 | 10 |
| 6 | 50 |
| 7 | 100 |
| 8 | 500 |
| 9 | 1,000 |
| 10 | 10,000 |

**Subsidiary Activities:**
| Potency | Difficulty |
|---------|-----------|
| 1 | None |
| 2 | General, +10 |
| 3 | General |
| 4 | -15, L result |
| 5 | M result |
| 6 | -15, M result |
| 7 | H result |
| 8 | -15, H result |
| 9 | C result |
| 10 | -15, C result |

#### Effect Potency Tables

**Range:**
| Potency | Range |
|---------|-------|
| 1 | Same Room |
| 2 | Same City Block |
| 3 | Same City |
| 4 | Same County |
| 5 | Same State |
| 6 | Same Country |
| 7 | Same Continent |
| 8 | Same Hemisphere |
| 9 | Same Planet |
| 10 | Interstellar |

**Duration:**
| Potency | Duration |
|---------|----------|
| 1 | Immediate |
| 2 | 1 Minute |
| 3 | 15 Minutes |
| 4 | 1 Hour |
| 5 | 1 Day |
| 6 | 1 Month |
| 7 | 1 Year |
| 8 | 1 Decade |
| 9 | A Lifetime |
| 10 | Permanent |

**Area of Effect:**
| Potency | Area (# Individuals) |
|---------|---------------------|
| 1 | Single Individual |
| 2 | Small Room (2) |
| 3 | Large Room (5) |
| 4 | City Block (10) |
| 5 | City (50) |
| 6 | County (100) |
| 7 | State (1,000) |
| 8 | Country (10,000) |
| 9 | Continent (1,000,000) |
| 10 | Planet (1,000,000,000) |

**Fatigue (damage to caster):**
| Potency | Damage |
|---------|--------|
| 1 | 5D10 STA/WPR + 2D10 wounds |
| 2 | 4D10 + 1D5 wounds |
| 3 | 3D10 + 1 wound |
| 4 | 2D10 |
| 5 | 1D10 |
| 6 | 1D5 |
| 7 | 2 points |
| 8 | 1 point |
| 9 | Confusion (dazed 5 rounds) |
| 10 | None |

#### End Results

| End Result | Type | Potency | Effect |
|-----------|------|---------|--------|
| Animal Control | General | 3 | Control nearby animals |
| Animate Dead | General | 7 | Create skeletons/zombies |
| Anti-Magic | Specific | 5 | Nullify other spells |
| Armor | General | 4/6/8 | Lower Strike Rank of attacks by 2/4/6 |
| Bind (portal) | General | 3 | Secure a door or portal |
| Bind (creature) | Specific | 8 | Restrain a living creature |
| Communication | General | 3 | Communicate over distance |
| Control | Specific | 6 | Control another intelligent being |
| Cure | General | 2-5 | Heal: 1D10 STA / 3D10+1D5 wounds / all physical / all ailments |
| Damage | General | 4-8 | 1D5 / 1D10 / 3D10 / 4D10+1D10w / 5D10+2D10w STA |
| Darkness | General | 3 | Blanket area in darkness |
| Destroy | General | 5/6/7 | Destroy soft / hard / any objects |
| Detect | General | 3 | Detect specified item/presence/quality |
| Enchant | General | 3-6 | Add 2D10/4D10/6D10/8D10 to attributes/skills |
| Exorcism | Specific | 5 | Free target from possession |
| Extradimensional Travel | General | 6 | Travel to another plane |
| Flight | General | 4 | Grant flight |
| Free (portal) | General | 2 | Open a Bound portal |
| Free (creature) | Specific | 7 | Release a Bound creature |
| Grow | General | 6 | Expand size |
| History | Specific | 2 | Learn history of item/area |
| Illusion | Specific | 6 | Alter appearance of reality |
| Incorporeal Shift | General | 3 | Become incorporeal |
| Invisibility | General | 3 | Become invisible |
| Item | General | 3 | Bind spell effects into a physical item |
| Longevity | General | 4 | Prevent aging |
| Magic Crystal | General | 3/4 | Create thin/thick ice/crystal barrier |
| Magic Flame | General | 5 | Blanket area in flames |
| Mind Reading | Specific | 7 | Read thoughts/emotions |
| Mystic Barrier | General | 6 | Create impenetrable barrier |
| Plant Growth | General | 4 | Expand plant life |
| Possession | Specific | 6 | Possess another being |
| Remote Sensing | General | 5 | View distant region with all senses |
| Shrink | General | 6 | Reduce size |
| Summon | General | 6 | Transport creatures to caster |
| Teleport | General | 7 | Transport to remote destination |
| Transform | General/Specific | 7 | Transform creature/item into another |
| Willpower Attack | General | 4-8 | 1D5/1D10/3D10/4D10/5D10 WPR damage |

**Casting Check Modifier Table:**
| Pc + Pe + Pm | Modifier |
|-------------|----------|
| > 0 | 0 |
| 0 to -2 | -5 |
| -3 to -5 | -15 |
| -6 to -10 | -25 |
| -11 to -15 | -40 |
| -16 to -20 | -55 |
| -21 to -25 | -70 |
| -26 or less | -90 |

Where Pc = total cause Potency, Pe = total effect Potency (negative), Pm = magic factor (1-10 reflecting how available magic is in the setting).

### Psionic Abilities (Companion)

Requires **Psionic Ability Edge** (8 CIPs). Each use costs 5 WPR per round.

| Discipline | Cost | Levels? |
|-----------|------|---------|
| Change Temperature | 6 CIP | No |
| Clairvoyant/Prescient Dream | 4/6/8 CIP | S/T/M |
| Empathy | 6 CIP | No |
| Restore Stamina | 4/6/8 CIP | S/T/M |
| Restore Willpower | 4/6/8 CIP | S/T/M |
| Telekinesis | 6 CIP | No |
| Telepathy | 6 CIP | No |
| White Heat | 6 CIP | No |

All psionic characters also get **Psionic Attack**: 2D10 STA damage + 1 wound, 100 yard range, auto-hit vs non-psionics.

### Task Difficulty Modifiers (Companion)

| Difficulty | Modifier |
|-----------|----------|
| Easy | +15 |
| Average | 0 (no modifier) |
| Difficult | -15 |
| Very Difficult | -25 |

### Restricted/Encouraged Skills (Companion)

CMs may modify skill costs during character creation:
- **Encouraged skills**: cost half normal CIPs
- **Discouraged skills**: cost double CIPs

### Luck Points (Companion)

- Start each scenario with Luck Points = Luck Score
- Spend 1-for-1 to lower a failed die roll
- Spend half starting total to convert a lethal hit to a miss
- Good Fortune Edge: +10 per purchase
- Misfortune Drawback: -10 per purchase
- Gritty mode: start at half Luck Score
- Wild mode: start at double Luck Score

### Character Creation Steps (100 CIP Method)
1. **Background** — Age (12-85), Height, Weight, Education, Profession, Social/Economic Status, Personal History, Name
2. **Buy Basic Abilities** — 1 CIP per 5 points (e.g., STR 65 = 13 CIPs). Min 10, Max 90.
3. **Choose Skill System** — Broad, Narrow, or Mixed
4. **Buy Skills** — At Student/Teacher/Master levels per the chosen system
5. **Buy Edges** — Each has a CIP cost
6. **"Buy" Drawbacks** — Each gives CIPs back
7. **Buy Disciplines/Spells/Psionics** — Art disciplines or custom spells (3 CIP each) or psionic disciplines
8. **Even Out** — Adjust to reach exactly 100 CIPs (or 85/125)
9. **Compute Derived Stats** — Movement, Unskilled Melee, Sensing the Unknown, Wounds, etc.
10. **Fill in Character Sheet** — Final scores, handedness, Current STA/WPR, Strike Rank for each skill

### Result Table (Core Mechanic)

All checks in Chill use a d100 roll against a Target number. The result level depends on how far under the Target you roll:

| Roll vs Target | Result |
|---------------|--------|
| Roll ≤ Target and ≤ 1/2 Target and ≤ 1/4 Target | **C** (Colossal) |
| Roll ≤ Target and ≤ 1/2 Target | **H** (High) |
| Roll ≤ Target | **M** (Medium) |
| Roll ≤ Target (barely) | **L** (Low) |
| Roll > Target | **F** (Failure) |

More precisely for a Specific Check:
- **L result** = roll ≤ Target
- **M result** = roll ≤ Target, within the middle band
- **H result** = roll ≤ 1/2 Target (rounded down)
- **C result** = roll ≤ 1/4 Target (rounded down)

For a **General Check**, any roll ≤ Target succeeds (no result levels).

**Botch**: Rolling exactly 100 is always a failure regardless of Target.

### Strike Rank

Each skill has a **Strike Rank** used in combat. Strike Rank = the Skill Score column on the result table that determines the success band. This is pre-calculated from the Skill Score for quick reference during play.

### Wounds System

Characters have a number of wound boxes based on STR and STA:
- Wound boxes ≈ floor((STR + STA) / 2 / 10) (approximately 3-9 boxes)
- Each wound box represents a serious injury
- When all wound boxes are filled, the character is incapacitated
- Wounds heal slowly (1 per day with rest, modified by Improved Wound Recovery edge)

### Height & Weight Guidelines

| Height | Male Weight | Female Weight |
|--------|-------------|---------------|
| 4'8"-5'0" | 105-125 | 85-105 |
| 5'0"-5'4" | 115-135 | 95-115 |
| 5'4"-5'6" | 125-145 | 105-130 |
| 5'6"-5'8" | 140-180 | 110-140 |
| 5'8"-6'0" | 150-180 | 120-160 |
| 6'0"-6'2" | 165-195 | 130-170 |
| 6'2"-6'4" | 170-195 | — |
| 6'4"+ | 195-225 | — |
