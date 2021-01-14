import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/authContext.js';
import axios from 'axios';

const Profile = (props) => {

  const [ userData, setUserData ] = useState({});

  const authorization = useContext(AuthContext);

  const fetchUserData = (userID) => {
    axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `
          query {
            user(userID:"${userID}") {
              name
              userid
              photo
              groups {
                name
              }
              events {
                title
                _id
              }
              going {
                title
              }
            }
          }
        `
      }
    }).then((userdata) => {
      setUserData(userdata.data.data.user)
    })
  }

  useEffect(() => {
    fetchUserData(authorization.userId)
  }, [])



  return userData.events ? (
    <>
    <h2>User Profile</h2>
    <h3>User Info</h3>
    <ul>
      <li>Name: {userData.name}</li>
      <li>Username: {userData.userid}</li>
    </ul>
    <h3>Hosting</h3>
    <ul>
      {
        userData.events.map((event) => {
          return (
            <>
            <li>{event.title}</li>
            </>
          )
        })
      }
    </ul>
    <h3>Attending</h3>
    <ul>
      {
        userData.going.map((event) => {
          return (
            <li>{event.title}</li>
          )
        })
      }
    </ul>
    </>
  ) : (
    <h2>Loading...</h2>
  )
}

export default Profile;