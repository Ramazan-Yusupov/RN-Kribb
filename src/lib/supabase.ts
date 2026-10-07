import { createClient } from "@supabase/supabase-js";

function requireEnvironmentVariable(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = requireEnvironmentVariable(
  "EXPO_PUBLIC_SUPABASE_URL",
  process.env.EXPO_PUBLIC_SUPABASE_URL,
);
const supabaseAnonKey = requireEnvironmentVariable(
  "EXPO_PUBLIC_SUPABASE_KEY",
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>,
) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken();
    },
  });
}
