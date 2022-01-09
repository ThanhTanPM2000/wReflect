import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import { Input } from 'antd';
import _ from 'lodash';
import { useMutation } from '@apollo/client';
import { OpinionMutations } from '../../grapql-client/mutations';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import { Opinion } from '../../types';
import board from './board';

const { TextArea } = Input;

type Props = {
  index: number;
  boardId: string;
  columnId: string;
  isCreateBottom: boolean;
};

export default function createTicket({ index, boardId, columnId, isCreateBottom }: Props) {
  const [text, setText] = useState('');
  const [isAction, setIsAction] = useState(false);

  const [createOpinion] = useMutation<OpinionMutations.createOpinionResult, OpinionMutations.createOpinionVars>(
    OpinionMutations.createOpinion,
  );

  const handleCreateTicket = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    createOpinion({
      variables: {
        boardId,
        columnId,
        text,
        isAction,
        isCreateBottom,
      },
      update: async (store, { data }) => {
        const boardData = store.readQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>({
          query: BoardQueries.getBoard,
          variables: {
            boardId,
          },
        });
        const newBoardData = _.cloneDeep(boardData);

        // newBoardData?.board.columns[index].opinions.push(data?.createOpinion as Opinion);
        const columns = newBoardData?.board.columns.map((column, idx) => {
          if (idx === index) {
            return data?.createOpinion || column;
          }
          return column;
        });

        // newBoardData?.board.columns[index].opinions.push(data?.createOpinion as Opinion);

        store.writeQuery({
          query: BoardQueries.getBoard,
          variables: {
            boardId,
          },
          data: {
            board: { ...boardData?.board, columns },
          },
        });
      },
    });
    setText('');
  };
  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <div className="panel tab">
      <a className={!isAction ? 'active link' : 'link'} onClick={() => setIsAction(false)}>
        Opinion
      </a>
      <a className={isAction ? 'active link' : 'link'} onClick={() => setIsAction(true)}>
        Action
      </a>
      <TextArea
        onChange={handleOnChange}
        onPressEnter={handleCreateTicket}
        value={text}
        placeholder={`Press enter to add ${isAction ? 'Action' : 'Opinion'}`}
      />
    </div>
  );
}
