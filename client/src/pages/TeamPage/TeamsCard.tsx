import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Card, Col, Avatar, Row, Pagination, Skeleton, notification, Empty } from 'antd';

import { useQuery } from '@apollo/client';
import { getTeams } from '../../grapql-client/queries';
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import SearchBar from '../../components/SearchBar/SearchBar';

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
  const redirect = () => {
    history.push('/team-detail');
  };

  const { error, data, loading, refetch } = useQuery(getTeams, {
    variables: { status, isGettingAll: false, search: searchText, page, size },
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    refetch();
  }, [searchText, page, size]);

  if (error)
    return (
      <>
        {notification.error({
          message: `Notification`,
          description: `Something wrong`,
          placement: 'bottomLeft',
        })}
      </>
    );

  if (loading)
    return (
      <>
        <Card style={{ width: 300, marginTop: 16 }} loading={true}>
          <Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title="Card title"
            description="This is the description"
          />
        </Card>
        <Card
          style={{ width: 300, marginTop: 16 }}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Skeleton loading={true} avatar active>
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
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
      <div className="flex flex-dir-c flex-ai-c flex-jc-c " style={{ flex: 1 }}>
        {!data.teams || data.teams.data.length == 0 ? (
          <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100%' }}>
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          </div>
        ) : (
          <>
            <div className="flex flex-dir-c flex-ai-c flex-jc-c" style={{ flex: 1 }}>
              <div style={{ flexGrow: 6, height: '100%' }} className="flex flex-ai-c flex-jc-c">
                <Row key={`row`} gutter={[16, 16]}>
                  {data.teams.data.map((team: any) => {
                    return (
                      <Col
                        key={team.id}
                        span={
                          data.teams.data.length === 1
                            ? 24
                            : data.teams.data.length === 2
                            ? 12
                            : data.teams.data.length === 3
                            ? 8
                            : 6
                        }
                        // span={24}
                      >
                        <Card
                          hoverable
                          key={team.id}
                          onClick={() => redirect()}
                          size="small"
                          loading={loading}
                          actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                          ]}
                        >
                          <Meta
                            title={team.name}
                            avatar={<Avatar key={`hek${team.id}`} shape="square" src={team.picture} />}
                          ></Meta>
                          <div className="flex flex-dir-r" style={{ marginTop: '30px' }}>
                            <div style={{ flex: 1 }}>
                              {team.members.map((member: any) => {
                                return <Avatar size="small" key={member.id} src={member.user.picture} />;
                              })}
                            </div>
                            <div>{`${team.members.length}`} members</div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
              <div className="flex flex-jc-c mt-12" style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Pagination
                  defaultCurrent={1}
                  current={page}
                  total={data.teams.total}
                  defaultPageSize={8}
                  pageSize={size}
                  onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TeamsCard;
