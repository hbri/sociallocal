import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = (props) => {
  const [ comment, setComment ] = useState('')

  const handleChange = function(event) {
    let commenttext = event.target.value;
    setComment(commenttext)
  }

  const submitForm = function() {
    axios.post(`/api/addpost/${props.eventid}`, {
      content: comment
    })
  }

  return (
    <div>
      <label>Comment:</label>
      <input type="text" id="postbody" onChange={handleChange}></input>
      <button onClick={submitForm}>Submit</button>
    </div>
  )
}

export default CommentForm;