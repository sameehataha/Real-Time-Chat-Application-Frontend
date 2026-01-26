import { Typography, Box, Avatar } from '@mui/material'
import React, { memo } from 'react'
import { messageName, lightGray } from '../../constants/color'
import moment from 'moment'
import { fileFormat, transformImage } from '../../lib/features'
import { motion } from "motion/react"
import RenderAttchments from './RenderAttchments'

const MessageCpmponent = ({ message, user, isOnline = false }) => {
  // Debug log
  console.log("ðŸ“¨ MessageComponent received:", {
    messageId: message?._id,
    content: message?.content,
    senderName: message?.sender?.name,
    userId: user?._id,
    isOnline,
  });

  // Safely destructure with defaults
  const {
    sender = {}, 
    content = "", 
    attachments = [], 
    createdAt,
    isAlert = false
  } = message || {};

  // Check if message is from current user
  const sameSender = sender?._id === user?._id || 
                     String(sender?._id) === String(user?._id);

  const timeAgo = moment(createdAt).fromNow();

  // Helper function to get URL from attachment
  const getAttachmentUrl = (attachment) => {
    if (!attachment) return "";
    return attachment?.url || attachment?.secure_url || ""; 
  };

  // Render alert messages differently
  if (isAlert) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "1rem 0",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          {content}
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: "-100%" }} 
      whileInView={{ opacity: 1, x: 0 }} 
      style={{ 
        display: 'flex',
        justifyContent: sameSender ? 'flex-end' : 'flex-start',
        marginY: '0.5rem',
        alignItems: 'flex-end',
        gap: '0.5rem'
      }}
    >
      {/* Avatar for other users */}
      {!sameSender && sender?.avatar && (
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={transformImage(sender.avatar)} // transformImage handles arrays/objects now
            alt={sender.name}
            sx={{
              width: 32,
              height: 32,
              cursor: "pointer",
            }}
          />
        </Box>
      )}

      {/* Message Bubble */}
      <Box
        sx={{
          backgroundColor: sameSender ? "#007bff" : "white",
          color: sameSender ? "white" : "black",
          width: "fit-content",
          borderRadius: "8px",
          padding: "0.75rem",
          maxWidth: "70%",
          wordBreak: "break-word",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Show sender name if not the user's message */}
        {!sameSender && sender?.name && (
          <Typography 
            color={messageName} 
            fontWeight="600" 
            variant='caption'
            sx={{ display: 'block', marginBottom: '0.25rem' }}
          >
            {sender.name}
          </Typography>
        )}

        {/* Show message content */}
        {content ? (
          <Typography variant="body2">
            {content}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            (No content)
          </Typography>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <Box sx={{ marginTop: content ? "0.75rem" : 0 }}>
            {attachments.map((attachment, index) => {
              const url = getAttachmentUrl(attachment);

              if (!url) {
                console.warn(`Attachment ${index} has no valid URL:`, attachment);
                return null;
              }

              const file = fileFormat(url);

              return (
                <Box 
                  key={attachment?.public_id || index} 
                  sx={{ marginY: "0.5rem" }}
                >
                  <a 
                    href={url} 
                    target='_blank' 
                    rel='noopener noreferrer'
                    download 
                    style={{
                      color: sameSender ? "white" : "black",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {RenderAttchments(file, url)}
                  </a>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Timestamp */}
        <Typography 
          variant='caption' 
          sx={{
            display: "block", 
            marginTop: "0.5rem",
            opacity: 0.7,
            fontSize: "0.75rem"
          }}
        >
          {timeAgo}
        </Typography>
      </Box>

      {/* Avatar for current user */}
      {sameSender && user?.avatar && (
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={transformImage(user.avatar)} // transformImage handles arrays/objects now
            alt={user.name}
            sx={{
              width: 32,
              height: 32,
            }}
          />
         
        </Box>
      )}
    </motion.div>
  );
};

export default memo(MessageCpmponent);