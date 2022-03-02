import { useMutation, useQuery } from '@apollo/client';
import { Button, notification, Select, Switch } from 'antd';
import React, { useState } from 'react';
import { TopNavBar } from '../../components/TopNavBar';
import { HealthCheckQueries, TeamQueries } from '../../grapql-client/queries';
import { HealthCheckMutations } from '../../grapql-client/mutations';

import templatesHealthCheck, { templateHealthCheckType } from '../../const/healthCheckTemplate';
import { Board } from '../../types';
import { useEffect } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ResultHealthCheck from './resultHealthCheck';
import { useHistory } from 'react-router-dom';

type Props = {
  teamId: string;
  boardId: string;
};

const { Option } = Select;

export default function HealthCheck({ teamId, boardId }: Props) {
  const history = useHistory();
  const [isViewResult, setIsViewResult] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>();
  const [selecteTemplate, setSelectedTemplate] = useState<templateHealthCheckType>();

  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const { data: healthCheckData } = useQuery<HealthCheckQueries.getBoardResult, HealthCheckQueries.getBoardVars>(
    HealthCheckQueries.getHealthCheck,
    {
      variables: {
        teamId,
        boardId,
      },
    },
  );

  const [startSurvey] = useMutation<HealthCheckMutations.startSurveyResult, HealthCheckMutations.startSurveyVars>(
    HealthCheckMutations.startSurvey,
    {
      onError: () => {
        notification.error({ message: 'Something failed with server', placement: 'bottomRight' });
      },
    },
  );

  useEffect(() => {
    setSelectedBoard(data?.team?.boards.find((board) => board.id === boardId));
    setIsViewResult(false);
  }, [teamId, boardId, data]);

  useEffect(() => {
    setSelectedTemplate(
      templatesHealthCheck.find(
        (template) => template.id === healthCheckData?.getHealthCheck?.healthCheck?.templateId,
      ) || null,
    );
  }, [healthCheckData?.getHealthCheck?.healthCheck]);

  const renderListOptionBoard = data?.team?.boards?.map((board) => (
    <Option value={board?.id} key={board?.id}>
      {board?.title}
    </Option>
  ));

  const handleSelectBoard = (value: string) => {
    // setSelectedBoard(data?.team?.boards?.find((board) => board.id === value));
    history.push(`/team-health/${teamId}/${value}`);
  };

  return (
    <div className="healthCheckPage">
      <TopNavBar team={data?.team} title="Health Check" />
      <div className="team-health">
        {healthCheckData?.getHealthCheck?.healthCheck ? (
          <>
            <div className="header-content">
              <Select onSelect={handleSelectBoard} value={selectedBoard?.id} style={{ width: '200px' }}>
                {renderListOptionBoard}
              </Select>
              <div className="templates-overview poll-center-items">
                <Button onClick={() => history.push(`/board/${teamId}/${boardId}`)} type="ghost">
                  Go To Board
                </Button>
                <Button onClick={() => setIsViewResult(!isViewResult)} style={{ marginLeft: '20px' }}>
                  {isViewResult ? 'Go To Survey' : 'Show Results'}
                </Button>
              </div>
            </div>
            <div className="templates-overview poll-center-items">
              <div className="templates-overview-card poll-center-items" style={{ height: 'auto', minHeight: '0px' }}>
                <h3>{selecteTemplate?.title}</h3>
              </div>
            </div>
            <div className="templates-overview poll-center-items">
              {isViewResult ? (
                <div>
                  <ResultHealthCheck selectedTemplate={selecteTemplate} />
                </div>
              ) : (
                <>
                  {selecteTemplate?.statements.map((statement) => (
                    <div
                      key={statement?.title}
                      className="templates-overview-card poll-center-items"
                      style={{ height: 'auto', minHeight: '180px', cursor: 'auto' }}
                    >
                      <h3>{statement?.title}</h3>
                      <p style={{ textAlign: 'center' }}>{statement?.description}</p>
                      <div className="num-wrapper poll-center-items">
                        <span className="num orange">1</span>
                        <span className="num blue">2</span>
                        <span className="num purple">3</span>
                        <span className="num lpink">4</span>
                        <span className="num green">5</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {!selecteTemplate ? (
              <>
                <div className="header-content">
                  <Select onSelect={handleSelectBoard} value={selectedBoard?.id} style={{ width: '200px' }}>
                    {renderListOptionBoard}
                  </Select>
                  <Button type="ghost">Go To Board</Button>
                </div>
                <div className="templates-overview">
                  {templatesHealthCheck.map((card) => (
                    <div
                      onClick={() => setSelectedTemplate(card)}
                      key={card?.id}
                      className="templates-overview-card poll-center-items"
                    >
                      <h3>{card?.title}</h3>
                      <div className="statement-wrapper poll-center-items">
                        {card?.statements.map((statement) => (
                          <span className={`statement ${statement?.color}`} key={statement.title}>
                            {statement?.title}
                          </span>
                        ))}
                      </div>
                      <Button style={{ fontSize: '10px' }} type="default" size="small">
                        Show Details
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                {/* <Button onClick={() => setSelectedTemplate(null)}>Go Back</Button> */}
                <div className="templates-overview poll-center-items">
                  <Button onClick={() => setSelectedTemplate(null)}>Go Back</Button>
                  <Button
                    onClick={() =>
                      startSurvey({
                        variables: {
                          teamId,
                          boardId,
                          templateId: selecteTemplate.id,
                          isAnonymous: false,
                          isCustom: false,
                          status: 'OPEN',
                        },
                      })
                    }
                    style={{ marginLeft: '20px' }}
                  >
                    Start Survey
                  </Button>
                </div>
                <div className="templates-overview poll-center-items">
                  <span className="anonymous-label"></span>
                  <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
                </div>
                <div className="templates-overview poll-center-items">
                  <div
                    className="templates-overview-card poll-center-items"
                    style={{ height: 'auto', minHeight: '0px' }}
                  >
                    <h3>{selecteTemplate?.title}</h3>
                  </div>
                </div>
                <div className="templates-overview poll-center-items">
                  {selecteTemplate?.statements?.map((statement) => (
                    <div
                      key={statement?.title}
                      className="templates-overview-card poll-center-items"
                      style={{ height: 'auto', minHeight: '180px', cursor: 'auto' }}
                    >
                      <h3>{statement?.title}</h3>
                      <p style={{ textAlign: 'center' }}>{statement?.description}</p>
                      <div className="num-wrapper poll-center-items">
                        <span className="num orange">1</span>
                        <span className="num blue">2</span>
                        <span className="num purple">3</span>
                        <span className="num lpink">4</span>
                        <span className="num green">5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
