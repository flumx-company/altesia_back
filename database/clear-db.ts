import { createConnection, getConnection } from 'typeorm';

async function clearDb() {
  try {
    await createConnection();
    await getConnection().synchronize(true);
  } catch (e) {
    throw e;
  }
}

clearDb()
  .then(() => console.log('Database tables cleared successfully'))
  .catch((e) => console.log('Error', e))
  .finally(() => {
    process.exit();
  });
