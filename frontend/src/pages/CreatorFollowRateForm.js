import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Card,
  Grid,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { apiProxy } from "../utils/constants";


const CreatorFollowRateForm = ({ token }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    creator: id,
    rating: "",
    review_text: "",
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
        `${apiProxy}/api/creator/review/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Review created successfully!");
        navigate("/dashboard/");
      } else {
        const errorMessage = await response.text();
        setError("Something went wrong! Try again later");
        console.error("Failed to create review:", errorMessage);
      }
    } catch (error) {
      console.error("Error creating Review:", error);
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
            Creat Review
          </Typography>
          <Divider sx={{ my: 2 }} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="rating"
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="review_text"
                  type="text"
                  name="review_text"
                  value={formData.review_text}
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
                    "Submit"
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

export default CreatorFollowRateForm;
