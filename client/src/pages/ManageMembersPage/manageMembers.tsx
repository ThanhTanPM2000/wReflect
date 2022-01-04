import { Avatar, Button, Modal, Select } from 'antd';
import React, { useContext, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
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
import { Team } from '../../types';

import { useApolloClient, ReadQueryOptions } from '@apollo/client';

type Props = {
  teamId: string;
};

const { confirm } = Modal;
const { Option } = Select;

export default function manageMembers({ teamId }: Props) {
  const [isVisibleAddMemModal, setIsVisibleAddMemModal] = useState(false);
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const client = useApolloClient();

  const history = useHistory();
  const me = useContext(SelfContext);

  const { data: teamIds } = useQuery<TeamQueries.getTeamIdsResult>(TeamQueries.getTeamIds, {
    fetchPolicy: 'cache-first', // Used for first execution
    notifyOnNetworkStatusChange: true,
  });

  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const [deleteTeam] = useMutation<TeamMutations.deleteTeamResult, TeamMutations.deleteTeamVars>(
    TeamMutations.deleteTeam,
    {
      refetchQueries: [TeamQueries.getTeams],
    },
  );

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

  const renderOptions = () => {
    return teamIds?.getTeamIds.map((team) => (
      <Option key={team.id} value={team.id}>
        <Avatar className="mr-10" shape="square" size="small" src={team.picture} />
        {`${team.name}`}
      </Option>
    ));
  };

  const handleSelect = (value: string) => {
    history.push(`/manage-members/${value}`);
  };

  return (
    <Loading refetch={refetch} data={!!data} loading={loading} error={error}>
      <>
        <div className="flex flex-dir-r flex-ai-c " style={{ gap: '10px' }}>
          <h2 style={{ margin: '0px' }}>Manage Members</h2>
          <Select
            style={{ width: 200 }}
            bordered
            placeholder="Search to Select"
            optionFilterProp="children"
            defaultValue={teamId}
            onSelect={handleSelect}
          >
            {renderOptions()}
          </Select>
        </div>
        <div className="flex flex-1 flex-dir-r manageMembersPage card mt-10">
          <>
            <div className="flex-1 manageMembers">
              <div className="mr-10">
                <SearchBar onHandleSearch={handleSearch} isLoading={loading} placeholder="Find members" />
              </div>
              <div className="mt-25">
                <ListMember searchText={searchText} teamData={data?.team} />
              </div>
            </div>
            <div className="flex-1 addTeamMembers">
              <AddTeamMembers teamData={data?.team} />
            </div>
          </>
          {/* <AddMembersModal isVisible={isVisibleAddMemModal} teamId={teamId} setIsVisible={setIsVisibleAddMemModal} /> */}
          <EditTeamDetailModal
            isVisible={isVisibleEditDetails}
            teamData={data?.team}
            setIsVisible={setIsVisibleEditDetails}
          />
        </div>
      </>
    </Loading>
  );
}
