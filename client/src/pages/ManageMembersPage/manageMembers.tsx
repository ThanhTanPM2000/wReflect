import { Avatar, Button, Empty, Modal, PageHeader, Select } from 'antd';
import React, { useContext, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { TabPane } from 'rc-tabs';
import SearchBar from '../../components/SearchBar/SearchBar';
import ListMember from '../TeamDetailPage/listMember';
import { TeamQueries } from '../../grapql-client/queries';
import EditTeamDetailModal from '../TeamDetailPage/editTeamDetailModal';
import SelfContext from '../../contexts/selfContext';

import { TeamMutations } from '../../grapql-client/mutations';
import { useHistory } from 'react-router-dom';
import { Loading } from '../../components/Loading';
import { AddTeamMembers } from '.';

import { useApolloClient } from '@apollo/client';
import { TopNavBar } from '../../components/TopNavBar';

type Props = {
  teamId: string;
};

const { confirm } = Modal;
const { Option } = Select;

export default function manageMembers({ teamId }: Props) {
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const client = useApolloClient();

  const history = useHistory();
  const me = useContext(SelfContext);

  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  return (
    <>
      <TopNavBar team={data?.team} title="Manage Members" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <>
          {data && data?.team ? (
            <div className="flex flex-1 flex-dir-r manageMembersPage card mt-10">
              <>
                <div className="flex-1 manageMembers">
                  <div className="mr-10">
                    <SearchBar onHandleSearch={handleSearch} isLoading={loading} placeholder="Find members" />
                  </div>
                  <div className="mt-25">
                    <ListMember searchText={searchText} teamData={data.team} />
                  </div>
                </div>
                <div className="flex-1 addTeamMembers">
                  <AddTeamMembers teamData={data.team} />
                </div>
              </>
              <EditTeamDetailModal
                isVisible={isVisibleEditDetails}
                teamData={data.team}
                setIsVisible={setIsVisibleEditDetails}
              />
            </div>
          ) : (
            <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />
          )}
        </>
      </Loading>
    </>
  );
}
