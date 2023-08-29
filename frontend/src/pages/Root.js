import { Outlet, useLoaderData, useNavigation, useSubmit } from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { useEffect } from 'react';
import {getTokenDuration} from "../utils/auth";

function RootLayout() {
  // const navigation = useNavigation();
const token = useLoaderData(); // no need for useRouteLoaderData('root') since this is in the root

const submit= useSubmit();

useEffect(() => {
if(!token) {
  return;
}
if(token === 'EXPIRED'){
  submit(null,{action:'/logout' , method:'POST'})
}

const tokenDuration = getTokenDuration();
console.log(tokenDuration,"TOKEN DURATION");

const timer = setTimeout(() => {
submit(null,{action:'/logout' , method:'POST'})
},tokenDuration)
return () => {
  clearTimeout(timer);
}

},[token,submit]) 

return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
