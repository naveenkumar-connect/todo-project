/*  Manages the redux state, state is modified on the basis of triggering actions 
    The state contains properties such as username, authtoken and isAuthenticated.
    All these properties determines if some user is logged in or not and if logged in
    what is the username and what is the authToken.
*/

import * as actionTypes from './Action';

const initialState = {
    username : window.localStorage.getItem('username'),
    authToken : window.localStorage.getItem('authToken'),
    isAuthenticated : window.localStorage.getItem('isAuthenticated')
}

const reducer = (state = initialState, action) => {
    /* updates redux state on the basis of the actions received */

    switch (action.type) {
        case actionTypes.TOKENRECEIVED:
            window.localStorage.setItem('username', action.authData.username);
            window.localStorage.setItem('authToken', action.authData.authToken);
            window.localStorage.setItem('isAuthenticated', action.authData.isAuthenticated);
            return {
                ...state,
                username: action.authData.username,
                authToken: action.authData.authToken,
                isAuthenticated: action.authData.isAuthenticated
            }
        case actionTypes.LOGOUT:
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('authToken');
            window.localStorage.removeItem('isAuthenticated');
            return {
                ...state,
                username: "",
                authToken: null,
                isAuthenticated: false
            }
    }
    return state;
};

export default reducer;