import './AppTabs.css';

export type AppTab = 'sheet' | 'sheet-data';

type AppTabsProps = {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
};

const TABS: { id: AppTab; label: string }[] = [
  { id: 'sheet', label: 'Sheet' },
  { id: 'sheet-data', label: 'Sheet data' },
];

export function AppTabs({ tab, onChange }: AppTabsProps) {
  return (
    <nav className="tabs" aria-label="Views">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={tab === id ? 'tab active' : 'tab'}
          onClick={() => onChange(id)}
          aria-current={tab === id ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
