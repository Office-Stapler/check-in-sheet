import { useId } from 'react';
import { namesTextToParticipants } from '../../data/names';
import type { SheetState } from '../../hooks/useSheetState';
import './SheetData.css';

type SheetDataProps = {
  sheet: SheetState;
};

/** Edit persisted sheet fields (`sheet.data`). Add fields in `SheetData` type. */
export function SheetDataEditor({ sheet }: SheetDataProps) {
  const { data, updateData, setMarkColumnLabel } = sheet;
  const titleId = useId();
  const nameColId = useId();
  const phoneColId = useId();
  const namesId = useId();
  const markFieldsId = useId();
  const count = namesTextToParticipants(data.namesText).length;

  return (
    <section className="names-editor" aria-label="Sheet data">
      <div className="names-editor-header">
        <h2>Sheet data</h2>
        <p>Set the title, column headers, then list one name per line.</p>
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
        <div className="field">
          <span className="field-label" id={markFieldsId}>
            Mark columns
          </span>
          <div
            className="mark-column-list"
            role="group"
            aria-labelledby={markFieldsId}
          >
            {data.markColumnLabels.map((label, index) => (
              <label key={index} className="mark-column-item">
                <span className="mark-column-num">{index + 1}</span>
                <input
                  className="column-input"
                  type="text"
                  value={label}
                  onChange={(e) => setMarkColumnLabel(index, e.target.value)}
                  spellCheck={false}
                  placeholder="Optional"
                  aria-label={`Mark column ${index + 1}`}
                />
              </label>
            ))}
          </div>
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
