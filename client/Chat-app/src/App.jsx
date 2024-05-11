import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { server } from "./constants/config";
import ProtectRoute from "./components/auth/ProtectRoute";
import { Loaders } from "./components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "../socket";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));

const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

function App() {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExist(data.user)))
      .catch((err) => dispatch(userNotExist()));
  }, [dispatch]);

  return loader ? (
    <Loaders />
  ) : (
    <>
      <Router>
        <Suspense fallback={<Loaders />}>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/messages" element={<MessageManagement />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="buttom-center" />
      </Router>
    </>
  );
}

export default App;

// import React, { Suspense, lazy, useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ProtectRoute from "./components/auth/ProtectRoute";
// import { LayoutLoader } from "./components/layout/Loaders";
// import axios from "axios";
// import { server } from "./constants/config";
// import { useDispatch, useSelector } from "react-redux";
// import { userExists, userNotExists } from "./redux/reducers/auth";
// import { Toaster } from "react-hot-toast";
// import { SocketProvider } from "./socket";

// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Chat = lazy(() => import("./pages/Chat"));
// const Groups = lazy(() => import("./pages/Groups"));
// const NotFound = lazy(() => import("./pages/NotFound"));

// const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
// const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
// const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
// const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
// const MessagesManagement = lazy(() =>
//   import("./pages/admin/MessageManagement")
// );

// const App = () => {
//   const { user, loader } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     axios
//       .get(`${server}/api/v1/user/me`, { withCredentials: true })
//       .then(({ data }) => dispatch(userExists(data.user)))
//       .catch((err) => dispatch(userNotExists()));
//   }, [dispatch]);

//   return loader ? (
//     <LayoutLoader />
//   ) : (
//     <BrowserRouter>
//       <Suspense fallback={<LayoutLoader />}>
//         <Routes>
//           <Route
//             element={
//               <SocketProvider>
//                 <ProtectRoute user={user} />
//               </SocketProvider>
//             }
//           >
//             <Route path="/" element={<Home />} />
//             <Route path="/chat/:chatId" element={<Chat />} />
//             <Route path="/groups" element={<Groups />} />
//           </Route>

//           <Route
//             path="/login"
//             element={
//               <ProtectRoute user={!user} redirect="/">
//                 <Login />
//               </ProtectRoute>
//             }
//           />

//           <Route path="/admin" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<Dashboard />} />
//           <Route path="/admin/users" element={<UserManagement />} />
//           <Route path="/admin/chats" element={<ChatManagement />} />
//           <Route path="/admin/messages" element={<MessagesManagement />} />

//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Suspense>

//       <Toaster position="bottom-center" />
//     </BrowserRouter>
//   );
// };

// export default App;
