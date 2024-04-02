import { Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const Siderbar = ({ selectedItem, setSelectedItem }) => {
  const items = [
    { name: "Profile", icon: <PersonIcon /> },
    { name: "My Stuffs", icon: <FormatListBulletedIcon /> },
    { name: "Add Fashion", icon: <AddIcon /> },
    { name: "Perfomance", icon: <AnalyticsIcon /> },
  ];

  return (
    <Stack mt={10}>
      <Stack
        direction="row"
        sx={{
          overflowY: "auto",
          height: { xm: "auto", md: "95%" },
          flexDirection: { md: "column" },
        }}
      >
        {items.map((item) => (
          <button
            className="category-btn"
            onClick={() => setSelectedItem(item.name)}
            key={item.name}
            style={{
              background: item.name === selectedItem && "#D4D4D4",
              opacity: item.name === selectedItem && 1,
            }}
          >
            <span
              style={{ color: item.name === selectedItem ? "red" : "#020035" }}
            >
              {" "}
              {item.icon}
            </span>{" "}
            <span style={{ marginLeft: "20px" }}> {item.name}</span>
          </button>
        ))}
      </Stack>
    </Stack>
  );
};

export default Siderbar;
