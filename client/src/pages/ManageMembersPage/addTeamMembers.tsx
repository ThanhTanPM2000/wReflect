import React, { useState, useRef } from 'react';
import { TweenOneGroup } from 'rc-tween-one';
import { Form, notification, message, Button, FormInstance, Input, Tag, Switch, Tooltip } from 'antd';
import { useMutation } from '@apollo/client';
import { MemberMutations } from '../../grapql-client/mutations';
import { TeamQueries } from '../../grapql-client/queries';
import { UserAddOutlined, CheckOutlined, SendOutlined, CopyOutlined, CloseOutlined } from '@ant-design/icons';
import _ from 'lodash';

const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

type Props = {
  teamId: string;
};

type listStatusAddMembers = {
  success: [string];
  errors: [string];
};

const showNotification = (data: listStatusAddMembers) => {
  const { success, errors } = data;
  success.map((suc: string) => {
    message.success(suc);
  });
  errors.map((error: string) => {
    message.error(error);
  });
};

const AddMembersModal = ({ teamId }: Props) => {
  const [inviteUrl, setInviteUrl] = useState('http://localhost:3000');
  const [listEmails, setListEmails] = useState<string[]>([]);
  const formRef = useRef<FormInstance>(null);

  const [addNewMember] = useMutation(MemberMutations.AddNewMember, {
    refetchQueries: [TeamQueries.getTeam],
  });

  const onAddEmail = (value: any) => {
    if (validEmail.test(value.email)) {
      if (!listEmails.includes(value.email)) {
        const newListEmails = _.clone(listEmails);
        setListEmails([...newListEmails, value.email]);
      }
      formRef.current?.resetFields();
    } else {
      notification.warning({
        message: `Notification`,
        description: `${value.email} is not a valid email`,
        placement: 'bottomLeft',
      });
    }
  };

  const handleClose = (removedEmail: string) => {
    const newListEmails = listEmails.filter((email) => email !== removedEmail);
    setListEmails(newListEmails);
  };

  const tagChild = listEmails.map((email) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(email);
        }}
      >
        {email}
      </Tag>
    );
    return (
      <span key={email} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  });

  const handleDeleteData = () => {
    setListEmails([]);
    formRef.current?.resetFields();
  };

  const handleCreate = async () => {
    const myListEmails = _.clone(listEmails);
    setListEmails([]);
    const { data } = await addNewMember({ variables: { emailUsers: myListEmails, teamId } });
    showNotification(data.addMember);
    formRef.current?.resetFields();
  };

  const copyToClipboard = async () => {
    navigator.clipboard
      .writeText(inviteUrl)
      .then(() => {
        message.info('Embedded Url is copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy url to clipboard!');
      });
  };

  return (
    <div>
      <h3>Add Team Members</h3>
      <h4 className="flex flex-dir-r mt-25">
        Invite via URL
        <Switch
          style={{ marginLeft: 'auto' }}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
        />
      </h4>
      <p>Anyone with the link can join your team.</p>
      <div>
        <Input.Group compact>
          <Input style={{ width: 'calc(100% - 80px)' }} defaultValue={inviteUrl} />
          <Tooltip title="copy git url">
            <Button onClick={copyToClipboard} icon={<CopyOutlined />} />
          </Tooltip>
        </Input.Group>
      </div>
      <h4 className="mt-25">Invite via Email</h4>
      <Form onFinish={(value) => onAddEmail(value)} ref={formRef}>
        <Input.Group compact className="flex flex-dir-r">
          <Form.Item
            style={{ width: 'calc(100% - 30px)' }}
            name="email"
            rules={[
              { required: true, message: 'Input is empty' },
              { type: 'email', message: 'The input is not valid E-mail!' },
            ]}
          >
            <Input allowClear autoFocus placeholder="Please input email to add member in Team" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              icon={<UserAddOutlined />}
              size="middle"
              style={{ width: '100px' }}
              title="Add"
              type="primary"
            >
              Add
            </Button>
            <Button
              className="ml-10"
              icon={<SendOutlined />}
              size="middle"
              style={{ width: '100px' }}
              title="Send"
              type="primary"
            >
              Send
            </Button>
          </Form.Item>
        </Input.Group>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
            }}
            onEnd={(e: any) => {
              if (e?.type === 'appear' || e?.type === 'enter') {
                e.target.style = 'display: inline-block';
              }
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
      </Form>
    </div>
  );
};

export default AddMembersModal;
