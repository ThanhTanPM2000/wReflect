import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Card, Col, Avatar, Row, Pagination, Result, Button, Spin, Empty } from 'antd';

import { NetworkStatus, useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { SettingOutlined, UsergroupAddOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Member, Team, Teams, TeamStatus } from '../../types';
import { Loading } from '../../components/Loading';

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

const TeamsCard = ({ status, searchText, page, size, setPage, setSize, setIsLoading }: Props) => {
  const history = useHistory();
  const [isVisibleAddModal, setVisibleModal] = useState(false);

  const redirect = (value: number) => {
    history.push(`/teams/${value}`);
  };

  const { error, data, loading, refetch, networkStatus } = useQuery(TeamQueries.getTeams, {
    variables: { status, isGettingAll: false, search: searchText, page, size },
    fetchPolicy: 'cache-and-network', // Used for first execution
    notifyOnNetworkStatusChange: true,

    // errorPolicy: 'all',
  });

  useEffect(() => {
    refetch();
  }, [searchText, page, size]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const onAddMember = () => {
    setVisibleModal(true);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };
  console.log(data);

  return (
    <div className="flex flex-1 flex-dir-c" style={{ padding: '10px' }}>
      <Loading
        refetch={refetch}
        data={data?.teams?.data?.length > 0}
        loading={loading || networkStatus === NetworkStatus.refetch}
        error={error}
      >
        <>
          <div className="flex flex-1 flex-dir-c" style={{ overflow: 'auto' }}>
            <Row className="flex flex-dir-r" style={{ height: '100%', padding: '10px' }} key={`row`} gutter={[16, 16]}>
              {data?.teams?.data?.map((team: Team) => {
                return (
                  <Col
                    key={team.id}
                    className="flex"
                    style={{ height: '100%', maxWidth: '500px', maxHeight: '200px' }}
                    span={(() => {
                      switch (data.teams.data.length) {
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
                      // style={{ height: '100%' }}
                      bodyStyle={{ display: 'flex', flex: 1 }}
                      className="flex flex-1 flex-dir-c"
                      hoverable
                      key={team.id}
                      size="small"
                      loading={loading}
                      actions={[
                        <SettingOutlined key="setting" />,
                        <UsergroupAddOutlined key="edit" onClick={() => onAddMember()} />,
                        <EllipsisOutlined key="ellipsis" />,
                      ]}
                    >
                      <>
                        <div className="flex flex-1 flex-dir-c flex-jc-sb" onClick={() => redirect(team.id)}>
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
                                {team.members.map((member: Member) => {
                                  return (
                                    <Avatar
                                      style={{ marginRight: '3px' }}
                                      size="small"
                                      key={member?.email}
                                      src={member?.user?.profile?.picture}
                                    />
                                  );
                                })}
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
      </Loading>
    </div>
  );
};

export default TeamsCard;
