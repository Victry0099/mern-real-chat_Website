import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { mateBlack } from "../../constants/color";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { server } from "../../constants/config";
import { useFetchData } from "6pp";
import { useErrors } from "../../hooks/Hooks";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );
  const { stats, messagesChart } = data || [];

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "1rem", margin: "1.5rem 0.5rem", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />
        <SearchField placeholder="Search..." />
        <CurveButton>Search</CurveButton>
        <Box sx={{ flexGrow: 1 }} />
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
        >
          {moment().format("dddd, Do MMMM YYYY ")}
        </Typography>
        <NotificationsIcon />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget title={"User"} value={stats?.usersCount} Icon=<PersonIcon /> />
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon=<GroupIcon />
      />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        Icon=<MessageIcon />
      />
    </Stack>
  );

  return loading ? (
    <Skeleton height={"100vh"} />
  ) : (
    <AdminLayout>
      <Container component={"main"}>
        {Appbar}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{
            xs: "center",
            lg: "stretch",
          }}
          sx={{ gap: "1rem" }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "1rem 2rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem",
              cursor: "pointer",
              // height: "20rem",
            }}
          >
            <Typography variant="h6" margin={"0.5rem 0"}>
              Last Messages
            </Typography>

            <LineChart value={messagesChart || []} />
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              width: "100%",
              width: { xs: "100%", sm: "50%" },
              maxWidth: "20rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              // height: "20rem",
            }}
          >
            <DoughnutChart
              labels={["Single Chats", "Group Chats"]}
              value={[
                stats?.totalChatsCount - stats?.groupsCount || 0,
                stats?.groupsCount || 0,
              ]}
            />

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon />
              <Typography>Vs</Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={5}
    sx={{
      padding: "1.5rem",
      margin: "1rem 0",
      borderRadius: "1rem",
      width: "20rem",
    }}
  >
    <Stack
      alignItems={"center"}
      spacing={"1rem"}
      justifyContent={"space-evenly"}
    >
      <Typography
        sx={{
          width: "3rem",
          height: "3rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          padding: "0.5rem",
          border: `3px solid ${mateBlack}`,
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Typography>{Icon}</Typography>
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);
export default Dashboard;
