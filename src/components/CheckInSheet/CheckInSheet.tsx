import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  CHECK_IN_COLUMNS,
  DEFAULT_NAME_COLUMN_LABEL,
  DEFAULT_PHONE_COLUMN_LABEL,
  type Participant,
} from '../../data/names';
import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  ROWS_PER_PAGE,
} from '../../data/page';
import './CheckInSheet.css';

const a4PageStyle = {
  '--a4-width': `${A4_WIDTH_MM}mm`,
  '--a4-height': `${A4_HEIGHT_MM}mm`,
} as CSSProperties;

type CheckInSheetProps = {
  title: string;
  participants: Participant[];
  extraBlankPages?: number;
  nameColumnLabel?: string;
  phoneColumnLabel?: string;
  markColumnLabels?: string[];
  editable?: boolean;
  onInsertRow?: (index: number) => void;
  onRemoveRow?: (index: number) => void;
  onRenameRow?: (index: number, name: string) => void;
};

function emptyPage(rowsPerPage: number): (Participant | null)[] {
  return Array.from({ length: rowsPerPage }, () => null);
}

function chunkPages(
  participants: Participant[],
  rowsPerPage: number,
  extraBlankPages: number,
) {
  const pages: (Participant | null)[][] = [];

  for (let i = 0; i < participants.length; i += rowsPerPage) {
    const slice = participants.slice(i, i + rowsPerPage);
    const padded: (Participant | null)[] = [...slice];
    while (padded.length < rowsPerPage) {padded.push(null);}
    pages.push(padded);
  }

  for (let i = 0; i < extraBlankPages; i++) {
    pages.push(emptyPage(rowsPerPage));
  }

  if (pages.length === 0) {
    pages.push(emptyPage(rowsPerPage));
  }

  return pages;
}

export function CheckInSheet({
  title,
  participants,
  extraBlankPages = 0,
  nameColumnLabel = DEFAULT_NAME_COLUMN_LABEL,
  phoneColumnLabel = DEFAULT_PHONE_COLUMN_LABEL,
  markColumnLabels,
  editable = false,
  onInsertRow,
  onRemoveRow,
  onRenameRow,
}: CheckInSheetProps) {
  const pages = chunkPages(participants, ROWS_PER_PAGE, extraBlankPages);
  const markLabels =
    markColumnLabels ?? Array.from({ length: CHECK_IN_COLUMNS }, () => '');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingIndex != null) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingIndex]);

  function startEdit(index: number, currentName: string) {
    setEditingIndex(index);
    setDraft(currentName);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setDraft('');
  }

  function saveEdit() {
    if (editingIndex == null) {return;}
    onRenameRow?.(editingIndex, draft.trim());
    cancelEdit();
  }

  return (
    <div className="sheets" style={a4PageStyle}>
      {pages.map((rows, pageIndex) => (
        <section
          className="sheet"
          key={pageIndex}
          aria-label={`Page ${pageIndex + 1}`}
        >
          <h1 className="sheet-title">{title}</h1>

          <table className="check-in-table">
            <thead>
              <tr>
                <th className="col-index" scope="col" />
                <th className="col-name" scope="col">
                  {nameColumnLabel}
                </th>
                <th className="col-phone" scope="col">
                  {phoneColumnLabel}
                </th>
                {markLabels.map((label, i) => (
                  <th className="col-mark" scope="col" key={i}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((person, rowIndex) => {
                const globalIndex = pageIndex * ROWS_PER_PAGE + rowIndex;
                const number = globalIndex + 1;
                const isDataRow = globalIndex < participants.length;
                const showControls = editable && isDataRow;
                const isEditing = editingIndex === globalIndex;

                return (
                  <tr key={person?.id ?? `empty-${pageIndex}-${rowIndex}`}>
                    <td
                      className={
                        showControls ? 'col-index col-index-editable' : 'col-index'
                      }
                    >
                      <strong>{number}</strong>
                      {showControls && (
                        <div className="cell-actions row-actions no-print">
                          <button
                            type="button"
                            className="row-btn"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onInsertRow?.(globalIndex)}
                            aria-label={`Insert row before ${number}`}
                            title="Insert row above"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="row-btn row-remove"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onRemoveRow?.(globalIndex)}
                            aria-label={`Remove row ${number}`}
                            title="Remove row"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </td>
                    <td
                      className={
                        showControls
                          ? `col-name col-name-editable${isEditing ? ' is-editing' : ''}`
                          : 'col-name'
                      }
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          className="name-edit-input no-print"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              saveEdit();
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          aria-label={`Edit name for row ${number}`}
                        />
                      ) : (
                        <>
                          <span className="name-text">{person?.name ?? ''}</span>
                          {showControls && (
                            <div className="cell-actions name-actions no-print">
                              <button
                                type="button"
                                className="row-btn row-btn-edit"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() =>
                                  startEdit(globalIndex, person?.name ?? '')
                                }
                                aria-label={`Edit name for row ${number}`}
                                title="Edit name"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                    <td className="col-phone" />
                    {markLabels.map((_, i) => (
                      <td className="col-mark" key={i} />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {editable && pageIndex === pages.length - 1 && (
            <div className="add-row-bar no-print">
              <button
                type="button"
                className="row-btn row-btn-wide"
                onClick={() => onInsertRow?.(participants.length)}
              >
                + Add blank row
              </button>
            </div>
          )}

          <footer className="sheet-footer">
            <span className="page-number">{pageIndex + 1}</span>
          </footer>
        </section>
      ))}
    </div>
  );
}
