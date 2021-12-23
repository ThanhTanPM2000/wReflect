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
  // const [loading, setLoading] = useState(loadingMe);

  // const [getMe, { loading }] = useLazyQuery(UserQueries.me);
  // const { data, loading } = useQuery(UserQueries.me);

  setUpdateLoginState(async (newMe: null | User) => {
    setMe(newMe);
    localStorage.setItem('email', newMe?.email || '');
  });

  // if (!loading) {
  //   console.log('hello');
  //   setMe(data?.me);
  //   localStorage.setItem('email', data?.me?.email || '');
  // }

  useEffect(() => {
    (async function () {
      // if (!loading) {
      //   setMe(data.me);
      //   localStorage.setItem('email', data?.me?.email || '');
      // }
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
