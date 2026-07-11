import {
  CHECK_IN_COLUMNS,
  DEFAULT_NAME_COLUMN_LABEL,
  DEFAULT_PHONE_COLUMN_LABEL,
  DEFAULT_SHEET_TITLE,
  INITIAL_NAMES,
} from './names';

/** Persisted sheet configuration — add fields here to extend Sheet data. */
export type SheetData = {
  title: string;
  namesText: string;
  nameColumnLabel: string;
  phoneColumnLabel: string;
  markColumnLabels: string[];
  extraBlankPages: number;
};

export const DEFAULT_SHEET_DATA: SheetData = {
  title: DEFAULT_SHEET_TITLE,
  namesText: INITIAL_NAMES,
  nameColumnLabel: DEFAULT_NAME_COLUMN_LABEL,
  phoneColumnLabel: DEFAULT_PHONE_COLUMN_LABEL,
  markColumnLabels: Array.from({ length: CHECK_IN_COLUMNS }, () => ''),
  extraBlankPages: 0,
};

const STORAGE_KEY = 'check-in-sheet-data';

function isSheetData(value: unknown): value is SheetData {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.title === 'string' &&
    typeof v.namesText === 'string' &&
    typeof v.nameColumnLabel === 'string' &&
    typeof v.phoneColumnLabel === 'string' &&
    Array.isArray(v.markColumnLabels) &&
    typeof v.extraBlankPages === 'number'
  );
}

function normalizeMarkLabels(labels: unknown): string[] {
  const defaults = DEFAULT_SHEET_DATA.markColumnLabels;
  if (!Array.isArray(labels)) {
    return [...defaults];
  }
  return defaults.map((_, i) =>
    typeof labels[i] === 'string' ? labels[i] : '',
  );
}

export function loadSheetData(): SheetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) {
      return { ...DEFAULT_SHEET_DATA };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!isSheetData(parsed)) {
      return { ...DEFAULT_SHEET_DATA };
    }
    return {
      ...DEFAULT_SHEET_DATA,
      ...parsed,
      markColumnLabels: normalizeMarkLabels(parsed.markColumnLabels),
      extraBlankPages: Math.max(0, parsed.extraBlankPages),
    };
  } catch {
    return { ...DEFAULT_SHEET_DATA };
  }
}

export function saveSheetData(data: SheetData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
