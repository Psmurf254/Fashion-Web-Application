import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Card,
  InputAdornment,
  Grid,
  Divider,
} from "@mui/material";
import { DateRange } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiProxy } from "../utils/constants";

const CreateAccount = ({ token }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    contact_phone: "",
    contact_email: "",
    description: "",
    specialty: "",
    facebook: "",
    instagram: "",
    whatsApp: "",
    x: "",
    profile_picture: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const val = type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(
        `${apiProxy}/api/creator/account/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Account created successfully!");
        navigate("/dashboard/");
      } else {
        const errorMessage = await response.text();
        setError("Something went wrong! Try again later");
        console.error("Failed to create account:", errorMessage);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section style={{ marginTop: "40px" }}>
      <Stack alignItems="center" alignContent="center">
        <Card sx={{ padding: "20px" }}>
          <Typography variant="h6" color="text.secondary">
            Create Account
          </Typography>
          <Divider sx={{ my: 2 }} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Full Name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Gender"
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Contact Phone"
                  type="text"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Contact Email"
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Profile Picture"
                  type="file"
                  name="profile_picture"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="specialty"
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Description"
                  type="text"
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="facebook link"
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Instagram Link"
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="x link"
                  type="text"
                  name="x"
                  value={formData.x}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Whatsapp link"
                  type="text"
                  name="whatsApp"
                  value={formData.whatsApp}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Divider sx={{ my: 2 }} />
              {error && (
                <Grid item xs={12}>
                  <Typography
                    color="error"
                    variant="body2"
                    textAlign="center"
                    paragraph
                  >
                    {error}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Divider sx={{ my: 2 }} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Divider sx={{ my: 2 }} />
              </Grid>
            </Grid>
          </form>
        </Card>
      </Stack>
    </section>
  );
};

export default CreateAccount;
