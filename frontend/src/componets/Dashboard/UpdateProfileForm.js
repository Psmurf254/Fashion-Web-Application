import React, { useState } from "react";
import { TextField, Button, Stack, Alert } from "@mui/material";
import { apiProxy } from "../../utils/constants";

const UpdateProfileForm = ({ creator, onUpdate, token }) => {
  const [formData, setFormData] = useState({
    full_name: creator.full_name,
    profile_picture: creator.profile_picture,
    contact_phone: creator.contact_phone,
    contact_email: creator.contact_email,
    gender: creator.gender,
    date_of_birth: creator.date_of_birth,
    description: creator.description,
    specialty: creator.specialty,
    facebook: creator.facebook,
    instagram: creator.instagram,
    whatsApp: creator.whatsApp,
    x: creator.x,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "profile_picture") {
      const imageValue = type === "file" ? files[0] : formData.profile_picture;
      setFormData({
        ...formData,
        profile_picture: imageValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    const form = new FormData();

    form.append("id", creator.id);
    form.append("full_name", formData.full_name);
    form.append("contact_phone", formData.contact_phone);
    form.append("contact_email", formData.contact_email);
    form.append("gender", formData.gender);
    form.append("date_of_birth", formData.date_of_birth);
    form.append("description", formData.description);
    form.append("specialty", formData.specialty);
    form.append("facebook", formData.facebook);
    form.append("instagram", formData.instagram);
    form.append("whatsApp", formData.whatsApp);
    form.append("x", formData.x);

    if (formData.profile_picture instanceof File) {
      form.append("profile_picture", formData.profile_picture);
    }

    fetch(`${apiProxy}/api/creator/update/${creator.id}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        return response.json();
      })
      .then((data) => {
        onUpdate(data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
      });
  };

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Profile"
        type="file"
        name="profile_picture"
        onChange={handleChange}
        margin="normal"
        fullWidth
      />

      <TextField
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
      />

      <TextField
        label="contact_phone"
        name="contact_phone"
        value={formData.contact_phone}
        onChange={handleChange}
      />

      <TextField
        label="contact_email"
        name="contact_email"
        value={formData.contact_email}
        onChange={handleChange}
      />

      <TextField
        label="gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      />

      <TextField
        label="date_of_birth"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
      />
      <TextField
        label="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <TextField
        label="specialty"
        name="specialty"
        value={formData.specialty}
        onChange={handleChange}
      />

      <TextField
        label="facebook"
        name="facebook"
        value={formData.facebook}
        onChange={handleChange}
      />

      <TextField
        label="instagram"
        name="instagram"
        value={formData.instagram}
        onChange={handleChange}
      />

      <TextField
        label="x"
        name="x"
        value={formData.x}
        onChange={handleChange}
      />

      <TextField
        label="whatsApp"
        name="whatsApp"
        value={formData.whatsApp}
        onChange={handleChange}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Update Profile
      </Button>
    </Stack>
  );
};

export default UpdateProfileForm;
