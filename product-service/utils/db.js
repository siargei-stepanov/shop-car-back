import pg from 'pg';
const { Client } = pg;

export const getDBOptions = () => {
  const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PWD } = process.env;
  return {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    user: PG_USER,
    password: PG_PWD,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

export const getDBClient = () => {
  const options = getDBOptions();
  return new Client(options);
};

export const executeTransaction = async (callback) => {
  const client = getDBClient();
  try {
    await client.connect();
    await client.query('BEGIN');

    const response = await callback(client);

    await client.query('COMMIT');
    return response;
  } catch (e) {
    console.log('Cannot execute query, aborting the transaction');
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.end();
  }
};
