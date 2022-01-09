import React, { useState, useContext, useEffect } from 'react';
import { Select, Avatar, Tooltip } from 'antd';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';
import { Board, Column } from '../../types';
import { ColumnMutations, OpinionMutations } from '../../grapql-client/mutations';
import { MenuOutlined, CloseOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import _ from 'lodash';
import selfContext from '../../contexts/selfContext';

type Props = {
  teamId: string;
  boardId: string;
};

const { Option } = Select;

export default function board({ teamId, boardId }: Props) {
  const [board, setBoard] = useState<Board | null>(null);
  const me = useContext(selfContext);
  const [currentNumVotes, setCurrentNumVotes] = useState(0);
  const [isBoardPanelActive, setIsBoardPanelActive] = useState(false);
  const history = useHistory();
  const client = useApolloClient();

  console.log(board?.columns);

  useQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>(BoardQueries.getBoard, {
    variables: {
      boardId,
    },
    onCompleted: (data) => {
      setBoard(data.board);
    },
  });

  useEffect(() => {
    setCurrentNumVotes(
      board?.columns?.reduce(
        (prev, curr) =>
          prev +
          curr.opinions.reduce((prevOp, currOp) => prevOp + currOp.upVote.filter((id) => id === me?.id).length, 0),
        0,
      ) || 0,
    );
  }, [board]);

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
      data.getTeamIds;
    },
  });

  const handleOnDragEnd = async (result: DropResult) => {
    const prevList = _.cloneDeep(board?.columns);
    const tempList = _.cloneDeep(board?.columns);
    if (result.combine) {
      let combineText = '';
      const currentColumn = tempList?.find((column) => column.id === result.combine?.droppableId);
      if (!currentColumn?.opinions) return;
      const sourceOpinion = tempList
        ?.find((column) => column.id == result.source?.droppableId)
        ?.opinions.splice(result.source.index, 1);
      if (!sourceOpinion || sourceOpinion.length <= 0) return;
      currentColumn.opinions = currentColumn?.opinions.map((opinion) => {
        if (opinion.id === result.combine?.draggableId) {
          combineText = `${opinion?.text}\n${sourceOpinion[0]?.text}`;
          return {
            ...opinion,
            text: combineText,
            upVote: [...opinion.upVote, ...sourceOpinion[0].upVote],
            mergedAuthors: [...opinion.mergedAuthors, sourceOpinion[0]?.authorId],
            remarks: [...opinion.remarks, ...sourceOpinion[0]?.remarks],
          };
        }
        return opinion;
      });

      client.cache.writeQuery({
        query: BoardQueries.getBoard,
        variables: {
          boardId,
        },
        data: {
          board: { ...board, columns: tempList },
        },
      });

      combineOpinion({
        variables: {
          combine: result.combine,
          source: result.source,
          draggableId: result.draggableId,
          text: combineText,
        },
        onError: () => {
          client.cache.writeQuery({
            query: BoardQueries.getBoard,
            variables: {
              boardId,
            },
            data: {
              board: prevList,
            },
          });
        },
      });
    } else {
      if (!result.destination) return;

      const reorderedItem = tempList
        ?.find((column) => column.id === result.source.droppableId)
        ?.opinions?.splice(result.source.index, 1);
      if (!reorderedItem || reorderedItem.length <= 0) return;
      tempList
        ?.find((column) => column.id === result.destination?.droppableId)
        ?.opinions.splice(result?.destination?.index, 0, reorderedItem[0]);

      client.cache.writeQuery({
        query: BoardQueries.getBoard,
        variables: {
          boardId,
        },
        data: {
          board: { ...board, columns: tempList },
        },
      });

      orderOpinion({
        variables: {
          destination: result?.destination,
          source: result?.source,
          draggableId: result?.draggableId,
        },
        onError: (err) => {
          client.cache.writeQuery({
            query: BoardQueries.getBoard,
            variables: {
              boardId,
            },
            data: {
              board: prevList,
            },
          });
        },
      });
    }
  };

  const teamOptions = () => {
    return data?.getTeamIds.map((team) => (
      <Option key={team.id} value={team.id}>
        <Avatar className="mr-10" size="small" src={team.picture} />
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
        <div className="currentLimitVotes">Votes {`${currentNumVotes}/${board?.votesLimit}`}</div>
        <div className="board-tracking">
          <div className="board-selector">
            <Select bordered optionFilterProp="children" defaultValue={teamId}>
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
                      shape="circle"
                      key={member?.user?.email}
                      src={member?.user?.profile?.picture}
                    />
                  </Tooltip>
                </div>
              ))}
            </Avatar.Group>
          </div>
        </div>
        <div className={`board-action ${isBoardPanelActive && 'active'}`}>
          <div className="boardPanel" onClick={() => setIsBoardPanelActive(!isBoardPanelActive)}>
            {isBoardPanelActive ? (
              <CloseOutlined className="boardPanelIcon" />
            ) : (
              <MenuOutlined className="boardPanelIcon" />
            )}{' '}
            {'\t \t '} Action
          </div>
          <div className="boardActionPanel">
            <ul>
              <li>
                <PlusCircleOutlined className="boardPanelIcon " />
                <a className="addBoard">Create New Board</a>
              </li>
              <li>
                <EditOutlined className="boardPanelIcon " />
                <a className="editBoard">Edit Board</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="board flex flex-dir-r">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {board?.columns?.map((column, index) => {
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
