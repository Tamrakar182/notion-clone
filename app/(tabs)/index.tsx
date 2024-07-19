import { StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "@/db/schema";

const expo = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expo);

export default function HomeScreen() {
  const handleClick = async () => {
    const users = await db.insert(schema.UserTable).values({"email": "yoo", "name": "sickkk"})
    console.log(users)
  }

  const { data } = useLiveQuery(db.select().from(schema.UserTable));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText>Hello Moto</ThemedText>
        <Button onPress={handleClick} title="Create User" />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
