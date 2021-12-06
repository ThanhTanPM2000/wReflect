import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, DatePicker, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';

import { AddNewTeam } from '../../grapql-client/mutations';
import { getTeams } from '../../grapql-client/queries';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type Props = {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
};

const TeamCreateModal = ({ isVisible, setIsVisible }: Props) => {
  const [addNewTeam, { error, loading }] = useMutation(AddNewTeam, {
    refetchQueries: [
      getTeams, // DocumentNode object parsed with gql
      'teams', // Query name
    ],
  });

  const [form] = Form.useForm();

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const onFinish = () => {
    form.validateFields().then(async (values: any) => {
      const startDate = values['range-picker'] && values['range-picker'][0] ? values['range-picker'][0] : moment();
      const endDate = values['range-picker'] && values['range-picker'][1] ? values['range-picker'][1] : moment();
      const teamName = values['teamName'];
      const teamDescription = values['teamDescription'];
      const isPublic = values['select'] === 'public' ? true : false;

      // console.log(startDate);
      // console.log(endDate);
      // console.log(teamName);
      // console.log(teamDescription);
      // console.log(isPublic);

      addNewTeam({
        variables: { startDate, endDate, name: teamName, description: teamDescription, isPublic: isPublic },
      });
      setIsVisible(false);
    });
  };

  return (
    <Modal title="Create Your Team" visible={isVisible} onOk={onFinish} onCancel={() => setIsVisible(false)}>
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name="teamName"
          hasFeedback
          label="Team Name"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <Input placeholder="Input team name" type="text" name="name" />
        </Form.Item>
        <Form.Item
          name="teamDescription"
          hasFeedback
          label="Description"
          rules={[{ required: true, message: 'Please input your name' }]}
        >
          <TextArea placeholder="Description of the team" rows={4} name="description" />
        </Form.Item>
        <Form.Item name="upload" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="range-picker" label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item name="select" label="Select">
          <Select>
            <Select.Option value="private">Private</Select.Option>
            <Select.Option value="public">Public</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TeamCreateModal;
