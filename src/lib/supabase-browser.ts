import { createBrowserClient } from "@supabase/ssr";

let supabaseBrowserInstance: ReturnType<typeof createBrowserClient> | null =
  null;

export function createClient() {
  // Jika instance browser sudah ada, pakai yang sudah ada. Jangan bikin baru!
  if (!supabaseBrowserInstance) {
    supabaseBrowserInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return supabaseBrowserInstance;
}
