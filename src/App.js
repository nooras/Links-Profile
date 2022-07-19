// import logo from './logo.svg';
import './App.css';
import { client } from './utils/client';
import { ApolloProvider } from "@apollo/react-hooks"
import LinksProfile from './graphqlAPI/LinksProfile';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import video from './bg.mp4';

// const name = "noorasf"
function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <ApolloProvider client={client}>
            <Routes>
              <Route path="/" element={<LinksProfile />}></Route>
              <Route path="/:userUniqeName" element={<LinksProfile />}>
              </Route>
            </Routes>
          </ApolloProvider>
        </BrowserRouter>
      </div>
      // </></>
  );
}

export default App;
