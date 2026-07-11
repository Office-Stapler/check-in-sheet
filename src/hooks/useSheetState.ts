import { useEffect, useState } from 'react';
import { addToast } from '../toast/toastStore';
import {
  namesTextToParticipants,
  participantsToNamesText,
  type Participant,
} from '../data/names';
import {
  loadSheetData,
  saveSheetData,
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

  function setMarkColumnLabel(index: number, label: string) {
    setData((prev) => ({
      ...prev,
      markColumnLabels: prev.markColumnLabels.map((value, i) =>
        i === index ? label : value,
      ),
    }));
  }

  return {
    data,
    updateData,
    setMarkColumnLabel,
    sortMode,
    setSortMode,
    participants,
    insertRow,
    removeRow,
    renameRow,
  };
}
