/**
 * Hand and Foot scoring (standard variant).
 * Structured so extra variants (e.g. wildcard books) can be added later.
 */

const POINTS = {
  wentOut: 300,
  perfectDraw: 100,
  redThree: 100,
  cleanBook: 500,
  dirtyBook: 300,
  // Future: wildcardBook: 1500,
} as const;

export interface RoundScoreInput {
  perfect_draw: boolean;
  red_threes: number;
  clean_books: number;
  dirty_books: number;
  played_card_value: number;
}

export interface RoundScoreBreakdown {
  wentOut: number;
  perfectDraw: number;
  redThrees: number;
  cleanBooks: number;
  dirtyBooks: number;
  playedCardValue: number;
  total: number;
}

/** Compute points for one player in one round. */
export function computeRoundScore(
  input: RoundScoreInput,
  wentOut: boolean,
  _variant: string = "standard"
): RoundScoreBreakdown {
  const wentOutPts = wentOut ? POINTS.wentOut : 0;
  const perfectDrawPts = input.perfect_draw ? POINTS.perfectDraw : 0;
  const redThreesPts = input.red_threes * POINTS.redThree;
  const cleanBooksPts = input.clean_books * POINTS.cleanBook;
  const dirtyBooksPts = input.dirty_books * POINTS.dirtyBook;

  const total =
    wentOutPts +
    perfectDrawPts +
    redThreesPts +
    cleanBooksPts +
    dirtyBooksPts +
    input.played_card_value;

  return {
    wentOut: wentOutPts,
    perfectDraw: perfectDrawPts,
    redThrees: redThreesPts,
    cleanBooks: cleanBooksPts,
    dirtyBooks: dirtyBooksPts,
    playedCardValue: input.played_card_value,
    total,
  };
}

export { POINTS };
