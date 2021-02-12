import React from 'react';
import reactDOM from 'react-dom';
import App from './src/App.jsx';
import { BrowserRouter } from 'react-router-dom';

// reactDOM.render(<App />, document.getElementById('app'));

reactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById('app')
)