import { createClient } from '@supabase/supabase-js'

const URL = 'https://oafrhurknacckjkvqrig.supabase.co'
// Copy the 'default' key from your "Publishable key" section in Supabase
const KEY = 'sb_publishable_TjE-nR8tTLqfPic7G31xWw_lwopDm5u' 

export const supabase = createClient(URL, KEY);