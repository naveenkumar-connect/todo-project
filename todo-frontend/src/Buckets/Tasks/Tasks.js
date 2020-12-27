import React, {Component} from 'react';
import axios from 'axios';
import './Tasks.css';
import { connect } from 'react-redux';

class Tasks extends Component
{   
    state = {
        taskList: [],         // will be needed to store list of objects from API response
        addNewToBucket: false,// required to check if user is trying to add new values
        newFieldValue: '',     // required to hold new task value temporarily
        taskToEdit: {},       // holds info of the Task of which user wants to change name  
        tempTaskNames: {}     // holds values of temporary Task names when user tries to edit bucket name
    }
    
    getValues() {
        //performs reading values over the API and update them to state

        axios.get('/task/' + this.props.visitingProfileUser + '/')
        .then(response => {
            this.setState({ 
                taskList: response.data
            });
        })
        .catch(err =>{
            //executes when updation over API fails
            console.log("Task read failed");
        });
    }

    onTaskMarkHandler = (task) => {
        axios.patch('/task/' +this.props.username+ '/' + task.id + '/',
                    {
                        "checked": !task.checked
                    }
                        ,
                    {
                        headers: {
                            'Authorization' : `token ${this.props.authToken}`
                        }
                    })
                    .then(response => {
                        this.getValues();       //reloads card data from the api and rerenders the UI
                    })
                    .catch(err =>{
                        //executes when updation at the backend fails
                        console.log("Task Mark Failed");
                    }
        );
    }

    taskDeleteHandler = (task) => {
        axios.delete('/task/'+ this.props.username + '/' + task.id + '/',
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
                                console.log("Task Delete failed");
                            }
        );
    }

    constructor(props) {
        super(props);
        this.getValues();
    }

    addTaskSubmit = (event) => {
        event.preventDefault();

        axios.post('/task/' + this.props.username + '/',
            {
                taskname: this.state.newFieldValue,
                bucketname: this.props.bucketID,
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
                    addNewToBucket: false,
                    newFieldValue: ''     
                })
            })
            .catch(err =>{
                //executes when addition at the backend fails
                console.log("Bucket Creation Failed");
            }
        );

    }

    taskNameEditSubmit = (event, task) => {
        event.preventDefault();
        axios.patch('/task/'+ this.props.username + '/' + task.id + '/',
                            {
                                taskname: this.state.tempTaskNames[task.id]
                            }
                                ,
                            {
                                headers: {
                                    'Authorization' : `token ${this.props.authToken}`
                                }
                            })
                            .then(response => {
                                this.getValues();       //reloads card data from the api and rerenders the UI
                                var tempObj = this.state.taskToEdit;
                                tempObj[task.id] = false
                                this.setState({
                                    taskToEdit: tempObj
                                });
                            })
                            .catch(err =>{
                                //executes when updation at the backend fails
                                console.log("Task Name Change Failed");
                            }
        );
    }

    render(){
        return(
            <div>
                {   this.state.taskList.map((task, index) => {
                        return(
                            task.bucketname === this.props.bucketID ?
                                <div className = "Tasks" key = {task.id}>
                                    {   /* shows prompt to edit the task names*/
                                        this.state.taskToEdit[task.id] && this.props.visitingProfileUser === this.props.username?
                                        <form>
                                            <input 
                                                className="TaskNameEditInput"
                                                type = 'text' 
                                                value = {this.state.tempTaskNames[task.id]}
                                                onChange = {(event)=>{
                                                    var tempObj = this.state.tempTaskNames
                                                    tempObj[task.id] = event.target.value
                                                    this.setState({
                                                        tempTaskNames: tempObj
                                                    });
                                                }}
                                            />
                                            
                                            <button 
                                                className = "TaskNameEditSubmit"
                                                onClick = {(event)=>(this.taskNameEditSubmit(event, task))}
                                            >
                                                Submit 
                                            </button>

                                            <button
                                                className = "TaskNameEditCancel"
                                                onClick = {()=>{
                                                    var tempObj = this.state.taskToEdit;
                                                    tempObj[task.id] = false
                                                    this.setState({
                                                        taskToEdit: tempObj
                                                    });
                                                }}

                                            >
                                                Cancel
                                            </button>
                                        </form>
                                        :
                                        <div>
                                            {   /* displays checkbox to mark/unmark the task for completion */
                                                this.props.visitingProfileUser === this.props.username?
                                                    <form className = "TaskMark">
                                                        <input 
                                                            type = "checkbox" 
                                                            checked = {this.state.checked}
                                                            onChange = {() => (this.onTaskMarkHandler(task))}
                                                        >
                                                        
                                                        </input>
                                                    </form>
                                                : null
                                            }
                                            
                                            {/* shows task title */}
                                            <div 
                                                className = {task.checked?"TaskName Checked":"TaskName"}
                                                onClick = {()=>{
                                                    var tempObj = this.state.taskToEdit;
                                                    var tempObjForTempNames = this.state.tempTaskNames;
                                                    tempObj[task.id] = true
                                                    tempObjForTempNames[task.id] = task.taskname
                                                    this.setState({
                                                        taskToEdit: tempObj,
                                                        temptaskNames: tempObjForTempNames
                                                    });
                                                }}
                                            >
                                                {task.taskname}
                                            </div>
                                            
                                            {   /* shows delete button for the task */
                                                this.props.visitingProfileUser === this.props.username?
                                                <button 
                                                        className = "DeleteButton"
                                                        onClick = {()=>(this.taskDeleteHandler(task))}
                                                >
                                                </button> 
                                                : null
                                            }
                                        </div>
                                    }
                                </div> : null
                        )
                    })
                }
                {
                    this.state.addNewToBucket? 
                    <form>
                        {/* add new task */}
                        <input 
                            className="TaskNameEditInput"
                            type = 'text' 
                            placeholder = 'Enter Task'
                            value = {this.state.newFieldValue}
                            onChange = {(event)=>{
                                this.setState({
                                    newFieldValue: event.target.value
                                });
                            }}
                        />
                        {/* Submit new task */}
                        <button 
                            className = "TaskNameEditSubmit"
                            onClick = {(event)=>(this.addTaskSubmit(event))}
                        >
                            Submit 
                        </button>

                        {/* cancel new task */}
                        <button
                            className = "TaskNameEditCancel"
                            onClick = { () => {
                                this.setState(
                                    {
                                        addNewToBucket: false
                                    }
                                );
                            }}

                        >
                            Cancel
                        </button>

                    </form>
                    :
                    <div>
                        {   /* shows add button for the tasks */
                            this.props.visitingProfileUser === this.props.username?
                                <button
                                    className = "AddButton"
                                    onClick = { () => {
                                        this.setState(
                                            {
                                                addNewToBucket: true
                                            }
                                        );
                                    }}
                                />
                            :null
                        }
                    </div>
                }

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
  export default connect( mapStateToProps )( Tasks );