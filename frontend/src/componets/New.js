import React, { useEffect } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { customSlick01 } from "../utils/SlickSettings";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";
import { apiProxy, newFashions_heading } from "../utils/constants";
import Heading from "./Heading";
import "aos/dist/aos.css";
import AOS from "aos";

const New = ({ fashions, loading, error }) => {
  const sortedFashions = fashions
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 9);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section style={{ overflowX: "hidden" }} id="new">
      <Box textAlign="center" data-aos="fade-down">
        <Heading
          tag={newFashions_heading && newFashions_heading[0].tag}
          title={newFashions_heading && newFashions_heading[0].title}
          description={
            newFashions_heading && newFashions_heading[0].description
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
      <Stack>
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
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                    data-aos="flip-right"
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
                </CardContent>
              </Link>
            </Box>
          ))}
        </Slider>
      </Stack>
    </section>
  );
};

export default New;
