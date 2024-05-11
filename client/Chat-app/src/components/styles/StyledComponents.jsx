import React from "react";
import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { greyColor, mateBlack } from "../../constants/color";
const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  width: 1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  margin: -1,
});
const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  pading: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled("input")`
  font-size: 1.2rem;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1rem;
  background-color: ${greyColor};
`;

const SearchField = styled("input")`
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  background-color: #f1f1f1;
  font-size: 1.1rem;
  width: 20vmax;
  border: none;
  outline: none;
`;

const CurveButton = styled("button")`
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  background-color: ${mateBlack};
  font-size: 1.1rem;
  border: none;
  outline: none;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const bounceAnimation = keyframes`
  0% {
    // transform: scale(1);
    transform: translateY(0);
  }
  50% {
    // transform: scale(1.5);
    transform: translateY(5px);
  }
  100% {
    // transform: scale(1);
    transform: translateY(10px);
  }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite alternate`,
}));

export {
  BouncingSkeleton,
  CurveButton,
  SearchField,
  InputBox,
  Link,
  VisuallyHiddenInput,
};
