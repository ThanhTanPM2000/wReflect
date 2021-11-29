import React from 'react';
import { Image } from 'antd';

const HomePage = () => {
  return (
    <div className="flex flex-jc-sa flex-ai-sa">
      <Image preview={false} src="/homePageMale.png" alt="image" />
      <Image preview={false} src="/homePageFemale.png" alt="image" />
    </div>
  );
};

export default HomePage;
