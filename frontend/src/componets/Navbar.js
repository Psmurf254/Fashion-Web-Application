import {
  Stack,
  Box,
  Typography,
  Badge,
  IconButton,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NotificationsNone, Save } from "@mui/icons-material";
import Notification from "../pages/Notification";
import { apiProxy, companyLogo, navLinks } from "../utils/constants";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ token, onLogout, isCreator }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [shownav, setShowNav] = useState(true);
  const trigger = useScrollTrigger();

  const isLoggedIn = !!token;

  const handleLogout = () => {
    onLogout();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);

    setNotificationData((prevData) =>
      prevData.map((notification) => ({ ...notification, read: true }))
    );
  };

  useEffect(() => {
    const fetchNotificatioData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/notifications/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setNotificationData(data);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    if (token) {
      fetchNotificatioData();
    }

    const handleScroll = () => {
      setShowNav(!trigger);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [token, trigger]);

  const MenuStyles = isMenuOpen
    ? { left: "0" }
    : { left: { xs: "-150%", sm: "0", md: "0", lg: "0" } };

  return (
    <Stack
      sx={{
        transition: "opacity 0.5s ease-in-out",
        opacity: shownav ? 1 : 0,
        pointerEvents: shownav ? "auto" : "none",
      }}
    >
      <Stack
        flexDirection="row"
        backgroundColor="#000"
        mt={0}
        width="100%"
        position="fixed"
        zIndex={1}
        sx={{ justifyContent: "space-between", zIndex: 999, px: 3 }}
        className="Navbar"
      >
        <Box>
          <Link to="/">
            <Typography
              sx={{
                fontSize: {
                  lg: "20px",
                  md: "20px",
                  sm: "17px",
                  xm: "17px",
                  opacity: 0.8,
                },
              }}
              textTransform="uppercase"
              color="red"
            >
              {/* <img src={companyLogo} width={45} height={45} alt="logo"/> */}
              {companyLogo}
            </Typography>
          </Link>
        </Box>

        <Box
          gap={2}
          className="NavLinks"
          sx={{ ...MenuStyles, display: { lg: "flex" } }}
        >
          <Link to="/">
            {" "}
            <li onClick={handleMenuToggle}>Home</li>{" "}
          </Link>

          {navLinks.map((item, index) => (
            <li key={index} onClick={handleMenuToggle}>
              <a href={`/${item.url}`} style={{ color: "#fff" }}>
                {item.name}
              </a>
            </li>
          ))}

          <Box
            sx={{
              ml: { lg: 30 },
              display: { lg: "flex", flexDirection: "row-reverse" },
            }}
          >
            {isLoggedIn ? (
              <>
                <li onClick={handleLogout}>Logout</li>
                {isCreator ? (
                  <Link to="/dashboard">
                    <li onClick={handleMenuToggle}>Dashboard</li>{" "}
                  </Link>
                ) : (
                  <Link to="/creator/account/create">
                    <li onClick={handleMenuToggle}>Create Account</li>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register">
                  <li onClick={handleMenuToggle}>Register</li>
                </Link>
                <Link to="/login">
                  <li onClick={handleMenuToggle}>Login</li>
                </Link>
              </>
            )}
          </Box>
        </Box>

        <Box
          onClick={handleMenuToggle}
          color="#fff"
          sx={{ display: { xs: "block", lg: "none" } }}
        >
          {isMenuOpen ? (
            <>
              <IconButton
                sx={{
                  display: { xs: "block", lg: "none" },
                  color: "red",
                }}
                onClick={handleMenuToggle}
              >
                <CloseIcon fontSize="35px" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton>
                <MenuIcon
                  sx={{
                    color: "#fff",
                    fontSize: 25,
                    mt: -1,
                  }}
                />
              </IconButton>
            </>
          )}
        </Box>
      </Stack>

      {isLoggedIn ? (
        <>
          <Stack
            position="fixed"
            right={24}
            p="0 7px"
            borderLeft="1px solid #000"
            gap={2}
            zIndex={99}
            className="floatingLinks"
            sx={{ top: { lg: "40%" } }}
          >
            <Box>
              <IconButton color="primary" onClick={handleNotificationToggle}>
                <Badge
                  badgeContent={
                    notificationData.length > 0
                      ? notificationData.filter(
                          (notification) => !notification.read
                        ).length
                      : 0
                  }
                  color="error"
                >
                  <NotificationsNone
                    sx={{
                      backgroundColor: "#000",
                      color: "#fff",
                      padding: "7px",
                      fontSize: "32px",
                    }}
                  />
                </Badge>
              </IconButton>

              <Notification
                isOpen={isNotificationOpen}
                onClose={handleNotificationToggle}
                notificationData={notificationData}
                token={token}
              />
            </Box>

            <Box>
              <Link to="/fashion/saved">
                <Badge badgeContent={0} color="error">
                  <Save
                    sx={{
                      backgroundColor: "#000",
                      color: "#fff",
                      padding: "7px",
                      fontSize: "32px",
                      ml: 1,
                    }}
                  />
                </Badge>
              </Link>
            </Box>
          </Stack>
        </>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default Navbar;
