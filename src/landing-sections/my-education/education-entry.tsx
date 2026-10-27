import { Box, Chip, Typography } from "@mui/material";
import { COLOR_PRIMARY, COLOR_PRIMARY_LIGHT } from "utils/constants/colors";

export interface IEducationEntry {
  institution: string;
  degree: string;
  field: string;
  period: string;
  description: string;
}

export const EducationEntry = ({ entry }: { entry: IEducationEntry }) => (
  <Box
    sx={{
      display: "flex",
      p: "1px",
      borderRadius: "16px",
      maxWidth: "340px",
      minWidth: "250px",
      flex: 1,
      background: `linear-gradient(145deg, ${COLOR_PRIMARY}55, ${COLOR_PRIMARY_LIGHT}22)`,
      transition: "background 0.3s ease",
      "&:hover": {
        background: `linear-gradient(145deg, ${COLOR_PRIMARY}, ${COLOR_PRIMARY_LIGHT}88)`,
        "& .card-inner": {
          transform: "scale(1.01)",
          boxShadow: `0 12px 40px ${COLOR_PRIMARY}33`,
        },
      },
    }}
  >
    <Box
      className="card-inner"
      sx={{
        flex: 1,
        p: 3,
        borderRadius: "15px",
        background: "rgba(18, 0, 50, 0.82)",
        backdropFilter: "blur(12px)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <Chip
        label={entry.period}
        size="small"
        sx={{
          bgcolor: `${COLOR_PRIMARY}22`,
          color: COLOR_PRIMARY_LIGHT,
          border: `1px solid ${COLOR_PRIMARY}55`,
          borderRadius: "6px",
          fontSize: "0.68rem",
          fontWeight: 700,
          mb: 2,
          height: "22px",
        }}
      />
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ lineHeight: 1.3, mb: 0.5 }}
      >
        {entry.institution}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: COLOR_PRIMARY_LIGHT, fontWeight: 600, mb: 0.5 }}
      >
        {entry.degree}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: COLOR_PRIMARY, fontStyle: "italic", mb: 2 }}
      >
        {entry.field}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.75,
          display: "block",
        }}
      >
        {entry.description}
      </Typography>
    </Box>
  </Box>
);
