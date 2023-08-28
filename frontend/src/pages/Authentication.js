import { json, redirect } from 'react-router';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async({request,params}) => {

//grab the mode from the searchParams
const searchParams = new URL(request.url).searchParams;
const mode = searchParams.get('mode') || 'login'; // if undefined then mode = login

if(mode !== 'login' && mode !== 'signup'){
  throw json({message:'Unsupported mode'},{status:422})
}

const data = await request.formData();
const authData = {
  email : data.get('email'),
  password : data.get('password')
}

const response = await fetch('http://localhost:8080/' + mode,{
  method:'POST',
  body:JSON.stringify(authData),
  headers : {
    'Content-type': 'application/json'
  }
})

//this is backend response
if(response.status === 422 || response.status === 401) {
  return response
}

if(!response.ok) {
  throw json({message:'Couldnot authenticate user'},{status:500})
}

// get the token from the backend

const resData = await response.json();
const token = resData.token;

///store the token on localstorage

localStorage.setItem('token' , token);

//for automatic logout

const expiration = new Date();
expiration.setHours(expiration.getHours() + 1);
localStorage.setItem('expiration' , expiration.toISOString())

return redirect('/')

}