import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import AuthContext from '../../context/authContext.js';
import { useParams } from 'react-router-dom';
import CommentBox from './CommentBox.jsx';
import {
  EventContainer,
  ButtonLink
} from './eventStyle.js';
import axios from 'axios';

const EventDetails = ({eventid}) => {

  const authorization = useContext(AuthContext);

  const [ eventDetails, setEventDetails ] = useState(null);
  const [ properDate, setProperDate ] = useState({start: null, end: null});
  const [ userStates, setUserStates ] = useState({
    interested: false,
    attending: false,
    liked: false
  })

  const { eventDetailID } = useParams();

  const getDetails = async (eventid) => {
    const fetchedData = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          query {
            events(eventID: "${eventid}") {
              title
              time {
                start
                end
              }
              description
              location
              tags
              image
              group {
                name
              }
              attendees {
                name
                _id
              }
              interested {
                name
                _id
              }
              host {
                name
              }
              likes {
                _id
              }
              posts {
                timestamp
                content
                postedBy {
                  userid
                }
              }
            }
          }
        `
      }
    })

    // console.log(fetchedData.data.data.events)
    setEventDetails(fetchedData.data.data.events)

    const updatedStartDate = new Date(parseInt(fetchedData.data.data.events.time.start)).toString();

    const updatedEndDate = new Date(parseInt(fetchedData.data.data.events.time.end)).toString();

    setProperDate({
      start: updatedStartDate,
      end: updatedEndDate
    })

    const loggedInUser = authorization.userId;
    const updatedUserStates = {...userStates}

    eventDetails.attendees.forEach(attendee => {
      if (attendee._id === loggedInUser) {
        updatedUserStates.attending = true;
      }
    })

    eventDetails.interested.forEach(interest => {
      if (interest._id === loggedInUser) {
        updatedUserStates.interested = true    }
    })

    setUserStates(updatedUserStates)

    console.log(eventDetails)

  }

  const attendEvent = async () => {
    const loggedInUser = authorization.userId;
    const eventPageId = eventDetailID;

    const addAttendee = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          mutation {
            addUserAttending(attendeeInput: {
              eventid: "${eventPageId}"
              userid: "${loggedInUser}"
            }) {
              name
            }
          }
        `
      }
    })
    const loggedInUsername = addAttendee.data.data.addUserAttending.name;
    const updatedEventDetails = {...eventDetails};

    updatedEventDetails.attendees.push({name: loggedInUsername, _id:loggedInUser})

    const updatedUserStates = {...userStates};
    updatedUserStates.attending = true;
    setUserStates(updatedUserStates)

    setEventDetails(updatedEventDetails)

  }

  const removeEvent = async () => {
    const loggedInUser = authorization.userId;
    const eventPageId = eventDetailID;

    const removeAttendee = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          mutation {
            removeUserAttending(eventid: "${eventPageId}", userid: "${loggedInUser}") {
              name
            }
          }
        `
      }
    })
    const loggedInUsername = removeAttendee.data.data.removeUserAttending.name;
    const updatedEventDetails = {...eventDetails};

    updatedEventDetails.attendees.forEach((attendee, i) => {
      if (attendee._id === loggedInUser) {
        updatedEventDetails.attendees.splice(i, 1);
        const updatedUserStates = {...userStates};
        updatedUserStates.attending = false;
        setUserStates(updatedUserStates)
      }
    })

    setEventDetails(updatedEventDetails)

  }

  const interestedInEvent = async () => {
    const loggedInUser = authorization.userId;
    const eventPageId = eventDetailID;

    await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          mutation {
            addUserInterested(eventid: "${eventPageId}", userid: "${loggedInUser}") {
              name
            }
          }
        `
      }
    })

  }

  const likeEvent = async () => {
    const loggedInUser = authorization.userId;
    const eventPageId = eventDetailID;

    const newLike = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          mutation {
            addLikes(eventID: "${eventPageId}", userid: "${loggedInUser}") {
              name
            }
          }
        `
      }
    })

    console.log(newLike.data.data)
  }


  useEffect(() => {
    getDetails(eventDetailID)
  }, eventDetails)

  return eventDetails ? (
    <EventContainer>
      <h4>Event Details</h4>
      <h2>{eventDetails.title}</h2>
      <ul>
        <li>Title: {eventDetails.title}</li>
        <li>Description: {eventDetails.description}</li>
        <li>Start Time: {properDate.start}</li>
        <li>End Time: {properDate.end}</li>
        <li>Location: {eventDetails.location}</li>
        <li>Tags: {eventDetails.tags}</li>
        <li>Group: {eventDetails.group.name}</li>
        <li>Host: {eventDetails.host.name}</li>
        <li>Likes: {eventDetails.likes.length}</li>
        </ul>
        <h3>Attending:</h3>
        <ul>
          {
            eventDetails.attendees.map((attendee) => (
              <li>{attendee.name}</li>
            ))
          }
        </ul>
        <h3>Interested:</h3>
        <ul>
          {
            eventDetails.interested.map((interestee) => (
              <li>{interestee.name}</li>
            ))
          }
        </ul>
        <h3>Event Actions:</h3>
        {
          userStates.interested
          ? <ButtonLink>Not Interested</ButtonLink>
          : <ButtonLink onClick={interestedInEvent}>Interested</ButtonLink>
        }
        {
          userStates.attending
          ? <ButtonLink onClick={removeEvent}>Not Going</ButtonLink>
          : <ButtonLink onClick={attendEvent}>Going</ButtonLink>
        }
        {
          userStates.liked
          ? <ButtonLink>Dislike</ButtonLink>
          : <ButtonLink onClick={likeEvent}>Like</ButtonLink>
        }
        <h3>Posts:</h3>
          <CommentBox postList={eventDetails.posts} eventdetailid={eventDetailID} />
    </EventContainer>
  ) : (
    <p>Loading</p>
  )
}

export default EventDetails;