import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {

  const submitData = async function() {
    axios('/adduser', {
      name: 'James Bond',
      city: 'San Francisco',
      state: 'CA',
      photo: 'https://mvpsocial.s3-us-west-2.amazonaws.com/profilepic1.jpeg'
    })
  }

  return (
    <div>
      <h3>Chat</h3>

    </div>
  )
}

export default Chat;