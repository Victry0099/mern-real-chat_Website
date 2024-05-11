import { Grid, Skeleton, Stack, Box } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";

const Loaders = () => {
  return (
    <>
      <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}
        >
          <Skeleton variant="rectangular" height={"100vh"} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={6}
          height={"100%"}
          //   bgcolor="primary.main"
        >
          <Stack spacing={"1rem"}>
            {Array.from({ length: 10 }).map((item, index) => (
              <Skeleton key={index} variant="rounded" height={"5rem"} />
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          md={4}
          lg={3}
          height={"100%"}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Skeleton variant="rectangular" height={"100vh"} />
        </Grid>
      </Grid>
    </>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.4rem"}
      direction={"row"}
      justifyContent={"center"}
      // alignItems={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={6}
        height={6}
        style={{
          animationDelay: "0s",
          backgroundColor: "red",
          color: "red",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={6}
        height={6}
        style={{
          animationDelay: "0.2s",
          backgroundColor: "blue",
          color: "blue",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={6}
        height={6}
        style={{
          animationDelay: "0.4s",
          backgroundColor: "green",
          color: "green",
        }}
      />
    </Stack>
  );
};

export { TypingLoader, Loaders };
