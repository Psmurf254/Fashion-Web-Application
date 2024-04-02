import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  Box,
  CardContent,
  CardMedia,
  Pagination,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Card,
  Button,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { apiProxy } from "../utils/constants";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { service_heading, searviceImg, companyName } from "../utils/constants";
import Heading from "./Heading";
import "aos/dist/aos.css";
import AOS from "aos";

const Services = ({ categories, fashions, setFashions, loading, error }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setShowFilter(false);
  };

  const [page, setPage] = useState(1);

  const CustomArrow = ({ onClick, icon }) => (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: "7%",
        top: "30%",
        border: "none",
        outline: "none",
        zIndex: "1",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {icon}
    </button>
  );

  const customPrevArrow = (
    <CustomArrow
      icon={
        <NavigateNextIcon
          style={{
            color: "gray",
            width: "100%",
            opacity: 0.7,
          }}
        />
      }
    />
  );

  const customNextArrow = (
    <CustomArrow
      icon={
        <NavigateNextIcon
          style={{
            color: "gray",
            width: "100%",
            transform: "rotate(180deg)",
            opacity: 0.7,
            marginTop: "300%",
            cursor: "pointer",
          }}
        />
      }
    />
  );

  var settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: customNextArrow,
    prevArrow: customPrevArrow,
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const filteredFashions =
    selectedCategory === "ALL"
      ? fashions
      : fashions.filter((fashion) => fashion.category === selectedCategory);

  const startIndex = (page - 1) * 6;
  const endIndex = page * 6;

  const handleColorFilter = (color) => {
    setSelectedColor(color);
    setShowFilter(false);
    setShowSearch(false);
  };

  const filteredFashionsWithColor = selectedColor
    ? filteredFashions.filter((fashion) =>
        fashion.colors
          .split(",")
          .map((color) => color.trim().toLowerCase())
          .includes(selectedColor.toLowerCase())
      )
    : filteredFashions;

  const paginatedFashions = filteredFashionsWithColor.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    const filteredFashions = fashions.filter(
      (fashion) =>
        fashion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fashion.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFashions(filteredFashions);
    setSearchQuery("");
    setShowFilter(false);
    setShowSearch(false);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <section style={{ overflowX: "hidden" }} id="services">
        <Box textAlign="center" data-aos="fade-down">
          <Heading
            tag={service_heading && service_heading[0].tag}
            title={service_heading && service_heading[0].title}
            description={service_heading && service_heading[0].description}
          />
        </Box>

        <Divider sx={{ mt: 5, backgroundColor: "white" }} />
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          textAlign="center"
        >
          <Box>
            <Select
              label="Select Category"
              value={selectedCategory}
              onChange={handleChange}
              sx={{ padding: "5px 20px", height: 35, mt: 1 }}
            >
              <MenuItem value="ALL">ALL</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Stack
            flexDirection="row"
            gap={2}
            sx={{
              mr: 0,
            }}
          >
            <Box>
              <IconButton
                onClick={handleFilterClick}
                sx={{
                  backgroundColor: "#D4D4D4",
                  p: "5px 20px",
                  borderRadius: "5px",
                  mt: 1,
                }}
              >
                {showFilter ? (
                  <CloseIcon sx={{ fontSize: 25 }} />
                ) : (
                  <FilterAltIcon sx={{ fontSize: 25 }} />
                )}
                <Typography color="text.secondary" fontSize="12px" ml={1}>
                  Filter
                </Typography>
              </IconButton>
            </Box>

            <Box>
              <IconButton
                onClick={handleSearchClick}
                sx={{
                  backgroundColor: "#D4D4D4",
                  p: "5px 20px",
                  borderRadius: "5px",
                  mt: 1,
                }}
              >
                {showSearch ? (
                  <CloseIcon sx={{ fontSize: 25 }} />
                ) : (
                  <SearchIcon sx={{ fontSize: 25 }} />
                )}
                <Typography color="text.secondary" fontSize="12px" ml={1}>
                  Search
                </Typography>
              </IconButton>
            </Box>
          </Stack>
        </Stack>
        <Divider sx={{ backgroundColor: "white", mt: 1 }} />
        <Stack
          sx={{
            mt: 2,
            padding: 5,
            backgroundColor: "#D4D4D4",
            borderRadius: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 3,
            flexWrap: "wrap",
            position: "absolute",
            width: "90%",
            zIndex: showFilter ? 2 : -2,
            opacity: showFilter ? 1 : 0,
            transition: "all .7s",
          }}
        >
          <Box>
            <Typography variant="body6">Sort by</Typography>
            <Stack gap={2} mt={3}>
              <IconButton color="text.secondary" sx={{ fontSize: 17 }}>
                {" "}
                Default
              </IconButton>
            </Stack>
          </Box>
          <Box>
            <Typography variant="body6">Color</Typography>
            <Stack mt={3} gap={2}>
              <Box
                display="inline-flex"
                gap={1}
                onClick={() => handleColorFilter("")}
              >
                <IconButton
                  sx={{
                    height: 1,
                    backgroundColor: "none",
                    border: "1px solid ",
                  }}
                ></IconButton>
                <Typography
                  color="text.secondary"
                  mt={-0.4}
                  sx={{ cursor: "pointer" }}
                >
                  None
                </Typography>
              </Box>
              <Box
                display="inline-flex"
                gap={1}
                onClick={() => handleColorFilter("black")}
              >
                <IconButton
                  sx={{ height: 1, backgroundColor: "#000" }}
                ></IconButton>
                <Typography
                  color="text.secondary"
                  mt={-0.4}
                  sx={{ cursor: "pointer" }}
                >
                  Black
                </Typography>
              </Box>
              <Box
                display="inline-flex"
                gap={1}
                onClick={() => handleColorFilter("red")}
              >
                <IconButton
                  sx={{ height: 1, backgroundColor: "red" }}
                ></IconButton>
                <Typography
                  color="text.secondary"
                  mt={-0.4}
                  sx={{ cursor: "pointer" }}
                >
                  Red
                </Typography>
              </Box>
              <Box
                display="inline-flex"
                gap={1}
                onClick={() => handleColorFilter("blue")}
              >
                <IconButton
                  sx={{ height: 1, backgroundColor: "blue" }}
                ></IconButton>
                <Typography
                  color="text.secondary"
                  mt={-0.4}
                  sx={{ cursor: "pointer" }}
                >
                  Blue
                </Typography>
              </Box>
              <Box
                display="inline-flex"
                gap={1}
                onClick={() => handleColorFilter("yellow")}
              >
                <IconButton
                  sx={{ height: 1, backgroundColor: "yellow" }}
                ></IconButton>
                <Typography
                  color="text.secondary"
                  mt={-0.4}
                  sx={{ cursor: "pointer" }}
                >
                  Yellow
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box>
            <Typography variant="body6">Tags</Typography>
            <Stack mt={3}>
              <Typography
                border={1}
                p={1}
                borderRadius={1}
                color="error"
                variant="body6"
              >
                No available Tags
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {showSearch && (
          <Stack>
            {showSearch && (
              <Stack
                mt={3}
                sx={{
                  position: "absolute",
                  zIndex: showSearch ? 2 : -2,
                  opacity: showSearch ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                  width: "90%",
                }}
              >
                <Card>
                  <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    sx={{ width: "100%" }}
                    required
                    onChange={handleSearchInputChange}
                  />
                  <IconButton
                    sx={{ position: "absolute", right: 50, mt: 1 }}
                    onClick={handleSearch}
                  >
                    <SearchIcon sx={{ fontSize: "24px" }}>Search</SearchIcon>
                  </IconButton>
                </Card>
              </Stack>
            )}
          </Stack>
        )}

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
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          {paginatedFashions.map((fashion, index) => (
            <Box
              sx={{
                maxWidth: { lg: 250, md: 250 },
              }}
              className="FashionCard"
            >
              <Box data-aos="fade-right">
                <Slider {...settings}>
                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}${fashion.image}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                  ></CardMedia>

                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}${fashion.thumbnail1}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                  ></CardMedia>

                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}${fashion.thumbnail2}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                  ></CardMedia>

                  <CardMedia
                    component="img"
                    height="300px"
                    image={`${apiProxy}/${fashion.thumbnail3}`}
                    alt={fashion.name}
                    sx={{ objectFit: "cover" }}
                    className="FashionCardImg"
                  ></CardMedia>
                </Slider>

                <CardContent data-aos="fade-left">
                  <Typography
                    gutterBottom
                    variant="body6"
                    component="div"
                    color="text.secondary"
                  >
                    {fashion.name.slice(0, 20)}
                  </Typography>
                  <Link to={`/fashion/${fashion.id}`}>
                    <Box
                      display="inline-flex"
                      gap={1}
                      sx={{ cursor: "pointer", textAlign: "center" }}
                    >
                      <Typography
                        sx={{ transform: "rotate(180deg)", opacity: 0.8 }}
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
                        variant="body3"
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

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredFashions.length / 6)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </section>

      {/* section 2 */}
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
          {/* Big Circle */}
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
          <Box
            sx={{
              objectFit: "cover",
              position: "relative",
              zIndex: 2,
              ml: { lg: 12 },
              mt: 5,
            }}
            data-aos="flip-left"
          >
            <img src={searviceImg} width={300} height={350} alt="about" />
          </Box>
        </Box>

        <Box
          textAlign="center"
          zIndex={99}
          top="25%"
          display="block"
          data-aos="fade-up"
          sx={{
            left: { lg: "25%" },
            position: { xs: "relative", lg: "absolute" },
          }}
        >
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
            {service_heading && service_heading[0].hero_title}{" "}
            <span style={{ color: "red" }}>{companyName}</span> Excellence
          </Typography>
          <Typography variant="boy1" fontWeight={300} color="text.secondary">
            {service_heading && service_heading[0].hero_description}
          </Typography>
          <Box mt={3} data-aos="fade-right">
            <Link to="/dashboard">
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
                Create Today
              </Button>
            </Link>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Services;
