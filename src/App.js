// // NOMOR 1
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
// 	Route,
// 	Link
// } from 'react-router-dom';
// import Home from "./Pages/Home";
// import About from "./Pages/About";
// import Dashboard from "./Pages/Dashboard";

// export default function BasicExample() {
//   return(
//     <Router>
//       <div>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/about">About</Link>
//           </li>
//           <li>
//             <Link to="/dashboard">Dashboard</Link>
//           </li>
//         </ul>
//         <hr />
//         <Routes>
//           <Route exact path="/" element={<Home />}/>
//           <Route path="/about" element={<About />}/>
//           <Route path="/dashboard" element={<Dashboard />}/>
//         </Routes>
//       </div>
//     </Router>
// 	);
// }

//Nomor2
// import React from "react";
// import{
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   useParams
// } from "react-router-dom";
// import Child from "./Pages/Child";

// export default function ParamsExample(){
//   return(
//     <Router>
//       <div>
//         <h2>Accounts</h2>
//         <ul>
//           <li>
//             <Link to="/netflix">Netflix</Link>
//           </li>
//           <li>
//             <Link to="/gmail">Gmail</Link>
//           </li>
//           <li>
//             <Link to="/yahoo">Yahoo</Link>
//           </li>
//           <li>
//             <Link to="/amazon">Amazon</Link>
//           </li>
//         </ul>
//         <Routes>
//           <Route path="/:id" element={<Child />}/>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// //Use Nesting Router nomr 3
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
// 	Route,
// 	Link,
// } from 'react-router-dom';
// import Home from "./Pages/Home";
// import Topics from "./Pages/Topics/Topics";
// import Kuliner from "./Pages/Topics/Kuliner";
// import ReviewHotel from "./Pages/Topics/ReviewHotel";
// import Travelling from "./Pages/Topics/Travelling";

// export default function NestingExample(){
//   return(
//     <Router>
//       <div>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/topics">Topics</Link>
//           </li>
//         </ul>
//         <hr />
//         <Routes>
//           <Route path="/" element={<Home/>}/>
//           <Route path="/topics" element={<Topics/>}>
//             <Route path="kuliner" element={<Kuliner/>}/>
//             <Route path="review-hotel" element={<ReviewHotel/>}/>
//             <Route path="travelling" element={<Travelling/>}/>
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// NOMOR 4 Use Redirects
import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
  Outlet
} from "react-router-dom";

export default function AuthExample() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />

          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>

          <Routes>
            <Route path="/public" element={<PublicPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<PrivateRoute/>}>
              <Route path="/protected" element={<ProtectedPage/>}/>
            </Route>
          </Routes>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton() {
  let navigate = useNavigate();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

function PrivateRoute({ children, ...rest}){
  let auth = useAuth();
  return auth.user ? <Outlet /> : <Navigate to="/login" />;
}

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return(
    
    <h3>Protected</h3>
  );
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/protected" } };
  let login = () => {
    auth.signin(() => {
      navigate("/", {replace: true});
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}