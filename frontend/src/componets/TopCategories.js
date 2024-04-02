import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Modal,
  CardMedia,
  Stack,
} from "@mui/material";
import topcategoryalt from "../assets/imgs/topcategoryalt.png";
import Heading from "./Heading";
import { topcategory_heading } from "../utils/constants";
import { apiProxy } from "../utils/constants";
import { Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "aos/dist/aos.css";
import AOS from "aos";

const TopCategories = ({ fashions, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const categoryCounts = {};
  fashions.forEach((fashion) => {
    if (categoryCounts[fashion.category]) {
      categoryCounts[fashion.category]++;
    } else {
      categoryCounts[fashion.category] = 1;
    }
  });

  const sortedCategories = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  );
  const topCategories = sortedCategories
    .slice(0, 4)
    .map((categoryId) => parseInt(categoryId, 10));

  const filteredCategories = categories.filter((category) =>
    topCategories.includes(category.id)
  );

  const handleClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filteredFashions = selectedCategory
    ? fashions.filter((fashion) => fashion.category === selectedCategory)
    : [];

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section>
      <Box textAlign="center" data-aos="fade_down">
        <Heading
          tag={topcategory_heading && topcategory_heading[0].tag}
          title={topcategory_heading && topcategory_heading[0].title}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-around"
        mt={8}
        gap={3}
        sx={{ overflowX: "auto" }}
        data-aos="fade-up"
      >
        {filteredCategories.map((category) => (
          <Box
            key={category.id}
            onClick={() => handleClick(category.id)}
            sx={{ cursor: "pointer" }}
          >
            <Card
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                backgroundColor:
                  selectedCategory === category.id
                    ? "lightgray"
                    : "transparent",
              }}
            >
              <CardContent style={{ textAlign: "center" }}>
                {category.icon ? (
                  <img
                    src={`${apiProxy}${category.icon}`}
                    alt="Category"
                    style={{
                      width: "100%",
                      height: "auto",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ) : (
                  <img
                    src={topcategoryalt}
                    alt="Category"
                    style={{
                      width: "100%",
                      height: "auto",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </CardContent>
            </Card>
            <Typography
              variant="body1"
              mt={2}
              color="gray"
              fontWeight={600}
              data-aos="flip-right"
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-aos="zoom-in"
      >
        <Box sx={{ backgroundColor: "white", padding: 3, borderRadius: 2 }}>
          <Typography variant="h5" id="modal-title" textAlign="center" mb={2}>
            Available Items for Category {selectedCategory}
          </Typography>

          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              mt: 3,
              gap: 3,
              overflowY: "auto",
              maxHeight: "80vh",
            }}
          >
            {filteredFashions.map((fashion) => (
              <Box
                key={fashion.id}
                sx={{
                  maxWidth: { lg: 250, md: 250 },
                }}
                className="FashionCard"
              >
                <Box>
                  <CardMedia
                    component="img"
                    height="300px"
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
        </Box>
      </Modal>
    </section>
  );
};

export default TopCategories;
