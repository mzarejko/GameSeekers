import axios from 'axios';

export const refreshToken = (callback1, callback2) => {
    axios.post('http://0.0.0.0:8000/v1/accounts/refresh-token/', {
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
    axios.post('http://0.0.0.0:8000/v1/accounts/logout/',{
        "refresh" : localStorage.getItem('refresh_token')
    }).then((response) => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }).catch((err) => {
        console.log(err)
    });
}

export const login = (username, password) => {
        axios.post("http://0.0.0.0:8000/v1/accounts/login/", {
            "username": username,
            "password": password
        }).then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }).catch((error) => {
            console.log(error)
        });
}
