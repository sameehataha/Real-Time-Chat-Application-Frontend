import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { Drawer, Grid, Skeleton } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Header";
import Title from "../shared/Title";
import ChatList from "../../specific/ChatList";
import ProfileCard from "../../specific/ProfileCard";
import DeleteChatMenu from "../dialog/DeleteChatMenu.jsx";
import { useMyChatsQuery } from "../../api/api";
import { useSocketEvents, useErrors } from "../../Hooks/hook.jsx";
import { getSocket } from "../../socket.jsx";
import { blue } from "../../constants/color.js";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFECTCH_CHATS,
  CHAT_JOINED, 
  CHAT_LEAVE,
  ONLINE_USERS,
} from "../../constants/events.js";
import {
  incrementNotification,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} from "../../redux/reducers/chat-reducer.js";
import { getOrSaveFromStorage } from "../../lib/features.js";
import { setIsDeleteMenu, setSelectedDeleteChat } from "../../redux/reducers/misc-reducer-.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;
    const socket = getSocket();
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]); 

    const { isMobileMenu } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("", {
      refetchOnMountOrArgChange: true,
    });

    useErrors([{ isError, error }]);

    // Notify server that this user is online
    useEffect(() => {
      if (user?._id && socket) {
        socket.emit(CHAT_JOINED, user._id);
      }
    }, [user?._id, socket]);

    useEffect(() => {
      if (chatId) dispatch(removeNewMessagesAlert(chatId));
    }, [chatId, dispatch]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

const handleNewMessageAlertHandler = useCallback((data) => {

  console.log("NEW_MESSAGE_ALERT RECEIVED");
  console.log("Data:", data);
  console.log("Current chatId:", chatId);
  
  // If message is from the current chat, don't show alert
  if (data?.chatId?.toString() === chatId?.toString()) {
    console.log("Alert is from current chat, skipping notification");
    return;
  }

  console.log(`Dispatching setNewMessagesAlert for chat: ${data.chatId}`);
  
  // Dispatch to Redux to update notification count
  dispatch(setNewMessagesAlert({ 
    chatId: data.chatId.toString(), 
    count: 1 
  }));
  
  console.log("Alert dispatched to Redux");
}, [chatId, dispatch]);

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
      refetch();
    }, [dispatch, refetch]);

    const refetchChatsHandler = useCallback(() => refetch(), [refetch]);

    //Online/Offline Handlers
    const onlineUsersListener = useCallback((data) => {
      console.log("ONLINE_USERS event received:", data);
      setOnlineUsers(data || []); // Update online users state with full list
    }, []);

    const handleUserOnline = useCallback((data) => {
      console.log("USER_ONLINE event:", data.userId);
      setOnlineUsers((prev) => {
        const userId = data.userId?.toString();
        if (userId && !prev.includes(userId)) {
          console.log("Adding user to online list:", userId);
          return [...prev, userId];
        }
        return prev;
      });
    }, []);

    const handleUserOffline = useCallback((data) => {
      console.log("USER_OFFLINE event:", data.userId);
      setOnlineUsers((prev) => {
        const userId = data.userId?.toString();
        if (userId) {
          console.log("Removing user from online list:", userId);
          return prev.filter(id => id !== userId);
        }
        return prev;
      });
    }, []);


    const eventHandlers = useMemo(() => ({
      [NEW_MESSAGE_ALERT]: handleNewMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFECTCH_CHATS]: refetchChatsHandler,
      [ONLINE_USERS]: onlineUsersListener,
      "USER_ONLINE": handleUserOnline,
      "USER_OFFLINE": handleUserOffline,
    }), [handleNewMessageAlertHandler, newRequestHandler, refetchChatsHandler, onlineUsersListener, handleUserOnline, handleUserOffline]);

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title title={"Chat"} />
        <Header />
        <DeleteChatMenu deleteMenuAnchor={deleteMenuAnchor} />

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid item size={{ sm: 4, md: 3 }} sx={{ display: { xs: "none", sm: "block" } }} height={"100%"}>
            {isLoading ? <Skeleton /> : (
              <ChatList
                chats={data?.chats || []}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
                userId={user?._id}
              />
            )}
          </Grid>

          <Grid item size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
           <WrappedComponent {...props} chatId={chatId} user={user} onlineUsers={onlineUsers} />
          </Grid>

          <Grid item size={{ md: 4, lg: 3 }} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: blue }} height={"100%"}>
            <ProfileCard user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;