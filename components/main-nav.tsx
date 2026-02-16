"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, WalletCards, BookOpen, ListTodo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Hand and Foot", icon: WalletCards },
  { href: "/how-to-play", label: "How to play", icon: BookOpen },
  { href: "/protected/games", label: "My games", icon: ListTodo },
] as const;

export function MainNav({
  rightSlot,
  className,
}: {
  rightSlot: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={cn(
        "w-full flex justify-center border-b border-b-foreground/10 h-14 sm:h-16",
        className
      )}
    >
      <div className="w-full max-w-5xl flex justify-between items-center gap-3 px-4 py-2 sm:px-5 text-sm">
        {/* Desktop: left links */}
        <div className="hidden md:flex gap-5 items-center font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "hover:underline",
                href === "/" ? "" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile: logo + hamburger */}
        <div className="flex md:hidden items-center gap-2 min-w-0">
          <Link
            href="/"
            className="font-semibold truncate hover:underline"
          >
            Hand and Foot
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-2rem,320px)] flex-col gap-6 px-4 pt-8 pb-6"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium hover:bg-muted transition-colors"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-3 border-t pt-4 [&_a]:flex [&_a]:h-11 [&_a]:w-full [&_a]:items-center [&_a]:justify-center [&_button]:min-h-11 [&_button]:w-full [&_button]:inline-flex [&_button]:items-center [&_button]:justify-center">
                {rightSlot}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: right slot (auth + theme) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {rightSlot}
        </div>
      </div>
    </nav>
  );
}
