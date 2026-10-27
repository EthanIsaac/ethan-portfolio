import { Button, Stack, Typography, useTheme } from "@mui/material";
import { useMemo, useCallback } from "react";
import { EducationEntry, IEducationEntry } from "./education-entry";

export const MyEducation = () => {
  const theme = useTheme();

  const handleSeeMore = useCallback(() => {
    document.getElementById("tech-stack-section")?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const entries: IEducationEntry[] = useMemo(
    () => [
      {
        institution: "EGADE Business School, Tecnológico de Monterrey",
        degree: "Master of Business Administration",
        field: "Business Administration",
        period: "2025 – to date",
        description:
          "Currently pursuing an MBA at EGADE Business School, focusing on leadership, strategy, and innovation. Expected to graduate in 2027.",
      },
      {
        institution: "Tecnológico de Monterrey",
        degree: "Bachelor of Engineering",
        field: "Computer Systems Engineering",
        period: "2016 – 2019",
        description:
          "Graduated with honors, specializing in software development, algorithms, and data structures. Complemented with courses in entrepreneurship, project management and machine learning.",
      },
      {
        institution: "CECyT 3 - Instituto Politécnico Nacional",
        degree: "Technical High School",
        field: "Computer Systems",
        period: "2011 – 2015",
        description:
          "Completed a technical high school program in computer systems, gaining foundational knowledge in programming, hardware, and networking.",
      },
    ],
    [],
  );

  return (
    <section id="my-education-section">
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={4}
        p={4}
        width="100%"
        minHeight="100dvh"
        boxSizing="border-box"
        textAlign="center"
      >
        <Typography variant="h3">
          My{" "}
          <span style={{ color: theme.palette.primary.main }}>Education</span>
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          spacing={2}
          rowGap={2}
        >
          {entries.map((entry) => (
            <EducationEntry key={entry.institution} entry={entry} />
          ))}
        </Stack>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleSeeMore}
        >
          See more
        </Button>
      </Stack>
    </section>
  );
};
