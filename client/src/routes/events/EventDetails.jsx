import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OutsideBox } from './eventStyle.js';
import axios from 'axios';
import { DateTime } from 'luxon';

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
              }
            }
          }
        `
      }
    })

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
    <div>
      <h3>Event Details Page</h3>
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
        <h3>Posts:</h3>
        {
          eventDetails.posts.map((post) => (
            <li>{post.content}</li>
          ))
        }
      </ul>
    </div>
  ) : (
    <p>Loading</p>
  )
}

export default EventDetails;