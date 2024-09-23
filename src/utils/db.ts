import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default class DB {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  public async dbInit(): Promise<void> {
    try {
      const { error } = await this.supabase.from('some_table').select('*').limit(1);

      if (error) {
        throw new Error(`failed to connect to the database: ${error.message}`);
      }

      console.log('successfully connected to db');
    } catch (error) {
      console.error('error initializing db connection:', error);
      throw error;
    }
  }
}
