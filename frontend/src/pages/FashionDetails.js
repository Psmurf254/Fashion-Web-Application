import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Divider,
  Stack,
  IconButton,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  Rating,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  TextField,
  Button,
} from "@mui/material";
import {  CommentOutlined } from "@mui/icons-material";
import AddchartIcon from '@mui/icons-material/Addchart';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PersonIcon from '@mui/icons-material/Person';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ShareIcon from "@mui/icons-material/Share";
import { WhatsApp, Twitter } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { apiProxy } from "../utils/constants";
import Heading from "../componets/Heading";
import 'aos/dist/aos.css';
import AOS from 'aos';

const FashionDetails = ({ token }) => {
  const { id } = useParams();
  const [fashionDetails, setFashionDetails] = useState(null);
  const [fashions, setFashions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewUsers, setReviewUsers] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fashionDetailRef = useRef(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showadditionalinfo, setShowadditionalinfo] = useState(false);
  const [showorderinfo, setShoworderinfo] = useState(false);

  // Fetch current user
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
    const fetchFashionDetails = async () => {
      try {
        // Fetch fashion details
        const fashionResponse = await fetch(
          `${apiProxy}/api/fashion-details/${id}/`
        );
        if (!fashionResponse.ok) {
          throw new Error("Failed to fetch fashion details");
        }
        const fashionData = await fashionResponse.json();

        // Fetch comments data
        const commentsResponse = await fetch(
          `${apiProxy}/api/comments/`
        );
        const commentsData = await commentsResponse.json();

        // Fetch likes data
        const likesResponse = await fetch(`${apiProxy}/api/likes/`);
        const likesData = await likesResponse.json();

        // Fetch review ratings data
        const reviewRatingsResponse = await fetch(
          `${apiProxy}/api/review-ratings/`
        );
        const reviewRatingsData = await reviewRatingsResponse.json();

        const relatedFashionsResponse = await fetch(
          `${apiProxy}/api/fashions/`
        );
        const relatedFashionsData = await relatedFashionsResponse.json();
        setFashions(relatedFashionsData);

        // Fetch favorites
        const favoriteResponse = await fetch(
          `${apiProxy}/api/favorites/`
        );
        const favoriteData = await favoriteResponse.json();

        const currentUserFavorite = favoriteData.find(
          (item) =>
            item.fashion === fashionData?.id &&
            item.user === currentUser?.[0]?.id
        );
        setIsSaved(!!currentUserFavorite);

        setFashionDetails({
          ...fashionData,
          comments: commentsData.filter(
            (comment) => comment.fashion === fashionData.id
          ),
          likes: likesData.filter((like) => like.fashion === fashionData.id),
          reviewRatings: reviewRatingsData.filter(
            (rating) => rating.fashion === fashionData.id
          ),
        });

        // Fetch and set review users
        const users = {};
        for (const review of reviewRatingsData) {
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fashion details:", error);
        setError("Error fetching fashion details. Please try again.");
        setLoading(false);
      }
    };

    fetchFashionDetails();
  }, [id, currentUser]);

  const handleCommentClick = () => {
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  const handleReviewSubmit = async () => {
    
    setFormLoading(true);
    setFormError(null);
    
    try {
      const response = await fetch(`${apiProxy}/api/review/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: reviewRating,
          review_text: reviewText,
          fashion: id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      setFormError("Error submitting review. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // handle Save
  const handleSaveFashion = async () => {
    try {
      const response = await fetch(`${apiProxy}/api/add_favorite/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fashion: fashionDetails.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save fashion");
      }
      const data = await response.json();
      console.log("fashion saved successfully:", data);
      window.location.reload();

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleCommentSubmit = async () => {
    // Submit comment
    try {
      const response = await fetch(
        `${apiProxy}/api/comment/create/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: commentText, fashion: id }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setFormError("Error submitting comment. Please try again.");
    }
  };

  const handleShareClick = () => {
    setIsShareDialogOpen(true);
  };

  const handleShareClose = () => {
    setIsShareDialogOpen(false);
  };

  const handleShareFashion = (platform) => {
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
        break;
      case "gmail":
        window.open(
          `mailto:?subject=Check out this fashion&body=Hey, I found this amazing fashion and wanted to share it with you: ${window.location.href}`
        );
        break;
      default:
        break;
    }
    window.open(shareUrl, "_blank");
  };

  //filter related fashions
  const relatedFashions = fashions?.filter(
    (fashion) => fashion.category === fashionDetails?.category
    
  );


  const scrollToFashionDetail = () => {
    fashionDetailRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const showadditionalinfoStyles = showadditionalinfo
    ? { display: "block" }
    : { display: "none" };

  const showorderinfoStyles = showorderinfo
    ? { display: "block" }
    : { display: "none" };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const handleAdditionalInfoToggle = () => {
    setShowadditionalinfo(!showadditionalinfo);
  };

  const handleOrderInfoToggle = () => {
    setShoworderinfo(!showorderinfo);
  };

  useEffect(() => {
    AOS.init({duration: 1000})
  }, []);

  return (
    <>
      <div ref={fashionDetailRef}>
      </div>

       {/* section 1 */}
       <Stack mt={3} sx={{ backgroundImage:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.5))",
          p: 3,
          px:{lg: 12},
          py:{lg: 6 },
          position: 'relative',
          
          }}>

<Box
  sx={{
    position: 'relative',
    width: {lg: '480px'},
    height: '480px',
    borderRadius: '50%',
    ml:{lg: -12},
  }}
 
>
  {/* Big Circle */}
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#fff', 
      borderRadius: '50%',
      zIndex: 1, 
      overflowX: 'hidden',
     
    }}
    data-aos="fade-right"
  ></div>
  {fashionDetails && (
  <Box  sx={{ objectFit: 'cover', position: 'relative', zIndex: 2, mt: 4,  ml:{ xs: 5, lg: 12 },
  }}
  data-aos="flip-left">
  <img src={`${apiProxy}${fashionDetails.image}`} width={270} height={350} alt={fashionDetails.name}
  style={{borderRadius: '50px'}}
  />
  </Box>
  )}
</Box>

<Box textAlign='center'  zIndex={99}  top='25%' display='block' data-aos="fade-up"
sx={{
  left: { lg: "30%" },
  position: { xs: "relative", lg: "absolute" },
 }}
>
{fashionDetails && (
  <>
<Typography  sx={{
    fontSize: {
      lg: "50px",
      xs: "35px"
    },
  }} fontWeight={600} mt={4} mb={1} data-aos="zoom-in" >

    
{fashionDetails.name}
</Typography>
<Typography  variant="boy1" fontWeight={300} color='text.secondary'>
{fashionDetails.description}
</Typography>
</>
    )}

<Box mt={3} data-aos="fade-right">
<Link to={`/creator/${fashionDetails?.creator}`}>
<Button
            variant="contained"
            sx={{
              background: "transparent",
              color: "purple",
              fontWeight: "600",
              fontSize: "18x",
              borderRadius: "5px",
              border: "1px solid white",
              padding: "15px 35px",
              
             
            }}
          >
           Check Fashionista
          </Button>
          </Link>

</Box>

</Box>


      </Stack>
          {/* section 2 */}
      <section  >
        <Box textAlign='center' data-aos="fade-down">
        <Heading
        tag='Details'
        title={fashionDetails && fashionDetails.name}
        />
        </Box>
       

      <Divider sx={{ mt: 5, backgroundColor: "white" }} />
      <Stack
        direction="row"
        mt={5}
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        {loading && <CircularProgress />}

        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
      </Stack>

      {fashionDetails && (
        <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
          {/* thumbnails images */}
          <Stack
            direction="row"
            gap={3}
            sx={{
              overflowY: "auto",
              height: { xm: "auto", md: "95%" },
              flexDirection: { md: "column" },
              mb: 3,
            }}
            data-aos="fade-right"
          >
             <CardMedia
              component="img"
              maxWidth={20}
              height="auto"
              image={`${apiProxy}${fashionDetails.image}`}
              alt={fashionDetails.name}
              sx={{ objectFit: "cover", maxWidth: 70, borderRadius: 1 }}
              onClick={() => handleThumbnailClick(`${apiProxy}${fashionDetails.image}`)}
            ></CardMedia>
            <CardMedia
              component="img"
              maxWidth={20}
              height="auto"
              image={`${apiProxy}${fashionDetails.thumbnail1}`}
              alt={fashionDetails.name}
              sx={{ objectFit: "cover", maxWidth: 70, borderRadius: 1 }}
              onClick={() => handleThumbnailClick(`${apiProxy}${fashionDetails.thumbnail1}`)}
            ></CardMedia>

            <CardMedia
              component="img"
              maxWidth={20}
              height="auto"
              image={`${apiProxy}${fashionDetails.thumbnail2}`}
              alt={fashionDetails.name}
              sx={{ objectFit: "cover", maxWidth: 70, borderRadius: 1 }}
              onClick={() => handleThumbnailClick(`${apiProxy}${fashionDetails.thumbnail2}`)}
            ></CardMedia>

            <CardMedia
              component="img"
              maxWidth={20}
              height="auto"
              image={`${apiProxy}${fashionDetails.thumbnail3}`}
              alt={fashionDetails.name}
              sx={{ objectFit: "cover", maxWidth: 70, borderRadius: 1 }}
              onClick={() => handleThumbnailClick(`${apiProxy}${fashionDetails.thumbnail3}`)}
            ></CardMedia>
          </Stack>

          <Box
            //   main image area
            sx={{
              overflowY: "auto",
              height: "90vh",
              flex: 2,
              ml: { lg: 4, md: 4 },
              maxWidth: { lg: 400, md: 400 },
              objectFit: "cover",
              mb: 5,
            }}
            data-aos="flip-left"
          >
            <CardMedia
              component="img"
              height="auto"
              image={selectedImage || `${apiProxy}${fashionDetails.image}`}
              alt={fashionDetails.name}
              sx={{
                borderRadius: 1,
                maxWidth: "100%",
              }}
            ></CardMedia>
          </Box>

          <Box
            sx={{
              overflowY: "auto",
              height: "90vh",
              flex: 2,
              ml: { lg: 8, md: 6 },
              maxWidth: { lg: 450, md: 450 },
            }}
            data-aos="fade-left"
          >
            <Typography variant="h5" component="div" color="primary">
              {fashionDetails.name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {fashionDetails.description}
            </Typography>
            <Box>
              <IconButton
                onClick={handleAdditionalInfoToggle}
                sx={{ color: "#000", fontSize: 15 }}
              >
                 Additional Information  <NavigateNextIcon sx={{ml: 4}}/>
              </IconButton>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
                sx={{ ...showadditionalinfoStyles }}
              >
                {fashionDetails.additinal_info}
              </Typography>
            </Box>
            <IconButton
              onClick={handleOrderInfoToggle}
              sx={{ color: "#000", fontSize: 15 }}
            >
              How can i get the Product  <NavigateNextIcon sx={{ml: 4}}/>
            </IconButton>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              gutterBottom
              sx={{ ...showorderinfoStyles }}
            >
              {fashionDetails.order_info}
            </Typography>

            <Box mt={2}>
              <Rating
                name="rating"
                value={fashionDetails.reviewRatings[0]?.rating}
                readOnly
                sx={{fontSize: 15}}
              />
            </Box>

            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
              {token && !isSaved && (
                <IconButton  sx={{
                  backgroundColor: "#D4D4D4",
                  p: "3px 30px",
                  borderRadius: "20px",
                }}>
                  <AddchartIcon sx={{ fontSize: 15 }} onClick={handleSaveFashion} />
                  <Typography color="text.secondary" fontSize="12px" ml={1}>
                  Save
                </Typography>
                </IconButton>
              )}

              <IconButton
                onClick={handleCommentClick}
                sx={{
                  backgroundColor: "#D4D4D4",
                  p: "3px 30px",
                  borderRadius: "20px",
                }}
              >
                <CommentOutlined sx={{ fontSize: 15 }} />
                <Typography color="text.secondary" fontSize="12px" ml={1}>
                  {fashionDetails.comments.length}
                </Typography>
              </IconButton>

              <IconButton
                onClick={handleShareClick}
                sx={{
                  backgroundColor: "#D4D4D4",
                  p: "3px 30px",
                  borderRadius: "20px",
                }}
              >
                <ShareIcon sx={{ fontSize: 15 }} />
                <Typography color="text.secondary" fontSize="12px" ml={1}>
                  Share
                </Typography>
              </IconButton>
            </Stack>

           

            <Dialog open={isShareDialogOpen} onClose={handleShareClose} data-aos="zoom-in">
              <DialogTitle>Share to</DialogTitle>
              <DialogContent sx={{display: 'flex', gap: 4}}>
                <IconButton onClick={() => handleShareFashion("whatsapp")}>
                 <IconButton> <WhatsApp /></IconButton>
                </IconButton>
                <IconButton onClick={() => handleShareFashion("twitter")}>
                  <Twitter />
                </IconButton>
                <IconButton onClick={() => handleShareFashion("gmail")}>
                  <EmailIcon />
                </IconButton>
              </DialogContent>
            </Dialog>

           
            {showComments && fashionDetails && (
              <Dialog open={showComments} onClose={handleCloseComments} data-aos="zoom-in">
                <DialogTitle>Comments</DialogTitle>
                <DialogContent>
                  {formLoading && <CircularProgress />}
                  <Divider sx={{ backgroundColor: "white" }} />
                  <List>
                    {fashionDetails.comments.map((comment, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={comment.text}
                          secondary={`By ${
                            reviewUsers[comment.user] || "Anonymous"
                          }`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {token ? (
                    <TextField
                      autoFocus
                      margin="dense"
                      id="comment"
                      label="Add Comment"
                      fullWidth
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                  ) : (
                    <Typography variant="body2" color="error">
                      Please login to comment
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  {token && (
                    <Button
                      disabled={formLoading}
                      onClick={handleCommentSubmit}
                      color="primary"
                    >
                      {formLoading ? "Submitting..." : "Submit"}
                    </Button>
                  )}
                  <Button onClick={handleCloseComments} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            {showReviewForm && fashionDetails && (
              <Dialog
                open={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                data-aos="zoom-in"
              >
                <DialogTitle>Write a Review</DialogTitle>
                <DialogContent>
                  <Divider sx={{ backgroundColor: "white" }} />
                  <Rating
                    name="reviewRating"
                    value={reviewRating}
                    onChange={(event, newValue) => setReviewRating(newValue)}
                    sx={{ mt: 2 }}
                  />
                  <Divider sx={{ mt: 2, backgroundColor: "white" }} />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="reviewText"
                    label="Review"
                    fullWidth
                    multiline
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ mt: 3 }}
                  />
                  {formError && <Alert severity="error">{formError}</Alert>}
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={formLoading}
                    onClick={handleReviewSubmit}
                    color="primary"
                  >
                    {formLoading ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    disabled={formLoading}
                    onClick={() => setShowReviewForm(false)}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <Box display="flex" gap={3} mt={3}>
             
              {token && (
            
                  <IconButton
                   sx={{
                    backgroundColor: "#D4D4D4",
                    p: "3px 30px",
                    borderRadius: "20px",
                   }}
                    onClick={() => setShowReviewForm(true)}
                  >
                    <RateReviewIcon sx={{fontSize: 15}} />
                    <Typography fontSize='12px' color='text.secondary' ml={1}>  
                    {formLoading ? "Submitting Review..." : "Write a Review"}
                    </Typography>
                  
                  </IconButton>
                
              )}

           
                <Box>
                <Link to={`/creator/${fashionDetails.creator}`}>
                  <IconButton sx={{
                   backgroundColor: "#D4D4D4",
                   p: "3px 30px",
                   borderRadius: "20px",
                  }}>
                    <PersonIcon sx={{
                      fontSize: 15,
                    
                     }} />
                    <Typography fontSize='14px' color='text.secondary' ml={1}>Fashionista</Typography>
                  </IconButton>
                
                </Link>
                </Box>
            </Box>
          </Box>
        </Stack>
      )}
    {/* sectin 3 */}

      <Divider sx={{ mt: 5, backgroundColor: "white" }} />
      <Stack mt={3}>
        <Box textAlign='center' data-aos="zoom-down">
          <Heading 
          tag='related'
          title = 'Related Fashions'
          />
        </Box>
        <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: "flex-start",
          gap: 3,
          flexWrap: "wrap",
          mt: 3,
        }}
        data-aos="fade-up"
      >
          {relatedFashions?.slice(0, 8).map((fashion, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: { lg: 250, md: 250 },
              }}
              className="FashionCard"
              data-aos="flip-right"
            >
              <Box>
              <CardMedia
                  component="img"
                  height='300px'
                  image={`${apiProxy}${fashion.image}`}
                  alt={fashion.name}
                  sx={{ objectFit: "cover" }}
                  className="FashionCardImg"
                ></CardMedia>

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="body6"
                    component="div"
                    color="text.secondary"
                  >
                    {fashion.name}
                  </Typography>
                  <Link to={`/fashion/${fashion.id}`}>
                    <Box
                      mt={1}
                      display="inline-flex"
                      gap={1}
                      sx={{
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                      onClick={scrollToFashionDetail}
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
            </Box>
          ))}
        </Stack>
      </Stack>
    </section>
    </>
  );
};

export default FashionDetails;
