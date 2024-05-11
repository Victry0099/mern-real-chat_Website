import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box bgcolor={"rgba(0, 0, 0, 0.1)"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select to a friend chat
      </Typography>
    </Box>
  );
};

// export default Home;
export default AppLayout()(Home);
