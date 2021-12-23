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
  // const handleError = (code: string) => {
  //   switch (code) {
  //     case "404":
  //       return (
  //         <Result
  //       )

  //     default:
  //       break;
  //   }
  // };

  return (
    <>
      {loading || error ? (
        <div className="flex flex-1 flex-ai-c flex-jc-c">
          {loading ? (
            <Spin tip="Loading..." />
          ) : (
            <>
              {console.log('error of loading is ', { ...error })}
              <Result
                status={error?.graphQLErrors[0]?.extensions?.code}
                // title="There are some problems with your operation."
                title={error?.graphQLErrors[0]?.extensions?.code}
                subTitle={error?.message}
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
            </>
          )}
        </div>
      ) : (
        <>{data ? children : <Empty description="No Teams Data" className="flex flex-dir-c flex-ai-c flex-jc-c" />}</>
      )}
    </>
  );
}
