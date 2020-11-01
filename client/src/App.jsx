import React, { useState } from 'react';
import Panel from './Panel.jsx';
import Chat from './Chat.jsx';
import Info from './Info.jsx';

function App() {

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
};

export default App;