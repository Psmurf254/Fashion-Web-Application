import React, { useEffect } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Divider,
  Box,
  Rating,
  CircularProgress,
  Alert,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { customSlick01 } from "../utils/SlickSettings";
import { Link } from "react-router-dom";
import { apiProxy, topfashions_heading } from "../utils/constants";
import Heading from "./Heading";
import "aos/dist/aos.css";
import AOS from "aos";

const calculateAverageRating = (fashion) => {
  const totalStars = fashion.reviewRatings.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  return totalStars / fashion.reviewRatings.length;
};

const Popular = ({ fashions, loading, error }) => {
  const sortedFashions = fashions
    .sort((a, b) => calculateAverageRating(b) - calculateAverageRating(a))
    .slice(0, 9);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section
      style={{
        overflowX: "hidden",
      }}
      id="trendingFashions"
    >
      <Box textAlign="center" data-aos="fade-down">
        <Heading
          tag={topfashions_heading && topfashions_heading[0].tag}
          title={topfashions_heading && topfashions_heading[0].title}
          description={
            topfashions_heading && topfashions_heading[0].description
          }
        />
      </Box>
      <Divider sx={{ mt: "17px", backgroundColor: "white" }} />

      {loading && (
        <Stack
          direction="row"
          mt={5}
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <CircularProgress />
        </Stack>
      )}
      {error && (
        <Stack
          direction="row"
          mt={5}
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Alert severity="error">{error}</Alert>
        </Stack>
      )}

      <Stack mt={3}>
        <Slider
          {...customSlick01}
          style={{ textAlign: "left", marginTop: "30px" }}
        >
          {sortedFashions.map((fashion, index) => (
            <Box
              sx={{
                maxWidth: { lg: 250, md: 250 },
              }}
              data-aos="fade-up"
            >
              <Link to={`/fashion/${fashion.id}`}>
                <Box>
                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}${fashion.image}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover", borderRadius: "5px" }}
                    className="FashionCardImg"
                    data-aos="flip-left"
                  ></CardMedia>
                </Box>

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="body6"
                    component="div"
                    color="text.secondary"
                  >
                    {fashion.name}
                  </Typography>
                  {calculateAverageRating(fashion) ? (
                    <Box alignItems="center" mt={1}>
                      <Rating
                        name="read-only"
                        value={calculateAverageRating(fashion)}
                        precision={0.1}
                        readOnly
                        sx={{ fontSize: 17 }}
                      />
                    </Box>
                  ) : (
                    ""
                  )}
                </CardContent>
                <Divider sx={{ py: 2 }} />
              </Link>
            </Box>
          ))}
        </Slider>
      </Stack>
    </section>
  );
};

export default Popular;
