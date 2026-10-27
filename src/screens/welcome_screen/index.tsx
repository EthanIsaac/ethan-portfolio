"use client";
import { Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DURATION_WELCOME_SCREEN } from "../../utils/constants/durations";
import {
  WelcomeMessage,
  WelcomeScreenBackground,
  WelcomeScreenContainer,
} from "./styled";

const WelcomeScreen = () => {
  const [visible, setVisible] = useState(true);
  const theme = useTheme();

  // The intro animation starts with the static HTML, so it can finish before React
  // hydrates and onAnimationEnd is never delivered. Hide it on a timer as well.
  useEffect(() => {
    const durationMs = parseFloat(DURATION_WELCOME_SCREEN) * 1000;
    const remaining = Math.max(0, durationMs - performance.now());
    const timeout = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(timeout);
  }, []);
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
