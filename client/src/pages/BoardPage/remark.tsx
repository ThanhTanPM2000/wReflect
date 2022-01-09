import { Dropdown, Input, Menu, Modal } from 'antd';
import React, { KeyboardEvent, useEffect, useState, useRef } from 'react';
import { Opinion, Remark } from '../../types';
import { EllipsisOutlined, DeleteFilled } from '@ant-design/icons';
import { useMutation, useApolloClient } from '@apollo/client';
import { RemarkMutations } from '../../grapql-client/mutations';
import _ from 'lodash';

type Props = {
  isOpenRemark: boolean;
  setIsOpenRemark: (closeRemark: boolean) => void;
  opinion: Opinion;
};

const { TextArea } = Input;

export default function RemarkComponent({ isOpenRemark, setIsOpenRemark, opinion }: Props) {
  const [textRemark, setTextRemark] = useState('');
  const remarkListRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();

  useEffect(() => {
    remarkListRef?.current?.scrollTo(0, remarkListRef.current.scrollHeight);
  }, [opinion, isOpenRemark]);

  const [removeRemark] = useMutation<RemarkMutations.removeRemarkResult, RemarkMutations.removeRemarkVars>(
    RemarkMutations.removeRemark,
  );

  const [createRemark] = useMutation<RemarkMutations.createRemarkResult, RemarkMutations.createRemarkVars>(
    RemarkMutations.createRemark,
  );

  const handleOnCreateRemark = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.currentTarget.value !== '') {
      createRemark({
        variables: {
          opinionId: opinion.id,
          text: e.currentTarget.value,
        },
        update: (store, { data }) => {
          store.modify({
            id: store.identify(opinion),
            fields: {
              remarks(existingData) {
                const newRemarks = _.cloneDeep(existingData);
                return newRemarks.push(data?.createRemark);
              },
            },
          });
          setTextRemark('');
        },
      });
    }
  };
  return (
    <Modal
      className={`headerModal-${opinion.color}`}
      title={
        <div className="headerModalText">
          <p>{opinion.text}</p>
        </div>
      }
      centered
      visible={isOpenRemark}
      closable
      footer={null}
      onCancel={() => setIsOpenRemark(false)}
    >
      <div className="remarkline" ref={remarkListRef}>
        {opinion.remarks?.map((remark) => (
          <>
            <div className="remark">
              <div className="remarkHeader">
                <p>{opinion.author.profile.nickname}</p>
                <Dropdown
                  overlayStyle={{ width: '180px' }}
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          console.log(opinion);
                          const prevOpinion = _.cloneDeep(opinion);
                          client.cache.modify({
                            id: client.cache.identify(opinion),
                            fields: {
                              remarks(existingData, { readField }) {
                                return existingData.filter((cur: Remark) => readField('id', cur) !== remark.id);
                              },
                            },
                          });
                          removeRemark({
                            variables: {
                              remarkId: remark.id,
                            },
                            onError() {
                              client.cache.modify({
                                id: client.cache.identify(opinion),
                                fields: {
                                  remarks() {
                                    return prevOpinion.remarks;
                                  },
                                },
                              });
                            },
                          });
                        }}
                        key="3"
                        icon={<DeleteFilled />}
                      >
                        Remove
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Dropdown>
              </div>
              <div className="remarkContent">{remark.text}</div>
            </div>
          </>
        ))}
      </div>
      <TextArea
        autoFocus
        style={{ marginTop: '20px' }}
        value={textRemark}
        onChange={(value) => setTextRemark(value.currentTarget.value)}
        onPressEnter={handleOnCreateRemark}
      />
    </Modal>
  );
}
