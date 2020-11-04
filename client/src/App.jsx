import React, { useState, useEffect } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';



const App = () => {
  const [ event, setEvent ] = useState({});
  const [ loading, setLoading ] = useState(true);

  const eventid = location.pathname.split('/')[2];

  const fetchEvent = async function() {
    try {
      const response = await axios.get(`/api/getevent/${eventid}`)
      return response.data;
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEvent()
      .then((res) => {
        setEvent(res)
        setLoading(false)
      })
  }, [])

  return loading === true ? (
    <h3>Loading...</h3>
  ) : (
    <div className="container">
      <div className="main">
        <Panel />
      </div>
      <div className="chat">
        <Chat eventId={eventid}/>
      </div>
      <div className="info">
        <Info eventData={event}/>
      </div>
    </div>
  )
}

export default App;