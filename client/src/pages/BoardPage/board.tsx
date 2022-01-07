import React, { useState } from 'react';
import { Select, Avatar, Tooltip } from 'antd';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';
import { Board, Column } from '../../types';
import { ColumnMutations, OpinionMutations } from '../../grapql-client/mutations';
import _ from 'lodash';

type Props = {
  teamId: string;
  boardId: string;
};

const { Option } = Select;

export default function board({ teamId, boardId }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [currentNumVotes, setCurrentNumVotes] = useState(0);
  const history = useHistory();

  useQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>(BoardQueries.getBoard, {
    variables: {
      boardId,
    },
    onCompleted: (data) => {
      setBoard(data.board);
      setColumns(data.board.columns);
    },
  });

  const [orderOpinion] = useMutation<ColumnMutations.orderOpinionResult, ColumnMutations.orderOpinionVars>(
    ColumnMutations.orderOpinion,
  );

  const [combineOpinion] = useMutation<OpinionMutations.combineOpinionResult, OpinionMutations.combineOpinionVars>(
    OpinionMutations.combineOpinion,
  );

  const { data } = useQuery<TeamQueries.getTeamIdsResult>(TeamQueries.getTeamIds, {
    fetchPolicy: 'cache-first', // Used for first execution
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log(data);
      data.getTeamIds;
    },
  });

  const handleOnDragEnd = async (result: DropResult) => {
    const prevList = _.cloneDeep(columns);
    const tempList = _.cloneDeep(columns);
    if (result.combine) {
      let combineText = '';
      const currentColumn = tempList.find((column) => column.id === result.combine?.droppableId);
      if (!currentColumn?.opinions) return;
      const [sourceOpinion] = tempList
        .find((column) => column.id == result.source?.droppableId)!
        .opinions.splice(result.source.index, 1);
      currentColumn.opinions = currentColumn?.opinions.map((opinion) => {
        if (opinion.id === result.combine?.draggableId) {
          combineText = `${opinion.text}\n${sourceOpinion.text}`;
          return {
            ...opinion,
            text: combineText,
            mergedAuthors: [...opinion.mergedAuthors, sourceOpinion.authorId],
            remarks: [...opinion.remarks, ...sourceOpinion.remarks],
          };
        }
        return opinion;
      });
      setColumns(tempList);

      combineOpinion({
        variables: {
          combine: result.combine,
          source: result.source,
          draggableId: result.draggableId,
          text: combineText,
        },
        onError: () => {
          setColumns(prevList);
        },
      });
    } else {
      if (!result.destination) return;

      const [reorderedItem] = tempList
        .find((column) => column.id === result.source.droppableId)!
        .opinions?.splice(result.source.index, 1);
      tempList
        .find((column) => column.id === result.destination?.droppableId)
        ?.opinions.splice(result?.destination?.index, 0, reorderedItem);
      setColumns(tempList);

      orderOpinion({
        variables: {
          destination: result.destination,
          source: result.source,
          draggableId: result.draggableId,
        },
        onError: (err) => {
          console.log(err);
          setColumns(prevList);
        },
      });
    }
  };

  const teamOptions = () => {
    return data?.getTeamIds.map((team) => (
      <Option key={team.id} value={team.id}>
        <Avatar className="mr-10" shape="square" size="small" src={team.picture} />
        {`${team.name}`}
      </Option>
    ));
  };

  const boardOptions = () => {
    return data?.getTeamIds
      .find((team) => team.id === teamId)
      ?.boards.map((board) => (
        <Option key={board.id} value={board.id}>
          {board.title}
        </Option>
      ));
  };

  return (
    <>
      <div className="board-header">
        <div className="board-selector">
          <Select style={{ width: 200 }} bordered optionFilterProp="children" defaultValue={teamId}>
            {teamOptions()}
          </Select>
          <Select style={{ width: 200 }} bordered optionFilterProp="children" defaultValue={boardId}>
            {boardOptions()}
          </Select>
        </div>
        <div className="board-members">
          <Avatar.Group
            maxCount={3}
            style={{
              cursor: 'pointer',
            }}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {board?.team.members.map((member) => (
              <div onClick={() => history.push(`/manage-members/${teamId}`)} key={member?.user.email}>
                <Tooltip title={member?.user.profile.name} key={member?.user.email} placement="bottom">
                  <Avatar
                    style={{ marginRight: '3px' }}
                    size="default"
                    key={member?.user?.email}
                    src={member?.user?.profile?.picture}
                  />
                </Tooltip>
              </div>
            ))}
          </Avatar.Group>
        </div>
      </div>
      <div className="board flex flex-dir-r">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {columns?.map((column, index) => {
            return (
              <ColumnComponent
                currentNumVotes={currentNumVotes}
                setCurrentNumVotes={setCurrentNumVotes}
                board={board!}
                index={index}
                key={column.id}
                column={column}
              />
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}
