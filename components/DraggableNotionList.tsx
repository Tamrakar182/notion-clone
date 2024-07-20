import { NotionFileTable, db } from '@/drizzle'
import { asc, eq, sql } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import React, { useEffect } from 'react'
import DraggableFlatList from 'react-native-draggable-flatlist'
import DraggableNotionListItem from './DraggableNotionListItem'
import { NotionFile } from '@/drizzle/types'
import { useState } from 'react'

const DraggableNotionList = () => {
  const [sortedFiles, setSortedFiles] = useState<NotionFile[]>([])
  const { data } = useLiveQuery(
    db.select()
      .from(NotionFileTable)
      .orderBy(asc(NotionFileTable.order))
      .where(eq(NotionFileTable.parentFileId, 0))
  );

  useEffect(() => {
    setSortedFiles(data);
  }, [data]);

  const handleDragEnd = async (updatedData: NotionFile[]) => {
    setSortedFiles(updatedData)
    await db.transaction(
      async (tx) => {
        const updates = updatedData.map(async (file, index) => {
          await tx.update(NotionFileTable)
            .set({ order: index })
            .where(eq(NotionFileTable, file.id))
        })
      }, {
      behavior: 'immediate'
    }
    )

  }

  return (
    <DraggableFlatList
      data={sortedFiles}
      containerStyle={{ flex: 1 }}
      onDragEnd={({ data }) => {
        handleDragEnd(data)
      }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={DraggableNotionListItem}
    />
  )
}

export default DraggableNotionList