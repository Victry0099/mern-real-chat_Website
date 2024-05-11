import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "FunFusion",
  description = "This is the chat app called funfusion",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
