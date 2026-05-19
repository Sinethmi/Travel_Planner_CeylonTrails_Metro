"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Destination } from "@/lib/srilanka";
import { subscribeAllDestinations } from "@/lib/destinations";

interface DestinationsCtx {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
}

const Ctx = createContext<DestinationsCtx>({
  destinations: [],
  loading: true,
  error: null,
});

export function DestinationsProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAllDestinations(
      (nextDestinations) => {
        setDestinations(nextDestinations);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load destinations");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <Ctx.Provider value={{ destinations, loading, error }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDestinations(): DestinationsCtx {
  return useContext(Ctx);
}
