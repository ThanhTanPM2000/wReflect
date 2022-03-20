import React from 'react';
import { useHistory } from 'react-router';
import { Card, Col, Avatar, Row, Pagination, Empty } from 'antd';

import { NetworkStatus, useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { SettingOutlined, UsergroupAddOutlined, AimOutlined } from '@ant-design/icons';
import { Member, Team, TeamStatus } from '../../types';
import { LoadingSkeleton } from '../../components/Loading';

const { Meta } = Card;

type Props = {
  status?: TeamStatus;
  searchText: string;
  setIsLoading: (value: boolean) => void;
  page: number;
  size: number;
  setSize: (value: number) => void;
  setPage: (value: number) => void;
};

const TeamsCard = ({ searchText, page, size, setPage, setSize }: Props) => {
  const history = useHistory();

  const redirect = (team: Team) => {
    history.push(`/board/${team.id}/${team.boards[0].id}`);
  };

  const { error, data, loading, refetch, networkStatus } = useQuery<
    TeamQueries.getTeamsResult,
    TeamQueries.getTeamsVars
  >(TeamQueries.getTeams, {
    variables: { isGettingAll: false, search: searchText, page, size },
    fetchPolicy: 'cache-and-network', // Used for first execution
    notifyOnNetworkStatusChange: true,
  });

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <div className="flex flex-1 flex-dir-c" style={{ padding: '10px' }}>
      <LoadingSkeleton
        refetch={refetch}
        data={data?.teams}
        loading={loading || networkStatus === NetworkStatus.refetch}
        error={error}
      >
        {data && data?.teams.data.length > 0 ? (
          <>
            <div className="flex flex-1 flex-dir-c">
              <Row
                className="flex flex-dir-r"
                style={{ height: '100%', padding: '10px' }}
                key={`row`}
                gutter={[16, 16]}
              >
                {data?.teams?.data?.map((team: Team) => {
                  return (
                    <Col
                      key={team.id}
                      className="flex"
                      style={{ height: '100%', maxWidth: '500px', maxHeight: '200px' }}
                      span={(() => {
                        switch (data?.teams?.data?.length) {
                          case 1:
                            return 24;
                          case 2:
                            return 12;
                          case 3:
                            return 8;
                          default:
                            return 6;
                        }
                      })()}
                    >
                      <Card
                        bodyStyle={{ display: 'flex', flex: 1 }}
                        className="flex flex-1 flex-dir-c"
                        hoverable
                        key={team.id}
                        size="small"
                        loading={loading}
                        actions={[
                          <AimOutlined
                            key="reflect"
                            onClick={() => history.push(`/board/${team.id}/${team.boards[0].id}`)}
                            title='Do Reflect'
                          />,
                          <SettingOutlined title='Manage Board' key="setting" onClick={() => history.push(`/manage-board/${team.id}`)} />,
                          <UsergroupAddOutlined
                            key="edit"
                            onClick={() => history.push(`/manage-members/${team.id}`)}
                            title='Add member'
                          />,
                        ]}
                      >
                        <>
                          <div className="flex flex-1 flex-dir-c flex-jc-sb" onClick={() => redirect(team)}>
                            <div className="flex">
                              <Meta
                                key={team.name}
                                title={team.name}
                                avatar={<Avatar key={`hek${team.id}`} shape="square" src={team.picture} />}
                              ></Meta>
                            </div>
                            <div>
                              <div className="flex flex-dir-r flex-jc-sb">
                                <div>
                                  <Avatar.Group
                                    maxCount={2}
                                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                  >
                                    {team.members.map((member: Member) => {
                                      return (
                                        <Avatar
                                          style={{ marginRight: '3px' }}
                                          size="default"
                                          // srcSet={member?.user?.picture}
                                          key={member?.user?.email}
                                          src={member?.user?.picture}
                                        />
                                      );
                                    })}
                                  </Avatar.Group>
                                </div>
                                <div>
                                  <span>{`${team?.members?.length}`} members</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <div className="flex flex-ai-c flex-jc-c mt-12">
              <Pagination
                defaultCurrent={1}
                current={page}
                total={data?.teams?.total}
                defaultPageSize={8}
                pageSize={size}
                onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
              />
            </div>
          </>
        ) : (
          <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
        )}
      </LoadingSkeleton>
    </div>
  );
};

export default TeamsCard;
