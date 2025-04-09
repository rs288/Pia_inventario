//import { createClient } from '@supabase/supabase-js';
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jcjygqlpaibdnfqyyock.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjanlncWxwYWliZG5mcXl5b2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzAwNTgsImV4cCI6MjA1ODUwNjA1OH0.iAi_F-LNM_0PXO-0tHWt0lMzMoONOq7IUfioL2-d-MA';
const supabase = createClient(supabaseUrl, supabaseKey);

//export default supabase;
// Exporta el cliente de Supabase usando CommonJS
module.exports = supabase;
