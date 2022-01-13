import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { Card, Col, Avatar, Row, Pagination, PageHeader } from 'antd';

import { NetworkStatus, useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { SettingOutlined, UsergroupAddOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Member, Team, Teams, TeamStatus } from '../../types';
import { Loading } from '../../components/Loading';
import { TeamMutations } from '../../grapql-client/mutations';
import { me } from '../../apis/user';
import SelfContext from '../../contexts/selfContext';

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
  const me = useContext(SelfContext);

  const redirect = (team: Team) => {
    history.push(`/board/${team.id}/${team.boards[0].id}`);
  };

  const { error, data, loading, refetch, networkStatus } = useQuery<
    TeamQueries.getTeamsResult,
    TeamQueries.getTeamsVars
  >(TeamQueries.getTeams, {
    variables: { input: { status, isGettingAll: false, search: searchText, page, size } },
    fetchPolicy: 'cache-first', // Used for first execution
    notifyOnNetworkStatusChange: true,
  });

  const onAddMember = () => {
    setVisibleModal(true);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  return (
    <div className="flex flex-1 flex-dir-c" style={{ padding: '10px' }}>
      <Loading
        refetch={refetch}
        data={!!data && data?.teams?.data?.length > 0}
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
                        <SettingOutlined key="setting" />,
                        <UsergroupAddOutlined key="edit" onClick={() => onAddMember()} />,
                        <EllipsisOutlined key="ellipsis" />,
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
                                <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                  {team.members.map((member: Member) => {
                                    return (
                                      <Avatar
                                        style={{ marginRight: '3px' }}
                                        size="default"
                                        key={member?.user?.email}
                                        src={member?.user?.profile?.picture}
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
      </Loading>
    </div>
  );
};

export default TeamsCard;
