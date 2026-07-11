import { useEffect, useState } from 'react';
import { addToast } from '../toast/toastStore';
import {
  namesTextToParticipants,
  participantsToNamesText,
  type Participant,
} from '../data/names';
import {
  DEFAULT_SHEET_DATA,
  loadSheetData,
  parseSheetData,
  saveSheetData,
  sheetDataFilename,
  type SheetData,
} from '../data/sheetData';
import { sortParticipants, type SortMode } from '../utils/sortNames';

export type SheetState = ReturnType<typeof useSheetState>;

export function useSheetState() {
  const [data, setData] = useState<SheetData>(loadSheetData);
  const [sortMode, setSortMode] = useState<SortMode>('chinese-first');

  useEffect(() => {
    saveSheetData(data);
  }, [data]);

  const participants = sortParticipants(
    namesTextToParticipants(data.namesText),
    sortMode,
  );

  function updateData(patch: Partial<SheetData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function replaceData(next: SheetData, toastMessage: string) {
    const previous = data;
    setData(next);
    addToast({
      message: toastMessage,
      action: {
        label: 'Undo',
        onClick: () => setData(previous),
      },
    });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sheetDataFilename(data);
    link.click();
    URL.revokeObjectURL(url);
    addToast({ message: 'Sheet data exported' });
  }

  async function importData(file: File) {
    try {
      const text = await file.text();
      const parsed = parseSheetData(JSON.parse(text) as unknown);
      if (parsed == null) {
        addToast({ message: 'Import failed: invalid sheet file' });
        return;
      }
      replaceData(parsed, 'Sheet data imported');
    } catch {
      addToast({ message: 'Import failed: could not read file' });
    }
  }

  function resetData() {
    replaceData({ ...DEFAULT_SHEET_DATA }, 'Sheet data reset');
  }

  function commitRows(rows: Participant[]) {
    setSortMode('original');
    updateData({ namesText: participantsToNamesText(rows) });
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
    data,
    updateData,
    exportData,
    importData,
    resetData,
    sortMode,
    setSortMode,
    participants,
    insertRow,
    removeRow,
    renameRow,
  };
}
