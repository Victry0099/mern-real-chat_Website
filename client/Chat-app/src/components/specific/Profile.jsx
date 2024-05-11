import { Avatar, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transFormImage } from "../../lib/features";

const Profile = ({ user }) => {
  // console.log("user", user);
  return (
    <Stack spacing={"2rem"} alignItems={"center"}>
      <Avatar
        src={transFormImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          marginBottom: "1rem",
          border: "2px solid #e3e3e3",
          objectFit: "contain",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UsernameIcon />}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >
      {Icon && Icon}

      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="caption" color={grey}>
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
