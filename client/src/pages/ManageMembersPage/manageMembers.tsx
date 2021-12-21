import { Button, Modal, Tabs } from 'antd';
import React, { useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { TabPane } from 'rc-tabs';
import SearchBar from '../../components/SearchBar/SearchBar';
import ListMember from '../TeamDetailPage/listMember';
import { TeamQueries } from '../../grapql-client/queries';
import AddMembersModal from '../TeamDetailPage/addMemberModal';
import EditTeamDetailModal from '../TeamDetailPage/editTeamDetailModal';
import SelfContext from '../../contexts/selfContext';

import { ExclamationCircleOutlined, PlusCircleOutlined, EditFilled, DeleteOutlined } from '@ant-design/icons';
import { TeamMutations } from '../../grapql-client/mutations';
import { useHistory } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { AddTeamMembers } from '.';

type Props = {
  teamId: string;
};

const { confirm } = Modal;

export default function manageMembers({ teamId }: Props) {
  const [isVisibleAddMemModal, setIsVisibleAddMemModal] = useState(false);
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [searchText, setSearchText] = useState('');

  const history = useHistory();
  const me = useContext(SelfContext);

  const { loading, data, error, refetch } = useQuery(TeamQueries.getTeam, {
    variables: { teamId },
  });
  console.log('team is?', data);

  const [deleteTeam] = useMutation(TeamMutations.deleteTeam, {
    refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
  });

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const operations = (
    <>
      <div className="flex flex-dir-r flex-ai-c flex-jc-c mb-10">
        <Button
          className="btn-delete-team mr-10"
          icon={<DeleteOutlined />}
          size="middle"
          onClick={() => {
            confirm({
              title: 'Are you sure want to delete this team?',
              icon: <ExclamationCircleOutlined />,
              centered: true,
              okText: 'Delete',
              onOk: async () => {
                await deleteTeam({ variables: { teamId } });
                history.push('/teams');
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Delete Team
        </Button>
        <Button
          className="mr-10"
          icon={<PlusCircleOutlined />}
          size="middle"
          onClick={() => setIsVisibleAddMemModal(true)}
        >
          New Member
        </Button>
      </div>
    </>
  );

  return (
    <Loading refetch={refetch} data={!!data || data?.length >= 0} loading={loading} error={error}>
      <div>
        <Tabs
          type="card"
          className="tab-inner"
          style={{ height: '100%' }}
          tabBarExtraContent={data?.team?.ownerEmail.includes(me?.email) && operations}
        >
          <TabPane tab="Member" key="1" className="flex flex-1 flex-dir-r">
            <>
              <div className="flex-1">
                <SearchBar onHandleSearch={handleSearch} isLoading={loading} placeholder="Find members" />
                <div className="mt-25">
                  <ListMember searchText={searchText} teamData={data?.team} />
                </div>
              </div>
              <div className="flex-1" style={{ padding: '40px 40px 100px 70px' }}>
                <AddTeamMembers teamId={teamId} />
              </div>
            </>
          </TabPane>
          <TabPane tab="Setting" key="2" className="flex " style={{ overflow: 'auto' }}>
            <div>hello</div>
          </TabPane>
          <TabPane tab="Analytics" key="3" className="flex " style={{ overflow: 'auto' }}>
            <div>Data</div>
          </TabPane>
        </Tabs>
        {/* <AddMembersModal isVisible={isVisibleAddMemModal} teamId={teamId} setIsVisible={setIsVisibleAddMemModal} /> */}
        <EditTeamDetailModal
          isVisible={isVisibleEditDetails}
          teamData={data?.team}
          setIsVisible={setIsVisibleEditDetails}
        />
      </div>
    </Loading>
  );
}
