import React, { useEffect, useState } from 'react';
import { Input, Select, Button, Form, notification } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { OpinionStatus } from '../../types';
import { useMutation, useQuery } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { columnActionTrackerDefault } from '../../const/boardTemplateOption';
import { TopNavBar } from '../../components/TopNavBar';
import { OpinionMutations } from '../../grapql-client/mutations';
import ActionSelect from './actionSelect';
import CreateAction from './createAction';

const { Option } = Select;

type Props = {
  teamId: string;
};

export default function actionsTracker({ teamId }: Props) {
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedAssigners, setSelectedAssigners] = useState<string[]>([]);

  const { data } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setSelectedBoards(data?.team?.boards?.map((board) => board.id) || []);
    setSelectedAssigners([...(data?.team?.members?.map((member) => member?.user?.id) || []), 'not-assigned'] || []);
  }, []);

  const [updateOpinion] = useMutation(OpinionMutations.updateOpinion, {
    onError: (error) => {
      notification.error({
        placement: 'bottomRight',
        message:
          error?.message === 'You dont have permission for this mutation' &&
          'You can only change actions that assigned to you',
      });
    },
  });

  const handleOnDragEnd = (result: DropResult) => {
    if (result && !result.destination) return;
    updateOpinion({
      variables: {
        teamId,
        opinionId: result.draggableId,
        status: result.destination?.droppableId as OpinionStatus,
      },
      optimisticResponse: {
        updateOpinion: {
          id: result.draggableId,
          __typename: 'Opinion',
          status: result.destination?.droppableId as OpinionStatus,
        },
      },
    });
  };

  const optionChildBoard = data?.team?.boards.map((board) => (
    <Option key={board.id} value={board.id}>
      {board.title}
    </Option>
  ));

  const optionChildAssignees = data?.team?.members.map((member) => (
    <Option key={member?.id} value={member?.user?.id}>
      {member?.user?.nickname}
    </Option>
  ));

  const handleOnSelectBoards = (value: string) => {
    if (value === 'selectAll') {
      setSelectedBoards(data?.team?.boards?.map((board) => board.id) || []);
    } else {
      setSelectedBoards([...selectedBoards, value]);
    }
  };

  const handleOnSelectAssigners = (value: string) => {
    if (value === 'selectAll') {
      setSelectedAssigners([...(data?.team?.members?.map((member) => member?.user?.id) || []), 'not-assigned'] || []);
    } else {
      setSelectedAssigners([...selectedAssigners, value]);
    }
  };

  const handleOnDeselectBoards = (value: string) => {
    setSelectedBoards(selectedBoards.filter((selectBoard) => selectBoard !== value));
  };
  const handleOnDeselectAssigners = (value: string) => {
    setSelectedAssigners(selectedAssigners.filter((selectAssigner) => selectAssigner !== value));
  };

  return (
    <>
      <TopNavBar team={data?.team} title="Actions Tracker" />
      <div className="actionsTracker">
        <div className="header">
          <h2>Actions Tracker</h2>
          <p>Here you can create new action items & keep track of all the actions items in your teams.</p>
        </div>
        <CreateAction team={data?.team} selectedBoards={selectedBoards} />
        <div className="fullBoard">
          <div className="team actioncontainer">
            <div className="boards">
              <label>Board(s)</label>
              <Select
                onSelect={handleOnSelectBoards}
                onDeselect={handleOnDeselectBoards}
                showArrow
                allowClear
                onClear={() => setSelectedBoards([])}
                placeholder="Select..."
                mode="multiple"
                style={{ width: '100%' }}
                value={selectedBoards}
              >
                <Option key="selectAll" value="selectAll">
                  Select All
                </Option>
                {optionChildBoard}
              </Select>
            </div>
            <div className="assignees">
              <label>Assignee(s)</label>
              <Select
                onSelect={handleOnSelectAssigners}
                onDeselect={handleOnDeselectAssigners}
                showArrow
                allowClear
                onClear={() => setSelectedAssigners([])}
                placeholder="Select..."
                mode="multiple"
                value={selectedAssigners}
                style={{ width: '100%' }}
              >
                <Option key="selectAll" value="selectAll">
                  Select All
                </Option>
                <Option key="notAssigned" value="not-assigned">
                  Not Assigned
                </Option>
                {optionChildAssignees}
              </Select>
            </div>
          </div>
          <div
            className="boardcont"
            style={{
              marginTop: '20px',
            }}
          >
            <div className="board flex flex-dir-r">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                {data?.team && data?.team?.boards.length != 0 ? (
                  columnActionTrackerDefault.map((columnActions: { name: string; key: string; index: string }) => {
                    return (
                      <Droppable key={columnActions.key} droppableId={columnActions.key}>
                        {(provided) => (
                          <div className="column flex" {...provided.droppableProps} ref={provided.innerRef}>
                            <div className="colHead">
                              <div className="titleHead">{columnActions.name}</div>
                              <div className="actionHead"></div>
                            </div>
                            <div className="colContent">
                              <div>
                                {data?.team?.boards?.map((board) => {
                                  return (
                                    selectedBoards.includes(board.id) &&
                                    board?.columns?.map((column) =>
                                      column?.opinions?.map((opinion, index) => {
                                        if (
                                          opinion?.status === columnActions?.key &&
                                          selectedAssigners.includes(opinion.responsible)
                                        ) {
                                          return (
                                            <Draggable draggableId={opinion?.id} index={index} key={opinion?.id}>
                                              {(provided) => (
                                                <div
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  ref={provided.innerRef}
                                                >
                                                  {opinion.isAction && (
                                                    <div className={`opinionCol ${opinion.color}`}>
                                                      <div className="opinionHeader"></div>
                                                      <div className="opinionContent">
                                                        <p>
                                                          {opinion?.text?.split('\n').map((str) => {
                                                            return (
                                                              <>
                                                                {str}
                                                                <br />
                                                              </>
                                                            );
                                                          })}
                                                        </p>
                                                        {/* <ActionComponent
                                                        board={board}
                                                        column={column}
                                                        opinion={opinion}
                                                      /> */}
                                                        <ActionSelect
                                                          team={data?.team}
                                                          board={board}
                                                          column={column}
                                                          opinion={opinion}
                                                        />
                                                      </div>
                                                      <div className="opinionFooter"></div>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          );
                                        }
                                      }),
                                    )
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  })
                ) : (
                  <div></div>
                )}
              </DragDropContext>
            </div>
          </div>
          <label className="error"></label>
        </div>
      </div>
    </>
  );
}
