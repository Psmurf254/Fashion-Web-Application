import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Grid, Typography } from "@mui/material";

const StatisticsData = ({ data }) => {
  const sortedByComments = data
    ?.slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 3);
  const sortedByRatings = data
    ?.slice()
    .sort((a, b) => {
      const avgRatingA =
        a.reviewRatings.reduce((acc, curr) => acc + curr.rating, 0) /
        a.reviewRatings.length;
      const avgRatingB =
        b.reviewRatings.reduce((acc, curr) => acc + curr.rating, 0) /
        b.reviewRatings.length;
      return avgRatingB - avgRatingA;
    })
    .slice(0, 3);

  const commentsData = sortedByComments?.map((item) => ({
    name: item.name,
    comments: item.comments.length,
  }));
  const ratingsData = sortedByRatings?.map((item) => ({
    name: item.name,
    rating:
      item.reviewRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      item.reviewRatings.length,
  }));

  const weekly = data?.comments?.length;
  const monthly = data?.reviewRatings?.length;
  const overallPerformanceData = [
    { name: "Weekly", value: weekly },
    { name: "Monthly", value: monthly },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Fashion Comments
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commentsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Fashion Ratings
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratingsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rating" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Overall Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={overallPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsData;
