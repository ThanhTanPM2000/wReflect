import React, { useState } from 'react';
import { Button, Tabs, Input } from 'antd';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { StarOutlined, EllipsisOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import _, { result, template } from 'lodash';
import { useQuery } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';

type Props = {
  teamId: string;
  boardId: string;
};

export default function board({ teamId, boardId }: Props) {
  const { loading, data, error, refetch } = useQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>(
    BoardQueries.getBoard,
    {
      variables: {
        boardId,
      },
    },
  );

  const board = data?.board;

  const handleOnDragEnd = (result: DropResult) => {
    console.log(result);
  };

  return (
    <div className="board flex flex-dir-r">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {board?.columns?.map((column, index) => {
          return <ColumnComponent boardId={boardId} index={index} key={column.id} column={column} />;
        })}
      </DragDropContext>
    </div>
  );
}
