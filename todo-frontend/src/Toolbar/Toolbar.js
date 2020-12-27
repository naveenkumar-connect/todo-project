/* Displays Toolbar */

import React from 'react';
import './Toolbar.css';
import { NavLink } from 'react-router-dom';

const toolbar = (props) => (
        <header className='Toolbar'>

            {/* user profile name */}
            <div>{props.visitingProfileUser}</div>

            {/* app title */}
            <div className="ToDoText">
                <NavLink
                        to = "/login"
                        exact
                        className="Login"
                > To Do Tasks
                </NavLink>
            </div>
            {   /* showing login/logout button depending whether user is logged in or not */
                props.isAuthenticated?
                <div>
                    <NavLink
                        to = "/logout"
                        exact
                        className="Logout"
                    > Logout
                    </NavLink>
                </div>
                : 
                <div>
                    <NavLink
                        to = "/login"
                        exact
                        className="Login"
                    > Login
                    </NavLink>
                </div>
            }
        </header>
);

export default toolbar;

