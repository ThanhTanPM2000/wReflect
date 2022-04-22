import { Modal, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { AssessmentOnCriteria, Member } from '../../../types';

const { TextArea } = Input;

type Props = {
  member: Member;
  criteriaQuestion: AssessmentOnCriteria;
  comment: string;
  setComment: (value: string) => void;
  isVisible: boolean;
  setVisible: (value: boolean) => void;
};

export default function CommentModal({ isVisible, setVisible, comment, setComment, member, criteriaQuestion }: Props) {
  const [value, setValue] = useState(comment);

  useEffect(() => {
    setValue(comment);
  }, [comment]);

  const handleSave = () => {
    setComment(value);
    setVisible(false);
  };

  return (
    <Modal
      className={`headerModal-purple`}
      destroyOnClose
      title={
        <div className="flex flex-ai-c flex-jc-c">
          <h3 style={{ color: 'white' }}>{member?.user?.nickname}</h3>
          <div style={{ color: 'white' }}>{criteriaQuestion?.criteria?.name}</div>
        </div>
      }
      centered
      maskClosable={false}
      closable={false}
      footer={<Button onClick={() => handleSave()}>Done</Button>}
      onCancel={() => {
        setVisible(false);
      }}
      visible={isVisible}
    >
      <TextArea
        style={{ height: '200px' }}
        autoFocus
        placeholder="Comment about ..."
        value={value}
        onChange={(value) => setValue(value.currentTarget.value)}
      />
    </Modal>
  );
}
