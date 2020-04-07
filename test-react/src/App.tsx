import React from 'react';
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          If you see this, you are genius who combined React and Django.
          Edit your tsx files and recompile to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="disclaimer">
        This is a test project. We still need to add css.
      </div>
    </div>
  );
}

export default App;
