import { useState } from 'react';
import { AppTabs, type AppTab } from './components/AppTabs';
import { CheckInSheet } from './components/CheckInSheet';
import { SheetData } from './components/SheetData';
import { SheetToolbar } from './components/SheetToolbar';
import { useSheetState } from './hooks/useSheetState';
import './App.css';

function App() {
  const [tab, setTab] = useState<AppTab>('sheet');
  const sheet = useSheetState();
  const { data } = sheet;

  return (
    <div className="app">
      <header className="chrome no-print">
        <AppTabs tab={tab} onChange={setTab} />

        {tab === 'sheet' && (
          <>
            <SheetToolbar
              sortMode={sheet.sortMode}
              onSortModeChange={sheet.setSortMode}
              extraBlankPages={data.extraBlankPages}
              onExtraBlankPagesChange={(extraBlankPages) =>
                sheet.updateData({ extraBlankPages })
              }
            />
            <p className="row-hint">
              Hover the number for + / ×, or the name to edit. Numbers update
              automatically.
            </p>
          </>
        )}
      </header>

      {tab === 'sheet' ? (
        <CheckInSheet
          title={data.title}
          participants={sheet.participants}
          extraBlankPages={data.extraBlankPages}
          nameColumnLabel={data.nameColumnLabel}
          phoneColumnLabel={data.phoneColumnLabel}
          editable
          onInsertRow={sheet.insertRow}
          onRemoveRow={sheet.removeRow}
          onRenameRow={sheet.renameRow}
        />
      ) : (
        <SheetData sheet={sheet} />
      )}

      {/*
        On the Sheet data tab, only the editor is visible on screen.
        Browser print still needs the formatted sheet in the DOM: this block is
        hidden normally (`.print-only { display: none }`) and shown in
        `@media print`, while SheetData / chrome use `.no-print` so they are
        omitted from the printout.
      */}
      {tab === 'sheet-data' && (
        <div className="print-only">
          <CheckInSheet
            title={data.title}
            participants={sheet.participants}
            extraBlankPages={data.extraBlankPages}
            nameColumnLabel={data.nameColumnLabel}
            phoneColumnLabel={data.phoneColumnLabel}
          />
        </div>
      )}
    </div>
  );
}

export default App;
