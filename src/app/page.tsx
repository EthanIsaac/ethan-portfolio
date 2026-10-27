"use client";
import { Box } from "@mui/material";
import Background, { TextureCredit } from "components/background";
import { Intro } from "landing-sections/intro";
import { WhoIsEthan } from "landing-sections/whoIsEthan";
import { MyExperience } from "landing-sections/my-experience";
import { MyEducation } from "landing-sections/my-education";
import { TechStack } from "landing-sections/tech-stack";

const Landing = () => {
  return (
    <Box minWidth="100%" minHeight="100%" position="relative">
      <Background />
      {/* the background flies outward from the Sun, framing each section's planets in turn (see components/background) */}
      <div data-planet="Sun">
        <Intro />
      </div>
      <div data-planet="Mercury Venus">
        <WhoIsEthan />
      </div>
      <div data-planet="Earth Mars Jupiter Saturn">
        <MyExperience />
      </div>
      <div data-planet="Uranus">
        <MyEducation />
      </div>
      <div data-planet="Neptune">
        <TechStack />
      </div>
      <TextureCredit />
    </Box>
  );
};

export default Landing;
