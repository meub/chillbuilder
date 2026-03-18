import styles from './TabBar.module.css';

export const TAB_IDS = [
  'abilities',
  'skills',
  'edges-drawbacks',
  'the-art',
  'derived',
  'background',
  'equipment',
] as const;

export type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  abilities: 'Abilities',
  skills: 'Skills',
  'edges-drawbacks': 'Edges & Drawbacks',
  'the-art': 'The Art',
  derived: 'Derived Stats',
  background: 'Background',
  equipment: 'Equipment',
};

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className={styles.tabBar}>
      {TAB_IDS.map(id => (
        <button
          key={id}
          className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(id)}
        >
          {TAB_LABELS[id]}
        </button>
      ))}
    </nav>
  );
}
