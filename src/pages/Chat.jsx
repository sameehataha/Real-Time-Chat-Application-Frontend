import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteScrollTop } from "6pp";

// Internal Imports
import { lightGray, deepRoyalBlue } from "../constants/color";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialog/FileMenu";
import MessageCpmponent from "../components/shared/MessageCpmponent";
import { getSocket } from "../socket";
import {
  NEW_MESSAGE,
  NEW_ATTACHMENTS,
  START_TYPING,
  STOP_TYPING,
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVE,
} from "../constants/events.js";
import { useChatDetailsQuery, useGetMessagesQuery } from "../api/api.js";
import { useSocketEvents } from "../Hooks/hook.jsx";
import { setIsFileMenu } from "../redux/reducers/misc-reducer-.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat-reducer.js";
import { TypyingLoader } from "../components/layout/Loaders.jsx";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, onlineUsers = [] }) => {
  const containerRef = useRef(null);
  const fileMenuAnchorRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Fetching stored messages from API
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  );

  const chatDetails = useChatDetailsQuery({
    chatId,
    populate: true,
    skip: !chatId,
  });

  // SAFE SOCKET EMIT FUNCTION
  const safeEmit = useCallback(
    (event, data) => {
      if (!socket?.connected) {
        console.warn(`Socket not connected, cannot emit ${event}`);
        return false;
      }
      socket.emit(event, data);
      console.log(`Emitted ${event}:`, data);
      return true;
    },
    [socket],
  );

  // MESSAGE INPUT HANDLER WITH TYPING
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    // Only emit START_TYPING once when we start typing
    if (!IamTyping && socket?.connected) {
      safeEmit(START_TYPING, { chatId });
      setIamTyping(true);
    }

    // Clear the previous timer
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    // Start a new timer to emit STOP_TYPING after 1 second of inactivity
    typingTimeout.current = setTimeout(() => {
      if (IamTyping && socket?.connected) {
        safeEmit(STOP_TYPING, { chatId });
        setIamTyping(false);
      }
    }, 1000);
  };

  const members = chatDetails?.data?.chat?.members || [];
  useEffect(() => {
    console.log("\nMEMBERS DEBUG");
    console.log("Chat Details loading:", chatDetails.isLoading);
    console.log("Chat ID:", chatId);
    console.log("Members array:", members);
    console.log("Members count:", members.length);
    if (members.length > 0) {
      console.log("Sample member:", members[0]);
    }
  }, [members, chatId, chatDetails.isLoading]);

  // SOCKET EVENT HANDLERS
  const handleNewMessage = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === data.message._id);
        if (isDuplicate) return prev;
        return [...prev, data.message];
      });
    },
    [chatId],
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
      console.log("ðŸ‘¤ User started typing");
    },
    [chatId],
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
      console.log("ðŸ‘¤ User stopped typing");
    },
    [chatId],
  );

  const alertListener = useCallback(
    (content) => {
      const messageForAlert = {
        content,
        sender: {
          _id: "admin-system",
          name: "Admin",
        },
        chatId: chatId,
        createdAt: new Date().toISOString(),
        isAlert: true,
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId],
  );

  const handleNewAttachment = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => {
        const isDuplicate = prev.some((msg) => msg._id === data.message._id);
        if (isDuplicate) return prev;
        return [...prev, data.message];
      });
    },
    [chatId],
  );

  // Memoize event handlers
  const eventHandlers = useMemo(
    () => ({
      [NEW_MESSAGE]: handleNewMessage,
      [ALERT]: alertListener,
      [NEW_ATTACHMENTS]: handleNewAttachment,
      [START_TYPING]: startTypingListener,
      [STOP_TYPING]: stopTypingListener,
    }),
    [
      handleNewMessage,
      handleNewAttachment,
      startTypingListener,
      stopTypingListener,
      alertListener,
    ],
  );

  // Register socket listeners
  useSocketEvents(socket, eventHandlers);

  // SOCKET ROOM MANAGEMENT
  useEffect(() => {
    if (!socket?.connected || !chatId) {
      console.warn("Socket not ready or chatId missing");
      return;
    }

    console.log("Joining chat room:", chatId);

    // Join chat room
    safeEmit("JOIN_CHAT", chatId);

    // Notify others that user joined
    safeEmit(CHAT_JOINED, { userId: user._id, members });

    // Remove alert for this chat
    dispatch(removeNewMessagesAlert(chatId));

    // Cleanup on unmount
    return () => {
      console.log("Leaving chat room:", chatId);
      safeEmit("LEAVE_CHAT", chatId);
      safeEmit(CHAT_LEAVE, { userId: user._id, members });
      setMessages([]);
      setMessage("");
      setPage(1);
      setOldMessages([]);
    };
  }, [chatId, socket?.connected, dispatch, safeEmit, user._id, setOldMessages]);

  // AUTO SCROLL TO BOTTOM
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // HANDLE CHAT ERRORS
  useEffect(() => {
    if (chatDetails.isError) {
      console.error("Chat error, redirecting to home");
      navigate("/");
    }
  }, [chatDetails.isError, navigate]);

  // SEND MESSAGE HANDLER
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("SUBMIT HANDLER");

    if (!message.trim()) {
      console.warn("Empty message");
      return;
    }

    if (!socket?.connected) {
      console.error("Socket not connected");
      return;
    }

    console.log(`Socket connected: ${socket.id}`);
    console.log(`Chat ID: ${chatId}`);
    console.log(`Message: "${message}"`);

    // GET ALL MEMBER IDs
    const memberIds = members
      .map((m) => {
        if (typeof m === "string") return m;
        return m._id;
      })
      .filter((id) => id);

    console.log(`Members found: ${memberIds.length}`);
    memberIds.forEach((id, i) => {
      console.log(`[${i}] ${id.toString().slice(0, 10)}...`);
    });

    // EMIT MESSAGE
    console.log(`\n Emitting NEW_MESSAGE...`);
    safeEmit(NEW_MESSAGE, {
      chatId,
      message,
      members: memberIds,
    });

    console.log(`Message emitted!`);
    setMessage("");
  };

  // RENDER
  if (chatDetails.isLoading)
    return <Skeleton variant="rectangular" height="100vh" />;

  // Combine API history with real-time messages
  const allMessages = [...oldMessages, ...messages];

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        bgcolor={lightGray}
        padding="1rem"
        spacing="1rem"
        height="90%"
        sx={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {allMessages.map((msg) => (
          <MessageCpmponent
            key={msg._id}
            message={msg}
            user={user}
            isOnline={onlineUsers.includes(msg.sender?._id?.toString())}
          />
        ))}
        {userTyping && <TypyingLoader />}
        <div ref={bottomRef} />
      </Stack>

      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction="row"
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >
          <IconButton
            ref={fileMenuAnchorRef}
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }}
            onClick={() => dispatch(setIsFileMenu(true))}
            disabled={!socket?.connected}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message..."
            value={message}
            onChange={messageOnChange}
            disabled={!socket?.connected}
          />

          <IconButton
            type="submit"
            disabled={!socket?.connected}
            sx={{
              rotate: "-30deg",
              backgroundColor: deepRoyalBlue,
              color: lightGray,
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": { bgcolor: "primary.main" },
              "&:disabled": { bgcolor: "gray" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchorRef.current} chatId={chatId} />
    </>
  );
};

export default Chat;
