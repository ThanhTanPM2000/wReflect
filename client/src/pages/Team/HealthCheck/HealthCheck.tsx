import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, notification, Select, Switch, Badge, Card, Modal } from 'antd';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { Board, Member, Template } from '../../../types';
import { TopNavBar } from '../../../components/TopNavBar';
import { HealthCheckMutations } from '../../../grapql-client/mutations';
// import templatesHealthCheck from '../../../const/healthCheckTemplateDemo';
import { HealthCheckQueries, TeamQueries, TemplateQueries } from '../../../grapql-client/queries';
import QuestionHealthCheck from './QuestionHealthCheck';
import selfContext from '../../../contexts/selfContext';
import { HealthCheckSubscription } from '../../../grapql-client/subcriptions';
import ResultHealthCheck from './resultHealthCheck';
import { getTemplatesOfTeamResult, getTemplatesOfTeamVars } from '../../../grapql-client/queries/TemplateQueries';
import { submitDoPersonalResult } from '../../../grapql-client/mutations/AssessmentMutations';
import {
  submitHealthCheckAnswerResult,
  submitHealthCheckAnswerVars,
} from '../../../grapql-client/mutations/HealthCheckMutation';
import _ from 'lodash';
import { Loading } from '../../../components/Loading';
import CreateCustomTemplate from './Template/CreateCustomTemplateModal';
import TemplateComponent from './Template/TemplateComponent';

type Props = {
  teamId: string;
  boardId: string;
};
const { Option } = Select;
export type answerType = {
  questionId: string;
  point: number;
  comment: string;
};

