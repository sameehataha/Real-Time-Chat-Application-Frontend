import React, { use } from "react";
import { darkScrollbar, Dialog, Input, TextField } from "@mui/material";
import { Search as SearchIcon, TonalitySharp } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { FilledInput } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { Stack } from "@mui/material";
import UserItem from "../components/shared/UserItem";
import { List } from "@mui/material";
import { useState } from "react";
import { sampleUsers } from "../constants/SampleData";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from ".././redux/reducers/misc-reducer-.js";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../api/api.js";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAsyncMutation } from "../Hooks/hook.jsx";
const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [isLoadingsendFriendRequest, sendFriendRequestData, sendFriendRequest] =
    useAsyncMutation(useSendFriendRequestMutation);
  useSendFriendRequestMutation;
  const dispatch = useDispatch();
  const search = useInputValidation("");

  const [users, setUsers] = useState([]);
  const addFriendHandler = async (id) => {
    // Logic to add friend
    await sendFriendRequest("sending friend request", { userId: id });
  };
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack padding={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Search PEOPLE </DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingsendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
