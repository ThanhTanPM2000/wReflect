import React from 'react';

import { Spin, Result, Button, Empty } from 'antd';

type Props = {
  children: JSX.Element;
  data: boolean;
  refetch: () => void;
  loading: boolean;
  error: any;
};

export default function loading({ children, data, refetch, loading, error }: Props) {
  console.log('error', error);

  return (
    <>
      {loading || error ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c">
          {loading ? (
            <Spin tip="Loading..." />
          ) : (
            <Result
              status="warning"
              title="There are some problems with your operation."
              extra={
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    refetch();
                  }}
                >
                  Reload
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <>{data ? children : <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />}</>
      )}
    </>
  );
}
