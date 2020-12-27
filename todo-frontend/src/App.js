/* 
Defines routes and UI layout for the project
*/


import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Auth from './Auth/Auth';
import Logout from './Auth/Logout';
import SignUp from './Auth/SignUp';
import Home from './Home/Home';

function App(props) {
  return (
    <BrowserRouter>

      {/* Only one of the routes is selected at a time declared within <Switch> */}
      <Switch>
                { /*if user is authenticated then go to the home page otherwise to the login page when "<baseurl>/" is typed in url bar*/
                  
                  props.isAuthenticated ?
                    <Route path ="/" exact render = {() => (<Redirect to={'/' + props.username + "/home"} />)}  />
                    :
                    <Route path ="/" exact render = {() => (<Redirect to='/login' />)} />
                }

                <Route path= '/:urlUsername/home' exact component = {Home} />
                <Route path='/signup' exact component = {SignUp} />

                { /*  
                    if user is authenticated then go to home page otherwise go to login page when user 
                    types <baseurl>/login in url bar 
                  */
                  props.isAuthenticated ?
                    <Route path='/login' exact render = {() => (<Redirect to={'/' + props.username + "/home"} />)} />
                    :
                    <Route path='/login' exact component = {Auth} />
                }

                <Route path='/logout' exact component = {Logout} /> 

                {/* All the other unmatched urls request will be given response of 404 page not found by the below route */}
                <Route 
                  render = {() => 
                    <div className = "PageNotFound">
                      Error 404: Page not found
                    </div> 
                  } 
                />
      </Switch>
              
    </BrowserRouter>
  );
}


const mapStateToProps = state => {
  /* redux store state is called in App component */
  return {
      ...state
  };
}

/*  redux state subscription i.e. redux store state is connected to <App> 
    such that store state can be called in <App> as props 
*/
export default connect( mapStateToProps )( App );
