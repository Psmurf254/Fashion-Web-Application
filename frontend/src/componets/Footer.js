import { Box, Stack, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      setShowFooter(currentScrollTop > lastScrollTop || currentScrollTop === 0);
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const contentHeight = 500;

  return (
    <footer
      style={{
        position: "fixed",
        bottom: showFooter ? 0 : `-${contentHeight}px`,
        width: "100%",
        transition: "bottom 0.3s",
        zIndex: 9999,
      }}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-around"
        padding="30px 0"
        sx={{
          background:
            "linear-gradient(to right, rgba(228, 228, 228, 0.7), rgba(255, 255, 255, 0.7))",
        }}
      >
        <Box textAlign="left">
          <Typography variant="body1" color="text.secondary">
            Developed With ❤️ by : <br />
            <span
              style={{
                color: "red",

                opacity: "0.7",
                fontSize: "12px",
              }}
            >
              {" "}
              Maxwell Reuben{" "}
            </span>
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton
            aria-label="Facebook"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook />
          </IconButton>
          <IconButton
            aria-label="Twitter"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </IconButton>
        </Stack>
      </Stack>
    </footer>
  );
};

export default Footer;
