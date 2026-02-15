"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/app/actions/games";
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
import { Gamepad2, Users, PenLine } from "lucide-react";

const PLAYER_COUNTS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export function CreateGameForm() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    Array.from({ length: 4 }, (_, i) => `Player ${i + 1}`)
  );
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCount = (n: number) => {
    setPlayerCount(n);
    setPlayerNames((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push(`Player ${next.length + 1}`);
      return next;
    });
  };

  const setPlayerName = (index: number, value: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { gameId } = await createGame({
        name: gameName.trim() || undefined,
        playerCount,
        playerNames,
      });
      router.push(`/protected/games/${gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="game-name" className="flex items-center gap-2 text-muted-foreground">
          <PenLine className="h-4 w-4" />
          Game name (optional)
        </Label>
        <Input
          id="game-name"
          placeholder="e.g. Friday night"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="min-h-12 h-12 text-base border-2 border-muted-foreground/20 focus:border-card-red/50 touch-manipulation"
        />
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          Number of players
        </Label>
        <Select
          value={String(playerCount)}
          onValueChange={(v) => updateCount(Number(v))}
        >
          <SelectTrigger className="h-12 min-h-12 w-full border-2 border-muted-foreground/20 focus:border-card-red/50 touch-manipulation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLAYER_COUNTS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} players
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-muted-foreground">
          <Gamepad2 className="h-4 w-4" />
          Player names
        </Label>
        <div className="grid gap-2">
          {playerNames.map((name, i) => (
            <Input
              key={i}
              placeholder={`Player ${i + 1}`}
              value={name}
              onChange={(e) => setPlayerName(i, e.target.value)}
              className="min-h-12 h-12 text-base border-2 border-muted-foreground/20 focus:border-card-red/50 touch-manipulation"
            />
          ))}
        </div>
      </div>
      {error && (
        <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="h-12 min-h-12 w-full bg-game-felt text-game-felt hover:opacity-90 text-base font-medium touch-manipulation"
      >
        {loading ? "Creating…" : "Create game"}
      </Button>
    </form>
  );
}
