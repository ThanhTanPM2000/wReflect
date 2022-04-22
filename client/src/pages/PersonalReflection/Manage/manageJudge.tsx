import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { AssessmentQueries, CriteriaQueries, TeamQueries } from '../../../grapql-client/queries';
import { Assessment, Team } from '../../../types';
import { Button, Input, Pagination, Select, Tooltip } from 'antd';
import CreatingAssessmentModal from './creatingAssessmentModal';
import { SortDescendingOutlined, SortAscendingOutlined, AimOutlined } from '@ant-design/icons';
import { filterOfGetAssessmentList, sortType } from '../../../grapql-client/queries/assessmentQueries';
import moment from 'moment';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateAssessmentModal from './updateAssessmentModal';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import _ from 'lodash';

const { Search } = Input;
const { Option } = Select;

type Props = {
  teamId: string;
  setTeam: (team: Team) => void;
};

export default function ManageJudge({ teamId, setTeam }: Props) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [sort, setSort] = useState(sortType.DESC);
  const [orderBy, setOrderBy] = useState(filterOfGetAssessmentList.DATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>();

  const { data: criteriaListData } = useQuery<CriteriaQueries.getEssentialDataResult>(CriteriaQueries.getEssentialData);

  const {
    data,
    loading,
    refetch: teamRefetch,
    error: teamError,
  } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const {
    data: assessmentData,
    refetch: assessmentDataRefetch,
    error: assessmentError,
  } = useQuery<AssessmentQueries.getAssessmentsListResult, AssessmentQueries.getAssessmentsListVars>(
    AssessmentQueries.getAssessmentsList,
    {
      variables: {
        teamId,
        search: searchText,
        isGettingAll: false,
        offSet: (page - 1) * size,
        orderBy: filterOfGetAssessmentList.DATE,
        sort: sortType.DESC,
        limit: size,
      },
    },
  );

  useEffect(() => {
    setTeam(data?.team);
  }, [data]);

  const handleFilterBy = (value: string) => {
    console.log(value);
  };

  const onHandleSearch = (searchText: string) => {
    setSearchText(searchText);
    setPage(1);
  };

  const onPaginationChanged = (page: number, pageSize: number | undefined) => {
    setPage(page);
    pageSize && setSize(pageSize);
  };

  const handleRefetch = () => {
    teamRefetch();
    assessmentDataRefetch();
  };

  return (
    <Loading
      refetch={handleRefetch}
      data={!_?.isNull(data) && !_?.isNull(assessmentData)}
      loading={loading}
      error={teamError || assessmentError}
    >
      <>
        <div>
          <div className="personalSection">
            <div className={`manageJudge primary`}>Manage</div>
            <div onClick={() => history?.push(`/personal-reflect/analysis/${data?.team?.id}`)} className={`analysis`}>
              Analysis
            </div>
          </div>
        </div>
        <div className="manageJudgePage content">
          <div className="actionSection">
            <SearchBar placeholder="What are you looking for ?" isLoading={loading} onHandleSearch={onHandleSearch} />
            <Select defaultValue="NAME_DESC" onSelect={handleFilterBy}>
              <Option key="NAME_ASC" value="NAME_ASC">
                <SortAscendingOutlined /> Sort By Ascending Name
              </Option>
              <Option key="NAME_DESC" value="NAME_DESC">
                <SortDescendingOutlined /> Sort By Descending Name
              </Option>
              <Option key="DATE_ASC" value="DATE_ASC">
                <SortAscendingOutlined /> Sort By Ascending Date
              </Option>
              <Option key="DATE_DESC" value="DATE_DESC">
                <SortDescendingOutlined /> Sort By Descending Date
              </Option>
              <Option key="STATUS_ASC" value="STATUS_ASC">
                <SortAscendingOutlined /> Sort By Ascending Status
              </Option>
              <Option key="STATUS_DESC" value="STATUS_DESC">
                <SortDescendingOutlined /> Sort By Descending Status
              </Option>
            </Select>
            <div>
              <Button onClick={() => setIsCreateModalVisible(true)} type="primary">
                Create Assessment
              </Button>
            </div>
          </div>
          <div className="assessmentContainer"></div>
          <CreatingAssessmentModal
            criteriaData={criteriaListData?.getEssentialData?.criteriaList}
            team={data?.team}
            isVisible={isCreateModalVisible}
            setVisible={setIsCreateModalVisible}
          />
          <UpdateAssessmentModal
            assessment={selectedAssessment}
            criteriaData={criteriaListData?.getEssentialData?.criteriaList}
            team={data?.team}
            isVisible={isUpdateModalVisible}
            setVisible={setIsUpdateModalVisible}
          />
          <div className="container">
            <div style={{ marginTop: '50px' }} className="flex flex-ai-c flex-jc-c mt-25">
              <Pagination
                defaultCurrent={1}
                current={page}
                total={assessmentData?.getAssessmentsList?.total}
                defaultPageSize={8}
                pageSize={size}
                onChange={(page: number, pageSize?: number | undefined) => onPaginationChanged(page, pageSize)}
              />
            </div>
            <div className="listOfAssessment">
              {assessmentData?.getAssessmentsList?.data?.map((assessment) => (
                <>
                  <div key={assessment?.id} className={`assessmentCard ${assessment?.status == 'Complete' && 'done'}`}>
                    <div className="inforAssessment">
                      <div className="fieldInfor">
                        <div className="upperCase">Name:</div>
                        {assessment?.name?.toUpperCase()}
                      </div>
                      <div className="fieldInfor">
                        <div className="upperCase">Status:</div>
                        {assessment.status}
                      </div>
                      <div className="flex flex-dir-r">
                        <h3>{moment(+assessment.startDate).format('DD/MM/YYYY')}</h3>
                        <h3>{moment(+assessment.endDate).format('DD/MM/YYYY')}</h3>
                      </div>
                    </div>
                    <div className="actionAssessment">
                      <Tooltip title="Do Personal Reflection">
                        <AimOutlined
                          onClick={() => history.push(`/personal-reflect/do/${teamId}/${assessment?.id}`)}
                          style={{ marginRight: 20, fontSize: 15 }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={() => {
                            setSelectedAssessment(assessment);
                            setIsUpdateModalVisible(true);
                          }}
                          style={{ marginRight: 20, fontSize: 15 }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteOutlined
                          onClick={() => console.log('Deleted')}
                          style={{ marginRight: 20, fontSize: 15 }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </>
    </Loading>
  );
}
