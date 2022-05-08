import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

export default function HealthCheckConfiguration() {
  return (
    <div className="healthCheckConfiguration ">
      <Card className="pink mt-25" hoverable cover={<img alt="example" src="/images/healthCheck.jpeg" />}>
        <Meta
          title="Health Check Configuration"
          description="
          You can config all default health check that will show up in Health Check section of entire users"
        />
      </Card>
    </div>
  );
}
