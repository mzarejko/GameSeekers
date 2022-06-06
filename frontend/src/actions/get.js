import { toast, ToastContainer } from 'react-toastify';


export function getData(url)  {
    
        return fetch(
            url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
        }).then(function(response){
            console.log(response)
            return response.json();
          })
          .then(function(myJson) {
            console.log(myJson);
          });
                
    
}
