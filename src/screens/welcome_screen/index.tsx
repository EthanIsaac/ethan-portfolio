"use client";
import { Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  WelcomeMessage,
  WelcomeScreenBackground,
  WelcomeScreenContainer,
} from "./styled";

const WelcomeScreen = () => {
  const [visible, setVisible] = useState(true);
  const theme = useTheme();
  return (
    <WelcomeScreenBackground visible={visible}>
      <WelcomeScreenContainer>
        <WelcomeMessage
          visible={visible}
          onAnimationEnd={() => {
            setVisible(false);
          }}
        >
          <Typography variant="h3">
            Welcome to my{" "}
            <span style={{ color: theme.palette.primary.main }}>
              {" "}
              personal website
            </span>
          </Typography>
        </WelcomeMessage>
      </WelcomeScreenContainer>
    </WelcomeScreenBackground>
  );
};

export default WelcomeScreen;
