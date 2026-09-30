import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'series.db';
let database: SQLite.SQLiteDatabase | null = null;

// Singleton: abre o banco só na primeira chamada e reaproveita depois
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(database);
  return database;
}

// Cria a tabela se ela ainda não existir
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS series (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo     TEXT    NOT NULL,
      plataforma TEXT    NOT NULL,
      temporadas INTEGER NOT NULL,
      nota       INTEGER,
      concluida  INTEGER NOT NULL DEFAULT 0,
      createdAt  TEXT    NOT NULL
    );
  `);
}