import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiProxy } from "../../utils/constants";
import { Edit } from "@mui/icons-material";
import EditFashion from "./EditFashion";

const Creations = ({ creators, token }) => {
  const [fashions, setFashions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedFashion, setSelectedFashion] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fashionToDelete, setFashionToDelete] = useState(null);

  const handleUpdate = (updatedData) => {
    setFashions([updatedData]);
    setShowUpdateForm(false);
  };

  const handleShowUpdateForm = (fashion) => {
    setSelectedFashion(fashion);
    setShowUpdateForm(true);
  };

  useEffect(() => {
    if (creators.length > 0) {
      setCreatorId(creators[0].id);
    }
  }, [creators]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!creatorId) return;

        setLoading(true);
        setError(null);

        const fashionResponse = await fetch(`${apiProxy}/api/fashions/`);
        const fashionData = await fashionResponse.json();

        const filteredFashions = fashionData.filter(
          (fashion) => fashion.creator === creatorId
        );

        const commentsResponse = await fetch(`${apiProxy}/api/comments/`);
        const commentsData = await commentsResponse.json();

        const likesResponse = await fetch(`${apiProxy}/api/likes/`);
        const likesData = await likesResponse.json();

        const reviewRatingsResponse = await fetch(
          `${apiProxy}/api/review-ratings/`
        );
        const reviewRatingsData = await reviewRatingsResponse.json();

        const mergedFashionData = filteredFashions.map((fashion) => {
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

        setFashions(mergedFashionData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId]);

  const handleDelete = (id) => {
    setFashionToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${apiProxy}/api/fashion_update/${fashionToDelete}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete fashion");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting fashion:", error);
      setError("Error deleting fashion. Please try again.");
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" color="primary">
        My Stuffs
      </Typography>
      <Divider />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mt={50}
      >
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
      </Stack>
      {fashions.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Total Comments</TableCell>
                <TableCell>Total Reviews</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fashions.map((fashion) => (
                <TableRow key={fashion.id}>
                  <TableCell>
                    {" "}
                    <Avatar
                      alt="User Avatar"
                      src={`${apiProxy}${fashion.image}`}
                      sx={{ width: 60, height: 60, borderRadius: "5px" }}
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Link to={`/fashion/${fashion.id}`}>{fashion.name} </Link>
                  </TableCell>
                  <TableCell>{fashion.comments?.length}</TableCell>
                  <TableCell>{fashion.reviewRatings?.length}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleShowUpdateForm(fashion)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(fashion.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={showUpdateForm}
        onClose={() => setShowUpdateForm(false)}
        sx={{ overflow: "auto" }}
      >
        <DialogTitle>Edit Fashion</DialogTitle>
        <DialogContent>
          <EditFashion
            fashion={selectedFashion}
            token={token}
            onUpdate={handleUpdate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateForm(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        sx={{ overflow: "auto" }}
      >
        <DialogTitle sx={{ color: "red" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this fashion item?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete
          </Button>
          <Button onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Creations;
