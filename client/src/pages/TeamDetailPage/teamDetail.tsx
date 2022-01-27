import React, { useState, useContext, useRef } from 'react';
import { Menu, Button, Tabs, Skeleton, Dropdown, List, Modal, Avatar } from 'antd';
import { ExclamationCircleOutlined, EditFilled, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery, useLazyQuery, NetworkStatus } from '@apollo/client';

import { PlusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import AddMembersModal from './addMemberModal';
import { TeamQueries } from '../../grapql-client/queries';
import { TeamMutations } from '../../grapql-client/mutations';
import EditTeamDetailModal from './editTeamDetailModal';

import ListMember from './listMember';
import SearchBar from '../../components/SearchBar/SearchBar';
import { Member } from '../../types';
import { Loading } from '../../components/Loading';
import { TopNavBar } from '../../components/TopNavBar';

const { TabPane } = Tabs;

type Props = {
  teamId: string;
};

const TeamDetail = ({ teamId }: Props) => {
  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  return (
    <>
      <TopNavBar team={data?.team} title="Team Details" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <div
          className="teamDetails site-layout-background flex flex-1 flex-dir-r"
          style={{ height: '100%', padding: '5px' }}
        >
          <>
            <div className="flex flex-2 flex-jc-sb" style={{ padding: 24, height: '100%' }}>
              <div className="flex flex-ai-c flex-jc-sb">
                <Avatar shape="square" size={250} src={data?.team?.picture}></Avatar>
                <div
                  className="flex flex-ai-c flex-jc-sb nameTeam"
                  style={{ marginTop: '25px', height: 100, width: 500, overflow: 'hidden' }}
                >
                  Team: {data?.team?.name}
                </div>
                <div>Description: {data?.team?.description}</div>
                <div style={{ marginTop: '20px' }}>
                  {data?.team?.members.map((member: Member) => {
                    return (
                      <Avatar
                        style={{ marginRight: '3px' }}
                        size="small"
                        key={member?.user?.email}
                        src={member?.user?.picture}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-ai-c flex-jc-c">
                <Button
                  type="primary"
                  shape="round"
                  icon={<EditFilled />}
                  size="large"
                  // onClick={() => setIsVisibleEditDetails(true)}
                >
                  Edit Details
                </Button>
              </div>
            </div>
            <div
              className="flex-5 site-layout-background card-workspace"
              style={{
                padding: 24,
                height: '100%',
                boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
              }}
            ></div>
          </>
        </div>
      </Loading>
    </>
  );
};

export default TeamDetail;
