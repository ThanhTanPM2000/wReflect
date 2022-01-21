import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import Picker, { IEmojiData } from 'emoji-picker-react';

import { Board } from '../../types';
import { SmileOutlined } from '@ant-design/icons';
import boardTemplate from '../../const/boardTemplateOption';
import ConfigColumn from './configColumn';
import { template } from 'lodash';

type Props = {
  board?: Board;
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
};

type boardTemplateType = {
  name: string;
  columns: string[];
};

const { Option } = Select;

export default function ConfigBoardModal({ board, visible, setVisible }: Props) {
  const [templateSelect, setTemplateSelect] = useState<string>('defaultBoard');
  const boardOption = new Map<string, boardTemplateType>();
  // boardTemplate.map((template, index) => boardOption.set(index, template));

  const handleSelectTemplate = (value: string) => {
    setTemplateSelect(value);
  };

  // const renderColumn = () => {
  //   let arr = [],
  //   for (let idx = 1; idx <= 5; idx++) {
  //     arr.push(())
  //   }
  // };

  return (
    <Modal
      className="configBoard"
      centered
      visible={visible}
      footer={null}
      onCancel={() => setVisible(false)}
      width={1000}
    >
      <Form>
        <div className="config-board-modal">
          <div className="edit-board-modal">
            <h2>Edit board</h2>
            <Form.Item>
              <h4>Board Type</h4>
              <span>You can run a retrospective with phases</span>
              <Input defaultValue={board?.title} placeholder="Board Title" />
            </Form.Item>

            <Form.Item>
              <h4>Board Type</h4>
              <span>You can run a retrospective with phases</span>
              <Select defaultValue={board?.type}>
                <Option value="DEFAULT">No Phase</Option>
                <Option value="PHASE">Phase (Reflect, Group, Votes, Discuss)</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <h4>Max Votes</h4>
              <span>The number of votes per participant</span>
              <InputNumber style={{ width: '100%' }} value={board?.votesLimit ?? 25} />
            </Form.Item>
          </div>
          <div className="setting-board-modal">
            <h2>Configurations</h2>
            <Form.Item>
              <div>
                <h4>Public Board</h4>
                <Switch />
              </div>
              <span>Anyone with the link to board can access it</span>
            </Form.Item>

            <Form.Item>
              <div>
                <h4>Run Retrospective Anonymously</h4>
                <Switch />
              </div>
              <span>All the participants will give feedback anonymously</span>
            </Form.Item>
            <Form.Item>
              <div>
                <h4>Disable Up Votes</h4>
                <Switch />
              </div>
              <span>The participants will not be able to up vote</span>
            </Form.Item>
            <Form.Item>
              <div>
                <h4>Disable Down Votes</h4>
                <Switch />
              </div>
              <span>The participants will not be able to down vote</span>
            </Form.Item>
          </div>
          <div className="config-column-board-modal">
            <h2>Columns</h2>
            <div style={{ marginTop: '10px', width: '100%' }}>
              <Select onSelect={handleSelectTemplate} style={{ width: '100%' }} defaultValue="defaultBoard">
                <Option key="defaultBoard" value="defaultBoard">
                  -- Board Templates --
                </Option>
                {[
                  ...boardTemplate.map((template, index) => (
                    <Option key={`${index}`} value={index}>
                      {template.name}
                    </Option>
                  )),
                ]}
              </Select>

              {templateSelect === 'defaultBoard' ? (
                <ConfigColumn board={board} titleColumn="hello" />
              ) : (
                <ConfigColumn titleColumn="what" />
              )}
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
