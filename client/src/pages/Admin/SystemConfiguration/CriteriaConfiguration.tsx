import React from 'react';
import { Card } from 'antd';

const { Meta } = Card;

export default function CriteriaConfiguration() {
  return (
    <div className="criteriaConfiguration ">
      <Card className="purple mt-25" hoverable cover={<img alt="example" src="/images/criteria.jpeg" />}>
        <Meta
          title="Criteria Configuration"
          description="You can config all default health check that will show up in Health Check section of entire users"
        />
      </Card>
    </div>
  );
}
