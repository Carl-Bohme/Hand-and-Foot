import { createClient } from "@/lib/supabase/server";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";
import { Trophy, Users, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";

async function HomeContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-16 max-w-3xl p-5 text-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Hand and Foot
            </h1>
            <p className="text-xl text-muted-foreground">
              The score keeper for your card games. Create a game, add rounds, and see who’s ahead.
            </p>
          </div>

          <ul className="grid gap-6 text-left sm:grid-cols-3">
            <li className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <WalletCards className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Track every round</p>
                <p className="text-sm text-muted-foreground">
                  Went out, perfect draw, red threes, books, and card values—all in one place.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">3 to 10 players</p>
                <p className="text-sm text-muted-foreground">
                  Start a game with any table size. Name your players and go.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Live standings</p>
                <p className="text-sm text-muted-foreground">
                  Totals and round breakdown so you always know who’s winning.
                </p>
              </div>
            </li>
          </ul>

          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <p className="text-muted-foreground">
                  Create a game or pick an existing one to keep score.
                </p>
                <div className="flex justify-center">
                  <Button asChild size="lg">
                    <Link href="/protected/games">Begin</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Sign in to create games and keep score.
                </p>
                <div className="flex justify-center gap-3">
                  <Button asChild size="lg">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/sign-up">Sign up</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 text-muted-foreground">
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-medium hover:underline text-foreground"
              rel="noreferrer"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-medium hover:underline text-foreground"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}

function HomeFallback() {
  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-16 max-w-3xl p-5 text-center">
          <div className="h-10 w-64 animate-pulse rounded bg-muted mx-auto" />
          <div className="h-6 w-96 animate-pulse rounded bg-muted mx-auto" />
          <div className="grid gap-6 text-left sm:grid-cols-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="h-10 w-48 animate-pulse rounded bg-muted mx-auto mt-8" />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
