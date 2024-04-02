import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Grid,
  IconButton,
  CardContent,
  CardMedia,
  Rating,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import { useParams, Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { apiProxy } from "../utils/constants";
import "aos/dist/aos.css";
import AOS from "aos";
import Heading from "../componets/Heading";

const CreatorDetails = ({ token }) => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [creator, setCreator] = useState(null);
  const [fashions, setFashions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openReviewRead, setOpenReviewRead] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewUsers, setReviewUsers] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);

  //Fetch current user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        // Fetch fashion data
        const fashionResponse = await fetch(`${apiProxy}/api/fashions/`);
        const fashionData = await fashionResponse.json();
        setFashions(fashionData);

        // Fetch creator details
        const responseCreator = await fetch(
          `${apiProxy}/api/creators/creator/${id}`
        );
        if (!responseCreator.ok) {
          throw new Error("Failed to fetch creator details");
        }
        const creatorData = await responseCreator.json();

        // Fetch following data
        const followingResponse = await fetch(
          `${apiProxy}/api/creator_following/`
        );
        const followingData = await followingResponse.json();

        const currentUserFollowing = followingData.find(
          (item) =>
            item.creator === creatorData?.id &&
            item.user === currentUser?.[0]?.id
        );
        setIsFollowing(!!currentUserFollowing);

        // Merge creator details with following data
        const mergedCreator = {
          ...creatorData,
          followers: followingData.filter(
            (item) => item.creator === creatorData?.id
          ),
        };

        // Fetch review ratings data
        const reviewRatingsResponse = await fetch(
          `${apiProxy}/api/creator-ratings/`
        );
        const reviewRatingsData = await reviewRatingsResponse.json();

        // Merge creator details with review ratings data
        const creatorWithRatings = {
          ...mergedCreator,
          ratings: reviewRatingsData.filter(
            (item) => item.creator === creatorData.id
          ),
        };

        // Calculate average rating
        let totalStars = 0;
        creatorWithRatings.ratings.forEach((rating) => {
          totalStars += rating.rating;
        });
        const averageRating = totalStars / creatorWithRatings.ratings.length;

        
        const creatorWithAverageRating = {
          ...creatorWithRatings,
          rating: averageRating, 
        };

        setCreator(creatorWithAverageRating);
        setLoading(false);

    
        const users = {};
        for (const review of creatorWithAverageRating.ratings) {
          if (!users[review.user]) {
            const userResponse = await fetch(
              `${apiProxy}/api/users/user/${review.user}`
            );
            if (userResponse.ok) {
              const userData = await userResponse.json();
              users[review.user] = userData.username;
            }
          }
        }
        setReviewUsers(users);
      } catch (error) {
        console.error("Error fetching creator details:", error);
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, currentUser]);

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewText("");
    setRating("");
  };

  const handleOpenReviewRead = () => {
    setOpenReviewRead(true);
  };

  const handleCloseReviewRead = () => {
    setOpenReviewRead(false);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch(`${apiProxy}/api/creator/review/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          creator: id,
          rating: rating,
          review_text: reviewText,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      const data = await response.json();
      window.location.reload();
      console.log("Review submitted successfully:", data);

      handleCloseReviewDialog();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        const response = await fetch(
          `${apiProxy}/api/creator_following_update/${creator.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to unfollow creator");
        }
        console.log("Unfollowed creator successfully");
        setIsFollowing(false);
        window.location.reload();
      } else {
        const response = await fetch(
          `${apiProxy}/api/create_creator_following/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              creator: creator.id,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to follow creator");
        }
        console.log("Followed creator successfully");
        setIsFollowing(true);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error following/unfollowing creator:", error);
    }
  };

  
  const creatorFashions = fashions.filter(
    (fashion) => fashion.creator === creator?.id
  );

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      {/* section 1 */}
      <Stack
        mt={3}
        sx={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.5))",
          p: 3,
          px: { lg: 12 },
          py: { lg: 6 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { lg: "480px" },
            height: "480px",
            borderRadius: "50%",
            ml: { lg: -12 },
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              borderRadius: "50%",
              zIndex: 1,
              overflowX: "hidden",
            }}
            data-aos="fade-right"
          ></div>
          {creator && (
            <Box
              sx={{
                objectFit: "cover",
                position: "relative",
                zIndex: 2,
                mt: 4,
                ml: { xs: 5, lg: 12 },
              }}
              data-aos="flip-left"
            >
              <img
                src={`${apiProxy}${creator.profile_picture}`}
                width={270}
                height={350}
                alt={creator.full_name}
                style={{ borderRadius: "50px" }}
              />
            </Box>
          )}
        </Box>

        <Box
          textAlign="center"
          zIndex={99}
          top="25%"
          display="block"
          data-aos="fade-up"
          sx={{
            left: { lg: "30%" },
            position: { xs: "relative", lg: "absolute" },
          }}
        >
          {creator && (
            <>
              <Typography
                sx={{
                  fontSize: {
                    lg: "50px",
                    xs: "35px",
                  },
                }}
                fontWeight={600}
                mt={4}
                mb={1}
                data-aos="zoom-in"
              >
                Hello There, Im {creator.full_name}
              </Typography>
              <Typography
                variant="boy1"
                fontWeight={300}
                color="text.secondary"
              >
                {creator.description}
              </Typography>

              <Box textAlign="left" sx={{ ml: { lg: 11 } }} mt={5}>
                <Rating
                  value={creator.rating}
                  precision={0.1}
                  readOnly
                  sx={{ fontSize: 17 }}
                />
              </Box>
            </>
          )}

          <Stack textAlign="left">
            <Divider sx={{ mb: 3 }} />
            {creator && (
              <Grid
                container
                justifyContent="center"
                spacing={3}
                sx={{ ml: { lg: 11 } }}
              >
                <Grid item xs={12} md={8}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems="center"
                    spacing={2}
                    mt={3}
                  >
                    <div>
                      <Stack mt={2}>
                        <Stack flexDirection="row" gap={3}>
                          <IconButton
                            sx={{
                              backgroundColor: "#D4D4D4",
                              p: "3px 30px",
                              borderRadius: "20px",
                            }}
                            onClick={handleOpenReviewRead}
                          >
                            <Typography fontSize="12px" color="text.secondary">
                              {creator.ratings.length}
                            </Typography>

                            <Typography
                              fontSize="12px"
                              color="text.secondary"
                              ml={1}
                            >
                              Reviews
                            </Typography>
                          </IconButton>

                          <IconButton
                            sx={{
                              backgroundColor: "#D4D4D4",
                              p: "3px 30px",
                              borderRadius: "20px",
                            }}
                          >
                            <Typography fontSize="12px" color="text.secondary">
                              {creator.followers.length}
                            </Typography>
                            <Typography
                              fontSize="12px"
                              color="text.secondary"
                              ml={1}
                            >
                              followers{" "}
                            </Typography>
                          </IconButton>
                        </Stack>
                        {token && (
                          <Stack flexDirection="row" gap={5} mt={3}>
                            <IconButton
                              sx={{
                                backgroundColor: "#D4D4D4",
                                p: "3px 30px",
                                borderRadius: "20px",
                              }}
                              onClick={handleOpenReviewDialog}
                            >
                              <RateReviewIcon sx={{ fontSize: 12 }} />
                              <Typography
                                fontSize="12px"
                                color="text.secondary"
                                ml={1}
                              >
                                Rate
                              </Typography>
                            </IconButton>

                            <IconButton
                              sx={{
                                backgroundColor: "#D4D4D4",
                                p: "3px 30px",
                                borderRadius: "20px",
                              }}
                              onClick={handleFollow}
                            >
                              <ArrowUpwardIcon sx={{ fontSize: 15 }} />
                              <Typography
                                fontSize="12px"
                                color="text.secondary"
                                ml={1}
                              >
                                {isFollowing ? "Unfollow" : "Follow"}
                              </Typography>
                            </IconButton>
                          </Stack>
                        )}
                      </Stack>
                    </div>
                  </Stack>

                  <Dialog
                    open={openReviewRead}
                    onClose={handleCloseReviewRead}
                    data-aos="zoom-in"
                  >
                    <DialogTitle>All Reviews</DialogTitle>
                    <DialogContent>
                      <List>
                        {creator.ratings.map((review, index) => (
                          <ListItem key={index}>
                            <Card sx={{ padding: 2, textAlign: "left" }}>
                              <Typography
                                mt={1}
                                color="text.secondary"
                                fontSize={13}
                              >
                                {review.review_text}
                              </Typography>
                              <Typography
                                color="text.secondary"
                                fontSize={12}
                                opacity={0.7}
                              >
                                by {reviewUsers[review.user]}
                              </Typography>
                              <Divider
                                sx={{ backgroundColor: "white", mt: 1 }}
                              />
                            </Card>
                          </ListItem>
                        ))}
                      </List>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseReviewRead}>Close</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>

                <Dialog
                  open={openReviewDialog}
                  onClose={handleCloseReviewDialog}
                  data-aos="zoom-in"
                >
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogContent>
                    <Rating
                      name="rating"
                      value={rating}
                      onChange={(event, newValue) =>
                        handleRatingChange(newValue)
                      }
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="reviewText"
                      label="Review"
                      type="text"
                      fullWidth
                      value={reviewText}
                      onChange={handleReviewTextChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseReviewDialog}>Cancel</Button>
                    <Button onClick={handleReviewSubmit}>Submit</Button>
                  </DialogActions>
                </Dialog>

                <Grid item xs={12} md={4}>
                  <Stack
                    direction="row"
                    spacing={2}
                    mt={{ xs: 2, md: 0, lg: 5 }}
                    justifyContent="left"
                  >
                    <IconButton
                      aria-label="Facebook"
                      href={creator.facebook}
                      target="_blank"
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton
                      aria-label="Twitter"
                      href={creator.twitter}
                      target="_blank"
                    >
                      <Twitter />
                    </IconButton>
                    <IconButton
                      aria-label="Instagram"
                      href={creator.instagram}
                      target="_blank"
                    >
                      <Instagram />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Box>
      </Stack>

      <section>
        <Stack
          direction="row"
          mt={5}
          justifyContent="center"
          alignItems="center"
          width="100%"
          data-aos="fade-up"
        >
          {loading && <CircularProgress />}
        </Stack>

        <Box textAlign="center" data-aos="fade-down">
          <Heading
            tag="stuffs"
            title={`${creator && creator.full_name} Products`}
          />
        </Box>

        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 3,
            flexWrap: "wrap",
            mt: 15,
          }}
        >
          {creatorFashions.map((fashion, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: { lg: 250, md: 250 },
              }}
              className="FashionCard"
              data-aos="flip-left"
            >
              <Box>
                <Link to={`/fashion/${fashion.id}`}>
                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}${fashion.image}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                  ></CardMedia>
                </Link>
              </Box>
              <CardContent>
                <Link to={`/fashion/${fashion.id}`}>
                  <Typography
                    gutterBottom
                    variant="body6"
                    component="div"
                    color="text.secondary"
                  >
                    {fashion.name}
                  </Typography>
                  <Box
                    mt={1}
                    display="inline-flex"
                    gap={1}
                    sx={{ cursor: "pointer", textAlign: "center" }}
                  >
                    <Typography
                      sx={{
                        transform: "rotate(180deg)",
                        opacity: 0.8,
                      }}
                    >
                      <KeyboardBackspaceIcon
                        sx={{
                          fontSize: 30,
                          backgroundColor: "#D4D4D4",
                          borderRadius: "50px",
                          color: "#000",
                          padding: 1,
                        }}
                      />
                    </Typography>
                    <Typography
                      color="text.secondary"
                      mt={0.7}
                      variant="body6"
                      padding={1}
                    >
                      Details
                    </Typography>
                  </Box>
                </Link>
              </CardContent>
            </Box>
          ))}
        </Stack>
      </section>
    </>
  );
};

export default CreatorDetails;
