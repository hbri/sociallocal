import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import AuthContext from '../../context/authContext.js';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { EventContainer } from './eventStyle.js';

const CreateEvent = () => {

  const { groupID } = useParams();
  const authorization = useContext(AuthContext);
  const [ eventInfo, setEventInfo ] = useState({
    title: null,
    timestart: null,
    timeend: null,
    description: null,
    location: null,
    tags: null,
    image: null,
    group: null,
    host: null
  });

  const submitEventForm = async () => {

    const newEvent = await axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${authorization.token}`
      },
      data: {
        query: `
          mutation {
            createEvent(eventInput: {
              title: "${eventInfo.title}",
              description: "${eventInfo.description}",
              location: "${eventInfo.location}",
              tags: "${eventInfo.tags}",
              image: "${eventInfo.image}",
              group: "${groupID}"
            }, timeInput: {
                start: "${eventInfo.timestart}",
                end: "${eventInfo.timeend}"
            }) {
              title
              _id
            }
          }
        `
      }
    })

    const newEventData = newEvent.data.data.createEvent;
    console.log(newEventData)

  }

  const handleChange = (e) => {
    const field = e.target.id;
    const fieldVal = e.target.value;

    const newEventInfo = {...eventInfo};

    newEventInfo[field] = fieldVal;

    setEventInfo(newEventInfo)
  }

  return (
    <EventContainer>
      <h4>Create Event</h4>
      <label>Title</label>
      <input
        type="text"
        id="title"
        onChange={handleChange}
        value={eventInfo.title}>
      </input>
      <label>Description</label>
      <input
        type="text"
        id="description"
        onChange={handleChange}
        value={eventInfo.description}>
      </input>
      <label>Location</label>
      <input
        type="text"
        id="location"
        onChange={handleChange}
        value={eventInfo.location}>
      </input>
      <label>Tags</label>
      <input
        type="text"
        id="tags"
        onChange={handleChange}
        value={eventInfo.tags}>
      </input>
      <label>Image</label>
      <input
        type="text"
        id="image"
        onChange={handleChange}
        value={eventInfo.image}>
      </input>
      <label>Start Time</label>
      <input
        type="text"
        id="timestart"
        onChange={handleChange}
        value={eventInfo.timestart}>
      </input>
      <label>End Time</label>
      <input
        type="text"
        id="timeend"
        onChange={handleChange}
        value={eventInfo.timeend}>
      </input>
      <button onClick={submitEventForm}>Create</button>
    </EventContainer>
  )
}

export default CreateEvent;