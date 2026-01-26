import React, { Suspense, use, useEffect, useState } from "react";
import {
  Grid,
  Tooltip,
  IconButton,
  Box,
  Drawer,
  Typography,
  TextField,
  ButtonGroup,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { memo } from "react";
import { padding, Stack } from "@mui/system";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../constants/SampleData";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { lazy } from "react";
import UserItem from "../components/shared/UserItem";
import { blue } from "../constants/color";
import {
  useAddGroupMemberMutation,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../api/api";
import { useAsyncMutation, useErrors } from "../Hooks/hook";
import { LayoutLoaders } from "../components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc-reducer-";

const ConfirmDeleteDialog = lazy(
  () => import("../components/dialog/ConfirmDeleteDialog"),
);
const AddMember = lazy(() => import("../components/dialog/AddMember"));

const Groups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const chatId = useSearchParams()[0].get("group");
  // console.log(chatId);
  const myGroups = useMyGroupsQuery("");
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId },
  );
  //  console.log(groupDetails.data)
  // console.log(myGroups.data);
  const [isLoadingGroupName, data, updateGroup] = useAsyncMutation(
    useRenameGroupMutation,
  );
  const [isLoadingRemoveMember, dataremove, removeMember] = useAsyncMutation(
    useRemoveGroupMemberMutation,
  );
  const [isLoadingDeleteGroup, datadelete, deleteGroup] = useAsyncMutation(
    useDeleteChatMutation,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  // console.log(groupDetails.data?.chat?.members)
  const [members, setMembers] = useState([]);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [confirmAddDialog, setConfirmAddDialog] = useState(false);

  const erros = [
    {
      isError: myGroups.isError,
      error: myGroups.error?.data?.message,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error?.data?.message,
    },
  ];
  useErrors(erros);
  useEffect(() => {
    const chatData = groupDetails.data?.chat;
    if (chatData) {
      setGroupName(chatData.name);
      setGroupNameUpdatedValue(chatData.name);
      setMembers(chatData.chat?.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);
  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };
  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };
  const confirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log("delete group");
  };
  const confirmAddHandler = () => {
    dispatch(setIsAddMember(true));
    // setConfirmAddDialog(true);
    console.log("add member");
  };
  const deleteHandler = () => {
    setConfirmDeleteDialog(false);
    console.log("Deleting chatId:", chatId);
    deleteGroup("Deleting Group...", chatId);
    navigate("/groups");
  };
  const closeDeleteDialog = () => {
    setConfirmDeleteDialog(false);
  };
  const closeAddMemberDialog = () => {
    setConfirmAddDialog(false);
  };
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
    // console.log("Toggle member:", id);
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);
  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          {" "}
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>{" "}
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton
            onClick={() => setIsEdit(true)}
            disabled={isLoadingGroupName}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const ButtonGroup = (
    <Stack
      direction={{ sm: "row", xs: "column-reverse" }}
      spacing={"1rem"}
      p={{ sm: "1rem", xs: "0", md: "1rem 4rem" }}
    >
      <Button
        size="large"
        color="error"
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={confirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={confirmAddHandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  return myGroups.isLoading ? (
    <LayoutLoaders />
  ) : (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "whitesmoke" }}>
      <Grid container height={"90vh"} sx={{ overflowX: "hidden" }}>
        {/* Groups List */}
        <Grid
          item
          xs={12}
          sm={4}
          size={{ xs: 0, sm: 4 }}
          sx={{
            display: { xs: "none", sm: "block" },
            padding: "1rem",
            bgcolor: "#bbdbf3ff",
            p: 2,
          }}
        >
          <GroupList myGroups={myGroups.data?.groups} chatId={chatId} />
        </Grid>

        {/* Group Details */}

        <Grid
          item
          size={{ xs: 12, sm: 8 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            alignItems: "center",
            bgcolor: "#84b8dfff",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          {IconBtns}
          {groupName && (
            <>
              {GroupName} <Typography>Members</Typography>
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{ xs: 1, sm: 1, md: 2 }}
                spacing={"2rem"}
                height={"50vh"}
                overflow={"auto"}
              >
                {/* group members */}
                {isLoadingRemoveMember ? (
                  <CircularProgress />
                ) : (
                  groupDetails.data?.chat?.members?.map((user) => (
                    <UserItem
                      user={user}
                      isAdded
                      styling={{
                        boxShadow: "0  0 0.5rem rgba(0,0,0,0.2)",
                        padding: "1rem 2rem",
                        borderRadius: "1rem",
                        backgroundColor: "white",
                        transition: "all 0.3s ease",
                      }}
                      handler={removeMemberHandler}
                    />
                  ))
                )}
              </Stack>
              {ButtonGroup}
            </>
          )}
        </Grid>
        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMember chatId={chatId} />
          </Suspense>
        )}

        {confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeDeleteDialog}
              handleDelete={deleteHandler}
            />
          </Suspense>
        )}
        <Drawer
          sx={{ display: { xs: "none", sm: "block" } }}
          open={isMobileMenuOpen}
          onClose={handleMobileClose}
        >
          <GroupList myGroups={myGroups.data?.groups} chatId={chatId} />
        </Drawer>
      </Grid>
    </Box>
  );
};
const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign="center" padding="1rem">
          No groups
        </Typography>
      )}
    </Stack>
  );
};
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, members, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
        sx={{
          padding: "1rem",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.08)",
            transform: "translateX(5px)",
            "& .group-name": {
              color: "primary.main",
              fontWeight: 500,
            },
          },
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
