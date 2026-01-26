import React from 'react'
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import { ExitToApp, ManageAccounts, Menu as MenuIcon } from '@mui/icons-material'
import { Groups as GroupsIcon, Message as MessageIcon } from '@mui/icons-material'
import { useState } from 'react'
import { Close as CloseIcon } from '@mui/icons-material'
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom'
import { Dashboard } from "@mui/icons-material"
import { styled } from "@mui/material"
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogout } from '../../redux/thunks/admin';

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <Dashboard />
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccounts />
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />
  },
]

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  
  const logoutHandler = () => {
    console.log("logout handler called");
    dispatch(adminLogout())
  }
  
  return (
    <Stack width={w} direction={"column"} spacing={"2rem"} p={"2rem"}>
      <Typography variant='h5' textTransform={"uppercase"}>
        Admin
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link 
            to={tab.path} 
            key={tab.name}
            sx={location.pathname === tab.path && {
              bgcolor: "black",
              color: "white",
              ":hover": { color: "white" }
            }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}
      </Stack>
      <Stack 
        direction={"row"} 
        alignItems={"center"}
        spacing={1}
        onClick={logoutHandler}
        sx={{
          cursor: "pointer",
          padding: "1rem 2rem",
          borderRadius: "2rem",
          "&:hover": {
            bgcolor: "#f0f0f0"
          }
        }}
      >
        <ExitToAppIcon />
        <Typography>Logout</Typography>
      </Stack>
    </Stack>
  )
}

const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const { isAdmin } = useSelector((state) => state.auth)
  
  const handleMobile = () => {
    setIsMobile((prev) => !prev)
  }
  
  const handleClose = () => {
    setIsMobile(false)
  }
  
  if (!isAdmin) return <Navigate to="/admin" />
  
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          zIndex: 1000,
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      
      <Grid
        size={{ xs: 0, md: 3, lg: 2 }}
        sx={{
          display: { xs: "none", md: "block" },
          bgcolor: "rgb(255, 255, 255)",
          borderRight: "1px solid #eee",
        }}
      >
        <Sidebar />
      </Grid>
      
      <Grid 
        size={{ xs: 12, md: 9, lg: 10 }} 
        sx={{ bgcolor: "#f5f5f5" }}
      >
        {children}
      </Grid>
      
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  )
}

export default AdminLayout