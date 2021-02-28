import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import AuthContext from '../../context/authContext.js';
import {
  useParams,
  Link,
  useRouteMatch
} from 'react-router-dom';
import { GroupContainer } from './groupStyle.js';
import axios from 'axios';

const GroupDetails = (props) => {

  const authorization = useContext(AuthContext);
  const [ groupData, setGroupData ] = useState(null);
  const [ authToAddEvent, setAuthToAddEvent ] = useState(false)
  const { groupDetailID } = useParams();

  const requestBody = {
    query: `
      query {
        group(groupID: "${groupDetailID}") {
          name
          members {
            userid
            _id
          }
          location
          events {
            title
            _id
          }
          owner {
            userid
            _id
          }
          pendingRequests {
            userid
            _id
          }
        }
      }
    `
  }

  const getGroupDetails = async () => {

    const fetchedData = await axios({
      url: '/graphql',
      method: 'post',
      data: requestBody
    })

    setGroupData(fetchedData.data.data.group)

    const loggedInUser = authorization.userId;
    const groupMembers = fetchedData.data.data.group.members;

    const allAuthMembers = groupMembers.map(member => member._id);
    allAuthMembers.push(fetchedData.data.data.group.owner._id);

    allAuthMembers.forEach((member) => {
      if (loggedInUser === member) {
        setAuthToAddEvent(true)
      }
    })
  };

  const requestGroupJoin = () => {
    const userid = authorization.userId;
    const groupid = groupDetailID;

    axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${authorization.token}`
      },
      data: {
        query: `
          mutation {
            requestJoinGroup(groupid:"${groupid}", userid:"${userid}")
          }
        `
      }
    })
  }

  const approveJoinRequest = (userIdToApprove) => {
    const groupid = groupDetailID;
    const userid = userIdToApprove;

    axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${authorization.token}`
      },
      data: {
        query: `
          mutation {
            approveMemberToGroup(groupid:"${groupid}", requestinguser: "${userid}") {
              userid
            }
          }
        `
      }
    }).then(result => {
      console.log(result.data.data.approveMemberToGroup)
    })
  }

  useEffect(() => {
    getGroupDetails()
  }, [])

  return groupData ? (
    <GroupContainer>
    <h4>Group Details</h4>
    <h2>{groupData.name}</h2>
    <h4>Location: {groupData.location}</h4>
    <h4>Administrator: @{groupData.owner.userid}</h4>
    <h4>Members:</h4>
    <ul>
      {
        groupData.members.map((member) => (
          <li><Link to={`/userdetail/${member._id}`}>{member.userid}</Link></li>
        ))
      }
    </ul>
    <h4>Events:</h4>
    <ul>
      {
        groupData.events.map((event) => (
          <li><Link to={`/eventdetail/${event._id}`}>{event.title}</Link></li>
        ))
      }
    </ul>
    {
      groupData.owner._id === authorization.userId && <><h4>Pending Join Requets:</h4>
      <ul>
        {
          groupData.pendingRequests.map(request => (
            <>
            <li>{request.userid}</li>
            <button onClick={() => approveJoinRequest(request._id)}>Approve</button>
            </>
          ))
        }
      </ul>
      </>
    }
    {
      authToAddEvent && <h4><Link to={`/createevent/${groupDetailID}`}>Create Event</Link></h4>
    }
    {
      !authToAddEvent && <button onClick={requestGroupJoin}>Request To Join This Group</button>
    }
    </GroupContainer>
  ) : (
    <p>Loading Data...</p>
  )
}

export default GroupDetails;

/*

API ROUTE to add current group to the current users list of pendingGroups and add the current user to the list of pendingRequests for the current group

Display link to request access to group if current user does not match group owner - adding current user to current groups pendingRequests and adding current group to current users pendingGroups

Display list of pendingRequests if current user matches groups owner. Display approve link for each user, which will add the linked user to the current groups list of members. Edit the "add event" link to display if current user is the owner or a member.

*/