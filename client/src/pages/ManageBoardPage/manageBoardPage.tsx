import React, { useState } from 'react';
import { Button, Select, Avatar, Row, Col, Switch, Input, Tooltip, Empty } from 'antd';
import {
  PlusOutlined,
  LockTwoTone,
  UnlockTwoTone,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { TopNavBar } from '../../components/TopNavBar';
import { Loading } from '../../components/Loading';

type Props = {
  teamId: string;
};

const { Option } = Select;

const ManageBoardPage = ({ teamId }: Props) => {
  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const boardOptions = () => {
    return data?.team?.boards.map((board) => (
      <Option key={board.id} value={board.id}>
        {board.title}
      </Option>
    ));
  };

  return (
    <>
      <TopNavBar team={data?.team} title="Manage Board" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <>
          {data && data?.team ? (
            <div className="manage-board">
              <div className="board-selector">
                <div className="button-right">
                  {/* <Button>Merge Board</Button> */}
                  <Button icon={<PlusOutlined />}>Create Board</Button>
                </div>
              </div>

              <Row gutter={16}>
                <Col span={24}>
                  <div className="board-list">
                    {data?.team.boards?.map((board) => {
                      return (
                        <div
                          className="board-items site-layout-background"
                          key={board.id}
                          style={{
                            padding: 24,
                            height: '80px',
                            width: '100%',
                          }}
                        >
                          <h1>{board.title}</h1>
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
          ) : (
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          )}
        </>
      </Loading>
      {/* </div> */}
    </>
  );
};

export default ManageBoardPage;
