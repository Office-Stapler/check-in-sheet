import type { Participant } from '../data/names';

export type SortMode = 'chinese-first' | 'english-first' | 'original'

const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF]/;
const LATIN_RE = /[A-Za-z]/;

/** Classify by the first letter-like character in the name. */
export function nameScript(name: string): 'chinese' | 'english' | 'other' {
  for (const char of name) {
    if (CJK_RE.test(char)) {return 'chinese';}
    if (LATIN_RE.test(char)) {return 'english';}
  }
  return 'other';
}

function scriptRank(script: ReturnType<typeof nameScript>, mode: SortMode): number {
  if (mode === 'original') {return 0;}
  if (mode === 'chinese-first') {
    if (script === 'chinese') {return 0;}
    if (script === 'english') {return 1;}
    return 2;
  }
  // english-first
  if (script === 'english') {return 0;}
  if (script === 'chinese') {return 1;}
  return 2;
}

function compareWithinScript(a: string, b: string, script: ReturnType<typeof nameScript>) {
  if (script === 'chinese') {
    return a.localeCompare(b, 'zh-Hant');
  }
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}

export function sortParticipants(
  participants: Participant[],
  mode: SortMode,
): Participant[] {
  if (mode === 'original') {return [...participants];}

  return [...participants].sort((a, b) => {
    const scriptA = nameScript(a.name);
    const scriptB = nameScript(b.name);
    const rankDiff = scriptRank(scriptA, mode) - scriptRank(scriptB, mode);
    if (rankDiff !== 0) {return rankDiff;}
    return compareWithinScript(a.name, b.name, scriptA);
  });
}
