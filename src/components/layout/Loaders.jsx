import React from 'react'
import { Grid, Skeleton, Stack, Typography, Box } from '@mui/material'

const LayoutLoaders = () => {
  return (
    <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
      <Grid
        item
        size={{ sm: 4, md: 3 }}
        sx={{ display: { xs: "none", sm: "block" } }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid
        item
        size={{ xs: 12, sm: 8, md: 5, lg: 6 }}
        height={"100%"}
      >
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={"5rem"} />
          ))}
        </Stack>
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid
        item
        size={{ md: 4, lg: 3 }}
        height={"100%"}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  )
}


const TypyingLoader = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Typography variant="body2" color="textSecondary">
        Someone is typing
      </Typography>
      <Box sx={{ display: 'flex', gap: '0.3rem' }}>
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: 'bounce 1.4s infinite',
            '@keyframes bounce': {
              '0%, 80%, 100%': { opacity: 0.3 },
              '40%': { opacity: 1 },
            },
          }}
        />
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: 'bounce 1.4s infinite',
            animationDelay: '0.2s',
            '@keyframes bounce': {
              '0%, 80%, 100%': { opacity: 0.3 },
              '40%': { opacity: 1 },
            },
          }}
        />
        <Box
          sx={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            animation: 'bounce 1.4s infinite',
            animationDelay: '0.4s',
            '@keyframes bounce': {
              '0%, 80%, 100%': { opacity: 0.3 },
              '40%': { opacity: 1 },
            },
          }}
        />
      </Box>
    </Box>
  )
}

export { LayoutLoaders, TypyingLoader }
export default LayoutLoaders