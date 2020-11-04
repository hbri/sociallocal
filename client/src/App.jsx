import React, { useState, useEffect } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';



const App = () => {
  const [event, updateEvent] = useState({});
  const [posts, updatePosts] = useState([]);



  return (
    <div className="container">
      <div className="main">
        <Panel />
      </div>
      <div className="chat">
        <Chat />
      </div>
      <div className="info">
        <Info />
      </div>
    </div>
  )
}

export default App;