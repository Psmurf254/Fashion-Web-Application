import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CardMedia,
} from "@mui/material";
import UpdateProfileForm from "./UpdateProfileForm";
import {
  Facebook,
  Twitter,
  Instagram,
  WhatsApp,
  Edit,
} from "@mui/icons-material";
import { apiProxy } from "../../utils/constants";

const Profile = ({ creators, setCreators, token }) => {
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    if (creators.length > 0) {
      setLoading(false);
    }
  }, [creators]);

  const handleUpdate = (updatedData) => {
    setCreators([updatedData]);
    setShowUpdateForm(false);
  };

  const handleShowUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  console.log("profile info", creators);
  return (
    <Stack>
      <Typography
        className="Heading"
        variant="h6"
        color="#000"
        textTransform="uppercase"
      >
        Profile Info
      </Typography>
      <Divider sx={{ mt: "17px", backgroundColor: "white" }} />

      {!loading &&
        creators.map((creator, index) => (
          <Box mt={4} key={index}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Avatar
                      alt="User Avatar"
                      src={`${apiProxy}${creator.profile_picture}`}
                      sx={{ width: 150, height: 150 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* creator Information */}
              <Grid item xs={12} md={9}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {creator.full_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                    >
                      {creator.contact_phone} | {creator.contact_email}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={2}
                      mb={4}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleShowUpdateForm}
                      >
                        <Edit sx={{ mr: "7px" }} /> Update Profile
                      </Button>
                    </Stack>
                    <hr style={{ marginBottom: "14px" }} />

                    {/* Additional Information */}
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Gender
                        </Typography>
                        <Typography variant="body1">
                          {creator.gender}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Date of Birth
                        </Typography>
                        <Typography variant="body1">
                          {creator.date_of_birth}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <CardMedia
                          sx={{
                            padding: 1,
                            width: 50,
                            textAlign: "center",
                            border: "1px solid red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <a href={creator.facebook}>
                            {" "}
                            <Facebook />{" "}
                          </a>
                        </CardMedia>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <CardMedia
                          sx={{
                            padding: 1,
                            width: 50,
                            textAlign: "center",
                            border: "1px solid red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <a href={creator.Instagram}>
                            {" "}
                            <Instagram />{" "}
                          </a>
                        </CardMedia>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <CardMedia
                          sx={{
                            padding: 1,
                            width: 50,
                            textAlign: "center",
                            border: "1px solid red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <a href={creator.x}>
                            {" "}
                            <Twitter />{" "}
                          </a>
                        </CardMedia>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <CardMedia
                          sx={{
                            padding: 1,
                            width: 50,
                            textAlign: "center",
                            border: "1px solid red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <a href={creator.whatsapp}>
                            {" "}
                            <WhatsApp />{" "}
                          </a>
                        </CardMedia>
                      </Grid>
                    </Grid>

                    {/* Modal for Update Profile Form */}
                    <Dialog
                      open={showUpdateForm}
                      onClose={handleShowUpdateForm}
                    >
                      <DialogTitle>Update Profile</DialogTitle>
                      <DialogContent>
                        <UpdateProfileForm
                          creator={creator}
                          token={token}
                          onUpdate={handleUpdate}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleShowUpdateForm}>Cancel</Button>
                      </DialogActions>
                    </Dialog>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ))}
    </Stack>
  );
};

export default Profile;
