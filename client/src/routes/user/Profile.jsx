import React, {
  useEffect,
  useState,
  useContext
} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/authContext.js';
import axios from 'axios';
import { ProfileContainer } from './profileStyle.js';

const Profile = (props) => {

  const [ userData, setUserData ] = useState({});
  const [ groupFields, setGroupFields ] = useState({
    name: '',
    location: ''
  })

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
                _id
              }
              events {
                title
                _id
              }
              going {
                title
                _id
              }
            }
          }
        `
      }
    }).then((userdata) => {
      setUserData(userdata.data.data.user)
    })
  }


  const handleChange = (e) => {
    const field = e.target.id;
    const fieldValue = e.target.value;
    const curFields = {...groupFields};
    curFields[field] = fieldValue;

    setGroupFields(curFields)
  }

  const submitGroupForm = () => {
    console.log("^^^ submit Form Submitted ^^^")
    console.log(groupFields.name)
    console.log(groupFields.location)

    axios({
      url: '/graphql',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${authorization.token}`
      },
      data: {
        query: `
          mutation {
            createGroup(groupInput: {
              name: "${groupFields.name}",
              location: "${groupFields.location}",
            }) {
              _id
              name
            }
          }
        `
      }
    }).then(result => {
      console.log(result.data.data.createGroup)
    })

    const emptyForm = {
      name: '',
      location: ''
    }

    setGroupFields(emptyForm)
  }


  useEffect(() => {
    fetchUserData(authorization.userId)
  }, [])



  return userData.events ? (
    <ProfileContainer>
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
            <li><Link to={`eventdetail/${event._id}`}>{event.title}</Link></li>
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
            <li><Link to={`eventdetail/${event._id}`}>{event.title}</Link></li>
          )
        })
      }
    </ul>
    <h3>Groups</h3>
    <ul>
      {
        userData.groups.map((group) => (
          <li><Link to={`groupdetail/${group._id}`}>{group.name}</Link></li>
        ))
      }
    </ul>
    <h3>Create Group</h3>
      <label>Group Name:</label>
      <input
        type="text"
        id="name"
        value={groupFields.name}
        onChange={handleChange}>
      </input>
      <label>Group Location:</label>
      <input
        type="text"
        id="location"
        value={groupFields.location}
        onChange={handleChange}>
      </input>
      <button onClick={submitGroupForm}>Create</button>
    </ProfileContainer>
  ) : (
    <h2>Loading...</h2>
  )
}

export default Profile;