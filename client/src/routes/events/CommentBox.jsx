import React, { useState, useEffect } from 'react';
import AddComment from './AddComment.jsx';
import { OutsideBox, InsideBox } from './eventStyle.js';

const CommentBox = ({postList, eventdetailid}) => {

  const [ commentList, setCommentList ] = useState([]);

  const setPosts = () => {
    setCommentList(postList)
  }

  const updatePosts = (arrayOfPosts) => {
    setCommentList(arrayOfPosts)
  }

  useEffect(() => {
    setPosts()
    console.log(commentList)
  }, commentList)

  return commentList.length > 0 ? (
    <>
    <OutsideBox>
    {
      commentList.map((post) => (
        <InsideBox>
        <p>{`@${post.postedBy.userid} on ${post.timestamp}`}</p>
        <p>{post.content}</p>
        </InsideBox>
      ))
    }
    </OutsideBox>
    <AddComment eventid={eventdetailid} updateList={updatePosts} currentList={commentList}/>
    </>
  ) : (
    <AddComment eventid={eventdetailid} updateList={updatePosts} currentList={[]}/>
  )
}


export default CommentBox;