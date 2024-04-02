import Header from "./Header";
import About from "./About";
import Services from "./Services";
import React, { useState, useEffect } from "react";
import Popular from "./Popular";
import New from "./New";
import TopCreators from "./TopCreators";
import { apiProxy } from "../utils/constants";
import { Divider } from "@mui/material";
import TopCategories from "./TopCategories";

const Home = () => {
  const [abouts, setAbouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fashions, setFashions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch abouts
        const responseAbout = await fetch(`${apiProxy}/api/about/`);
        const dataAbout = await responseAbout.json();
        setAbouts(dataAbout);

        // Fetch categories
        const responseCategories = await fetch(`${apiProxy}/api/categories/`);
        const dataCategories = await responseCategories.json();
        setCategories(dataCategories);

        // Fetch fashion data
        const fashionResponse = await fetch(`${apiProxy}/api/fashions/`);
        const fashionData = await fashionResponse.json();

        // Fetch comments data
        const commentsResponse = await fetch(`${apiProxy}/api/comments/`);
        const commentsData = await commentsResponse.json();

        // Fetch likes data
        const likesResponse = await fetch(`${apiProxy}/api/likes/`);
        const likesData = await likesResponse.json();

        // Fetch review ratings data
        const reviewRatingsResponse = await fetch(
          `${apiProxy}/api/review-ratings/`
        );
        const reviewRatingsData = await reviewRatingsResponse.json();

        // Merge comments, likes, and review ratings with fashion data
        const mergedFashionData = fashionData.map((fashion) => {
          const fashionComments = commentsData.filter(
            (comment) => comment.fashion === fashion.id
          );
          const fashionLikes = likesData.filter(
            (like) => like.fashion === fashion.id
          );
          const fashionReviewRatings = reviewRatingsData.filter(
            (rating) => rating.fashion === fashion.id
          );

          return {
            ...fashion,
            comments: fashionComments,
            likes: fashionLikes,
            reviewRatings: fashionReviewRatings,
          };
        });
        if (mergedFashionData < 1) {
          setError("Nothing found in the database");
          setLoading(false);
        } else {
          setFashions(mergedFashionData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data! Please try again later");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <About abouts={abouts} />
      <Divider sx={{ py: 1 }} />
      <TopCategories categories={categories} fashions={fashions} />
      <Services
        categories={categories}
        fashions={fashions}
        error={error}
        loading={loading}
        setFashions={setFashions}
      />
      <Popular fashions={fashions} error={error} loading={loading} />
      <Divider sx={{ py: 1 }} />
      <New fashions={fashions} error={error} loading={loading} />
      <TopCreators />
      <div></div>
    </div>
  );
};

export default Home;
