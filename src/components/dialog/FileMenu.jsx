import React, { useRef } from "react";
import { ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsFileMenu,
  setUploadingLoader,
} from "../../redux/reducers/misc-reducer-";
import {
  AudioFile,
  Image as ImageIcon,
  UploadFile,
  VideoFile,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachementsMutation } from "../../api/api";

const FileMenu = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachementsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const selectRef = (ref) => ref.current?.click();

  const fileChangeHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error("You can only send up to 5 files at a time");

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading("Sending attachments...");
    closeFileMenu();

    try {
      const formData = new FormData();
      formData.append("chatId", chatId);

      files.forEach((file) => formData.append("files", file));

      const res = await sendAttachments(formData);

      if (res.data) {
        toast.success("Sent successfully", { id: toastId });
      } else {
        toast.error(res.error?.data?.message || "Failed to send", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
      <div style={{ width: "10rem" }}>
        <MenuItem onClick={() => selectRef(imageRef)}>
          <Tooltip title="Image">
            <ImageIcon />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Images</ListItemText>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={fileChangeHandler}
            ref={imageRef}
          />
        </MenuItem>

        <MenuItem onClick={() => selectRef(audioRef)}>
          <Tooltip title="Audio">
            <AudioFile />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Audios</ListItemText>
          <input
            type="file"
            multiple
            accept="audio/*"
            style={{ display: "none" }}
            onChange={fileChangeHandler}
            ref={audioRef}
          />
        </MenuItem>

        <MenuItem onClick={() => selectRef(videoRef)}>
          <Tooltip title="Video">
            <VideoFile />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Videos</ListItemText>
          <input
            type="file"
            multiple
            accept="video/*"
            style={{ display: "none" }}
            onChange={fileChangeHandler}
            ref={videoRef}
          />
        </MenuItem>

        <MenuItem onClick={() => selectRef(fileRef)}>
          <Tooltip title="File">
            <UploadFile />
          </Tooltip>
          <ListItemText style={{ marginLeft: "0.5rem" }}>Files</ListItemText>
          <input
            type="file"
            multiple
            accept="*"
            style={{ display: "none" }}
            onChange={fileChangeHandler}
            ref={fileRef}
          />
        </MenuItem>
      </div>
    </Menu>
  );
};

export default FileMenu;
