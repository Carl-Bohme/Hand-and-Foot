"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRound, updateRound } from "@/app/actions/games";
import type { GameWithRounds, RoundWithScores } from "@/app/actions/games";
import type { GamePlayer } from "@/lib/db/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Star,
  BookOpen,
  Hash,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PlayerRoundInput = {
  perfect_draw: boolean;
  red_threes: number;
  clean_books: number;
  dirty_books: number;
  played_card_value: number;
};

function getInitialScores(
  players: GamePlayer[],
  round?: RoundWithScores
): Record<string, PlayerRoundInput> {
  const init: Record<string, PlayerRoundInput> = {};
  for (const p of players) {
    const existing = round?.round_scores.find((rs) => rs.game_player_id === p.id);
    init[p.id] = existing
      ? {
          perfect_draw: existing.perfect_draw,
          red_threes: existing.red_threes,
          clean_books: existing.clean_books,
          dirty_books: existing.dirty_books,
          played_card_value: existing.played_card_value,
        }
      : {
          perfect_draw: false,
          red_threes: 0,
          clean_books: 0,
          dirty_books: 0,
          played_card_value: 0,
        };
  }
  return init;
}

export function AddRoundForm({
  game,
  round: editRound,
  onSuccess,
}: {
  game: GameWithRounds;
  round?: RoundWithScores;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const players = game.game_players;
  const [wentOutPlayerId, setWentOutPlayerId] = useState<string>(
    editRound?.went_out_player_id ?? players[0]?.id ?? ""
  );
  const [scores, setScores] = useState<Record<string, PlayerRoundInput>>(() =>
    getInitialScores(players, editRound)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateScore = (
    playerId: string,
    field: keyof PlayerRoundInput,
    value: boolean | number
  ) => {
    setScores((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const scorePayload = players.map((p) => ({
        game_player_id: p.id,
        ...scores[p.id],
      }));
      if (editRound) {
        await updateRound(editRound.id, game.id, wentOutPlayerId, scorePayload);
      } else {
        await addRound(game.id, wentOutPlayerId, scorePayload);
      }
      router.refresh();
      if (!editRound) {
        setScores((prev) => {
          const next: Record<string, PlayerRoundInput> = {};
          for (const p of players) {
            next[p.id] = {
              perfect_draw: false,
              red_threes: 0,
              clean_books: 0,
              dirty_books: 0,
              played_card_value: 0,
            };
          }
          return next;
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24 sm:pb-0">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base font-medium">
          <LogOut className="h-4 w-4 text-card-red" />
          Who went out?
        </Label>
        <Select value={wentOutPlayerId} onValueChange={setWentOutPlayerId}>
          <SelectTrigger className="h-12 w-full min-h-[48px] border-2 border-card-red/30 focus:border-card-red sm:max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {players.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {p.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> 100
          </span>
          <span className="flex items-center gap-1">
            <span className="flex h-5 w-5 items-center justify-center rounded font-mono text-sm font-bold text-card-red">
              3
            </span>{" "}
            100 ea
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-card-red" /> 500
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-card-black" /> 300
          </span>
          <span className="flex items-center gap-1">
            <Hash className="h-3.5 w-3.5" /> card value
          </span>
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((p, idx) => (
            <Card
              key={p.id}
              className={cn(
                "overflow-hidden transition-shadow hover:shadow-md",
                p.id === wentOutPlayerId
                  ? "border-2 border-game-felt ring-2 ring-game-felt/20"
                  : "border-2 border-muted"
              )}
            >
              <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/30 p-0 px-4 py-3 min-h-[52px]">
                <CardTitle className="min-w-0 flex-1 truncate text-base">{p.name}</CardTitle>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                    idx % 2 === 0 ? "bg-card-red" : "bg-card-black"
                  )}
                >
                  {idx + 1}
                </span>
                {p.id === wentOutPlayerId && (
                  <span className="shrink-0 rounded bg-game-felt px-2 py-0.5 text-xs font-medium text-game-felt">
                    went out
                  </span>
                )}
              </CardHeader>
              <CardContent className="space-y-3 px-4 pt-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={scores[p.id]?.perfect_draw ?? false}
                    id={`perfect-${p.id}`}
                    onClick={() =>
                      updateScore(p.id, "perfect_draw", !(scores[p.id]?.perfect_draw ?? false))
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        scores[p.id]?.perfect_draw
                          ? "fill-amber-400 stroke-amber-500 text-amber-500"
                          : "fill-none stroke-amber-500/70 text-amber-500/70"
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                  <Label
                    htmlFor={`perfect-${p.id}`}
                    className="flex cursor-pointer items-center gap-1.5 text-sm font-normal flex-1 min-h-[48px] items-center"
                  >
                    Perfect draw
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`red-${p.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <span className="flex h-4 w-4 items-center justify-center font-mono text-xs font-bold text-card-red">
                        3
                      </span>
                      Red 3s
                    </Label>
                    <Input
                      id={`red-${p.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="min-h-12 h-12 text-base border-muted-foreground/30 touch-manipulation"
                      value={scores[p.id]?.red_threes ?? 0}
                      onChange={(e) =>
                        updateScore(p.id, "red_threes", parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`clean-${p.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <BookOpen className="h-3 w-3 text-card-red" />
                      Clean
                    </Label>
                    <Input
                      id={`clean-${p.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="min-h-12 h-12 text-base border-muted-foreground/30 touch-manipulation"
                      value={scores[p.id]?.clean_books ?? 0}
                      onChange={(e) =>
                        updateScore(p.id, "clean_books", parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`dirty-${p.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <BookOpen className="h-3 w-3 text-card-black" />
                      Dirty
                    </Label>
                    <Input
                      id={`dirty-${p.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="min-h-12 h-12 text-base border-muted-foreground/30 touch-manipulation"
                      value={scores[p.id]?.dirty_books ?? 0}
                      onChange={(e) =>
                        updateScore(p.id, "dirty_books", parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`value-${p.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <Hash className="h-3 w-3" />
                      Card value
                    </Label>
                    <Input
                      id={`value-${p.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className="min-h-12 h-12 text-base border-muted-foreground/30 touch-manipulation"
                      value={scores[p.id]?.played_card_value ?? 0}
                      onChange={(e) =>
                        updateScore(
                          p.id,
                          "played_card_value",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full min-h-12 bg-game-felt text-game-felt hover:opacity-90 text-base font-medium touch-manipulation sm:w-auto sm:min-w-[160px]"
        >
          {loading
            ? editRound
              ? "Updating…"
              : "Saving…"
            : editRound
              ? "Update round"
              : "Save round"}
        </Button>
      </div>
    </form>
  );
}
