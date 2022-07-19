// import logo from './logo.svg';
import './App.css';
import { client } from './utils/client';
import { ApolloProvider } from "@apollo/react-hooks"
import GetAllUsers from './graphqlAPI/GetAllUsers';
import LinksProfile from './graphqlAPI/LinksProfile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const name = "noorasf"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ApolloProvider client={client}>

      
        <Routes>
        <Route path="/" element={<LinksProfile/>}></Route>
          <Route path="/:userUniqeName" element={<LinksProfile/>}>
              {/* <LinksProfile name={name}/> */}
              {/* <GetAllUsers /> */}
              {/* <div>hello</div> */}
          </Route>
        </Routes>
        </ApolloProvider>
      </BrowserRouter>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
