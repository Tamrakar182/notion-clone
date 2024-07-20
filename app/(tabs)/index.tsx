import { StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db, UserTable  } from '@/drizzle';
import DraggableNotionList from '@/components/DraggableNotionList';

export default function HomeScreen() {
  const handleClick = async () => {
    const users = await db.insert(UserTable).values({"email": "yoo", "name": "sickkk"})
    console.log(users)
  }
  // const handleAddNotion = async () => {
  //   const file = await db.insert(schema.NotionFileTable).values({
  //     authorId: 1,
  //     content: "tes",
  //     coverPhoto: "",
  //     description: "",
  //     icon: "😭",
  //     title: "test",
  //     type: "default",
  //   })
  //   console.log(file)
  // }


  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <DraggableNotionList />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
