import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TabBar, type TabId } from './TabBar';
import { AbilitiesTab } from '../tabs/AbilitiesTab';
import { SkillsTab } from '../tabs/SkillsTab';
import { EdgesDrawbacksTab } from '../tabs/EdgesDrawbacksTab';
import { TheArtTab } from '../tabs/TheArtTab';
import { DerivedStatsTab } from '../tabs/DerivedStatsTab';
import { BackgroundTab } from '../tabs/BackgroundTab';
import { EquipmentTab } from '../tabs/EquipmentTab';
import { PrintSheet } from '../print/PrintSheet';
import styles from './AppShell.module.css';

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  abilities: AbilitiesTab,
  skills: SkillsTab,
  'edges-drawbacks': EdgesDrawbacksTab,
  'the-art': TheArtTab,
  derived: DerivedStatsTab,
  background: BackgroundTab,
  equipment: EquipmentTab,
};

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('abilities');
  const TabContent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.main}>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className={styles.content}>
            <TabContent />
          </div>
        </div>
      </div>
      <PrintSheet />
    </>
  );
}
