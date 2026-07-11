/** ISO A4 portrait width in millimetres. */
export const A4_WIDTH_MM = 210;

/** ISO A4 portrait height in millimetres. */
export const A4_HEIGHT_MM = 297;

/**
 * How many data rows fit on one A4 sheet with the current title, margins,
 * and row height. Chunking uses this so each page matches A4_WIDTH_MM × A4_HEIGHT_MM.
 */
export const ROWS_PER_PAGE = 24;
