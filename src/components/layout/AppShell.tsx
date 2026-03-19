import { useState } from 'react';
import { Menu } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const TabContent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <div className={styles.shell}>
        {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={styles.main}>
          <div className={styles.topBar}>
            <button className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <TabBar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />
          </div>
          <div className={styles.content}>
            <TabContent />
          </div>
        </div>
      </div>
      <PrintSheet />
    </>
  );
}
