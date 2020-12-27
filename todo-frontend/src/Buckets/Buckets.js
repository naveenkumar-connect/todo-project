/*
Create <Buckets> that manages the <Tasks>
*/ 

import React, {Component} from 'react';
import './Buckets.css';
import { connect } from 'react-redux';
import axios from 'axios';
import Tasks from './Tasks/Tasks';

class Buckets extends Component
{   
    state = {
        bucketList: [],         // will be needed to store list of objects from API response
        addBucketField: '',    
        bucketToEdit: {},       // holds info of the bucket of which user wants to change name  
        tempBucketNames: {}     // holds values of temporary bucket names when user tries to edit bucket name
    }

    getValues() {
        //performs reading values over the API and update them to state

        axios.get('/bucket/' + this.props.visitingProfileUser + '/')
        .then(response => {
            this.setState({ 
                bucketList: response.data
            });
        })
        .catch(err =>{
            //executes when updation over API fails
            console.log("Bucket read failed");
        });
    }

    constructor(props) {
        super(props);
        this.getValues(); //print buckets on the screen
    }

    bucketNameChangeHandler = (event) => {
            /*  setting current field value in this.state */
            this.setState ({
                addBucketField: event.target.value
            })
    }

    addBucketSubmit = (event) => {
        // adds new buckets in the database over post request in api 

        event.preventDefault(); // prevents the page from loading

        axios.post('/bucket/' + this.props.username + '/',
            {
                bucketname: this.state.addBucketField,
                username: this.props.username
            }
            ,
            {
                headers: {
                    'Authorization' : `token ${this.props.authToken}`
                }
            })
            .then(response => {
                //executes when addition was successful at the backend
                this.getValues();       //reloads card data from the api and rerenders the UI
                this.setState({
                    addBucketField: ""
                });
            })
            .catch(err =>{
                //executes when addition at the backend fails
                console.log("Bucket Creation Failed");
            }
        );

    }

    bucketDeleteHandler = (bucket) => {
        // deletes buckets from the database over delete request in api 

        axios.delete('/bucket/'+ this.props.username + '/' + bucket.id + '/',
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                this.getValues();       //reloads card data from the api and rerenders the UI
                            })
                            .catch(err =>{
                                //executes when deletion at the backend fails
                                console.log("Bucket Delete failed");
                            }
        );
    }

    bucketNameEditSubmit = (event, bucket) => {
        // performs updatation of buckets in the database over patch request in api

        event.preventDefault();
        axios.patch('/bucket/'+ this.props.username + '/' + bucket.id + '/',
                            {
                                bucketname: this.state.tempBucketNames[bucket.id]
                            }
                                ,
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                this.getValues();       //reloads card data from the api and rerenders the UI
                                var tempObj = this.state.bucketToEdit;
                                tempObj[bucket.id] = false
                                this.setState({
                                    bucketToEdit: tempObj
                                });
                            })
                            .catch(err =>{
                                //executes when updation at the backend fails
                                console.log("Bucket Name Change Failed");
                            }
        );
    }

    

    render(){
        return(
            <div className = "Top">
                <div className = "AddBucket">
                    {   /* display bucket addition form field and submit and cancel buttons */
                        /* updatation can only be done by the owner */
                        this.props.visitingProfileUser === this.props.username?
                        <form onSubmit={this.addBucketSubmit}>
                            <input 
                                className="BucketNameInput"
                                type="text" 
                                placeholder = "Bucket Name" 
                                value = {this.state.addBucketField}
                                onChange = {this.bucketNameChangeHandler}
                            />
                            <button className="AddBucketButton" type='submit'>Add Bucket</button>
                        </form>
                        : null
                    }
                </div>
                <div className = "BucketLayout">
                    {   this.state.bucketList.map((bucket, index) => {
                            return(
                                <div className = "Buckets" key = {bucket.id}>
                                    {   /* shows prompt to edit the bucket names*/
                                        this.state.bucketToEdit[bucket.id] && this.props.visitingProfileUser === this.props.username?
                                        <form>
                                            <input 
                                                className="BucketNameEditInput"
                                                type = 'text' 
                                                value = {this.state.tempBucketNames[bucket.id]}
                                                onChange = {(event)=>{
                                                    var tempObj = this.state.tempBucketNames
                                                    tempObj[bucket.id] = event.target.value
                                                    this.setState({
                                                        tempBucketNames: tempObj
                                                    });
                                                }}
                                            />
                                            
                                            <button 
                                                className = "BucketNameEditSubmit"
                                                onClick = {(event)=>(this.bucketNameEditSubmit(event, bucket))}
                                            >
                                                Submit 
                                            </button>

                                            <button
                                                className = "BucketNameEditCancel"
                                                onClick = {()=>{
                                                    var tempObj = this.state.bucketToEdit;
                                                    tempObj[bucket.id] = false
                                                    this.setState({
                                                        bucketToEdit: tempObj
                                                    });
                                                }}

                                            >
                                                Cancel
                                            </button>
                                        </form>
                                        :
                                        // shows Bucket title
                                        <div>
                                            <div 
                                                className = 'BucketName'
                                                onClick = {()=>{
                                                    var tempObj = this.state.bucketToEdit;
                                                    var tempObjForTempNames = this.state.tempBucketNames;
                                                    tempObj[bucket.id] = true
                                                    tempObjForTempNames[bucket.id] = bucket.bucketname
                                                    this.setState({
                                                        bucketToEdit: tempObj,
                                                        tempBucketNames: tempObjForTempNames
                                                    });
                                                }}
                                            >
                                                {bucket.bucketname}
                                            </div> 
                                            
                                            {   /* shows delete button for the bucket */
                                                this.props.visitingProfileUser === this.props.username?
                                                <button 
                                                        className = "DeleteButton"
                                                        onClick = {()=>(this.bucketDeleteHandler(bucket))}
                                                >
                                                </button> 
                                                : null
                                            }
                                        </div>
                                    }

                                    {/* Displays tasks of the bucket */}
                                    <Tasks bucketID = {bucket.id} username = {this.props.username} visitingProfileUser = {this.props.visitingProfileUser}/>
                                </div>
                            )
                        })
                    }
                </div>
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
  export default connect( mapStateToProps )( Buckets );