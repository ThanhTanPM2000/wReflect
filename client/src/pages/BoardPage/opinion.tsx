import React, { useState, useContext } from 'react';

import { Dropdown, Menu, Modal, Input, Badge, Avatar } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import {
  StarFilled,
  StarOutlined,
  DeleteFilled,
  EditFilled,
  EllipsisOutlined,
  LikeOutlined,
  FireFilled,
  DislikeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { Opinion } from '../../types';
import { useMutation } from '@apollo/client';
import selfContext from '../../contexts/selfContext';
import { OpinionMutations } from '../../grapql-client/mutations';
import { BoardQueries } from '../../grapql-client/queries';
import _ from 'lodash';

type Props = {
  boardId: string;
  opinion: Opinion;
  key: string;
  index: number;
};

const { confirm } = Modal;
const { TextArea } = Input;

export default function OpinionComponenent({ opinion, boardId, index }: Props) {
  const [color, setColor] = useState(opinion?.color);
  const [isEdit, setIsEdit] = useState(false);
  const [currentOpinion, setCurrentOpinion] = useState(opinion);
  const [isBookmarked, setIsBookmarked] = useState(currentOpinion.isBookmarked);
  const me = useContext(selfContext);

  const [removeOpinion] = useMutation<OpinionMutations.removeOpinionResult, OpinionMutations.removeOpinionVars>(
    OpinionMutations.removeOpinion,
    {},
  );

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
            onOk: async () => {
              return await removeOpinion({
                variables: {
                  opinionId: opinion.id,
                },
                update: async (store) => {
                  const boardData = store.readQuery<BoardQueries.getBoardResult, BoardQueries.getBoardVars>({
                    query: BoardQueries.getBoard,
                    variables: {
                      boardId,
                    },
                  });

                  const newColumns = boardData?.board.columns.map((column) => {
                    return { ...column, opinions: column.opinions.filter((x) => x.id != opinion.id) };
                  });

                  store.writeQuery({
                    query: BoardQueries.getBoard,
                    variables: {
                      boardId,
                    },
                    data: {
                      board: { ...boardData?.board, columns: newColumns },
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
          <div className="orange block-color" onClick={() => setColor('orange')} />
          <div className="pink block-color" onClick={() => setColor('pink')} />
          <div className="blue block-color" onClick={() => setColor('blue')} />
          <div className="light-blue block-color" onClick={() => setColor('light-blue')} />
          <div className="green block-color" onClick={() => setColor('green')} />
          <div className="gray block-color" onClick={() => setColor('gray')} />
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Draggable draggableId={`${opinion.id}`} index={index} key={`${opinion.id}`}>
      {(provided) => (
        <div
          className={`opinionCol ${color}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="opinionHeader">
            {isBookmarked ? (
              <StarFilled onClick={() => setIsBookmarked(false)} style={{ fontSize: '20px', cursor: 'pointer' }} />
            ) : (
              <StarOutlined onClick={() => setIsBookmarked(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
            )}

            <Dropdown overlayStyle={{ width: '180px' }} overlay={menu} placement="bottomRight">
              <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
            </Dropdown>
          </div>

          <div className="opinionContent">
            {isEdit ? (
              <TextArea
                style={{ textAlign: 'center' }}
                autoFocus
                onBlur={(e) => {
                  setIsEdit(false);
                  setCurrentOpinion({
                    ...opinion,
                    text: e.target.value,
                  });
                }}
                defaultValue={currentOpinion.text}
              ></TextArea>
            ) : (
              <p>{currentOpinion.text}</p>
            )}
          </div>

          <div className="opinionFooter">
            <div className="owner-opinion">
              <Avatar
                style={{ marginRight: '3px' }}
                size="default"
                key={currentOpinion?.author?.id}
                src={currentOpinion?.author?.profile?.picture}
              />
            </div>
            <div className="upvote">
              <Badge size="small" count={currentOpinion.upVote.length}>
                <LikeOutlined
                  onClick={() => {
                    if (me?.id && currentOpinion.upVote.find((userVoteid) => userVoteid == me.id)) {
                      setCurrentOpinion({
                        ...currentOpinion,
                        upVote: currentOpinion.upVote.filter((userVoteid) => userVoteid != me.id),
                      });
                    } else if (me?.id) {
                      setCurrentOpinion({
                        ...currentOpinion,
                        upVote: [...currentOpinion.upVote, me.id],
                      });
                    }
                  }}
                  style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                />
              </Badge>
            </div>
            <div className="downvote">
            <Badge size="small" count={currentOpinion.downVote.length}>
                <DislikeOutlined
                  onClick={() => {
                    if (me?.id && currentOpinion.downVote.find((userVoteid) => userVoteid == me.id)) {
                      setCurrentOpinion({
                        ...currentOpinion,
                        downVote: currentOpinion.downVote.filter((userVoteid) => userVoteid != me.id),
                      });
                    } else if (me?.id) {
                      setCurrentOpinion({
                        ...currentOpinion,
                        downVote: [...currentOpinion.downVote, me.id],
                      });
                    }
                  }}
                  style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
                />
              </Badge>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
