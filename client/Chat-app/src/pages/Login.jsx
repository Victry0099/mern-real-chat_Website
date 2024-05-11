import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config.js";
import { userExist } from "../redux/reducers/auth.js";
import { usernameValidator } from "../utils/validators.js";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  //? use if make strong password (const password = useStrongPassword());

  const avatar = useFileHandler("single");
  // console.log(avatar);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handelSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExist(data.user));

      toast.success(data.message, { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handelLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Loading In...");
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        config
      );
      dispatch(userExist(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
      console.error(error);
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLogin ? (
            <>
              <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
                Login
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onSubmit={handelLogin}
              >
                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  type="text"
                  id="username"
                  label="Username"
                  required
                  sx={{ marginBottom: "1rem" }}
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  fullWidth
                  placeholder="Enter your Password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility based on showPassword state
                  id="password"
                  label="Password"
                  required
                  sx={{ marginBottom: "1rem" }}
                  value={password.value}
                  onChange={password.changeHandler}
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
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
                  Or
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ marginBottom: "0rem" }}>
                Sign Up
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "70vh",
                  boxSizing: "border-box",
                }}
                onSubmit={handelSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "6rem",
                      height: "6rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  {avatar.error && (
                    <Typography color="error" variant="caption">
                      {avatar.error}
                    </Typography>
                  )}

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  type="text"
                  id="name"
                  label="Name"
                  required
                  // margin="normal"
                  style={{ margin: "0.5rem" }}
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  type="text"
                  id="bio"
                  label="bio"
                  required
                  // margin="normal"
                  style={{ margin: "0.5rem" }}
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  fullWidth
                  placeholder="Enter your username"
                  type="text"
                  id="username"
                  label="Username"
                  required
                  // margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                  style={{ margin: "0.5rem" }}
                />

                {/*  this is use for if make strong password  */}
                {/* {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )} */}

                <TextField
                  fullWidth
                  placeholder="Enter your Password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility based on showPassword state
                  id="password"
                  label="Password"
                  required
                  sx={{ marginBottom: "1rem" }}
                  value={password.value}
                  onChange={password.changeHandler}
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
                  sx={{ marginTop: "1rem" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography variant="h5" sx={{ marginBottom: "0rem" }}>
                  Or
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
