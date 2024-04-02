import React, { useState, useEffect } from "react";
import {
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { apiProxy } from "../utils/constants";

const Save = ({ token }) => {
  const [savedFashions, setSavedFashions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch current user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch( `${apiProxy}/api/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch saved fashions and fashion details
  useEffect(() => {
    const fetchSavedFashions = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/favorites/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const favoriteData = await response.json();
        const currentuserSavedFashions = favoriteData
          ? favoriteData.filter(
              (fashion) => fashion?.user === currentUser?.[0]?.id
            )
          : [];

        // Fetch fashion details for each saved fashion
        const fashionDetailsPromises = currentuserSavedFashions.map(
          async (favorite) => {
            const fashionResponse = await fetch(
            `${apiProxy}/api/fashion-details/${favorite.fashion}/`
            );
            if (!fashionResponse.ok) {
              throw new Error("Failed to fetch fashion details");
            }
            return fashionResponse.json();
          }
        );

        // Wait for all fashion details to be fetched
        const fashionDetails = await Promise.all(fashionDetailsPromises);
        setSavedFashions(fashionDetails);
      } catch (error) {
        console.error("Error fetching saved fashions:", error);
        setError("Error fetching saved fashions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFashions();
  }, [token, currentUser]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
      `${apiProxy}/api/favorite_update/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete favorite");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting favorite:", error);
      setError("Error deleting favorite. Please try again.");
    }
  };

  

  return (
    <section>
      <TableContainer>
        <Stack
          direction="row"
          mt={5}
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
        {!loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>

                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedFashions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No saved fashions found
                  </TableCell>
                </TableRow>
              ) : (
                savedFashions.map((fashion) => (
                  <TableRow key={fashion.id}>
                    <TableCell>
                      <Link to={`/fashion/${fashion.id}`}>
                        <img
                          src={`${apiProxy}${fashion.image}`}
                          alt={fashion.name}
                          style={{ width: "70px", height: "70px", borderRadius: '5px'}}
                        />
                      </Link>
                    </TableCell>

                    <TableCell>   <Link to={`/fashion/${fashion.id}`}>{fashion.name} </Link></TableCell>

                    <TableCell>
                      <IconButton
                
                       
                      >
                       <DeleteIcon  onClick={() => handleDelete(fashion.id)}/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Box></Box>
    </section>
  );
};

export default Save;
