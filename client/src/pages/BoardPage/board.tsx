import React, { useState, useEffect } from 'react';
import { Button, Tabs, Input, Select, Avatar, Tooltip } from 'antd';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { StarOutlined, EllipsisOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import _, { result, template } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';
import { Board, Column } from '../../types';
import { getTeamIdsResult } from '../../grapql-client/queries/TeamQueries';
import { ColumnMutations, OpinionMutations } from '../../grapql-client/mutations';
import { argsToArgsConfig } from 'graphql/type/definition';

type Props = {
  teamId: string;
  boardId: string;
};

const { Option } = Select;

export default function board({ teamId, boardId }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const history = useHistory();
  console.log(board);

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
      const currentColumn = tempList.find((column) => column.id === result.combine?.droppableId);
      if (!currentColumn?.opinions) return;
      const [sourceOpinion] = tempList
        .find((column) => column.id == result.source?.droppableId)!
        .opinions.splice(result.source.index, 1);
      currentColumn.opinions = currentColumn?.opinions.map((opinion) => {
        if (opinion.id === result.combine?.draggableId) {
          return {
            ...opinion,
            text: `${opinion.text}\n${sourceOpinion.text}`,
            mergedAuthors: [...opinion.mergedAuthors, sourceOpinion.authorId],
            remarks: [...opinion.remarks, ...sourceOpinion.remarks],
          };
        }
        return opinion;
      });
      setColumns(tempList);
      console.log(tempList);
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
        <div className="board-members" onClick={() => history.push(`/manage-members/${teamId}`)}>
          <Avatar.Group
            maxCount={3}
            style={{
              cursor: 'pointer',
            }}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {board?.team.members.map((member) => (
              <div key={member?.user.email} onClick={() => console.log('clicked')}>
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
            return <ColumnComponent boardId={boardId} index={index} key={column.id} column={column} />;
          })}
        </DragDropContext>
      </div>
    </>
  );
}
