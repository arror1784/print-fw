import React from 'react';
import logo from './logo.svg';
import './App.css';
import './components/Button'
import './routes'
import AppRoute from './routes';
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <AppRoute></AppRoute>
        </BrowserRouter>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          <Button color="gray" type="small">asdasdasd</Button>
        </p> */}
      </header>
    </div>
  );
}

export default App;
