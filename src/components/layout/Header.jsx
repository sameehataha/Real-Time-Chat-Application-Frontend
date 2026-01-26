import { Box, AppBar, Toolbar, Typography, IconButton, Menu, Tooltip, Backdrop, Badge } from '@mui/material'
import React, { lazy, Suspense } from 'react'
import { useState } from 'react'
import { blue } from '../../constants/color'
import { useNavigate } from 'react-router-dom'
import { Add as AddIcon , Menu as MenuIcon ,Search as SearchIcon, Group as GroupIcon,Logout as LogoutIcon ,Notifications as NotificationsIcon} from '@mui/icons-material'
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from "../../redux/reducers/auth-reducer"
import toast from 'react-hot-toast'
import {setIsMobileMenu, setIsNotification, setIsSearch} from "../../redux/reducers/misc-reducer-.js"
import { incrementNotification, decrementNotification} from "../../redux/reducers/chat-reducer.js"
import { setIsNewGroup } from "../../redux/reducers/misc-reducer-.js"

  const SearchDialog = lazy(() => import('../../specific/Search'));
  const NotificationDialog = lazy(() => import('../../specific/Notifications'));
  const NewGroupDialog = lazy(() => import('../../specific/NewGroup'));
  
const Header = () => {
  const navigate = useNavigate();  
  const  dispatch = useDispatch();
  const {isSearch,isNotification,isNewGroup} = useSelector(state => state.misc)
   const { notificationCount } = useSelector(state => state.chat)

  const handleMobile = () => {
   dispatch(setIsMobileMenu(true));
   console.log("mobile")
  }
  const openSearch = () => {
    dispatch(setIsSearch(true))
  }
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true))
  }
  const openNotifications = () => {
    dispatch(setIsNotification(true));
    dispatch(decrementNotification())
  }
  const navigateToGroup = () => {
    navigate('/groups');
  }
  const logoutHandler = async () => {
    console.log("logout");
    try{
       const {data} = await axios.get(`${server}/api/v1/user/logout`,{
      withCredentials:true
    })
    dispatch(userNotExists())
    toast.success(data.message)
    }catch(err){
        toast.error(err?.response?.data?.message || "Something went wrong");
        console.log(err);
    }
  }
  return <>
  <Box sx={{flexGrow:1}} height={"4rem"}>
    <AppBar position='static' sx={{bgcolor:blue}} >
      <Toolbar>
        <Typography variant='h6'sx={{display:{xs:"none", sm:"block"}}}>Talkie</Typography>
        <Box sx={{ display: { xs: "block", sm: "none" } }}> <IconButton color='inherit' onClick={handleMobile}><MenuIcon /></IconButton></Box>
        <Box sx={{  flexGrow: 1 }} />
        <Box>
          <Iconbtn title={"Search"} icon={<SearchIcon />} onClick={openSearch} />
          <Iconbtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
          <Iconbtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup} />
          <Iconbtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotifications} value={notificationCount} />
          <Iconbtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
        </Box>
      </Toolbar>
    </AppBar>
    </Box>
    {isSearch && <Suspense fallback={<Backdrop  open/>}><SearchDialog /></Suspense>}
    {isNotification && <Suspense fallback={<Backdrop  open/>}><NotificationDialog /></Suspense>}
    {isNewGroup && <Suspense fallback={<Backdrop  open/>}><NewGroupDialog /></Suspense>}
  </>
}
const Iconbtn = ({title,icon,onClick,value})  => {
  return (
  <Tooltip title={title}>
    <IconButton color='inherit' size="large" onClick={onClick}>
      {
        value ? <Badge badgeContent={value} color="error">{icon}</Badge> : icon
      }
      
    </IconButton>
  </Tooltip>
  )
}
export default Header
