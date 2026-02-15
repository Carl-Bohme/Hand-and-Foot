// Database row types (match Supabase schema)

export type GameVariant = "standard";

export interface Game {
  id: string;
  user_id: string;
  name: string | null;
  variant: GameVariant;
  created_at: string;
  updated_at: string;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  position: number;
  name: string;
}

export interface Round {
  id: string;
  game_id: string;
  round_number: number;
  went_out_player_id: string | null;
  created_at: string;
}

export interface RoundScore {
  id: string;
  round_id: string;
  game_player_id: string;
  perfect_draw: boolean;
  red_threes: number;
  clean_books: number;
  dirty_books: number;
  played_card_value: number;
}

// Input types for creating/updating
export interface InsertGame {
  user_id: string;
  name?: string | null;
  variant?: GameVariant;
}

export interface InsertGamePlayer {
  game_id: string;
  position: number;
  name: string;
}

export interface InsertRound {
  game_id: string;
  round_number: number;
  went_out_player_id?: string | null;
}

export interface InsertRoundScore {
  round_id: string;
  game_player_id: string;
  perfect_draw: boolean;
  red_threes: number;
  clean_books: number;
  dirty_books: number;
  played_card_value: number;
}
