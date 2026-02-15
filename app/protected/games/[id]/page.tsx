import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { getGameWithRounds } from "@/app/actions/games";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { computeRoundScore } from "@/lib/game/scoring";
import { AddRoundForm } from "../add-round-form";
import { Standings } from "../standings";
import { RoundBreakdown } from "../round-breakdown";
import { ArrowLeft, WalletCards, Users, ListOrdered } from "lucide-react";

function GamePageFallback() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="h-12 w-32 animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

async function GamePageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameWithRounds(id);
  if (!game) notFound();

  const totalsByPlayerId = new Map<string, number>();
  for (const p of game.game_players) {
    totalsByPlayerId.set(p.id, 0);
  }
  for (const round of game.rounds) {
    const wentOutId = round.went_out_player_id ?? null;
    for (const rs of round.round_scores) {
      const breakdown = computeRoundScore(
        {
          perfect_draw: rs.perfect_draw,
          red_threes: rs.red_threes,
          clean_books: rs.clean_books,
          dirty_books: rs.dirty_books,
          played_card_value: rs.played_card_value,
        },
        rs.game_player_id === wentOutId
      );
      const prev = totalsByPlayerId.get(rs.game_player_id) ?? 0;
      totalsByPlayerId.set(rs.game_player_id, prev + breakdown.total);
    }
  }

  const standings = game.game_players
    .map((p) => ({
      player: p,
      total: totalsByPlayerId.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 pb-[calc(3rem+2rem+max(1rem,env(safe-area-inset-bottom)))] sm:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-game-felt text-game-felt shadow-md sm:h-12 sm:w-12">
            <WalletCards className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              {game.name || `Game ${new Date(game.created_at).toLocaleDateString()}`}
            </h1>
            <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {game.game_players.length} players
              <span className="text-border">·</span>
              <ListOrdered className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {game.rounds.length} round{game.rounds.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button variant="outline" size="default" className="h-11 min-h-11 w-full touch-manipulation sm:w-auto sm:shrink-0 gap-2" asChild>
          <Link href="/protected/games">
            <ArrowLeft className="h-4 w-4" />
            Games
          </Link>
        </Button>
      </div>

      <Standings standings={standings} game={game} />

      <Card className="overflow-hidden border-2 border-card-red/20 bg-card">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">
            Round {game.rounds.length + 1}
          </CardTitle>
          <CardDescription className="text-sm">
            Who went out, then each player’s scores: perfect draw, red threes, clean books, dirty
            books, and total played card value.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <AddRoundForm game={game} />
        </CardContent>
      </Card>

      {game.rounds.length > 0 && (
        <Card className="overflow-hidden border-2 border-card-black/20">
          <CardHeader className="pb-2 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card-black/10 text-card-black dark:bg-card-black/30">
                <ListOrdered className="h-4 w-4" />
              </span>
              Round breakdown
            </CardTitle>
            <CardDescription className="text-sm">Points per round per player. Tap Edit to change a round.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <RoundBreakdown game={game} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<GamePageFallback />}>
      <GamePageContent params={params} />
    </Suspense>
  );
}
