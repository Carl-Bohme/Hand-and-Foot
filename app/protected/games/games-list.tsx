import Link from "next/link";
import { getGames } from "@/app/actions/games";
import { Button } from "@/components/ui/button";
import { WalletCards, Calendar } from "lucide-react";

export async function GamesList() {
  const games = await getGames();
  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 py-8 px-4 text-center">
        <WalletCards className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No games yet.</p>
        <p className="text-xs text-muted-foreground">Create one in the panel to the left.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {games.map((g) => (
        <li key={g.id}>
          <Button
            variant="outline"
            className="h-auto w-full justify-start gap-3 py-3 text-left font-normal hover:border-card-red/40 hover:bg-card-red/5"
            asChild
          >
            <Link href={`/protected/games/${g.id}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <WalletCards className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="min-w-0 flex-1 truncate">
                {g.name || `Game ${new Date(g.created_at).toLocaleDateString()}`}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(g.created_at).toLocaleDateString()}
              </span>
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
