import { useAuth } from "@clerk/expo";
import { useEffect, useRef } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";

/**
 * Keep one Supabase client for the lifetime of the mounted Clerk session.
 * The token getter is updated through a ref so changing Clerk's getToken
 * function does not create a new client and retrigger every dependent effect.
 */
export function useSupabase() {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const clientRef = useRef<ReturnType<typeof createClerkSupabaseClient> | null>(
    null,
  );

  if (!clientRef.current) {
    clientRef.current = createClerkSupabaseClient(() => getTokenRef.current());
  }

  return clientRef.current;
}
