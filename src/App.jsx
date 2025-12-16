import React, { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./routes/routes";

import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "./sockets/socket";
import { registerSocketListeners } from "./sockets/socketListeners";
import { getAllArticles } from "./redux/slices/articleSlice";
import { setInitialRequests } from "./redux/slices/friendSlice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // 🔐 prevents duplicate socket listeners
  const listenersRegistered = useRef(false);

  useEffect(() => {
    if (user?.pendingRequests) {
      dispatch(setInitialRequests(user.pendingRequests));
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      // 🔹 connect socket
      connectSocket(user._id);

      // 🔹 register socket listeners ONCE
      if (!listenersRegistered.current) {
        registerSocketListeners();
        listenersRegistered.current = true;
      }

      // 🔹 fetch articles ONLY after login
      dispatch(getAllArticles());
    }

    // 🔹 cleanup on logout
    return () => {
      disconnectSocket();
      listenersRegistered.current = false;
    };
  }, [user?._id, dispatch]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default App;
