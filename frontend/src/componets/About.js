import { Box, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Heading from "./Heading";
import { about_heading } from "../utils/constants";
import { about2 } from "../utils/constants";
import CustomButton from "./CustomButton";
import "aos/dist/aos.css";
import AOS from "aos";

const About = ({ abouts }) => {
  const [typedContent, setTypedContent] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTyping && abouts && abouts.length > 0) {
        const content = abouts[index]?.content;
        if (content) {
          setTypedContent(content.substring(0, typedContent.length + 1));
          if (typedContent === content) {
            setIsTyping(false);
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [typedContent, isTyping, index, abouts]);

  const showNextAboutContent = () => {
    setTypedContent("");
    setIsTyping(true);
    setIndex((index + 1) % abouts.length);
  };

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <section style={{ padding: 0 }} id="about">
      <Stack
        textAlign="left"
        sx={{
          flexDirection: { lg: "row", md: "row", sm: "column", xm: "column" },
          justifyContent: { lg: "space-around" },
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.5))",
          gap: 5,
          position: "relative",
          p: 3,
          px: { lg: 12 },
          py: { lg: 6 },
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
            <img src={about2} width={300} height={400} alt="about" />
          </Box>
        </Box>

        <Box
          sx={{
            width: { lg: "50%", md: "100%", sm: "100%", xm: "100%" },
            mt: 4,
          }}
          data-aos="fade-left"
        >
          <Heading
            tag={about_heading && about_heading[0].tag}
            title={about_heading && about_heading[0].title}
            description={about_heading && about_heading[0].description}
          />

          <Typography
            variant="body5"
            gutterBottom
            textTransform="capitalize"
            fontFamily="serif"
            lineHeight={2}
          >
            {typedContent}
          </Typography>
          <Box mt={3} justifyContent="center" alignItems="center">
            <CustomButton
              link="#services"
              variant="contained"
              content="Products"
              onClick={showNextAboutContent}
            />
          </Box>
        </Box>
      </Stack>
    </section>
  );
};

export default About;
