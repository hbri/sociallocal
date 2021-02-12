import React, { useContext } from 'react';
import AuthContext from './context/authContext.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams
} from 'react-router-dom';
import axios from 'axios';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';
import Login from './routes/login/Login.jsx';
import Events from './routes/events/Events.jsx';
import Profile from './routes/user/Profile.jsx';
import Logout from './routes/login/Logout.jsx';
import EventDetails from './routes/events/EventDetails.jsx';
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

const StyledButton = styled.button`
  border: none;
  color: green;
`;

const MainNav = () => {

  const authorization = useContext(AuthContext)

  return (
    <>
      <Router>
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
                {authorization.token && <StyledButton onClick={authorization.logout}>Logout</StyledButton>}
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
          <Route path="/login">
            <Login editThis={'demo'}/>
          </Route>
          <Route path="/events">
            <Events eventid={'5feebbffd21fe00f292ca356'} />
          </Route>
          <Route path="/userprofile">
            <Profile />
          </Route>
          <Route path="/eventdetail/:eventDetailID" children={<EventDetails />} />
        </Switch>
      </Router>
    </>
  )
}

export default MainNav;