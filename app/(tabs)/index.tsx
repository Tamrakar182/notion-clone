import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserTable } from '@/db/schema';

import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as schema from "@/db/schema";

const expo = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expo);

export default function HomeScreen() {
  const createUser = {
    name: "User",
    email: "user@email.com",
  }

  const handleClick = async () => {
    const users = await db.insert(schema.UserTable).values({"email": "yoo", "name": "sickkk"})
    console.log(users)
  }

  const { data } = useLiveQuery(db.select().from(schema.UserTable));

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText>Hello Moto</ThemedText>
        <Button onPress={handleClick} title="Create User" />
        {data && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
