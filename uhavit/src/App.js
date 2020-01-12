import React, { Component, Fragment }from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Intro from './view/Intro/Intro';
import SignUp from './view/SignUp/signup';
import LogIn from './view/LogIn/login';
import USetting from './view/uSetting/uSetting';
import UMake from './view/uMake/uMake';
import UNow from './view/uNow/uNow'

class App extends Component {
  render() {
    return (
      // <Fragment>
      //   <div className="wrapper">
      //     <Intro/>
      //     <SignUp/>
      //     <LogIn/>
      //     <USetting/>
      //     <UMake/>
      //     <UNow/>
      //   </div>
      // </Fragment>
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/Intro">Intro</Link>
          <Link to="/SignUp">SignUp</Link>
          <Link to="/LogIn">LogIn</Link>
          <Link to="/USetting">USetting</Link>
          <Link to="/UMake">UMake</Link>
          <Link to="/UNow">UNow</Link>
        </nav>
 
        <Switch>
        <Route path="/Intro">
          <Intro/>
        </Route>
        <Route path="/SignUp">
          <SignUp></SignUp>
        </Route>
        <Route path="/LogIn">
          <LogIn></LogIn>
        </Route>
        <Route path="/USetting">
          <USetting></USetting>
        </Route>
        <Route path="/UMake">
          <UMake></UMake>
        </Route>
        <Route path="/UNow">
          <UNow></UNow>
        </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
