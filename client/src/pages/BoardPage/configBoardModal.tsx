import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Board } from '../../types';

type Props = {
  boardData?: Board | null;
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
};

export default function ConfigBoardModal({ boardData, visible, setVisible }: Props) {
  return (
    <Modal centered visible={visible} footer={null} onCancel={() => setVisible(false)} width={1000}>
      <Form>
        <div className="config-board-modal">
          <div className="edit-board-modal">
            <h3>Edit board</h3>
            <Form.Item>
              <Input defaultValue={boardData?.title} placeholder="Board Title" />
            </Form.Item>
            <h5>Team*</h5>
          </div>
          <div className="setting-board-modal">
            <h3>Configurations</h3>
          </div>
          <div className="config-column-board-modal">
            <h3>Columns</h3>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
