import React, { useContext } from 'react';
import AuthContext from './context/authContext.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import axios from 'axios';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';
import Login from './routes/login/Login.jsx';
import Events from './routes/events/Events.jsx';
import Profile from './routes/user/Profile.jsx';
import Logout from './routes/login/Logout.jsx';
import {
  NavContainer,
  NavItems,
  NavTitle,
  MenuContainer,
} from './styles/main.jsx'
import styled from 'styled-components';

const StyledLinks = styled(Link)`
  color: rgb(149, 99, 190);
  text-decoration: none;
`;

const MainNav = () => {

  const authorization = useContext(AuthContext)

  return (
    <>
        <nav>
          <NavContainer>
            <NavTitle>
              Social Local
            </NavTitle>
            <MenuContainer>
              <NavItems>
                  <StyledLinks to="/">Home</StyledLinks>
              </NavItems>
              <NavItems>
                {!authorization.token && <StyledLinks to="/login">Login</StyledLinks>}
                {authorization.token && <StyledLinks to="/logout">Logout</StyledLinks>}
              </NavItems>
              <NavItems>
                <StyledLinks to="/events">Events</StyledLinks>
              </NavItems>
              {authorization.token &&
              <NavItems>
                <StyledLinks to="/userprofile">Profile</StyledLinks>
              </NavItems>}
            </MenuContainer>
          </NavContainer>
        </nav>
        <Switch>
          {authorization.token && <Redirect from="/login" to="/userprofile" exact />}
          {authorization.token && <Redirect from="/logout" to="/" exact />}
          <Route path="/login">
            <Login editThis={'demo'}/>
          </Route>
          <Route path="/events">
            <Events someParam={'demo'} />
          </Route>
          <Route path="/userprofile">
            <Profile />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
        </Switch>

    </>
  )
}

export default MainNav;