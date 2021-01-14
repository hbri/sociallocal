import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/authContext.js';


const Logout = () => {
  const authorization = useContext(AuthContext);

  useEffect(() => {
    authorization.logout()
  }, [])

  return (
    <h3>Logging Out...</h3>
  )

}

export default Logout;