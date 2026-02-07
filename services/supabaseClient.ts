import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fxjrecfudnawymglggdz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4anJlY2Z1ZG5hd3ltZ2xnZ2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MTgyODUsImV4cCI6MjA4NTk5NDI4NX0.hLMQ4TjiQFbjKr3mrJ8f_QhS1zQaC9Qsr9kHjVEyUFU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;