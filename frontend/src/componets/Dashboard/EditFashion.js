import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material"; 
import { apiProxy } from "../../utils/constants";

const EditFashion = ({ fashion, onUpdate, token }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: fashion.name,
    description: fashion.description,
    colors: fashion.colors,
    additinal_info: fashion.additinal_info,
    order_info: fashion.order_info,
    image: fashion.image,
    thumbnail1: fashion.thumbnail1,
    thumbnail2: fashion.thumbnail2,
    thumbnail3: fashion.thumbnail3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, type, files } = e.target;

    if (name === "image") {
      const imageValue = type === "file" ? files[0] : formData.image;
      setFormData({
        ...formData,
        image: imageValue,
      });
    }

    if (name === "thumbnail1") {
      const imageValue = type === "file" ? files[0] : formData.thumbnail1;
      setFormData({
        ...formData,
        thumbnail1: imageValue,
      });
    }

    if (name === "thumbnail2") {
      const imageValue = type === "file" ? files[0] : formData.thumbnail2;
      setFormData({
        ...formData,
        thumbnail2: imageValue,
      });
    }

    if (name === "thumbnail3") {
      const imageValue = type === "file" ? files[0] : formData.thumbnail3;
      setFormData({
        ...formData,
        thumbnail3: imageValue,
      });
    }

    if (
      name !== "image" &&
      name !== "thumbnail1" &&
      name !== "thumbnail2" &&
      name !== "thumbnail3"
    ) {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const form = new FormData();
      form.append("id", fashion.id);
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("colors", formData.colors);
      form.append("additional_info", formData.additinal_info);
      form.append("order_info", formData.order_info);

      if (formData.image instanceof File) {
        form.append("image", formData.image);
      }
      if (formData.thumbnail1 instanceof File) {
        form.append("thumbnail1", formData.thumbnail1);
      }

      if (formData.thumbnail2 instanceof File) {
        form.append("thumbnail2", formData.thumbnail2);
      }
      if (formData.thumbnail3 instanceof File) {
        form.append("thumbnail3", formData.thumbnail3);
      }

      const response = await fetch(
        `${apiProxy}/api/fashion_update/${fashion.id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update fashion");
      }
      window.location.reload();

      const updatedFashion = await response.json();
      onUpdate(updatedFashion);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error updating fashion:", error);
      setError("Failed to update fashion. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Stack height={50} position="relative">
      <Button onClick={handleOpen}>Edit</Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            boxShadow: 24,
            minHeight: "90vh",
            overflow: "auto",
            p: 4,
            mb: 5,
          }}
        >
          <Typography variant="h6">Edit Fashion</Typography>
          <Stack spacing={2} sx={{ height: "70vh", py: 4 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Colors"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Additional Info"
              name="additional_info"
              value={formData.additinal_info}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Order Info"
              name="order_info"
              value={formData.order_info}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="image"
              type="file"
              name="image"
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="thumbnail1"
              type="file"
              name="thumbnail1"
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="thumbnail2"
              type="file"
              name="thumbnail2"
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <TextField
              label="thumbnail3"
              type="file"
              name="thumbnail3"
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              mb={5}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
};

export default EditFashion;
