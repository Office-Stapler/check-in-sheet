export type Participant = {
  id: string
  name: string
}

export const INITIAL_NAMES = [].join('\n');

/** Keep blank lines as empty rows; drop only trailing empties. */
export function namesTextToParticipants(text: string): Participant[] {
  const lines = text.split(/\r?\n/);
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }
  return lines.map((line, index) => ({
    id: String(index),
    name: line.trim(),
  }));
}

export function participantsToNamesText(participants: Participant[]): string {
  return participants.map((p) => p.name).join('\n');
}

export const DEFAULT_SHEET_TITLE = 'Sheet title';

/** Blank session columns for handwritten check-in marks. */
export const CHECK_IN_COLUMNS = 7;

