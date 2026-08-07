import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString:"postgresql://postgres:sukumar5705@db.lyouyhafnbjairwdceax.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

await client.connect();
console.log('Connected!');
await client.end();