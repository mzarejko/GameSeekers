import axios from 'axios';
import { Redirect } from 'react-router-dom';
import React from 'react';



export const refreshToken = (callback1, callback2) => {
    axios.post('https://game-seekers-backend.herokuapp.com/v1/accounts/refresh-token/', {
        "refresh" : localStorage.getItem('refresh_token') 
    }).then((response) => {
        localStorage.removeItem('access_token')
        localStorage.setItem('access_token', response.data.access);

        if (callback1){
            callback1()
        }
    }).catch((err) => {
       if (callback2){
           callback2()
       }
       return err
    });
}

export const logout = () => {
    axios.post('https://game-seekers-backend.herokuapp.com/v1/accounts/logout/',{
        "refresh" : localStorage.getItem('refresh_token')
    }).then((response) => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }).catch((err) => {
        console.log(err)
    });
}



// export const login = (username, password) => {
        
//         axios.post("https://game-seekers-backend.herokuapp.com/v1/accounts/login/", {
//             "username": username,
//             "password": password
//         }).then((response) => {
//             localStorage.setItem('access_token', response.data.access);
//             localStorage.setItem('refresh_token', response.data.refresh);
//             localStorage.setItem('loggedIn', true);
//         }).catch((error) => {

//         });
        
// }

// export const register = (username, email, password1, password2) => {
//     axios.post("https://game-seekers-backend.herokuapp.com/v1/accounts/register/", {
//         "username": username,
//         "email": email,
//         "password1": password1,
//         "password2": password2
//     }).then((response) => {
//         return true
//     }).catch((error) => {
//         console.log(error)
//         return false
//     });
    
// }