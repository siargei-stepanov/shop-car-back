export const getDBOptions = (processEnv) => {
    const {PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PWD} = processEnv
    return {
        host: PG_HOST,
        port: PG_PORT,
        database: PG_DB,
        user: PG_USER,
        password: PG_PWD,
        ssl: {
            rejectUnauthorized: false
        }
    }
}