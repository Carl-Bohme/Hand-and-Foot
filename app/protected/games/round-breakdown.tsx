"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { computeRoundScore } from "@/lib/game/scoring";
import type { GameWithRounds } from "@/app/actions/games";
import { AddRoundForm } from "./add-round-form";
import { Pencil, X } from "lucide-react";

export function RoundBreakdown({ game }: { game: GameWithRounds }) {
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);

  if (game.rounds.length === 0) return null;

  return (
    <div className="space-y-4">
      {game.rounds.map((round) => {
        const wentOutId = round.went_out_player_id;
        const isEditing = editingRoundId === round.id;

        return (
          <div
            key={round.id}
            className="rounded-lg border-2 border-muted bg-muted/30 p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 font-medium text-muted-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-bold">
                  {round.round_number}
                </span>
                Round {round.round_number}
              </p>
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="min-h-11 h-11 gap-1.5 touch-manipulation"
                  onClick={() => setEditingRoundId(round.id)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="min-h-11 h-11 gap-1.5 touch-manipulation"
                  onClick={() => setEditingRoundId(null)}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>

            {isEditing ? (
              <AddRoundForm
                game={game}
                round={round}
                onSuccess={() => setEditingRoundId(null)}
              />
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {round.round_scores.map((rs) => {
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
                  return (
                    <li
                      key={rs.id}
                      className="flex items-center justify-between rounded-md border bg-background/80 px-3 py-3 min-h-[48px] text-sm sm:min-h-0 sm:py-2"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-card-red" />
                        {rs.game_player.name}
                        {rs.game_player_id === wentOutId && (
                          <span className="shrink-0 rounded bg-game-felt px-1.5 py-0.5 text-xs font-medium text-game-felt">
                            out
                          </span>
                        )}
                      </span>
                      <span className="ml-2 shrink-0 font-mono font-semibold text-card-red">
                        {breakdown.total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
