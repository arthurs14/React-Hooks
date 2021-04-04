import React from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  return <AuthContext.Consumer><Auth /></AuthContext.Consumer>;
};

export default App;
