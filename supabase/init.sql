-- Hand and Foot scorekeeping app
-- Run this in the Supabase SQL editor to create tables and RLS.

-- Game instance (owned by authenticated user)
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  variant text not null default 'standard' check (variant in ('standard')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Players in a game (by position, 3-10)
create table if not exists public.game_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  position smallint not null check (position >= 1 and position <= 10),
  name text not null,
  unique (game_id, position)
);

-- Rounds within a game
create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  round_number int not null check (round_number >= 1),
  went_out_player_id uuid references public.game_players(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (game_id, round_number)
);

-- Per-player score breakdown for one round (one row per player per round)
create table if not exists public.round_scores (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  game_player_id uuid not null references public.game_players(id) on delete cascade,
  perfect_draw boolean not null default false,
  red_threes int not null default 0 check (red_threes >= 0),
  clean_books int not null default 0 check (clean_books >= 0),
  dirty_books int not null default 0 check (dirty_books >= 0),
  played_card_value int not null default 0 check (played_card_value >= 0),
  -- For future variants, e.g. wildcard_books (1500 pts each)
  -- wildcard_books int not null default 0,
  unique (round_id, game_player_id)
);

-- Indexes for common queries
create index if not exists idx_games_user_id on public.games(user_id);
create index if not exists idx_game_players_game_id on public.game_players(game_id);
create index if not exists idx_rounds_game_id on public.rounds(game_id);
create index if not exists idx_round_scores_round_id on public.round_scores(round_id);

-- RLS: users can only access their own games (and related rows via FK)
alter table public.games enable row level security;
alter table public.game_players enable row level security;
alter table public.rounds enable row level security;
alter table public.round_scores enable row level security;

create policy "Users can manage own games"
  on public.games for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage players of own games"
  on public.game_players for all
  using (
    exists (
      select 1 from public.games g
      where g.id = game_players.game_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.games g
      where g.id = game_players.game_id and g.user_id = auth.uid()
    )
  );

create policy "Users can manage rounds of own games"
  on public.rounds for all
  using (
    exists (
      select 1 from public.games g
      where g.id = rounds.game_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.games g
      where g.id = rounds.game_id and g.user_id = auth.uid()
    )
  );

create policy "Users can manage round_scores of own games"
  on public.round_scores for all
  using (
    exists (
      select 1 from public.rounds r
      join public.games g on g.id = r.game_id
      where r.id = round_scores.round_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.rounds r
      join public.games g on g.id = r.game_id
      where r.id = round_scores.round_id and g.user_id = auth.uid()
    )
  );
