import React, { useState, useEffect } from 'react';
import AuthContext from './context/authContext.js'
import MainNav from './MainNav.jsx';
import regeneratorRuntime from 'regenerator-runtime';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';




const App = () => {
  const [ event, setEvent ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ authdata, setAuthdata ] = useState({token:null, userId:null})

  const eventid = location.pathname.split('/')[2];
  const curUser = '5fa1d33ed51893be5f4fc736';

  // login & logout below are used in context. calling these methods anywhere will change the state in App.jsx with setAuthdata
  const login = (token, userId) => {
    const authDataFormat = {
      token,
      userId
    }
    setAuthdata(authDataFormat)
  }

  const logout = () => {
    const nullAuth = {
      token: null,
      userId: null
    }
    setAuthdata(nullAuth)
  }

  return (
    <Router>
      <>
        <AuthContext.Provider value={{
          token: authdata.token,
          userId: authdata.userId,
          login,
          logout
        }}>
          <MainNav />
        </AuthContext.Provider>
      </>
    </Router>
  )
}

export default App;