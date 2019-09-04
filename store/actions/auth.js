export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

import { AsyncStorage } from 'react-native';

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token})
    }
    
}

export const signup = (email, password) => {
    return async dispatch => {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTciDHgU6VKRqMGZCCstfxS7XQlBdNX2A', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email : email,
                    password: password,
                    returnSecureToken: true
                })
            })
            if (!response.ok){
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong'
                if (errorId === 'EMAIL_EXISTS'){
                    message="This email exists already";
                }
                throw new Error(message)
            }
            const resData = await response.json();
            dispatch(authenticate(resData.userId, resData.localId, parseInt(resData.expiresIn) * 1000 ));
            saveDataToStorage(resData.idToken, resData.localId);
    }
};

export const logout = () => {
    return async dispatch => {
        await AsyncStorage.removeItem('userData');
        clearLogoutTimer();
        dispatch({type: LOGOUT});
    }
};

const clearLogoutTimer = () => {
    if (timer){
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

export const login = (email, password) => {
    return async dispatch => {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDTciDHgU6VKRqMGZCCstfxS7XQlBdNX2A', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email : email,
                    password: password,
                    returnSecureToken: true
                })
            })
            if (!response.ok){
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'Something went wrong'
                if (errorId === 'EMAIL_NOT_FOUND'){
                    message="Email could not be found";
                }
                else if (errorId==='INVALID_PASSWORD'){
                    message="Password is invalid"
                }
                throw new Error(message)
            }
            const resData = await response.json();
            dispatch(authenticate(resData.userId, resData.localId, parseInt(resData.expiresIn) * 1000));
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000).toISOString();
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate
    }))
}