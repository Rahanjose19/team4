import { createClient } from "@supabase/supabase-js";
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_ANON_KEY);
export default supabase;
