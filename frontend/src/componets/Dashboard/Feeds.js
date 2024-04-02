import { Stack, Box, CircularProgress, Typography } from "@mui/material";
import Siderbar from "./Siderbar";
import Content from "./Content";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiProxy } from "../../utils/constants";


const Feeds = ({token}) => {
    const [selectedItem, setSelectedItem] = useState("Profile");
    const [fashions, setFashions] = useState([]);
    const [creators, setCreators] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                const reviewRatingsResponse = await fetch(`${apiProxy}/api/review-ratings/`);
                const reviewRatingsData = await reviewRatingsResponse.json();

                // Merge comments, likes, and review ratings with fashion data
                const mergedFashionData = fashionData.map((fashion) => {
                    const fashionComments = commentsData.filter((comment) => comment.fashion === fashion.id);
                    const fashionLikes = likesData.filter((like) => like.fashion === fashion.id);
                    const fashionReviewRatings = reviewRatingsData.filter((rating) => rating.fashion === fashion.id);

                    return {
                        ...fashion,
                        comments: fashionComments,
                        likes: fashionLikes,
                        reviewRatings: fashionReviewRatings,
                    };
                });

                if (mergedFashionData < 1) {
                    setError('Nothing found in the database');
                } else {
                    setFashions(mergedFashionData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Error fetching data! Please try again later');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try {
                const response = await fetch(`${apiProxy}/api/creators/creator/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        navigate("/creator/account/create/");
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                }

                const data = await response.json();
                setCreators(data);
            } catch (error) {
                console.error("Error fetching creator data:", error);
                setError('Error fetching data!');
            } finally {
                setLoading(false);
            }
        };

        fetchCreatorData();
    }, [token, navigate]);

    const userFashions = fashions.filter((fashion) => fashion.creator === creators[0]?.id);

    return (
        <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
            <Box sx={{ borderRight: "1px solid red", padding: "15px", backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.5))" }}>
                <Siderbar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
            </Box>

            <Box sx={{ margin: 2, overflowY: "auto", height: "90vh", flex: 2 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Content selectedItem={selectedItem} creators={creators} setCreators={setCreators} token={token} fashions={userFashions} />
                )}
            </Box>
        </Stack>
    );
}

export default Feeds;
