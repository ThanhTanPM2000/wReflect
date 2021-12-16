import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Card, Col, Avatar, Row, Pagination, Skeleton, notification, Empty } from 'antd';

import { useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { SettingOutlined, UsergroupAddOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Meta } = Card;

type Props = {
  status: string;
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

  const { error, data, loading, refetch } = useQuery(TeamQueries.getTeams, {
    variables: { status, isGettingAll: false, search: searchText, page, size },
    fetchPolicy: 'cache-and-network', // Used for first execution
    nextFetchPolicy: 'cache-first', // Used for subsequent executions
    errorPolicy: 'all',
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    refetch();
  }, [searchText, page, size]);

  const onAddMember = () => {
    setVisibleModal(true);
  };

  if (loading || error)
    return (
      <>
        <Card style={{ width: 300, marginTop: 16 }} loading={true}>
          <Meta
            avatar={<Avatar key="k1" src="https://joeschmoe.io/api/v1/random" />}
            title="Card title"
            description="This is the description"
          />
        </Card>
        <Card
          style={{ width: 300, marginTop: 16 }}
          actions={[
            <SettingOutlined key="setting" />,
            <UsergroupAddOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Skeleton loading={true} avatar active>
            <Meta
              avatar={<Avatar key="key2" src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Skeleton>
        </Card>
      </>
    );

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <>
      <div className="flex flex-1 flex-dir-c" style={{ padding: '10px' }}>
        {!data.teams || data.teams.data.length == 0 ? (
          <div className="flex" style={{ flex: 1, height: '100%', width: '100%' }}>
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-dir-c" style={{ overflow: 'auto' }}>
              <Row className="flex flex-dir-r" style={{ height: '100%' }} key={`row`} gutter={[16, 16]}>
                {data.teams.data.map((team: any) => {
                  return (
                    <Col
                      key={team.id}
                      className="flex"
                      style={{ height: '100%', maxWidth: '500px', maxHeight: '200px', overflow: 'hidden' }}
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
                                  {team.members.map((member: any) => {
                                    return (
                                      <Avatar
                                        style={{ marginRight: '3px' }}
                                        size="small"
                                        key={member.userId}
                                        src={member.user.picture}
                                      />
                                    );
                                  })}
                                </div>
                                <div>
                                  <span>{`${team.members.length}`} members</span>
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
                total={data.teams.total}
                defaultPageSize={8}
                pageSize={size}
                onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TeamsCard;
