import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { useSelector } from "react-redux";
import LayoutLoaders from "./components/layout/Loaders";
import AppLayout from "./components/layout/AppLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketProvider } from "./socket.jsx";
import { userExists, userNotExists } from "./redux/reducers/auth-reducer.js";
import axios from "axios";
import { server } from "./constants/config.js";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const Notfound = lazy(() => import("./pages/Notfound"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/Admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/Admin/MessageManagement"));

const HomeWithLayout = AppLayout()(Home);
const ChatWithLayout = AppLayout()(Chat);

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader ? (
    <LayoutLoaders />
  ) : (
    <SocketProvider>
      <BrowserRouter>
        <Suspense fallback={<LayoutLoaders />}>
          <Routes>
            {/* Admin routes - BEFORE protected routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/messages" element={<MessageManagement />} />

            {/* Public login route */}
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />

            {/* Protected user routes */}
            <Route element={<ProtectRoute user={user} />}>
              <Route path="/" element={<HomeWithLayout />} />
              <Route path="/chat/:chatId" element={<ChatWithLayout />} />
              <Route path="/groups" element={<Groups />} />
            </Route>

            {/* 404 - last */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;
