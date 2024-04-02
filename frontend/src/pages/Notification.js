import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiProxy } from "../utils/constants";


const Notification = ({ isOpen, onClose, notificationData, token }) => {
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${apiProxy}/api/notifications/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Error deleting notification. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Notification</DialogTitle>
      <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
        {notificationData ? (
          notificationData.length > 0 ? (
            notificationData.map((notification) => (
              <Card key={notification.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1">{notification.message}</Typography>
                  <Divider/>
                  <Typography variant="caption" color='gray'>
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                  <IconButton onClick={() => handleDelete(notification.id)}
                sx={{
                  backgroundColor: "red",
                  p: "5px 18px",
                  borderRadius: "20px",
                  mt: 1,
                  ml: 10
                }}>
                    <DeleteIcon  sx={{ fontSize: 15 }} />
                    <Typography color="text.secondary" fontSize="12px" ml={1}>Delete</Typography>
                  </IconButton>
                </CardContent>
                
              </Card>
            ))
          ) : (
            <Typography variant="body1">No notifications available.</Typography>
          )
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
      <Button onClick={onClose}>Close</Button>
    </Dialog>
  );
};

export default Notification;
