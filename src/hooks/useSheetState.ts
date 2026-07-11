import { useEffect, useState } from 'react';
import { addToast } from '../toast/toastStore';
import {
  DEFAULT_SHEET_TITLE,
  INITIAL_NAMES,
  namesTextToParticipants,
  participantsToNamesText,
  type Participant,
} from '../data/names';
import { sortParticipants, type SortMode } from '../utils/sortNames';

const NAMES_STORAGE_KEY = 'check-in-names-text';
const TITLE_STORAGE_KEY = 'check-in-sheet-title';
const EXTRA_PAGES_STORAGE_KEY = 'check-in-extra-blank-pages';

function loadNamesText(): string {
  try {
    const raw = localStorage.getItem(NAMES_STORAGE_KEY);
    if (raw != null) {
      return raw;
    }

    const legacy = localStorage.getItem('check-in-participants');
    if (legacy) {
      const parsed = JSON.parse(legacy) as { name?: string }[];
      if (Array.isArray(parsed)) {
        return parsed
          .map((p) => (typeof p?.name === 'string' ? p.name : ''))
          .filter(Boolean)
          .join('\n');
      }
    }
  } catch {
    // fall through
  }
  return INITIAL_NAMES;
}

function loadTitle(): string {
  const raw = localStorage.getItem(TITLE_STORAGE_KEY);
  if (raw != null) {
    return raw;
  }
  return DEFAULT_SHEET_TITLE;
}

function loadExtraBlankPages(): number {
  const raw = localStorage.getItem(EXTRA_PAGES_STORAGE_KEY);
  if (raw == null) {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export type SheetState = ReturnType<typeof useSheetState>;

export function useSheetState() {
  const [sortMode, setSortMode] = useState<SortMode>('chinese-first');
  const [title, setTitle] = useState(loadTitle);
  const [namesText, setNamesText] = useState(loadNamesText);
  const [extraBlankPages, setExtraBlankPages] = useState(loadExtraBlankPages);

  useEffect(() => {
    localStorage.setItem(NAMES_STORAGE_KEY, namesText);
  }, [namesText]);

  useEffect(() => {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem(EXTRA_PAGES_STORAGE_KEY, String(extraBlankPages));
  }, [extraBlankPages]);

  const participants = sortParticipants(
    namesTextToParticipants(namesText),
    sortMode,
  );

  function commitRows(rows: Participant[]) {
    // Keep inserted blank rows in place after edits
    setSortMode('original');
    setNamesText(participantsToNamesText(rows));
  }

  function insertRow(index: number) {
    const rows = [...participants];
    rows.splice(index, 0, { id: crypto.randomUUID(), name: '' });
    commitRows(rows);
  }

  function removeRow(index: number) {
    const previous = [...participants];
    const removed = previous[index];
    if (!removed) {
      return;
    }

    commitRows(previous.filter((_, i) => i !== index));

    addToast({
      message: removed.name.trim()
        ? `Removed ${removed.name}`
        : 'Row removed',
      action: {
        label: 'Undo',
        onClick: () => commitRows(previous),
      },
    });
  }

  function renameRow(index: number, name: string) {
    const rows = participants.map((row, i) =>
      i === index ? { ...row, name } : row,
    );
    commitRows(rows);
  }

  return {
    title,
    setTitle,
    namesText,
    setNamesText,
    sortMode,
    setSortMode,
    extraBlankPages,
    setExtraBlankPages,
    participants,
    insertRow,
    removeRow,
    renameRow,
  };
}
