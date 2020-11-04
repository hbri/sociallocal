import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

const Chat = (props) => {
  const [ posts, setPosts ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getPosts = async function() {
    const allPosts = await axios.get(`/api/getposts/${props.eventId}`)
    return allPosts.data
  }

  const convertTime = function(IsoTime) {
    let display = DateTime.fromISO(IsoTime);
    return display;
  }

  useEffect(() => {
    getPosts()
      .then((results) => {
        setPosts(results)
        setLoading(false)
      })
  }, [])

  return loading === true ? (
    <p>Posts Loading...</p>
  ) : (
    <div>
      <h3>Chat</h3>
      {
        posts.map(({likes, content, postedBy, timestamp, comments}) => (
          <ul>
            <li>{content}</li>
            <li>{postedBy}</li>
            <li>{() => {
              DateTime.fromISO(timestamp)
            }}</li>
            <li>{likes}</li>
          </ul>
        ))
      }
    </div>
  )
}

export default Chat;