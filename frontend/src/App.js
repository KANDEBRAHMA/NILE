import './App.css';
import ResponsiveAppBar from './components/menu';
import './App.css'
import React, { useState } from "react";
import { UserRoutes, AdminRoutes, DriverRoutes, NormalRoutes } from './routes/routes'

function App() {
  const LoginContext = React.createContext();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") ? true : false);
  // const [hasAlreadyReload, setHasAlreadyReload] = React.useState(false);

  // function assignRoute(is) {
  //   if (is === true) {
  //     if (localStorage.getItem('role') === 'Admin') {
  //       <div>
  //         <AdminRoutes />
  //         <p>admin route</p>
  //       </div>

  //     }
  //     else if (localStorage.getItem('role') === 'User') {
  //       <div>
  //         <UserRoutes></UserRoutes>
  //         <p>user route</p>
  //       </div>

  //     }
  //     else if (localStorage.getItem('role') === 'Driver') {
  //       <div>
  //         <DriverRoutes />
  //         <p>driver route</p>
  //       </div>

  //     }
  //     else {
  //       <div><NormalRoutes />
  //         normal</div>
  //     }
  //   }
  // }

  // const role = localStorage.getItem('role')
  // if (role == 'Admin') {
  //   <AdminRoutes></AdminRoutes>
  // }
  // else if (role == 'User') {
  //   <UserRoutes></UserRoutes>
  // }
  // else if (role == 'Driver') {
  //   <DriverRoutes></DriverRoutes>
  // }
  // else {
  //   <NormalRoutes></NormalRoutes>
  // }

  function getRoutes() {
    switch (localStorage.getItem('role')) {
      case 'Admin':
        return  <AdminRoutes></AdminRoutes>
      case 'Driver':
        return  <DriverRoutes></DriverRoutes>
      case 'User':
          return   <UserRoutes></UserRoutes>
      default:
        return <NormalRoutes></NormalRoutes>
    }
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="App">
        <ResponsiveAppBar />
        {/* {console.log(isLoggedIn)}
        <assignRoute is={isLoggedIn}></assignRoute> */}

        {/* {
          (() => {
            switch(localStorage.getItem('role')){
              case 'Admin':
                <div>
                  Admin
                  <AdminRoutes></AdminRoutes>
                </div>
              case 'Driver':
                <div>
                  Driver
                  <DriverRoutes></DriverRoutes>
                </div>
              case 'User':
                <div>
                  Driver
                  <UserRoutes></UserRoutes>
                </div>
              default:
                <div>
                  <NormalRoutes></NormalRoutes>
                </div>
            }
          })
        } */}
        {
          isLoggedIn ? <div>{getRoutes()}</div>:<NormalRoutes></NormalRoutes>
        }

        {/* if(isLoggedIn){

        } */}
        {/* {isLoggedIn && localStorage.getItem('role') === 'Admin' ? 
        <div className='admin-routes'>
          <AdminRoutes></AdminRoutes>
          {<p>admin routes</p>}
        </div> : <div className='normal-routes'><DriverRoutes></DriverRoutes>
        driver route</div>} */}



        {/* {isLoggedIn ?
          <div>
            {localStorage.getItem('role') === 'Admin'}?<div><AdminRoutes></AdminRoutes></div>
          </div> :
          <div>
            {localStorage.getItem('role')==='Driver'}?<div></div>
          </div>} */}
      </div>
    </LoginContext.Provider>
  );
}

export default App;