export default function HealthCheck({ teamId, boardId }: Props) {
  const history = useHistory();
  const me = useContext(selfContext);
  const [isViewResult, setIsViewResult] = useState(false);
  const [isVisibleCreateCustom, setIsVisibleCreateCustom] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>();
  const [selecteTemplate, setSelectedTemplate] = useState<Template>();
  const [answers, setAnswers] = useState<answerType[]>([]);
  const [numOfMemberDoHealthCheck, setNumMembersDoHealthCheck] = useState<number>(0);
  const { t, i18n } = useTranslation();

  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  console.log(selecteTemplate);

  const { data: templates, loading: isLoading1 } = useQuery<getTemplatesOfTeamResult, getTemplatesOfTeamVars>(
    TemplateQueries?.getTemplatesOfTeam,
    {
      variables: {
        teamId,
      },
    },
  );

  const { data: getHealthCheck, loading: isLoading2 } = useQuery<
    HealthCheckQueries.getBoardResult,
    HealthCheckQueries.getBoardVars
  >(HealthCheckQueries.getHealthCheck, {
    variables: {
      teamId,
      boardId,
    },
  });

  const [createHealthCheck] = useMutation<
    HealthCheckMutations.createHealthCheckResult,
    HealthCheckMutations.createHealthCheckVars
  >(HealthCheckMutations.createHealthCheck, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
    updateQueries: {
      getHealthCheck: (previousData, { mutationResult }) => {
        return { getHealthCheck: mutationResult?.data?.startSurveyHealthCheck };
      },
    },
  });

  const [submitHealthCheckAnswer] = useMutation<submitHealthCheckAnswerResult, submitHealthCheckAnswerVars>(
    HealthCheckMutations.submitHealthCheckAnswer,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
      // updateQueries: {
      //   getHealthCheck: (previousData, { mutationResult }) => {
      //     return { getHealthCheck: mutationResult?.data?.submitHealthCheckAnswer};
      //   },
      // },
    },
  );

  const [reopenHealthCheck] = useMutation<
    HealthCheckMutations.reopenHealthCheckResult,
    HealthCheckMutations.reopenHealthCheckVars
  >(HealthCheckMutations.reopenHealthCheck, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message: error?.message,
      });
    },
    updateQueries: {
      getHealthCheck: (previousData, { mutationResult }) => {
        return { getHealthCheck: mutationResult?.data?.reopenHealthCheck };
      },
    },
    variables: {
      teamId,
      boardId,
    },
  });

  useSubscription<HealthCheckSubscription.reopenHealthCheckResult, HealthCheckSubscription.reopenHealthCheckVars>(
    HealthCheckSubscription.updateGetHealthCheckData,
    {
      variables: {
        meId: me?.id,
        teamId: data?.team?.id,
      },
      onSubscriptionData: ({ subscriptionData, client }) => {
        client.cache.updateQuery(
          {
            query: HealthCheckQueries.getHealthCheck,
            variables: {
              teamId,
              boardId,
            },
          },
          (data) => ({
            getHealthCheck: subscriptionData?.data?.subOnUpdateHealthCheck,
          }),
        );
      },
    },
  );

  useEffect(() => {
    setSelectedBoard(data?.team?.boards.find((board) => board.id === boardId));
    setAnswers([]);
    setIsViewResult(false);
    setSelectedTemplate(
      templates?.getTemplatesOfTeam?.find((template) => template.id === getHealthCheck?.getHealthCheck?.templateId),
    );
    const test = _.uniqBy(getHealthCheck?.getHealthCheck?.memberOnHealthCheck, function (e) {
      return e.memberId;
    }).length;
    setNumMembersDoHealthCheck(test);
  }, [teamId, boardId, getHealthCheck, templates]);

  const renderListOptionBoard = data?.team?.boards?.map((board) => (
    <Option value={board?.id} key={board?.id}>
      {board?.title}
    </Option>
  ));

  const handleSelectBoard = (value: string) => {
    setSelectedBoard(data?.team?.boards?.find((board) => board.id === value));
    history.push(`/team-health/${teamId}/${value}`);
  };

  const handleSubmitHealthCheck = () => {
    document.getElementsByClassName('healthCheckPage')[0].scrollTo({
      top: 50,
      behavior: 'smooth',
    });
    if (selecteTemplate?.healthCheckQuestions?.length !== answers.length) {
      notification.error({
        message: 'Please answer all Questions or please reload and try againt.',
        placement: 'bottomRight',
      });
      return;
    } else {
      submitHealthCheckAnswer({
        variables: {
          teamId,
          boardId,
          answers,
        },
      });
    }
  };

  const iMember = data?.team?.members?.find((member) => member.userId === me?.id);
  const answerOfMembers = getHealthCheck?.getHealthCheck?.memberOnHealthCheck?.filter(
    (answer) => answer?.memberId === iMember?.id,
  );
  const handleOnUpdateAnswer = (value: answerType) => {
    const newAnswers = answers?.filter((answer) => answer?.questionId != value?.questionId);
    setAnswers([...newAnswers, value]);
  };

  console.log('d', selecteTemplate);

  return (
    <>
      <CreateCustomTemplate teamId={teamId} isVisible={isVisibleCreateCustom} setIsVisible={setIsVisibleCreateCustom} />
      <TopNavBar iMember={iMember} team={data?.team} boardId={boardId} title="Health Check" />
      <div className="flex flex-dir-c flex-1 scrollable">
        <Card className="healthCheckPage flex flex-1 flex-ai-c flex-jc-c">
          <Loading data={getHealthCheck?.getHealthCheck} loading={isLoading1 || isLoading2}>
            <div className="team-health  flex flex-1 ">
              {getHealthCheck?.getHealthCheck ? (
                <>
                  <div className="flex flex-dir-r flex-jc-sb">
                    <Select
                      showSearch
                      showArrow
                      onSelect={handleSelectBoard}
                      value={boardId}
                      style={{ width: '200px' }}
                    >
                      {renderListOptionBoard}
                    </Select>
                    <div className="flex flex-dir-r flex-gap-10">
                      <Button onClick={() => history.push(`/reflect/${teamId}/${boardId}`)} type="ghost">
                        {t(`txt_heal_check_go_to`)}
                      </Button>
                      {answerOfMembers?.length == 0 ? (
                        <>
                          {isViewResult ? (
                            <Button type={'primary'} onClick={() => setIsViewResult(false)}>
                              Go To Survey
                            </Button>
                          ) : (
                            <Button type={'primary'} onClick={() => setIsViewResult(true)}>
                              Show Results
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          {(iMember?.isOwner || iMember?.isSuperOwner) && (
                            <Button
                              style={{ marginLeft: '10px' }}
                              onClick={() => {
                                Modal.confirm({
                                  title: 'Are you sure want to Reopen this health check',
                                  centered: true,
                                  okText: 'Reopen',
                                  cancelText: 'Cancel',
                                  onOk: async () => {
                                    reopenHealthCheck();
                                  },
                                });
                              }}
                              type="ghost"
                            >
                              {t(`txt_heal_check_reopen`)}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="health-check-answer">
                    <div className="templates-overview poll-center-items">
                      <Card className="flex flex-1 flex-dir-r flex-ai-c flex-jc-c">
                        <h3 className="flex flex-ai-c flex-jc-c">{selecteTemplate?.title}</h3>
                      </Card>
                    </div>
                    {isViewResult || answerOfMembers?.length > 0 ? (
                      <>
                        <div className="chartjs-size-monitor-expand">
                          <ResultHealthCheck
                            team={data?.team}
                            numOfMembersDoHealthCheck={numOfMemberDoHealthCheck}
                            teamId={teamId}
                            boardId={boardId}
                            healthCheck={getHealthCheck?.getHealthCheck}
                            selectedTemplate={selecteTemplate}
                          />
                        </div>
                        <div className="templates-overview poll-center-items">
                          <Card className="templates-overview-card poll-center-items">
                            <h3 className="flex flex-ai-c flex-jc-c">
                              {t(`txt_heal_check_response`)}
                              {`${numOfMemberDoHealthCheck}/${data?.team?.members.length} (${
                                (numOfMemberDoHealthCheck * 100) / data?.team?.members.length
                              }%)`}
                            </h3>
                          </Card>
                        </div>
                        {answerOfMembers?.length > 0 && (
                          <div className="templates-overview poll-center-items">
                            {selecteTemplate?.healthCheckQuestions.map((question) => (
                              <>
                                <QuestionHealthCheck
                                  answer={answerOfMembers?.find((answer) => answer?.questionId === question?.id)}
                                  comments={getHealthCheck?.getHealthCheck?.memberOnHealthCheck?.filter(
                                    (answer) => answer?.questionId === question?.id && !!answer?.comment,
                                  )}
                                  handleUpdateAnswer={handleOnUpdateAnswer}
                                  question={question}
                                />
                              </>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="templates-overview poll-center-items">
                          {selecteTemplate?.healthCheckQuestions.map((question) => (
                            <QuestionHealthCheck
                              key={question.id}
                              handleUpdateAnswer={handleOnUpdateAnswer}
                              question={question}
                            />
                          ))}
                        </div>
                        <div className="flex flex-jc-c flex-ai-c">
                          <Button onClick={handleSubmitHealthCheck} size="large">
                            {t(`txt_heal_check_submit`)}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {!selecteTemplate ? (
                    <>
                      <div className="header-content">
                        <Select
                          showSearch
                          showArrow
                          onSelect={handleSelectBoard}
                          value={selectedBoard?.id}
                          style={{ width: '200px' }}
                        >
                          {renderListOptionBoard}
                        </Select>
                        <div>
                          <Button onClick={() => history.push(`/reflect/${teamId}/${boardId}`)} type="ghost">
                            {t(`txt_heal_check_go_to`)}
                          </Button>
                        </div>
                      </div>
                      <div className="templates-overview flex-wrap">
                        <Card hoverable className="templates-overview-card">
                          <div
                            style={{ justifyContent: 'space-between' }}
                            className="flex flex-1 flex-dir-c flex-gap-10 poll-center-items"
                          >
                            <h3>{t(`txt_heal_check_create`)}</h3>
                            <Button onClick={() => setIsVisibleCreateCustom(true)} type="primary">
                              {t(`txt_heal_check_let`)}
                            </Button>
                          </div>
                        </Card>
                        {templates?.getTemplatesOfTeam?.map((template) => (
                          <>
                            <TemplateComponent
                              template={template}
                              setSelectedTemplate={setSelectedTemplate}
                              iMember={iMember}
                            />
                          </>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div>
                      {/* <Button onClick={() => setSelectedTemplate(null)}>Go Back</Button> */}
                      <div className="flex flex-dir-r flex-gap-10 flex-jc-c flex-ai-c">
                        <Button onClick={() => setSelectedTemplate(null)}>{t(`txt_heal_check_back`)}</Button>
                        <Button
                          type="primary"
                          onClick={() =>
                            createHealthCheck({
                              variables: {
                                teamId,
                                boardId,
                                templateId: selecteTemplate.id,
                                isAnonymous: false,
                              },
                            })
                          }
                        >
                          {t(`txt_heal_check_survey`)}
                        </Button>
                      </div>
                      <div className="templates-overview poll-center-items">
                        <span style={{ marginRight: '10px' }} className="anonymous-label">
                          {t(`txt_heal_check_secret`)}
                        </span>
                        <Switch
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          defaultChecked
                        />
                      </div>
                      <Card className="flex flex-ai-c flex-jc-c">
                        <h3 className="flex flex-ai-c flex-jc-c">{selecteTemplate?.title}</h3>
                      </Card>
                      <div className="templates-overview poll-center-items flex-wrap">
                        {selecteTemplate?.healthCheckQuestions?.map((question) => (
                          <Card
                            hoverable
                            className="templates-overview-card"
                            style={{ cursor: 'auto' }}
                            key={question?.id}
                          >
                            <div className="flex flex-1 flex-dir-c flex-gap-10 flex-jc-sb poll-center-items">
                              <h3>{question?.title}</h3>
                              <p style={{ textAlign: 'center' }}>{question?.description}</p>
                              <div className="num-wrapper poll-center-items">
                                <span className="num orange">1</span>
                                <span className="num blue">2</span>
                                <span className="num purple">3</span>
                                <span className="num lpink">4</span>
                                <span className="num green">5</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Loading>
        </Card>
      </div>
    </>
  );
}
