import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationCount: 0,
  newMessagesAlert:
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, get: true }) || [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },
    decrementNotification: (state) => {
      state.notificationCount = 0;
    },

    setNewMessagesAlert: (state, action) => {
      console.log("setNewMessagesAlert reducer called with:", action.payload);

      const { chatId, count } = action.payload;
      const chatIdStr = chatId.toString();

      // Find existing alert for this chat
      const existingIndex = state.newMessagesAlert.findIndex(
        (item) => item.chatId.toString() === chatIdStr,
      );

      if (existingIndex !== -1) {
        // Update existing alert
        state.newMessagesAlert[existingIndex].count += count;
        console.log(
          `Updated existing alert for chat ${chatIdStr}, new count:`,
          state.newMessagesAlert[existingIndex].count,
        );
      } else {
        // Add new alert
        state.newMessagesAlert.push({
          chatId: chatIdStr,
          count: count,
        });
        console.log(`Created new alert for chat ${chatIdStr}, count: ${count}`);
      }

      console.log("Updated newMessagesAlert state:", state.newMessagesAlert);

      // Save to localStorage
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: state.newMessagesAlert,
        save: true,
      });
    },

    removeNewMessagesAlert: (state, action) => {
      const chatIdToRemove = action.payload?.toString();

      console.log(
        "removeNewMessagesAlert reducer called for chat:",
        chatIdToRemove,
      );
      console.log("Current alerts before removal:", state.newMessagesAlert);

      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId?.toString() !== chatIdToRemove,
      );

      console.log("Current alerts after removal:", state.newMessagesAlert);

      // Save to localStorage
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: state.newMessagesAlert,
        save: true,
      });
    },
  },
});

export default chatSlice;
export const {
  incrementNotification,
  decrementNotification,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;
