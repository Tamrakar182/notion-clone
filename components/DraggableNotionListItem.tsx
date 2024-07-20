import React, { Children, useState } from 'react'
import { ThemedText } from './ThemedText'
import { TouchableOpacity, View, StyleSheet, Pressable, useColorScheme } from 'react-native'
import { RenderItemParams } from 'react-native-draggable-flatlist'
import { NotionFile } from '@/drizzle/types'
import { Ionicons } from '@expo/vector-icons'
import { db, NotionFileTable } from '@/drizzle'
import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { Colors } from '@/constants/Colors'
import { useActionSheet } from "@expo/react-native-action-sheet"

const DraggableNotionListItem = ({
  drag,
  isActive,
  item,
}: RenderItemParams<NotionFile>) => {
  return <NotionFileItem
    drag={drag}
    isActive={isActive}
    notionFile={item}
    iconColor='grey'
  />
}

interface InnerNotionListItemProps {
  parentId: number;
}

function InnerNotionListItem({ parentId }: InnerNotionListItemProps) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "light" ? Colors.light.icon : Colors.dark.icon;

  const { data } = useLiveQuery(
    db.select()
      .from(NotionFileTable)
      .where(eq(NotionFileTable.parentFileId, parentId))
  );

  if (data.length === 0) {
    return <ThemedText>No Pages Inside!!</ThemedText>
  }

  return (
    <View>
      {data.map((notionFile: NotionFile) => (
        <NotionFileItem
          key={notionFile.id}
          iconColor={iconColor}
          notionFile={notionFile}
        />
      ))}
    </View>
  )

}

interface NotionFileItemProps {
  drag?: () => void;
  isActive?: boolean;
  notionFile: NotionFile;
  iconColor: string;
}

function NotionFileItem({ isActive, iconColor, notionFile, drag }: NotionFileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = (id: number) => {
    const options = ["Delete", "Cancel"]
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions({
      options,
      destructiveButtonIndex,
      cancelButtonIndex,
    }, (selectedIndex: number | undefined) => {
      switch (selectedIndex) {
        case destructiveButtonIndex: {
          db
            .delete(NotionFileTable)
            .where(eq(NotionFileTable.id, id));

          break;
        }
        case cancelButtonIndex: {
          // cancelled
        }
      }

    })
  }

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        activeOpacity={0.8}
        disabled={isActive}
        onLongPress={drag}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => setIsOpen(!isOpen)}>
            <Ionicons
              name={isOpen ? "chevron-down" : "chevron-forward-outline"}
              size={18}
              style={{ marginRight: 12 }}
              color={iconColor}
            />
          </Pressable>
          <ThemedText type="defaultSemiBold">
            {notionFile.icon} {notionFile.title}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Pressable onPress={() => onPress(notionFile.id)}>
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={iconColor}
            />
          </Pressable>
          <Ionicons
            name="add"
            size={22}
            color={iconColor}
          />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.content}>
          <InnerNotionListItem parentId={notionFile.id} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  content: {
    marginLeft: 24
  }
})

export default DraggableNotionListItem