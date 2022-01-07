import React, { useState } from 'react';
import { Button, Select, Avatar, Row, Col, Switch, Input, Tooltip } from 'antd';
import {
  PlusOutlined,
  LockTwoTone,
  UnlockTwoTone,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { useHistory } from 'react-router';
import { useQuery } from '@apollo/client';
import { BoardQueries, TeamQueries } from '../../grapql-client/queries';
import { Board, Column } from '../../types';
import Modal from 'antd/lib/modal/Modal';

type Props = {
  teamId: string;
  boardId: string;
};

const { Option } = Select;
const { TextArea } = Input;

const ManageBoardPage = ({ teamId, boardId }: Props) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
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

  const { data } = useQuery<TeamQueries.getTeamIdsResult>(TeamQueries.getTeamIds, {
    fetchPolicy: 'cache-first', // Used for first execution
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log(data);
      data.getTeamIds;
    },
  });
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
    <div className="manage-board">
      <h1>Manage Board</h1>
      <div className="board-selector">
        <Select style={{ width: 300 }} bordered optionFilterProp="children" defaultValue={teamId}>
          {teamOptions()}
        </Select>
        <Select style={{ width: 300, marginLeft: 25 }} bordered optionFilterProp="children" defaultValue={boardId}>
          {boardOptions()}
        </Select>
        <div className="button-right">
          {/* <Button>Merge Board</Button> */}
          <Button style={{ width: 200, marginLeft: 25 }} icon={<PlusOutlined />}>
            Create Board
          </Button>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <div className="board-list">
            {data?.getTeamIds?.map((team) => {
              return (
                <div
                  className="board-items site-layout-background"
                  key={team.boards[0].id}
                  style={{
                    padding: 24,
                    height: '80px',
                    width: '100%',
                  }}
                >
                  <h1>{team.boards[0].title}</h1>
                  <div className="board-icons">
                    <span className="text-button" style={{ marginRight: 20 }}>
                      <Switch
                        style={{ marginRight: 10 }}
                        checkedChildren={<LockTwoTone twoToneColor="white" />}
                        unCheckedChildren={<UnlockTwoTone twoToneColor="white" />}
                      />
                      Lock Board
                    </span>
                    <Tooltip title="Clone Board">
                      <CopyOutlined style={{ marginRight: 20 }} />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined style={{ marginRight: 20 }} />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteOutlined style={{ marginRight: 20 }} />
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ManageBoardPage;
