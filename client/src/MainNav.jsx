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
// import axios from 'axios';
// import Panel from './Panel.jsx';
// import Chat from './Chat.jsx';
// import Info from './Info.jsx';
import Login from './routes/login/Login.jsx';
import CreateEvent from './routes/events/CreateEvent.jsx';
import Profile from './routes/user/Profile.jsx';
import EventDetails from './routes/events/EventDetails.jsx';
import GroupDetails from './routes/groups/GroupDetails.jsx';
import Groups from './routes/groups/Groups.jsx';
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
  color: rgb(149, 99, 190);
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
                <StyledLinks to="/groups">Groups</StyledLinks>
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
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/groupdetail/:groupDetailID">
            <GroupDetails />
          </Route>
          {!authorization.token && <Redirect to="/" exact />}
          <Route path="/eventdetail/:eventDetailID">
            <EventDetails />
          </Route>
          <Route path="/userprofile">
            <Profile />
          </Route>
          <Route path="/createevent/:groupID">
            <CreateEvent />
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default MainNav;

/*
<Route path="/eventdetail/:eventDetailID" children={<EventDetails />} />
*/