import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { sampleNotifications } from "../constants/SampleData";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../api/api";
import { useErrors } from "../Hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from ".././redux/reducers/misc-reducer-.js";
import toast from "react-hot-toast";
const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const { isLoadings, data, error, isError } = useGetNotificationsQuery();
  const friendRequestHandler = async ({ _id, accept }) => {
    // console.log("Handle friend request from:", sender.name);
    dispatch(setIsNotification(false));
    try {
      const res = await acceptFriendRequest({ requestId: _id, accept });
      if (res.data?.success) {
        console.log("use socker here");
        toast.success(res.data.message);
      } else toast.error(res.data?.message || "Something went wrong");
    } catch (errror) {
      toast.error(errror?.response?.data?.message || "Something went wrong");
      console.log(errror);
    }
  };
  const closeHandler = () => dispatch(setIsNotification(false));
  useErrors([{ error, isError }]);
  // console.log(data.allRequests)
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>
        {isLoadings ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <div>
      <ListItem
        sx={{
          padding: "0.5rem 0",
          "&:hover": {
            bgcolor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Stack
          direction={"row"}
          spacing={"3rem"}
          alignItems={"center"}
          width={"200%"}
        >
          <Avatar />
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
            }}
          >{`${name} sent you a friend request`}</Typography>
          <Stack sx={{ xs: "column", sm: "row" }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => handler({ _id, accept: true })}
            >
              Accept
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={() => handler({ _id, accept: false })}
            >
              Decline
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </div>
  );
});

export default Notifications;
