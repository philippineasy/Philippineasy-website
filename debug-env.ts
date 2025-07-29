import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' }); // pour debug manuel

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
