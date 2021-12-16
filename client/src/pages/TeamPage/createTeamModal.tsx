import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, DatePicker, Upload, Button, Select, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';

import { TeamMutations } from '../../grapql-client/mutations';
import { TeamQueries } from '../../grapql-client/queries';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

type Props = {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
};

const CreateTeamModal = ({ isVisible, setIsVisible }: Props) => {
  const [form] = Form.useForm();

  const [addNewTeam] = useMutation(TeamMutations.addNewTeam, {
    refetchQueries: [
      TeamQueries.getTeams, // DocumentNode object parsed with gql
      'teams', // Query name
    ],
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = () => {
    form.validateFields().then(async (values: any) => {
      console.log('all arguments ', values);
      const startDate = values['range-picker'] && values['range-picker'][0] ? values['range-picker'][0] : moment();
      const endDate = values['range-picker'] && values['range-picker'][1] ? values['range-picker'][1] : moment();
      const teamName = values['teamName'];
      const teamDescription = values['teamDescription'];
      const isPublic = values['select'] === 'public' ? true : false;
      const picture = values['upload'][0]?.response;

      addNewTeam({
        variables: {
          startDate,
          endDate,
          name: teamName,
          description: teamDescription,
          picture: picture,
          isPublic: isPublic,
        },
      });
      form.resetFields();
      setIsVisible(false);
    });
  };

  return (
    <Modal
      destroyOnClose={true}
      closable
      centered
      title="Create Your Team"
      visible={isVisible}
      okText="Create"
      onOk={onFinish}
      onCancel={() => setIsVisible(false)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="teamName"
          hasFeedback
          label="Team Name"
          rules={[
            { required: true, message: 'Please input your team name' },
            { min: 5, message: 'Team name must be minimum 5 characters.' },
            { max: 25, message: 'Team name must be maximum 25 characters.' },
          ]}
        >
          <Input bordered placeholder="Input team name" type="text" name="name" />
        </Form.Item>
        <Form.Item
          name="teamDescription"
          hasFeedback
          label="Description"
          rules={[
            { required: true, message: 'Please input your team description' },
            { min: 15, message: 'Team desciption must be minimum 15 characters.' },
            { max: 100, message: 'Team name must be maximum 100 characters.' },
          ]}
        >
          <TextArea bordered placeholder="Description of the team" rows={4} name="description" />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: 'Please input images' }]}
          name="upload"
          label="Upload"
          valuePropName="file"
          getValueFromEvent={normFile}
        >
          <Upload
            action="http://localhost:4000/api/upload"
            name="photo"
            multiple={false}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="range-picker" label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item name="select" label="Select">
          <Select defaultValue="public">
            <Select.Option value="private">Private</Select.Option>
            <Select.Option value="public">Public</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTeamModal;
