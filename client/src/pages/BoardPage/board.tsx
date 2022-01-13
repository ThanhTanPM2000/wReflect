import React, { useState, useContext, useEffect } from 'react';
import { Select, Avatar, Tooltip, Empty } from 'antd';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import ColumnComponent from './column';
import { Board, Column } from '../../types';
import { ColumnMutations, OpinionMutations } from '../../grapql-client/mutations';
import {
  MenuOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  EditOutlined,
  BulbOutlined,
  UngroupOutlined,
  LikeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import selfContext from '../../contexts/selfContext';
import ConfigBoardModal from './configBoardModal';
import { Loading } from '../../components/Loading';
import { TopNavBar } from '../../components/TopNavBar';
import { BoardSubscription } from '../../grapql-client/subcriptions';

type Props = {
  teamId: string;
  boardId: string;
};

export default function board({ teamId, boardId }: Props) {
  const [currentNumVotes, setCurrentNumVotes] = useState(0);
  const [isBoardPanelActive, setIsBoardPanelActive] = useState(false);
  const [isBoardModalVisible, setBoardModalVisible] = useState(false);
  const history = useHistory();
  const client = useApolloClient();
  const me = useContext(selfContext);
  const [board, setBoard] = useState<Board | null>(null);

  const { loading, data, error, refetch } = useQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>(
    BoardQueries.getBoard,
    {
      variables: { boardId },
    },
  );

  useSubscription<BoardSubscription.updateBoardResult, BoardSubscription.updateBoardVars>(
    BoardSubscription.updateBoard,
    {
      variables: {
        meId: me?.id,
      },
      onSubscriptionData: ({ client, subscriptionData: { data, loading } }) => {
        if (!loading && data?.updateBoard) {
          client.cache.modify({
            id: client.cache.identify(data.updateBoard),
            fields: {
              columns: () => {
                return data?.updateBoard.columns;
              },
            },
          });
        }
      },
    },
  );

  useEffect(() => {
    setCurrentNumVotes(
      data?.board?.columns?.reduce(
        (prev, curr) =>
          prev +
          curr.opinions.reduce((prevOp, currOp) => prevOp + currOp.upVote.filter((id) => id === me?.id).length, 0),
        0,
      ) || 0,
    );
    setBoard(data?.board || null);
  }, [boardId, data]);

  const [orderOpinion] = useMutation<ColumnMutations.orderOpinionResult, ColumnMutations.orderOpinionVars>(
    ColumnMutations.orderOpinion,
  );

  const [combineOpinion] = useMutation<OpinionMutations.combineOpinionResult, OpinionMutations.combineOpinionVars>(
    OpinionMutations.combineOpinion,
  );

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
          board: { ...data?.board, columns: tempList },
        },
      });

      orderOpinion({
        variables: {
          destination: result?.destination,
          source: result?.source,
          draggableId: result?.draggableId,
        },
        // onCompleted: (data) => {
        //   client.cache.modify({
        //     id: client.cache.identify(data.orderOpinion),
        //     fields: {
        //       columns: () => {
        //         return data.orderOpinion.columns;
        //       },
        //     },
        //   });
        // },
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

  return (
    <>
      <TopNavBar team={data?.board?.team} boardId={boardId} title="Do Reflect" />
      <Loading refetch={refetch} data={!!board} loading={loading} error={error}>
        <>
          {data && data?.board ? (
            <>
              <ConfigBoardModal setVisible={setBoardModalVisible} visible={isBoardModalVisible} />
              <div className="board-header">
                <div className="currentLimitVotes">Votes {`${currentNumVotes}/${board?.votesLimit}`}</div>
                <div className="board-tracking">
                  <div className="board-members">
                    <Avatar.Group
                      maxCount={3}
                      style={{
                        cursor: 'pointer',
                      }}
                      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    >
                      {data?.board?.team?.members?.map((member) => (
                        <div onClick={() => history.push(`/manage-members/${teamId}`)} key={member?.user?.email}>
                          <Tooltip title={member?.user?.profile?.nickname} key={member?.user?.email} placement="bottom">
                            <Avatar
                              style={{ marginRight: '1px' }}
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
                  <div className="board-phase">
                    <div className="phase-step">
                      <BulbOutlined />
                      Reflect
                    </div>
                    <div className="phase-step">
                      <UngroupOutlined />
                      Group
                    </div>
                    <div className="phase-step">
                      <LikeOutlined />
                      Votes
                    </div>
                    <div className="phase-step active">
                      <MessageOutlined />
                      Discuss
                    </div>
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
                        <a className="addBoard" onClick={() => setBoardModalVisible(true)}>
                          Create New Board
                        </a>
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
                        board={board}
                        index={index}
                        key={column.id}
                        column={column}
                      />
                    );
                  })}
                </DragDropContext>
              </div>
            </>
          ) : (
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          )}
        </>
      </Loading>
    </>
  );
}
