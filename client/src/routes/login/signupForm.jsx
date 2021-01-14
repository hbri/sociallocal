import React, { useState } from 'react';

const SignUpForm = (props) => {

  const [ userInfo, setUserInfo ] = useState({})

  const handleChange = (e) => {
    const holdData = userInfo;
    holdData[e.target.name] = e.target.value;
    setUserInfo(holdData)
    console.log(userInfo)
  }

  return (
    <form>
      <label>
        Name:
        <input
          name="name"
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        City:
        <input
          name="city"
          onChange={handleChange}
        />
      </label>
    </form>
  )

}

export default SignUpForm;