import React, { useState, useEffect } from 'react';

import { User } from './types';
import Routes from './Routes';
import { setUpdateLoginState, user } from './apis';
import SelfContext from './contexts/selfContext';

// import { createUploadLink } from 'apollo-upload-client';

import './styles/less/ant.less';
import { UserQueries } from './grapql-client/queries';
// const link = createUploadLink({ uri: 'http://localhost:4000/graphql', credentials: 'include' });

const App = (): JSX.Element => {
  const [me, setMe] = useState<null | User>(null);
  // const [constructor, setConstructor] = useState(true);

  setUpdateLoginState((newMe: null | User) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });

  // if (constructor) {
  //   (async () => {
  //     await user.me();
  //     setConstructor(false);
  //   })();
  // }

  useEffect(() => {
    (async function () {
      await user.me();
    })();
  }, []);

  return (
    <SelfContext.Provider value={me}>
      <Routes me={me} />
    </SelfContext.Provider>
  );
};

export default App;
