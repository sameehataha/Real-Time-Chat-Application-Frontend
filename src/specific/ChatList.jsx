import React from "react";
import { Stack } from "@mui/material";
import ChatItem from "../components/shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  newMessagesAlert = [],
  handleDeleteChat,
  onlineUsers = [], 
  userId,
}) => {
  return (
    <Stack width={w} direction={"column"} sx={{ overflowY: "auto", height: "100%" }}>
      {chats?.map((data, index) => {
        const { _id, name, avatar, groupChat, members } = data;

        // For group chats, show online if any member (except current user) is online
        // For one-on-one chats, show online if the other user is online
        let isOnline = false;

        if (groupChat) {
          // Group chat: show online if any member besides current user is online
          isOnline = members?.some((member) => {
            const memberId = typeof member === 'string' ? member : member._id;
            return memberId !== userId && onlineUsers.includes(memberId);
          });
        } else {
          // One-on-one chat: show online if the other user is online
          const otherMember = members?.find((member) => {
            const memberId = typeof member === 'string' ? member : member._id;
            return memberId !== userId;
          });

          if (otherMember) {
            const otherMemberId = typeof otherMember === 'string' ? otherMember : otherMember._id;
            isOnline = onlineUsers.includes(otherMemberId);
          }
        }

        // Debug logging
        if (isOnline) {
          console.log(`ðŸ”µ Chat "${name}" is online. Group chat: ${groupChat}, Online users:`, onlineUsers);
        }

        const messageAlert = newMessagesAlert.find(
          (alert) => alert.chatId?.toString() === _id?.toString()
        );

        return (
          <ChatItem
            key={_id}
            index={index}
            _id={_id}
            name={name || "Unknown Chat"}
            avatar={avatar || []}
            groupChat={groupChat || false}
            sameSender={chatId === _id.toString()}
            newMessageAlert={messageAlert}
            handleDeleteChat={handleDeleteChat}
            isOnline={isOnline} 
          />
        );
      })}
    </Stack>
  );
};
export default ChatList;