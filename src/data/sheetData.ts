import {
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
  extraBlankPages: number;
};

export const DEFAULT_SHEET_DATA: SheetData = {
  title: DEFAULT_SHEET_TITLE,
  namesText: INITIAL_NAMES,
  nameColumnLabel: DEFAULT_NAME_COLUMN_LABEL,
  phoneColumnLabel: DEFAULT_PHONE_COLUMN_LABEL,
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
    typeof v.extraBlankPages === 'number'
  );
}

/** Validate and normalize imported / stored JSON into SheetData. */
export function parseSheetData(value: unknown): SheetData | null {
  if (!isSheetData(value)) {
    return null;
  }
  // Pick known fields only so removed keys (e.g. markColumnLabels) are dropped.
  return {
    title: value.title,
    namesText: value.namesText,
    nameColumnLabel: value.nameColumnLabel,
    phoneColumnLabel: value.phoneColumnLabel,
    extraBlankPages: Math.max(0, value.extraBlankPages),
  };
}

export function loadSheetData(): SheetData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) {
      return { ...DEFAULT_SHEET_DATA };
    }
    return parseSheetData(JSON.parse(raw) as unknown) ?? {
      ...DEFAULT_SHEET_DATA,
    };
  } catch {
    return { ...DEFAULT_SHEET_DATA };
  }
}

export function saveSheetData(data: SheetData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function sheetDataFilename(data: SheetData): string {
  const slug = data.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'check-in-sheet'}.json`;
}
