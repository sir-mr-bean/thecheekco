import React from "react";
import { setup, styled } from "goober";

setup(React.createElement);

const HeartUI = styled("div")(({ isclick, styles }) => [
  {
    width: "100px",
    height: "100px",
    background:
      'url("data:image/png;base64,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") no-repeat',
    cursor: "pointer",
    display: "inline-block",
  },
  isclick === "true" && {
    backgroundPosition: "-2800px 0px",
    transition: "background 1s steps(28)",
  },
  styles,
]);

export default function Heart({ isClick, onClick, styles }) {
  return (
    <HeartUI
      isclick={isClick === false ? "false" : "true"}
      onClick={onClick}
      styles={styles}
    />
  );
}
