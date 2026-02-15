import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameWithRounds } from "@/app/actions/games";
import type { GamePlayer } from "@/lib/db/types";

export type StandingRow = { player: GamePlayer; total: number };

export function Standings({
  standings,
  game,
}: {
  standings: StandingRow[];
  game: GameWithRounds;
}) {
  if (standings.length === 0) {
    return (
      <Card className="overflow-hidden border-2 border-game-felt/30 bg-gradient-to-br from-muted/50 to-muted">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-game-felt text-game-felt">
              <Trophy className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">Standings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-6">
            <Trophy className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Add a round to see totals.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden border-2 border-game-felt/30 bg-gradient-to-br from-muted/50 to-muted">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-game-felt text-game-felt">
            <Trophy className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">Standings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-0">
          {standings.map((s, i) => (
            <li
              key={s.player.id}
              className={cn(
                "flex items-center justify-between gap-4 px-4 py-3 min-h-[52px] sm:min-h-0 transition-colors",
                i === 0 && "rounded-t-lg bg-game-gold/15 dark:bg-game-gold/20",
                i === 1 && standings.length > 1 && "bg-game-silver/10 dark:bg-game-silver/15",
                i === 2 && standings.length > 2 && "bg-game-bronze/10 dark:bg-game-bronze/15",
                i > 2 && "bg-background/50",
                i < standings.length - 1 && "border-b border-border/80"
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow",
                    i === 0 && "bg-game-gold",
                    i === 1 && "bg-game-silver",
                    i === 2 && "bg-game-bronze",
                    i > 2 && "bg-muted-foreground/30"
                  )}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{s.player.name}</span>
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums text-card-red dark:text-card-red">
                {s.total}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
