import type { SortMode } from '../../utils/sortNames';
import './SheetToolbar.css';

type SheetToolbarProps = {
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
  extraBlankPages: number;
  onExtraBlankPagesChange: (count: number) => void;
};

export function SheetToolbar({
  sortMode,
  onSortModeChange,
  extraBlankPages,
  onExtraBlankPagesChange,
}: SheetToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-controls">
        <div className="toolbar-group">
          <label htmlFor="sort-mode">Sort</label>
          <select
            id="sort-mode"
            value={sortMode}
            onChange={(e) => onSortModeChange(e.target.value as SortMode)}
          >
            <option value="chinese-first">Chinese names first</option>
            <option value="english-first">English names first</option>
            <option value="original">Original order</option>
          </select>
        </div>
        <div className="toolbar-group">
          <label htmlFor="extra-pages">Extra blank pages</label>
          <input
            id="extra-pages"
            className="extra-pages-input"
            type="number"
            placeholder="0"
            max={50}
            value={extraBlankPages === 0 ? '' : extraBlankPages}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              onExtraBlankPagesChange(
                Number.isFinite(n) ? Math.min(50, Math.max(0, n)) : 0,
              );
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className="print-btn"
        onClick={() => window.print()}
      >
        Print / Save PDF
      </button>
    </div>
  );
}
