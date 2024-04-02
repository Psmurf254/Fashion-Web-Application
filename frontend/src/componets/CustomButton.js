import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Button } from "@mui/material";

const CustomButton = ({ link, content, variant, onClick }) => {
  return (
    <Box>
      <Button
        variant={variant}
        sx={{ backgroundColor: "#000" }}
        onClick={onClick}
      >
        <a href={link} style={{ color: "#fff" }}>
          {content}
        </a>
        <span
          style={{
            marginLeft: "12px",
            transform: "rotate(180deg)",
            marginTop: "-8px",
          }}
        >
          <KeyboardBackspaceIcon />
        </span>
      </Button>
    </Box>
  );
};

export default CustomButton;
