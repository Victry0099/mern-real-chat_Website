import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, verfiyAdmin } from "../../redux/thunks/admin.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(verfiyAdmin());
  }, [dispatch]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(120,110,220,0.5), rgba(200,200,200,0.5))",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
            Admin Login
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              fullWidth
              placeholder="Enter your Password"
              type={showPassword ? "text" : "password"}
              id="password"
              label="Secret Key"
              required
              sx={{ marginBottom: "1rem" }}
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              autoFocus
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button
              fullWidth
              sx={{ marginTop: "0.2rem" }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
