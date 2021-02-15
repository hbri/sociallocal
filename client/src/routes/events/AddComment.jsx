import React, { useState, useContext } from 'react';
import AuthContext from '../../context/authContext.js';
import axios from 'axios';

const AddComment = ({eventid, updateList, currentList}) => {
  const [ comment, setComment ] = useState('')

  const authorization = useContext(AuthContext)

  const handleChange = function(event) {
    let commenttext = event.target.value;
    setComment(commenttext)
  }

  const submitForm = () => {

    const postHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authorization.token}`
    }

    axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${authorization.token}`
      },
      data: {
        query: `
          mutation {
            createPost(postInput:{
              content:"${comment}",
              eventid:"${eventid}"
            }) {
              timestamp
              content
              postedBy {
                userid
              }
            }
          }
        `,
      }
    }).then((result) => {

      const resultPath = result.data.data.createPost;
      const updatedList = [...currentList];
      const newCommentPush = {
        content: resultPath.content,
        timestamp: resultPath.timestamp,
        postedBy: {
          userid: resultPath.postedBy.userid
        }
      }
      console.log(resultPath)
      updatedList.push(newCommentPush);
      updateList(updatedList)
    })
    setComment('')
  }

  return (
    <div>
      <label>Comment:</label>
      <input type="text" id="postbody" onChange={handleChange} value={comment}></input>
      <button onClick={() => submitForm()}>Submit</button>
    </div>
  )
}

export default AddComment;

/*
mutation {
  createPost(postInput:{
    content:"here is the content",
    eventid:"5feebbffd21fe00f292ca356"
  }) {
    timestamp
  }
}
*/