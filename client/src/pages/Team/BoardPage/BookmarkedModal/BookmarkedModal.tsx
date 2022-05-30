import { Modal } from 'antd';
import React from 'react';
import { Board } from '../../../../types';

type Props = {
  board: Board;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
};

export default function BookmarkedModal({ board, isVisible, setIsVisible }: Props) {
  return (
    <Modal
      className={`headerModal`}
      maskStyle={{ backgroundColor: '#a4a0f1' }}
      title={
        <div className="flex flex-dir-c headerModalText">
          <div className="owner-opinion"></div>
          <p>Bookmarking Opinion/Acion List</p>
        </div>
      }
      centered
      visible={isVisible}
      closable
      footer={null}
      onCancel={() => setIsVisible(false)}
    >
      <div className="bookmarkingList">
        {board?.columns?.map((column) => (
          <>
            {column?.opinions
              ?.filter((opinion) => opinion?.isBookmarked)
              .map((opinion) => (
                <></>
              ))}
          </>
        ))}
      </div>
    </Modal>
  );
}
