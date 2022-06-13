import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const refreshToken = (callback1, callback2) => {
    axios.post('https://game-seekers-backend.herokuapp.com/v1/accounts/refresh-token/', {
        "refresh": localStorage.getItem('refresh_token')
    }).then((response) => {
        localStorage.removeItem('access_token')
        localStorage.setItem('access_token', response.data.access);

        if (callback1) {
            callback1()
        }
    }).catch((err) => {
        if (callback2) {
            callback2()
        }
        return err
    });
}

export const logout = () => {
    axios.post('https://game-seekers-backend.herokuapp.com/v1/accounts/logout/',
        { "refresh": localStorage.getItem('refresh_token') },
        {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }
    ).then((response) => {
        toast.success('🦄 Użytkownik ' + localStorage.getItem("currentUser") + " został wylogowany", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('currentUser')
    }).catch((err) => {
        console.log(err)
    });
}

export const login = (username, password) => {
    axios.post("https://game-seekers-backend.herokuapp.com/v1/accounts/login/", {
        "username": username,
        "password": password
    }).then((response) => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('currentUser', username);
        toast.success('🦄 Zalogowano jako ' + username, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }).catch((error) => {
        console.log(error)
    });
}
