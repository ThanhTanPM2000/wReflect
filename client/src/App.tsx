import React, { useState, useEffect } from 'react';
import { Me } from './types';
import { setUpdateLoginState, user } from './apis';
import Routes from './Routes';

import 'antd/dist/antd.css';

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | Me>(null);
  setUpdateLoginState((newMe: null | Me) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });
  useEffect(() => {
    (async function () {
      await user.me();
    })();
  }, []);
  return <Routes me={me} />;
};

export default App;
