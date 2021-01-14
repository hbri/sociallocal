import { createContext, useContext } from 'react';

export default createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});


/*
const aValue = useContext(myContext)

useContext accepts a context object, the value returned React.createContext, and then returns the current context value for that context
The current context value is determined by prop {value} of the nearest <myContext.Provider> above the calling component in the tree

*/