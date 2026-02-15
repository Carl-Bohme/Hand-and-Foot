import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "How to play Hand and Foot",
  description: "Rules and scoring for Hand and Foot card game.",
};

export default function HowToPlayPage() {
  return (
    <main className="flex-1 w-full flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-12 items-center max-w-3xl p-5 pb-16">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How to play Hand and Foot
          </h1>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is Hand and Foot?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                Hand and Foot is a matching and melding card game that is a variation of Rummy and
                Canasta. It is typically played with four players in partnerships of two, but can
                be adapted for two to six players. The game involves skill, strategy, and a bit of
                luck.
              </p>
              <p>
                Players begin with 11 cards from their <strong>Hand</strong>. Once all Hand cards
                are played, they pick up and play their second set of 11 cards, called their{" "}
                <strong>Foot</strong>. Players form <strong>melds</strong> (3 or more cards of the
                same rank). On a turn, a player can play a meld face up; their partner (the player
                across from them) can also play on that meld. A player can add to their team’s melds
                until there are seven cards in the meld—a <strong>book</strong>. Teams gain points
                for melds and lose points for cards left in hand at the end of the round. The goal
                is to have the most points when one player goes out.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The objective</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Form melds, accumulate points over multiple rounds, and have the team with the most
              points at the end of the agreed-upon number of rounds.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The cards and their values</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>In Hand and Foot, 3s, Deuces and Jokers are treated specially. Card values are:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Red 3s</strong> (hearts or diamonds) = 100 points each. They are played
                  individually. When you draw a red 3, place it face up by your melds and draw
                  another card.
                </li>
                <li>
                  <strong>Black 3s</strong> (clubs or spades) cannot be used in melds and can only
                  be discarded. Discarding a black 3 forces the next player to draw 2 cards (they
                  cannot take from the discard pile).
                </li>
                <li>
                  <strong>Wild cards:</strong> Jokers and Deuces (2s) may be used in melds, but
                  there must be <em>more</em> rank cards than wild cards in each meld.
                </li>
              </ul>
              <p className="font-medium">Point values:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Jokers = 50 points</li>
                <li>Deuces = 20 points</li>
                <li>Aces = 20 points</li>
                <li>8 through King = 10 points</li>
                <li>4 through 7 = 5 points</li>
                <li>Red 3s = 100 points</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The deal</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>Shuffle thoroughly. The dealer gives each player <strong>2 sets of 11 cards</strong>.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The first set is the <strong>Hand</strong>—players may look at it.</li>
                <li>The second set is the <strong>Foot</strong>—it stays face down until the Hand
                  has been played.</li>
                <li>The remaining cards form the <strong>stock</strong> (face down). The top card
                  is turned up to start the <strong>discard pile</strong>.</li>
                <li>If that card is a wild (Deuce or Joker) or a 3, put it back and turn the next
                  card instead.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The play</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>Play goes clockwise from the dealer’s left. On each turn a player:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Draws two cards</strong> from the stock, then may play meld(s); or
                </li>
                <li>
                  <strong>Picks up the last 7 cards</strong> from the discard pile (if the top
                  card is not a black 3). The player must have at least 2 cards in hand of the same
                  rank as the top card and must make a meld with that top card in the same turn.
                </li>
              </ul>
              <p>A turn ends when the player <strong>discards one card</strong>.</p>
              <p className="font-medium">Minimum meld to lay down (by round):</p>
              <ul className="list-disc pl-5">
                <li>Round 1: at least 50 points</li>
                <li>Round 2: at least 90 points</li>
                <li>Round 3: at least 120 points</li>
                <li>Round 4: at least 150 points</li>
              </ul>
              <p>Once a player has laid their first meld(s), their partner may play without meeting
                that round’s minimum.</p>
              <p className="font-medium pt-2">Books</p>
              <p>When a meld has <strong>seven cards</strong>, it is a <strong>book</strong>:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Clean book</strong> (red book): no wild cards. Worth <strong>500
                  points</strong>.
                </li>
                <li>
                  <strong>Dirty book</strong> (black book): contains wild cards. Worth{" "}
                  <strong>300 points</strong>.
                </li>
              </ul>
              <p>Complete books are stacked with a red card on top for clean, black for dirty.</p>
              <p>To end the round for everyone, one player must have at least 1 clean book, 1 dirty
                book, and discard their last card from their Foot.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The score</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>At the end of the round, add points for:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Clean book = 500</li>
                <li>Dirty book = 300</li>
                <li>Red 3 = 100 each</li>
                <li>Melds with fewer than 7 cards = use the card values above</li>
                <li>Bonus for the player/team who went out (often 100–300 points, depending on
                  house rules)</li>
              </ul>
              <p>Then <strong>subtract</strong> points for any cards left in Hand and Foot, using
                the same card values.</p>
              <p className="text-muted-foreground pt-2">
                This scorekeeper uses: went out = 300, perfect draw = 100, red 3s = 100 each, clean
                book = 500, dirty book = 300, plus the value of cards played.
              </p>
            </CardContent>
          </Card>
        </div>

        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
