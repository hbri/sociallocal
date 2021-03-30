import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/authContext.js';
import axios from 'axios';
import { SignUpContainer, SignUpElement, StyleBasic } from '../../styles/main.jsx'

const Login = ({editThis}) => {
  const [ submitAction, setAction ] = useState('login');
  const [ inputFields, setInputFields ] = useState({
    username: '',
    password: '',
    name: '',
    city: '',
    state: '',
    photo: ''
  });
  const authorization = useContext(AuthContext)

  const handleChange = (e) => {
    const field = e.target.id;
    const fieldValue = e.target.value;

    const curFields = {...inputFields};
    curFields[field] = fieldValue;

    setInputFields(curFields)
  }

  const submitForm = (formAction) => {
    if (formAction === 'login') {
      axios({
        url: '/graphql',
        method: 'post',
        data: {
          query: `
              query {
              login(userid: "${inputFields.username}", password: "${inputFields.password}") {
                token
                authID
                tokenExpiration
              }
            }
          `
        }
      }).then((result) => {
        const resultPath = result.data.data.login;
        authorization.login(resultPath.token, resultPath.authID)
      })

    } else if (formAction === 'signup') {
      axios({
        url: '/graphql',
        method: 'post',
        data: {
          query: `
            mutation {
              createUser(userInput: {
                name: "${inputFields.name}",
                locationCity: "${inputFields.city}",
                locationState: "${inputFields.state}",
                photo: "${inputFields.photo}",
                userid: "${inputFields.username}",
                password: "${inputFields.password}"
              }) {
                name
              }
            }
          `
        }
      }).then((result) => {
        console.log(result.data)
      })
    }

  }

  // useEffect(() => {
  //   console.log('using effect?')
  // }, submitAction)

  return (
      <>
      <StyleBasic>
      <h3>Login Page</h3>
      <SignUpContainer>
        <SignUpElement>
      <label>Username:</label>
      <input
        type="text"
        id="username"
        onChange={handleChange}>
      </input>
      </SignUpElement>
      <SignUpElement>
      <label>Password:</label>
      <input
        type="password"
        id="password"
        onChange={handleChange}>
      </input>
      </SignUpElement>
      {
        submitAction === 'signup' && (
          <>
          <SignUpElement>
          <label>Name:</label>
          <input
            type="text"
            id="name"
            onChange={handleChange}
          ></input>
          </SignUpElement>
          <SignUpElement>
          <label>City:</label>
          <input
            type="text"
            id="city"
            onChange={handleChange}
          ></input>
          8</SignUpElement>
          <SignUpElement>
          <label>State:</label>
          <input
            type="text"
            id="state"
            onChange={handleChange}
          ></input>
          </SignUpElement>
          <SignUpElement>
          <label>Photo:</label>
          <input
            type="text"
            id="photo"
            onChange={handleChange}
          ></input>
          </SignUpElement>
          </>
        )
      }
      </SignUpContainer>
      <button onClick={() => submitForm(submitAction)}>Submit</button>
      <div>
        <button onClick={() => setAction('login')}>Login</button>
        <button onClick={() => setAction('signup')}>Sign Up</button>
      </div>
      </StyleBasic>
      </>
  )
}

export default Login