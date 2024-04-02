import React from "react";
import { Typography, Box } from "@mui/material";

const Heading = ({ title, tag, description }) => {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ fontFamily: "sarif" }}
        color="chocolate"
        textTransform="uppercase"
      >
        [ {tag} ]
      </Typography>
      <Typography
        sx={{
          fontSize: { lg: "35px", md: "30px", sm: "20px", xm: "20px" },
          fontWeight: 600,
          fontFamily: "serif",
        }}
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        sx={{ fontSize: { xs: "15px", lg: "20px" } }}
        color="text.secondary"
        mb={3}
        mt={1}
      >
        {description}
      </Typography>
    </Box>
  );
};

export default Heading;
