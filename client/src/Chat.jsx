import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { ChatBox, ChatTop, ChatName, ChatTime, ChatImage, ChatIcon, ChatMiddle, ChatBottom } from './Styles.jsx';

const Chat = ({eventId}) => {
  const [ posts, setPosts ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ newPost, setNewPost ] = useState('');

  const getPosts = async function() {
    const allPosts = await axios.get(`/api/getposts/${eventId}`)
    return allPosts.data
  }

  const convertTime = function(isostring) {
    const luxonObj = DateTime.fromISO(isostring);
    const relative = luxonObj.toRelative();
    return relative
  }

  const handleChange = function(event) {
    let newPostText = event.target.value;
    setNewPost(newPostText)
  }

  const submitForm = function() {
    axios.post(`/api/addpost/${eventId}`, {
      content: newPost
    })
  }

  // const handleLike = function() {

  // }

  useEffect(() => {
    getPosts()
      .then((results) => {
        setPosts(results)
        setLoading(false)
      })
  }, [posts])

  return loading === true ? (
    <p>Posts Loading...</p>
  ) : (
      <div>
        {
          posts.map(({likes, content, postedBy, timestamp, comments}) => (
            <ChatBox>
              <ChatTop>
                <ChatImage>
                  <ChatIcon src={postedBy.photo}/>
                </ChatImage>
                <ChatName>
                  {postedBy.name}
                </ChatName>
                <ChatTime>
                  {convertTime(timestamp)}
                </ChatTime>
              </ChatTop>
              <ChatMiddle>
                {content}
              </ChatMiddle>
              <ChatBottom>
                Likes: {likes.length === undefined ? '0' : likes.length}
                <button>Like</button>
              </ChatBottom>
            </ChatBox>
          ))
        }
        <div>
          <label>Comment:</label>
          <input type="text" id="postbody" onChange={handleChange}></input>
          <button onClick={submitForm}>Submit</button>
        </div>
      </div>
  )
}

export default Chat;