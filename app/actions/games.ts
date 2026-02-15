"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Game,
  GamePlayer,
  Round,
  RoundScore,
  InsertGame,
  InsertGamePlayer,
  InsertRound,
  InsertRoundScore,
} from "@/lib/db/types";

export type GameWithPlayers = Game & { game_players: GamePlayer[] };
export type RoundWithScores = Round & {
  round_scores: (RoundScore & { game_player: GamePlayer })[];
};
export type GameWithRounds = GameWithPlayers & {
  rounds: RoundWithScores[];
};

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user.id;
}

export async function getGames(): Promise<Game[]> {
  const userId = await requireUserId();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Game[];
}

export async function getGameWithRounds(gameId: string): Promise<GameWithRounds | null> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", userId)
    .single();
  if (gameError || !game) return null;

  const { data: players, error: playersError } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId)
    .order("position");
  if (playersError) throw new Error(playersError.message);

  const { data: rounds, error: roundsError } = await supabase
    .from("rounds")
    .select("*")
    .eq("game_id", gameId)
    .order("round_number");
  if (roundsError) throw new Error(roundsError.message);

  const roundsList = (rounds ?? []) as Round[];
  const playersList = (players ?? []) as GamePlayer[];

  let scoresRaw: RoundScore[] = [];
  if (roundsList.length > 0) {
    const { data } = await supabase
      .from("round_scores")
      .select("*")
      .in("round_id", roundsList.map((r) => r.id));
    scoresRaw = (data ?? []) as RoundScore[];
  }

  const scoresByRound = new Map<string, (RoundScore & { game_player: GamePlayer })[]>();
  for (const s of scoresRaw) {
    const player = playersList.find((p) => p.id === s.game_player_id);
    if (!player) continue;
    const list = scoresByRound.get(s.round_id) ?? [];
    list.push({ ...s, game_player: player });
    scoresByRound.set(s.round_id, list);
  }

  const roundsWithScores: RoundWithScores[] = roundsList.map((r) => ({
    ...r,
    round_scores: (scoresByRound.get(r.id) ?? []).sort(
      (a, b) => a.game_player.position - b.game_player.position
    ),
  }));

  return {
    ...(game as Game),
    game_players: playersList,
    rounds: roundsWithScores,
  };
}

export async function createGame(params: {
  name?: string;
  playerCount: number;
  playerNames: string[];
}): Promise<{ gameId: string }> {
  const userId = await requireUserId();
  const supabase = await createClient();

  const count = Math.min(10, Math.max(3, params.playerCount));
  const names = params.playerNames.slice(0, count);
  if (names.length !== count) throw new Error("Player names required for each position.");

  const insertGame: InsertGame = {
    user_id: userId,
    name: params.name ?? null,
    variant: "standard",
  };
  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert(insertGame)
    .select("id")
    .single();
  if (gameError || !game) throw new Error(gameError?.message ?? "Failed to create game");

  const playerRows: InsertGamePlayer[] = names.map((name, i) => ({
    game_id: game.id,
    position: i + 1,
    name: name.trim() || `Player ${i + 1}`,
  }));
  const { error: playersError } = await supabase.from("game_players").insert(playerRows);
  if (playersError) throw new Error(playersError.message);

  return { gameId: game.id };
}

export async function addRound(
  gameId: string,
  wentOutPlayerId: string,
  scores: {
    game_player_id: string;
    perfect_draw: boolean;
    red_threes: number;
    clean_books: number;
    dirty_books: number;
    played_card_value: number;
  }[]
): Promise<void> {
  await requireUserId();
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .single();
  if (!game) throw new Error("Game not found");

  const { count } = await supabase
    .from("rounds")
    .select("*", { count: "exact", head: true })
    .eq("game_id", gameId);
  const roundNumber = (count ?? 0) + 1;

  const insertRound: InsertRound = {
    game_id: gameId,
    round_number: roundNumber,
    went_out_player_id: wentOutPlayerId,
  };
  const { data: round, error: roundError } = await supabase
    .from("rounds")
    .insert(insertRound)
    .select("id")
    .single();
  if (roundError || !round) throw new Error(roundError?.message ?? "Failed to create round");

  const scoreRows: InsertRoundScore[] = scores.map((s) => ({
    round_id: round.id,
    game_player_id: s.game_player_id,
    perfect_draw: s.perfect_draw,
    red_threes: s.red_threes,
    clean_books: s.clean_books,
    dirty_books: s.dirty_books,
    played_card_value: s.played_card_value,
  }));
  const { error: scoresError } = await supabase.from("round_scores").insert(scoreRows);
  if (scoresError) throw new Error(scoresError.message);

  await supabase
    .from("games")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", gameId);
}

export async function updateRound(
  roundId: string,
  gameId: string,
  wentOutPlayerId: string,
  scores: {
    game_player_id: string;
    perfect_draw: boolean;
    red_threes: number;
    clean_books: number;
    dirty_books: number;
    played_card_value: number;
  }[]
): Promise<void> {
  await requireUserId();
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("id", gameId)
    .single();
  if (!game) throw new Error("Game not found");

  const { data: round, error: roundError } = await supabase
    .from("rounds")
    .select("id")
    .eq("id", roundId)
    .eq("game_id", gameId)
    .single();
  if (roundError || !round) throw new Error("Round not found");

  await supabase
    .from("rounds")
    .update({ went_out_player_id: wentOutPlayerId })
    .eq("id", roundId);

  await supabase.from("round_scores").delete().eq("round_id", roundId);

  const scoreRows: InsertRoundScore[] = scores.map((s) => ({
    round_id: roundId,
    game_player_id: s.game_player_id,
    perfect_draw: s.perfect_draw,
    red_threes: s.red_threes,
    clean_books: s.clean_books,
    dirty_books: s.dirty_books,
    played_card_value: s.played_card_value,
  }));
  const { error: scoresError } = await supabase.from("round_scores").insert(scoreRows);
  if (scoresError) throw new Error(scoresError.message);

  await supabase
    .from("games")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", gameId);
}
