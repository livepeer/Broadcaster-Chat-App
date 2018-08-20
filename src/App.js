import React, { Component } from 'react';
import Layout from './components/Layout'
import './index.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path={'/'} render={() => (
            <h3>Please put a streamId into the URL bar</h3>
          )}/>
          <Route path={`/:streamId`} component={Layout}/>
        </div>
      </Router>
    );
  }
}

export default App;
