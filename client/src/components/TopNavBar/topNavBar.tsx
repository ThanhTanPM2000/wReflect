import React from 'react';
import { Button, Select, PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Team } from '../../types';

const { Option } = Select;

type Props = {
  title: string;
  team?: Team;
  boardId?: string;
};

const TopNavBar = ({ title, team, boardId }: Props) => {
  const history = useHistory();
  const boardOptions = () => {
    return team?.boards?.map((board) => (
      <Option key={board.id} value={board.id}>
        {board.title}
      </Option>
    ));
  };

  const handleRenderExtra = () => {
    switch (title) {
      case 'Manage Members':
        return [];
      case 'Do Reflect':
        return [
          <Select
            placeholder="Select board"
            key="5"
            style={{ width: 200 }}
            bordered
            optionFilterProp="children"
            defaultValue={boardId || ''}
          >
            {boardOptions()}
          </Select>,
        ];

      default:
        return [];
    }
  };

  return (
    <>
      <PageHeader
        className="topNavBar"
        onBack={() => history.replace('/teams')}
        title={title}
        extra={[
          ...handleRenderExtra(),
          <Link key="2" to={`/board/${team?.id}/${team?.boards[0]?.id}`}>
            <Button type={title == 'Do Reflect' ? 'primary' : undefined} key="2">
              Reflect
            </Button>
          </Link>,
          <Link key="3" style={{ textDecoration: 'none' }} to={`/manage-members/${team?.id}`}>
            <Button type={title == 'Manage Members' ? 'primary' : undefined}>Members</Button>
          </Link>,
          <Link key="4" style={{ textDecoration: 'none' }} to={`/manage-board/${team?.id}`}>
            <Button type={title == 'Manage Board' ? 'primary' : undefined} key="1">
              Board
            </Button>
          </Link>,
          <Link key="1" style={{ textDecoration: 'none' }} to="/manage-members/{teamId}">
            <Button type={title == 'Setting' ? 'primary' : undefined} key="1">
              Details
            </Button>
          </Link>,
        ]}
      />
    </>
  );
};

export default TopNavBar;
