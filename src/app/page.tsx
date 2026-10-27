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
      {/* each section shows one planet in the background (see components/background) */}
      <div data-planet="Earth">
        <Intro />
      </div>
      <div data-planet="Mars">
        <WhoIsEthan />
      </div>
      <div data-planet="Jupiter">
        <MyExperience />
      </div>
      <div data-planet="Saturn">
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
