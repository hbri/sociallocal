import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentBox from './CommentBox.jsx';
import {
  EventContainer
} from './eventStyle.js';
import axios from 'axios';

const EventDetails = ({eventid}) => {

  const [ eventDetails, setEventDetails ] = useState(null);
  const [ properDate, setProperDate ] = useState({start: null, end: null});

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
              }
              host {
                name
              }
              likes
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

    console.log(fetchedData.data.data.events)
    setEventDetails(fetchedData.data.data.events)

    const updatedStartDate = new Date(parseInt(fetchedData.data.data.events.time.start)).toString();

    const updatedEndDate = new Date(parseInt(fetchedData.data.data.events.time.end)).toString();

    setProperDate({
      start: updatedStartDate,
      end: updatedEndDate
    })

  }


  useEffect(() => {
    getDetails(eventDetailID)
  }, [])

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
        <li>Likes: {eventDetails.likes}</li>
        </ul>
        <h3>Posts:</h3>
          <CommentBox postList={eventDetails.posts} eventdetailid={eventDetailID} />
    </EventContainer>
  ) : (
    <p>Loading</p>
  )
}

export default EventDetails;