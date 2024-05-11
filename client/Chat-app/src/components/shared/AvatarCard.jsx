import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
import { transFormImage } from "../../lib/features";

// ? todo transform
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={"0.5"}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          width={"5rem"}
          height={"3rem"}
        >
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transFormImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                width: "2rem",
                height: "2rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
