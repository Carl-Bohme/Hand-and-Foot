"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";
import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={logout} disabled={loading}>
      {loading ? "Logging out…" : "Logout"}
    </Button>
  );
}
