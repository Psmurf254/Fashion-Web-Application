import React, { useState, useEffect } from "react";
import {
  Divider,
  Typography,
  Box,
  Avatar,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Facebook, Twitter, Instagram, WhatsApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CreatorSlics } from "../utils/SlickSettings";
import { apiProxy } from "../utils/constants";
import { topcreators_heading } from "../utils/constants";
import Heading from "./Heading";
import "aos/dist/aos.css";
import AOS from "aos";

const TopCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch creators
        const responseCreators = await fetch(`${apiProxy}/api/creators/`);
        const CreatorsData = await responseCreators.json();

        // Fetch following data
        const followingResponse = await fetch(
          `${apiProxy}/api/creator_following/`
        );
        const followingData = await followingResponse.json();

        // Fetch review ratings data
        const reviewRatingsResponse = await fetch(
          `${apiProxy}/api/creator-ratings/`
        );
        const reviewRatingsData = await reviewRatingsResponse.json();

        // Merge review ratings and following with creator data
        const mergedCreatorData = CreatorsData.map((creator) => {
          const creatorFollowing = followingData.filter(
            (following) => following.creator === creator.id
          );
          const creatorReviewRatings = reviewRatingsData.filter(
            (rating) => rating.creator === creator.id
          );

          return {
            ...creator,
            followers: creatorFollowing.length,
            reviewRatings: creatorReviewRatings,
          };
        });

        // Sort creators based on the number of followers
        const sortedCreators = mergedCreatorData.sort(
          (a, b) => b.followers - a.followers
        );

        // Slice the first 9 creators
        const topCreators = sortedCreators.slice(0, 9);

        if (topCreators < 1) {
          setError("Nothing found");
          setLoading(false);
        } else {
          setCreators(topCreators);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section
      style={{
        overflowX: "hidden",
        marginBottom: "10%",
        padding: 0,
      }}
    >
      <Divider sx={{ mt: "17px", backgroundColor: "white" }} />
      <Stack
        mt={3}
        sx={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.5))",
          p: 3,
          px: { lg: 12 },
          py: { lg: 6 },
        }}
      >
        <Box data-aos="fade-right">
          <Heading
            tag={topcreators_heading && topcreators_heading[0].tag}
            title={topcreators_heading && topcreators_heading[0].title}
          />
        </Box>
        {loading ? (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            width="100%"
            mt="1rem"
            sx={{}}
          >
            <CircularProgress />
          </Stack>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Slider
            {...CreatorSlics}
            style={{ textAlign: "left", marginTop: "30px" }}
          >
            {creators.map((creator, index) => (
              <Box sx={{ width: 345, maxWidth: "100%" }} data-aos="fade-up">
                <Link to={`/creator/${creator.id}`} key={index}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                    data-aos="flip-left"
                  >
                    <Avatar
                      alt={creator.full_name}
                      src={`${apiProxy}${creator.profile_picture}`}
                      sx={{ width: 120, height: 120 }}
                    />
                  </Box>
                </Link>
                <Box px={2}>
                  <Link to={`/creator/${creator.id}`} key={index}>
                    <Box>
                      <Typography variant="h6" gutterBottom color="#42a5f5">
                        {creator.full_name}
                      </Typography>

                      <Divider sx={{ mt: "12px" }} />

                      <Typography
                        variant="body6"
                        gutterBottom
                        mt={2}
                        color="gray"
                        component="div"
                        lineHeight={1.5}
                        letterSpacing={0.5}
                      >
                        {creator.description}
                      </Typography>
                    </Box>
                  </Link>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                    data-aos="fade-left"
                  >
                    <Box>
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

                      <IconButton
                        aria-label="WhatsApp"
                        href={creator.whatsApp}
                        target="_blank"
                      >
                        <WhatsApp />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      opacity="0.7"
                    >
                      {creator.followers} Followers
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        )}
      </Stack>
    </section>
  );
};

export default TopCreators;
