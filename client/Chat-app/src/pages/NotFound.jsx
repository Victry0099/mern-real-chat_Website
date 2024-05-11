import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={10} sm={8} md={6} lg={4}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" gutterBottom align="center">
            404 - Page Not Found
          </Typography>
          <Typography variant="body1" align="center">
            Sorry, the page you are looking for does not exist.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Go to Home
          </Button>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default NotFound;
