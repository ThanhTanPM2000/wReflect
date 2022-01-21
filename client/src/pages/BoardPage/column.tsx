import React, { useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Board, Column, Member } from '../../types';
import CreateTicket from './createTicket';
import OpinionComponent from './opinion';

type Props = {
  index: number;
  iMember?: Member;
  column: Column;
  board: Board;
  currentNumVotes: number | undefined;
  setCurrentNumVotes: (votes: number) => void;
};

export default function ColumnComponent({ column, iMember, board, index, currentNumVotes, setCurrentNumVotes }: Props) {
  return (
    <Droppable
      isCombineEnabled={board.currentPhase === 'GROUP'}
      // isDropDisabled={board.currentPhase === 'REFLECT'}

      key={column.id}
      droppableId={column.id}
    >
      {(provided) => (
        <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
          <h1 className="colHead">{column.title}</h1>
          <div className="colContent">
            {column.opinions.length > 3 && !board.isLocked && board.currentPhase === 'REFLECT' && (
              <CreateTicket isCreateBottom={false} board={board} column={column} index={index} />
            )}
            {column.opinions.map((opinion, index) => (
              <OpinionComponent
                iMember={iMember}
                currentNumVotes={currentNumVotes}
                setCurrentNumVotes={setCurrentNumVotes}
                board={board}
                column={column}
                key={opinion?.id}
                index={index}
                opinion={opinion}
              />
            ))}
            {provided.placeholder}

            {!board.isLocked && board.currentPhase === 'REFLECT' && (
              <CreateTicket isCreateBottom={true} board={board} column={column} index={index} />
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}
