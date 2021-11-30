import React from 'react';
import { Image } from 'antd';
import { Header } from './../../components/Header';

type Props = {
  email: string | null;
};

const HomePage = ({ email }: Props) => {
  return (
    <>
      <Header email={email} />
      <div className="flex flex-jc-sa flex-ai-sa">
        <Image preview={false} src="/homePageMale.png" alt="image" />
        <Image preview={false} src="/homePageFemale.png" alt="image" />
      </div>
    </>
  );
};

export default HomePage;
