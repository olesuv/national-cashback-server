export default class DB {
    private supabase;
    constructor(supabaseUrl: string, supabaseKey: string);
    dbInit(): Promise<void>;
}
