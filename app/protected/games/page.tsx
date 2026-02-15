import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GamesList } from "./games-list";
import { CreateGameForm } from "./create-game-form";
import { WalletCards, PlusCircle, ListTodo } from "lucide-react";

function GamesPageFallback() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}

async function GamesPageContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-game-felt text-game-felt shadow-md">
          <WalletCards className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hand and Foot</h1>
          <p className="text-muted-foreground mt-0.5">
            Create a game or pick an existing one to keep score.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-2 border-card-red/20 bg-card shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card-red/10 text-card-red">
                <PlusCircle className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">New game</CardTitle>
            </div>
            <CardDescription>
              Set number of players (3–10) and names, then start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateGameForm />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-2 border-card-black/20 bg-card shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card-black/10 text-card-black dark:bg-card-black/30 dark:text-card-black">
                <ListTodo className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Existing games</CardTitle>
            </div>
            <CardDescription>
              Open a game to add rounds and view standings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GamesList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <Suspense fallback={<GamesPageFallback />}>
      <GamesPageContent />
    </Suspense>
  );
}
