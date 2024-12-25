import React from 'react';
import { Flex, Spin } from 'antd';

const Loading: React.FC = () => (
  <Flex align="center" gap="middle">

    <Spin  className='!text-primary' size="large" />
  </Flex>
);

export default Loading;