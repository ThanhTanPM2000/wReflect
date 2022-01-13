import React, { useState, useEffect, useContext, useRef } from 'react';

import { Dropdown, Menu, Modal, Input, Badge, Avatar, Select, Tooltip } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import {
  StarFilled,
  StarOutlined,
  DeleteFilled,
  EditFilled,
  EllipsisOutlined,
  FireFilled,
  UpCircleOutlined,
  DownCircleOutlined,
  ExclamationCircleOutlined,
  MessageFilled,
  MessageOutlined,
} from '@ant-design/icons';

import { Board, Opinion } from '../../types';
import { useMutation, useApolloClient, useSubscription } from '@apollo/client';
import selfContext from '../../contexts/selfContext';
import { OpinionMutations } from '../../grapql-client/mutations';
import { BoardQueries } from '../../grapql-client/queries';
import _, { update } from 'lodash';
import remark from './remark';
import Remark from './remark';
import { OpinionSubscription } from '../../grapql-client/subcriptions';

type Props = {
  board: Board;
  opinion: Opinion;
  key: string;
  index: number;
  currentNumVotes: number | undefined;
  setCurrentNumVotes: (votes: number) => void;
};

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

export default function OpinionComponenent({ opinion, board, index, currentNumVotes, setCurrentNumVotes }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [currentOpinion, setCurrentOpinion] = useState(opinion);
  const prevCurrentOpinion = useRef(currentOpinion);
  const client = useApolloClient();
  const me = useContext(selfContext);
  const [isOpenRemark, setIsOpenRemark] = useState(false);

  useSubscription<OpinionSubscription.updateOpinionResult, OpinionSubscription.updateOpinionVars>(
    OpinionSubscription.updateOpinion,
    {
      variables: {
        opinionId: opinion.id,
      },
      onSubscriptionData: ({ client, subscriptionData: { data, loading } }) => {
        if (!loading && data?.updateOpinion) {
          client.cache.modify({
            id: client.cache.identify(data?.updateOpinion),
            fields: {
              text: () => data.updateOpinion.text,
              upVote: () => data.updateOpinion.upVote,
              isBookmarked: () => data.updateOpinion.isBookmarked,
              responsible: () => data.updateOpinion.responsible,
              color: () => data.updateOpinion.color,
              status: () => data.updateOpinion.status,
            },
          });
        }
      },
    },
  );

  const [updateOpinion] = useMutation<OpinionMutations.updateOpinionResult, OpinionMutations.updateOpinionVars>(
    OpinionMutations.updateOpinion,
    {
      variables: {
        opinionId: currentOpinion.id,
        text: currentOpinion.text,
        upVote: currentOpinion.upVote,
        isBookmarked: currentOpinion.isBookmarked,
        responsible: currentOpinion.responsible,
        color: currentOpinion.color,
        status: currentOpinion.status,
      },
    },
  );

  const [removeOpinion] = useMutation<OpinionMutations.removeOpinionResult, OpinionMutations.removeOpinionVars>(
    OpinionMutations.removeOpinion,
  );

  useEffect(() => {
    setCurrentOpinion(opinion);
  }, [opinion]);

  useEffect(() => {
    if (
      !_.isEqual(
        _.pick(prevCurrentOpinion.current, ['text', 'isAction', 'upVote', 'color', 'isBookmarked']),
        _.pick(currentOpinion, ['text', 'isAction', 'upVote', 'color', 'isBookmarked']),
      )
    ) {
      updateOpinion({
        onError: () => {
          client.cache.modify({
            id: client.cache.identify(currentOpinion),
            fields: {
              text: () => {
                return prevCurrentOpinion.current.text;
              },
              upVote: () => {
                return prevCurrentOpinion.current.upVote;
              },
              color: () => {
                return prevCurrentOpinion.current.color;
              },
              isBookmarked: () => {
                return prevCurrentOpinion.current.isBookmarked;
              },
              isAction: () => {
                return prevCurrentOpinion.current.isAction;
              },
              responsible: () => {
                return prevCurrentOpinion.current.responsible;
              },
              status: () => {
                return prevCurrentOpinion.current.status;
              },
            },
          });
        },
      });
    }
  }, [
    currentOpinion.text,
    currentOpinion.color,
    currentOpinion.isAction,
    currentOpinion.upVote,
    currentOpinion.isBookmarked,
    currentOpinion.responsible,
    currentOpinion.status,
  ]);

  const menu = (
    <Menu>
      <Menu.Item key="3" icon={<FireFilled />}>
        Convet to Action
      </Menu.Item>
      <Menu.Item onClick={() => setIsEdit(true)} key="2" icon={<EditFilled />}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => {
          confirm({
            title: 'Do you want to delete these items?',
            centered: true,
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
              const prevBoard = board;
              const newColumns = board.columns.map((column) => {
                return { ...column, opinions: column.opinions.filter((x) => x.id != opinion.id) };
              });

              client.cache.writeQuery({
                query: BoardQueries.getBoard,
                variables: {
                  boardId: board.id,
                },
                data: {
                  board: { ...board, columns: newColumns },
                },
              });
              removeOpinion({
                variables: {
                  opinionId: opinion.id,
                },
                onError: () => {
                  client.cache.writeQuery({
                    query: BoardQueries.getBoard,
                    variables: {
                      boardId: board.id,
                    },
                    data: {
                      board: prevBoard,
                    },
                  });
                },
              });
            },
          });
        }}
        icon={<DeleteFilled />}
      >
        Remove
      </Menu.Item>

      <Menu.Item>
        <div className="color-selector">
          <div
            className="orange block-color"
            onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'orange' })}
          />
          <div className="pink block-color" onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'pink' })} />
          <div className="blue block-color" onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'blue' })} />
          <div
            className="light-blue block-color"
            onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'light-blue' })}
          />
          <div className="green block-color" onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'green' })} />
          <div className="gray block-color" onClick={() => setCurrentOpinion({ ...currentOpinion, color: 'gray' })} />
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Draggable isDragDisabled={board.isLocked} draggableId={`${opinion.id}`} index={index} key={`${opinion.id}`}>
      {(provided) => (
        <div
          className={`opinionCol ${currentOpinion.color}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          key={opinion?.id}
        >
          <div className="opinionHeader">
            {currentOpinion.isBookmarked ? (
              <StarFilled
                onClick={() => {
                  setCurrentOpinion({ ...currentOpinion, isBookmarked: false });
                }}
                style={{ fontSize: '20px', cursor: 'pointer' }}
              />
            ) : (
              <StarOutlined
                onClick={() => {
                  setCurrentOpinion({ ...currentOpinion, isBookmarked: true });
                }}
                style={{ fontSize: '20px', cursor: 'pointer' }}
              />
            )}

            <div className="owner-opinion">
              <Avatar.Group
                maxCount={3}
                style={{
                  cursor: 'pointer',
                }}
                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              >
                {board?.team?.members
                  ?.filter(
                    (member) => opinion.mergedAuthors.includes(member?.userId) || opinion?.authorId == member?.userId,
                  )
                  .map((member) => (
                    <div key={member?.user?.email}>
                      <Tooltip title={member?.user?.profile?.name} key={member?.user?.email} placement="bottom">
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

            <Dropdown overlayStyle={{ width: '180px' }} overlay={menu} placement="bottomRight">
              <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
            </Dropdown>
          </div>

          <div className="opinionContent">
            <div className="opinionText">
              {isEdit ? (
                <TextArea
                  style={{ textAlign: 'center', minHeight: '180px' }}
                  autoFocus
                  bordered
                  onBlur={(e) => {
                    setIsEdit(false);
                    setCurrentOpinion({
                      ...opinion,
                      text: e.target.value,
                    });
                  }}
                  defaultValue={currentOpinion.text}
                />
              ) : (
                <p>
                  {currentOpinion.text.split('\n').map((str) => {
                    return (
                      <>
                        {str}
                        <br />
                      </>
                    );
                  })}
                </p>
              )}
              {currentOpinion.isAction === true && (
                <div className="opinionAction">
                  <Select className="select" defaultValue="Open" style={{ width: 120 }}>
                    <Option value="Open">Open</Option>
                    <Option value="inProgress">In progress</Option>
                    <Option value="Done">Done</Option>
                    <Option value="Rejected">Rejected</Option>
                  </Select>
                  <Select className="select" defaultValue="notAssigned" style={{ width: 120 }}>
                    <Option value="notAssigned">Not Assigned</Option>
                    <Option value="Team">Team</Option>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="opinionFooter">
            <div className="upvote">
              <Badge size="small" count={currentOpinion.upVote.length}>
                <UpCircleOutlined
                  onClick={() => {
                    if (me?.id && (currentNumVotes as number) < board.votesLimit) {
                      setCurrentOpinion({
                        ...currentOpinion,
                        upVote: [...currentOpinion.upVote, me.id],
                      });
                      setCurrentNumVotes((currentNumVotes as number) + 1);
                    }
                  }}
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                />
              </Badge>
            </div>
            <div className="downvote">
              <DownCircleOutlined
                onClick={() => {
                  if (me?.id && currentOpinion.upVote.length > 0) {
                    let findFirst = false;
                    setCurrentOpinion({
                      ...currentOpinion,
                      upVote: currentOpinion.upVote.filter((userVoteid) => {
                        if (userVoteid == me.id && !findFirst) {
                          findFirst = true;
                          return false;
                        }
                        return true;
                      }),
                    });
                    setCurrentNumVotes((currentNumVotes as number) - 1);
                  }
                }}
                style={{ fontSize: '20px', marginLeft: '5px', cursor: 'pointer' }}
              />
            </div>
            <div className="myVotes">
              [Your votes {`${currentOpinion.upVote.filter((voteIds) => voteIds == me?.id).length}`}]
            </div>
            <div className="remarks">
              <Badge size="small" count={opinion.remarks.length} showZero={false}>
                {opinion.remarks.length > 0 ? (
                  <MessageFilled
                    onClick={() => setIsOpenRemark(true)}
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                  />
                ) : (
                  <MessageOutlined
                    onClick={() => setIsOpenRemark(true)}
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                  />
                )}
              </Badge>
            </div>
          </div>
          <Remark isOpenRemark={isOpenRemark} setIsOpenRemark={setIsOpenRemark} opinion={currentOpinion} />
        </div>
      )}
    </Draggable>
  );
}
