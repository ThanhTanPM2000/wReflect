import React from 'react';
import { User, UserProfile } from '../types';

export default React.createContext<null | (User & { profile: UserProfile })>(null);
