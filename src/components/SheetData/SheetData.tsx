import { useId } from 'react';
import { namesTextToParticipants } from '../../data/names';
import type { SheetState } from '../../hooks/useSheetState';
import './SheetData.css';

type SheetDataProps = {
  sheet: SheetState;
};

/** Edit the sheet title and roster (source data for the Sheet view). */
export function SheetData({ sheet }: SheetDataProps) {
  const titleId = useId();
  const namesId = useId();
  const count = namesTextToParticipants(sheet.namesText).length;

  return (
    <section className="names-editor" aria-label="Sheet data">
      <div className="names-editor-header">
        <h2>Sheet data</h2>
        <p>Set the title, then list one name per line.</p>
      </div>

      <div className="field">
        <label htmlFor={titleId}>Title</label>
        <input
          id={titleId}
          className="title-input"
          type="text"
          value={sheet.title}
          onChange={(e) => sheet.setTitle(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="field">
        <label htmlFor={namesId}>Names</label>
        <textarea
          id={namesId}
          className="names-textarea"
          value={sheet.namesText}
          onChange={(e) => sheet.setNamesText(e.target.value)}
          spellCheck={false}
          placeholder={'劉行圓\n林儷樺\n陳鶯嬌 Jolly'}
        />
        <p className="names-count">{count} people</p>
      </div>
    </section>
  );
}
