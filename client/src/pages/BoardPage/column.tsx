import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Column } from '../../types';
import CreateTicket from './createTicket';
import OpinionComponent from './opinion';

type Props = {
  index: number;
  column: Column;
  boardId: string;
};

export default function ColumnComponent({ column, boardId, index }: Props) {
  return (
    <Droppable isCombineEnabled key={column.id} droppableId={column.id}>
      {(provided) => (
        <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
          <h1 className="colHead">{column.title}</h1>
          <div className="colContent">
            {column.opinions.length > 3 && <CreateTicket boardId={boardId} columnId={column?.id} index={index} />}
            {column.opinions.map((opinion, index) => (
              <OpinionComponent boardId={boardId} key={opinion?.id} index={index} opinion={opinion} />
            ))}
            {provided.placeholder}

            <CreateTicket boardId={boardId} columnId={column?.id} index={index} />
          </div>
        </div>
      )}
    </Droppable>
  );
}
