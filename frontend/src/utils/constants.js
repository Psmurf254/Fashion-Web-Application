import Home from "../componets/Home";
import Navbar from "../componets/Navbar";
import Header from "../componets/Header";
import About from "../componets/About";
import Footer from "../componets/Footer";

import heroimg1 from "../assets/imgs/heroimg1.png";
import heroimg2 from "../assets/imgs/heroimg2.png";
import heroimg3 from "../assets/imgs/heroimg3.png";

import about1 from "../assets/imgs/about1.png";
import aboutpalax from "../assets/imgs/aboutpalax.png";
import about2 from "../assets/imgs/about2.webp";
import searviceImg from "../assets/imgs/searviceImg.png";

export { Home, Navbar, Header, About, Footer };

export { heroimg1, heroimg2, heroimg3 };

export const companyName = "Company name";
export const companyLogo = "Company Logo";

export const navLinks = [
  {
    name: "Peoducts",
    url: "#services",
  },
  {
    name: "About us",
    url: "#about",
  },
  {
    name: "Trending",
    url: "#trendingFashions",
  },

  {
    name: "New",
    url: "#new",
  },
];

export const heroContent = [
  {
    id: 0,
    companyName: companyName,
    description:
      "A gallery of cool and unique stuffs. From Runway to Street Style, Thisis Where Every Look Tells a Story",
  },

  {
    id: 1,
    companyName: companyName,
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups",
  },
];

export const about_heading = [
  {
    tag: "About us",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export const service_heading = [
  {
    tag: "Products",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
    hero_title: "Step into",
    hero_description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export const topcategory_heading = [
  {
    tag: "Top Categories",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export const topcreators_heading = [
  {
    tag: "Top Fashionistas",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export const topfashions_heading = [
  {
    tag: "Top Fashions",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export const newFashions_heading = [
  {
    tag: "New Fashions",
    title: "Lorem ipsum is placeholder",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print,",
  },
];

export { about1, about2, aboutpalax, searviceImg };

// API
export const apiProxy = "http://127.0.0.1:8000";
