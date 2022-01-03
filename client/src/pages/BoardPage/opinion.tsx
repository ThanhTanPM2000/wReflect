import React from 'react';

import { Dropdown, Menu, Modal } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import {
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
import { OpinionMutations } from '../../grapql-client/mutations';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import _ from 'lodash';

type Props = {
  boardId: string;
  opinion: Opinion;
  key: string;
  index: number;
};

const { confirm } = Modal;

export default function OpinionComponenent({ opinion, boardId, index }: Props) {
  const [removeOpinion] = useMutation<OpinionMutations.removeOpinionResult, OpinionMutations.removeOpinionVars>(
    OpinionMutations.removeOpinion,
    {},
  );

  const menu = (
    <Menu>
      <Menu.Item key="3" icon={<FireFilled />}>
        Convet to Action
      </Menu.Item>
      <Menu.Item key="2" icon={<EditFilled />}>
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
    </Menu>
  );

  return (
    <Draggable draggableId={`${opinion.id}`} index={index} key={`${opinion.id}`}>
      {(provided) => (
        <div className="opinionCol" {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div className="opinionHeader">
            <StarOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
            <Dropdown overlayStyle={{ width: '180px' }} overlay={menu} placement="bottomRight">
              <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
            </Dropdown>
          </div>
          <div className="opinionContent">{opinion.text}</div>
          <div className="opinionFooter">
            <LikeOutlined style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
            <DislikeOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </div>
        </div>
      )}
    </Draggable>
  );
}
