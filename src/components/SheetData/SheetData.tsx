import { useId, useRef } from 'react';
import { namesTextToParticipants } from '../../data/names';
import type { SheetState } from '../../hooks/useSheetState';
import './SheetData.css';

type SheetDataProps = {
  sheet: SheetState;
};

/** Edit persisted sheet fields (`sheet.data`). Add fields in `SheetData` type. */
export function SheetDataEditor({ sheet }: SheetDataProps) {
  const { data, updateData, exportData, importData, resetData } = sheet;
  const titleId = useId();
  const nameColId = useId();
  const phoneColId = useId();
  const namesId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const count = namesTextToParticipants(data.namesText).length;

  return (
    <section className="names-editor" aria-label="Sheet data">
      <div className="names-editor-header">
        <div className="names-editor-heading">
          <h2>Sheet data</h2>
          <p>Set the title, column headers, then list one name per line.</p>
        </div>
        <div className="sheet-data-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                void importData(file);
              }
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className="sheet-data-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </button>
          <button type="button" className="sheet-data-btn" onClick={exportData}>
            Export
          </button>
          <button
            type="button"
            className="sheet-data-btn sheet-data-btn-danger"
            onClick={resetData}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor={titleId}>Title</label>
        <input
          id={titleId}
          className="title-input"
          type="text"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          spellCheck={false}
        />
      </div>

      <fieldset className="column-fields">
        <legend>Column headers</legend>
        <div className="field">
          <label htmlFor={nameColId}>Name column</label>
          <input
            id={nameColId}
            className="column-input"
            type="text"
            value={data.nameColumnLabel}
            onChange={(e) => updateData({ nameColumnLabel: e.target.value })}
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label htmlFor={phoneColId}>Phone column</label>
          <input
            id={phoneColId}
            className="column-input"
            type="text"
            value={data.phoneColumnLabel}
            onChange={(e) => updateData({ phoneColumnLabel: e.target.value })}
            spellCheck={false}
          />
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor={namesId}>Names</label>
        <textarea
          id={namesId}
          className="names-textarea"
          value={data.namesText}
          onChange={(e) => updateData({ namesText: e.target.value })}
          spellCheck={false}
          placeholder={'劉行圓\n林儷樺\n陳鶯嬌 Jolly'}
        />
        <p className="names-count">{count} people</p>
      </div>
    </section>
  );
}
