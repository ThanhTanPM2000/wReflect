import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Board, Column } from '../../types';
import CreateTicket from './createTicket';
import OpinionComponent from './opinion';

type Props = {
  index: number;
  column: Column;
  board: Board;
  currentNumVotes: number | undefined;
  setCurrentNumVotes: (votes: number) => void;
};

export default function ColumnComponent({ column, board, index, currentNumVotes, setCurrentNumVotes }: Props) {
  return (
    <Droppable isCombineEnabled key={column.id} droppableId={column.id}>
      {(provided) => (
        <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
          <h1 className="colHead">{column.title}</h1>
          <div className="colContent">
            {column.opinions.length > 3 && !board.isLocked && (
              <CreateTicket isCreateBottom={false} boardId={board.id} columnId={column?.id} index={index} />
            )}
            {column.opinions.map((opinion, index) => (
              <OpinionComponent
                currentNumVotes={currentNumVotes}
                setCurrentNumVotes={setCurrentNumVotes}
                board={board}
                key={opinion?.id}
                index={index}
                opinion={opinion}
              />
            ))}
            {provided.placeholder}

            {!board.isLocked && (
              <CreateTicket isCreateBottom={true} boardId={board.id} columnId={column?.id} index={index} />
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}
