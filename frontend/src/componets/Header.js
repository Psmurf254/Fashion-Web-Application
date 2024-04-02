import { Link } from "react-router-dom";
import { Typography, Stack, Box, Button } from "@mui/material";
import headerbg from "../assets/imgs/headerbg.png";
import Slider from "react-slick";
import { heroContent } from "../utils/constants";

import { heroimg1, heroimg2, heroimg3 } from "../utils/constants";

const Header = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  console.log("hero content", heroContent);

  return (
    <>
      <Stack
        sx={{
          backgroundImage: `linear-gradient(rgba(4,9,30,0.2), rgba(4,9,30,0.2)), url(${headerbg})`,
          backgroundSize: "cover",
          position: "relative",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
          mt: "4%",
          pl: 3,
          width: "100%",
          display: { xs: "none", lg: "block" },
        }}
        className="LgHeader"
      >
        <Stack ml="40%">
          <Slider {...settings}>
            {[heroimg1, heroimg2, heroimg3].map((image, index) => (
              <img src={image} width="100%" height="600px" alt="hero" />
            ))}
          </Slider>
        </Stack>

        <Stack
          maxWidth="50%"
          sx={{
            position: "absolute",
            top: "20%",
          }}
        >
          <Slider {...settings}>
            {heroContent.map((item, index) => (
              <Box key={index}>
                <Typography variant="h6" fontStyle="italic" mb={2} color="pink">
                  Welcome to {item.companyName}
                </Typography>

                <Typography
                  variant="h2"
                  color="#fff"
                  fontWeight={600}
                  textTransform="uppercase"
                >
                  We Live {item.companyName}
                </Typography>
                <Typography
                  variant="h6"
                  mb={2}
                  color="#fff"
                  fontWeight={300}
                  letterSpacing={2}
                  mt={2}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Slider>

          <Box display="flex" gap={4} mt={6} zIndex={99}>
            <a href="#services">
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
                View More
              </Button>
            </a>
            <Link to="/dashboard">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#fff",
                  color: "purple",
                  fontWeight: "600",
                  fontSize: "18x",
                  borderRadius: "5px",
                  padding: "15px 35px",
                }}
              >
                GET STARTED
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>

      {/* Small devices */}

      <Stack
        sx={{
          backgroundImage: `linear-gradient(rgba(4,9,30,0.2), rgba(4,9,30,0.2)), url(${headerbg})`,
          width: "100%",
          backgroundSize: "cover",
          position: "relative",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          mt: "4%",
          display: { xs: "block", lg: "none" },
        }}
        className="header"
      >
        <Box className="HeroText">
          <Slider {...settings}>
            {heroContent.map((item, index) => (
              <Box key={index}>
                <Typography variant="h5" fontWeight={600} mb={3} color="pink">
                  Welcome to {item.companyName}
                </Typography>

                <Typography
                  lineHeight={2}
                  textTransform="capitalize"
                  variant="boby6"
                  color="#fff"
                  mb={3}
                  letterSpacing={2}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Slider>

          <button className="herobtn">
            <a href="#services" style={{ color: "#fff" }}>
              Get Started
            </a>
          </button>
        </Box>
      </Stack>
    </>
  );
};

export default Header;
