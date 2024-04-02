import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Card,
  Grid,
  Divider,
  MenuItem,
} from "@mui/material";
import { apiProxy } from "../../utils/constants";

const CreateFashion = ({ token }) => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    colors: "",
    additinal_info: "",
    order_info: "",
    image: null,
    thumbnail1: null,
    thumbnail2: null,
    thumbnail3: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const responseCategories = await fetch(`${apiProxy}/api/categories/`);
      const dataCategories = await responseCategories.json();
      setCategories(dataCategories);
    };

    fetchCategories();
  }, []);

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

      const response = await fetch(`${apiProxy}/api/fashions/fashion/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Fashion created successfully!");
        window.location.reload();
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
    <Stack>
      <Stack alignItems="center" alignContent="center">
        <Card sx={{ padding: "20px" }}>
          <Typography variant="h6" color="text.secondary">
            Create Fashion
          </Typography>
          <Divider sx={{ my: 2 }} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="description"
                  type="text"
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
                  label="additinal_info"
                  type="text"
                  name="additinal_info"
                  value={formData.additinal_info}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="order_info"
                  type="text"
                  name="order_info"
                  value={formData.order_info}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="colors"
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="image"
                  type="file"
                  name="image"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="thumbnail 1"
                  type="file"
                  name="thumbnail1"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="thumbnail 2"
                  type="file"
                  name="thumbnail2"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="thumbnail 3"
                  type="file"
                  name="thumbnail3"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  required
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
                    "Add Fashhion"
                  )}
                </Button>
                <Divider sx={{ my: 2 }} />
              </Grid>
            </Grid>
          </form>
        </Card>
      </Stack>
    </Stack>
  );
};

export default CreateFashion;
