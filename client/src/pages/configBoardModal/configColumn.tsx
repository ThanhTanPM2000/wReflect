import React, { useState } from 'react';
import { Form, Input, Switch } from 'antd';

import { SmileOutlined } from '@ant-design/icons';
import { Board, Column } from '../../types';

type Props = {
  board?: Board;
  column?: Column;
  titleColumn: string;
};

export default function ConfigColumn({ board, column, titleColumn }: Props) {
  const [isActive, setIsActive] = useState(column?.isActive);

  return (
    <Form.Item>
      <div className="configColumn">
        <Input prefix={<SmileOutlined />} defaultValue={board?.title} placeholder="Column 1" />
        <Switch />
      </div>
    </Form.Item>
  );
}
