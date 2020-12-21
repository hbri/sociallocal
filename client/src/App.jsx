import React, { useState, useEffect } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';
import { Container, Main, ChatContainer, InfoContainer } from './Styles.jsx'



const App = () => {
  const [ event, setEvent ] = useState({});
  const [ loading, setLoading ] = useState(true);

  const eventid = location.pathname.split('/')[2];
  const curUser = '5fa1d33ed51893be5f4fc736';

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
    <Container>
      <Main>
        <Panel />
      </Main>
      <ChatContainer>
        <Chat eventId={eventid}/>
      </ChatContainer>
      <InfoContainer>
        <Info eventData={event}/>
      </InfoContainer>
    </Container>
  )
}

export default App;