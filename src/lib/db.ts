import Database from "better-sqlite3";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "pew.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    migrate(_db);
  }
  return _db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT    NOT NULL CHECK(length(name) BETWEEN 1 AND 6),
      score     INTEGER NOT NULL CHECK(score >= 0),
      wave      INTEGER NOT NULL CHECK(wave >= 1),
      duration  REAL    NOT NULL CHECK(duration > 0),
      created   TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.exec("CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC)");
}

export interface ScoreRow {
  id: number;
  name: string;
  score: number;
  wave: number;
  duration: number;
  created: string;
}

/** Get top N scores */
export function getTopScores(limit = 10): ScoreRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM scores ORDER BY score DESC, created ASC LIMIT ?")
    .all(limit) as ScoreRow[];
}

/** Insert a new score; returns the inserted row */
export function insertScore(
  name: string,
  score: number,
  wave: number,
  duration: number,
): ScoreRow {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO scores (name, score, wave, duration) VALUES (?, ?, ?, ?)",
    )
    .run(name, score, wave, duration);
  return db
    .prepare("SELECT * FROM scores WHERE id = ?")
    .get(result.lastInsertRowid) as ScoreRow;
}
