import { Button, Dialog, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { sampleUsers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import { Stack } from "@mui/system";
import { useState } from "react";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsQuery,
} from "../../api/api";
import { useAsyncMutation, useErrors } from "../../Hooks/hook";
import { useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc-reducer-";
import { useDispatch } from "react-redux";

const AddMember = ({ chatId }) => {
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoadings, data, error, isError } = useAvailableFriendsQuery(chatId);
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoadingAddMember, dataadd, addMember] = useAsyncMutation(
    useAddGroupMemberMutation,
  );
  useErrors([
    {
      isError,
      error,
    },
  ]);
  const selectMembersHandler = (id) => {
    // Handle member selection
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id],
    );
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Member...", { chatId, members: selectedMembers });
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };
  const friends = data?.friends || [];
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoadings ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMembersHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No User Found</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMember}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMember;
