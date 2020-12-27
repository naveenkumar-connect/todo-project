/* 
Implements signup feature. User provides personal info such as username, name, email and password to create an account.
The details are stored in database creating the user account and a token is performing user login altogether.
*/

import React, { Component } from 'react';
import './SignUp.css'; 
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../Store/Action';
import todoicon from '../Images/todoicon.png';

class SignUp extends Component {

    state = {
        redirectToHome: false,  //When set to true redirects route to Home page. It happens when user account is successfully created.
        errCode: '',            //Stores error code for authentication failure
        err: '',                //Stores error for authentication failure
        loading: false,         //Required for waiting spinner, spinners shows up when loading is set true
        username: '',           //Required to hold username field value in the form
        email: '',              //Required to hold email field value in the form
        password: ''            //Required to hold password field value in the form
    }

    signUpSubmit = (event) => {
        /* executes when user submits for signup with details */

        event.preventDefault();

        /* post request is sent to create account */
        axios.post('/profilecreate/',
            {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            })
            .then(response => {
                /* executes when account is created */
                if(response.data.status === 'profileCreated')
                {   
                    /* when signup is successful following api is called to get token from the backend */
                    axios.post('/login/',{
                            username: this.state.username,
                            password: this.state.password,
                            returnSecureToken: true
                        })
                        .then(response => { 
                            /* executes when token is successfully received */
                            
                            /* Details are set in redux state after user authentication.
                            */
                            this.props.onGetToken( {
                                username: this.state.username,
                                authToken: response.data.token,
                                isAuthenticated: true
                            } );
                            
                            /* when authentication is done route should redirect to <Home>, hence, setting redirectToHome as true */
                            this.setState({
                                redirectToHome: true
                            });
                        })
                        .catch(err =>{
                            /* executes in case if error */
                            console.log("Login Failed")
                        });
                }
                if(response.data.status === 'improperUsernameAndEmail')
                {   /* executes when username and email are not as per the parameters set by the backend */
                    
                    /* state is changed to let user know about the error */
                    this.setState( {
                        errorCode: 'improperUsernameAndEmail',
                        err: response.data.err
                    } );
                }
            })
            .catch(err =>{
                /* executes in case if error */
                console.log("SignUp Failed")
            });
    }





    render() {

        return (
            <div className = 'SignUpBox'> 
                <div className ="SignUpImageBox">
                    {/* Portfolio logo  */}
                    <img 
                        className = 'Logo'
                        src={todoicon} 
                        alt="Todo App" 
                        height="100"
                        width="100"
                    />
                </div>

                {   /*  following code either show error code(in case any issue occured with the signup details provided by the user) 
                    */
                    this.state.errorCode === 'improperUsernameAndEmail'?
                        <div className = "SignUpErrorDisplay">
                            {'username: '+this.state.err.username}
                            
                            {this.state.err.email ? <div> Email already exists </div> :null}
                        </div>
                        :null
                }

                {/* signup form */}
                <div className = "SignUp">
                    SignUp
                </div>

                <div >
                    <form className = "SignUpForm">
                        <div className = "LabelAndField">
                            <label>Username</label>
                            <input 
                                type = "text" 
                                value = {this.state.username} 
                                onChange = {(event)=> {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className = "LabelAndField">
                            <label>Email</label>
                            <input 
                                type = "text" 
                                value = {this.state.email}
                                onChange = {(event)=> {
                                    this.setState({
                                        email: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className = "LabelAndField">
                            <label>Password</label>
                            <input 
                                type = "password" 
                                value = {this.state.password}
                                onChange = {(event)=> {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className = "SignUpSubmitButton">
                            <button 
                                onClick = {(event)=>{this.signUpSubmit(event)}}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* when signup is successfull, the value of redirectToHome changes to true and below code executes
                redirecting the route to Home page */}
                { this.state.redirectToHome? <Redirect to = {"/" + this.props.username + "/home"} /> : null }
            </div>
        );
    }
}

/* redux state subscription */
const mapStateToProps = state => {
    return {
        ...state
    };
}

/* redux action dispatch */
const mapDispatchToProps = dispatch => {
    return {
        onGetToken: (authData) => dispatch( {type: actionTypes.TOKENRECEIVED, authData: authData } )
    };
}

/*  redux state subscription with connect */
export default connect( mapStateToProps, mapDispatchToProps )( SignUp );