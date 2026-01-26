import React, { use } from "react";
import { sampleUsers } from "../constants/SampleData";
import { Skeleton, Typography } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import UserItem from "../components/shared/UserItem";
import { useInputValidation } from "6pp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../api/api";
import { useAsyncMutation, useErrors } from "../Hooks/hook";
import { setIsNewGroup } from ".././redux/reducers/misc-reducer-.js";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoadings, data, error, isError } = useAvailableFriendsQuery();
  const [isLoadingNewGroup, dataNewGroup, newGroup] =
    useAsyncMutation(useNewGroupMutation);
  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);
  const errors = [
    {
      error,
      isError,
    },
  ];
  useErrors(errors);
  console.log(data);
  const selectMembersHandler = (id) => {
    // // Handle member selection
    // setMember((prev) =>
    //   prev.map((user) =>
    //     user._id === id ? { ...user, isAdded: !user.isAdded } : user
    //   )
    // );
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id],
    );
  };
  console.log("Selected member ID:", selectedMembers);
  const submitHandler = () => {
    // Handle group creation
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Select at least 3 member");
    console.log("Group name:", groupName.value);
    console.log("Selected members:", selectedMembers);
    // Verify newGroup
    console.log("Type of newGroup:", typeof newGroup);
    console.log("Value of newGroup:", newGroup);

    // creating th group
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoadings ? (
            <Skeleton />
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMembersHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"}>
          <Button variant="contained" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
