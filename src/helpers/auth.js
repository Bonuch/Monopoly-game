import { setAuthorization } from '@/helpers/axios-instance';
import axios from '@/helpers/axios-instance';

export function login(credentials) {

    return new Promise((res, rej) => {
        axios.post('/auth', credentials)
            .then((response) => {
                setAuthorization(response.data.accessToken);
                res(response.data);
            })
            .catch((err) =>{
                rej("Incorrect username or password.");
            })
    });
}


export function confirmLogin()
{
    return new Promise((resolve, reject) => {
        axios.post('/auth-confirm', {auth: 1}).then((response) => {
            setAuthorization(response.data.accessToken);
            resolve(response.data);
        })
        .catch((err) =>{
            reject("The access key was incorrect");
        });
    });
}
