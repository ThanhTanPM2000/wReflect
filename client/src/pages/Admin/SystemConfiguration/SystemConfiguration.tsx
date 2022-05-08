import React from 'react';
import { Row, Col, PageHeader } from 'antd';
import HealthCheckConfiguration from './HealthCheckConfiguration';
import CriteriaConfiguration from './CriteriaConfiguration';

type Props = {
  isAdmin: boolean;
};

export default function SystemConfiguration({ isAdmin }: Props) {
  return (
    <div className="systemConfiguration flex flex-dir-c flex-1">
      <PageHeader className="site-page-header flex flex-ai-c flex-jc-c" title="System Configuration" />
      <div style={{ overflowY: 'scroll' }}>
        <Row className="flex flex-ai-c flex-jc-c flex-dir-r" gutter={[16, 16]}>
          <Col span={9}>
            <HealthCheckConfiguration />
          </Col>
          <Col span={9}>
            <CriteriaConfiguration />
          </Col>
          <Col span={9}>
            <CriteriaConfiguration />
          </Col>
        </Row>
      </div>
    </div>
  );
}
