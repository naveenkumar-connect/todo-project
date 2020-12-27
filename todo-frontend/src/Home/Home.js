/*
Displays home page of the user including the buckets and the tasks
*/

import React, {Component} from 'react';
import './Home.css';
import { connect } from 'react-redux';
import Buckets from '../Buckets/Buckets';
import Toolbar from '../Toolbar/Toolbar';

class Home extends Component
{
    render(){
        return(
            <div>
                <Toolbar visitingProfileUser = {this.props.match.params.urlUsername} isAuthenticated = {this.props.isAuthenticated}/>
                <Buckets visitingProfileUser = {this.props.match.params.urlUsername}/>
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
  
  /*  redux state subscription with connect */
  export default connect( mapStateToProps )( Home );