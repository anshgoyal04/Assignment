// Why? GET is used to retrieve data; we use query parameters and auth headers.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return new Response(JSON.stringify({ data, error }), { status: error ? 400 : 200 })
})

