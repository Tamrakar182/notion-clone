
import migrations from "./migrations";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";

const expoDB = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expoDB);

export * from "./schema";
export { expoDB, db, migrations };