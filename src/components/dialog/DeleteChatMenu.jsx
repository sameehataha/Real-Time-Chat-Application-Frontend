import { Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc-reducer-.js";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import toast from "react-hot-toast";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../api/api";
import { useAsyncMutation } from "../../Hooks/hook";
import { useNavigate } from "react-router-dom";

const DeleteChatMenu = ({ deleteMenuAnchor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingDeleteChat, _, deleteChat] = useAsyncMutation(
    useDeleteChatMutation,
  );
  const [isLoadingLeaveGroup, __, leaveGroup] = useAsyncMutation(
    useLeaveGroupMutation,
  );

  console.log("DeleteChatMenu - selectedDeleteChat:", selectedDeleteChat);

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
  };

  //check if groupChat is true
  const isGroupChat = selectedDeleteChat?.groupChat === true;
  const chatId = selectedDeleteChat?.chatId;

  const deleteChatHandler = async () => {
    // Prevent double-click/multiple submissions
    if (isDeleting) return;

    setIsDeleting(true);
    closeHandler();
    deleteMenuAnchor.current = null;

    if (!chatId) {
      toast.error("Chat ID not found");
      setIsDeleting(false);
      return;
    }

    try {
      // Await the mutation and check the response
      const res = await deleteChat("Deleting Chat...", chatId);

      console.log("Delete response:", res);

      // Check if response has success flag
      if (res?.data?.success) {
        console.log("Chat deleted successfully, navigating...");
        // Wait a moment for socket event to be processed
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else if (res?.error) {
        console.error("Delete failed:", res.error);
        toast.error(res.error?.data?.message || "Failed to delete chat");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
      setIsDeleting(false);
    }
  };

  const leaveGroupHandler = async () => {
    // Prevent double-click/multiple submissions
    if (isDeleting) return;

    setIsDeleting(true);
    closeHandler();
    deleteMenuAnchor.current = null;

    if (!chatId) {
      toast.error("Chat ID not found");
      setIsDeleting(false);
      return;
    }

    try {
      // Await the mutation and check the response
      const res = await leaveGroup("Leaving Group...", chatId);

      console.log("Leave group response:", res);

      //  Check if response has success flag
      if (res?.data?.success) {
        console.log("Left group successfully, navigating...");
        // Wait a moment for socket event to be processed
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else if (res?.error) {
        console.error("Leave failed:", res.error);
        toast.error(res.error?.data?.message || "Failed to leave group");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
      setIsDeleting(false);
    }
  };

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor?.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {isGroupChat ? (
        <MenuItem
          onClick={leaveGroupHandler}
          disabled={isLoadingLeaveGroup || isDeleting}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Leave Group</Typography>
        </MenuItem>
      ) : (
        <MenuItem
          onClick={deleteChatHandler}
          disabled={isLoadingDeleteChat || isDeleting}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Delete Chat</Typography>
        </MenuItem>
      )}
    </Menu>
  );
};

export default DeleteChatMenu;
