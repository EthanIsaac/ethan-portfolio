import {
  Stack,
  Typography,
  Divider,
  useTheme,
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Box,
  Chip,
} from "@mui/material";
import { useCallback, useState } from "react";
import { IExperienceProps } from "./experience";
import { COLOR_PRIMARY, COLOR_PRIMARY_LIGHT } from "utils/constants/colors";

export const ExperienceTimelineCard = ({
  company,
  duration,
  description,
  logo,
  link,
  role,
}: IExperienceProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          <Stack spacing={2}>
            <Stack alignItems="center">{logo}</Stack>
            <Stack>
              <Typography variant="h4">
                {company} -{" "}
                <span style={{ color: theme.palette.primary.main }}>
                  {role}
                </span>
              </Typography>
              <Typography
                variant="subtitle1"
                color={theme.palette.primary.main}
              >
                {duration}
              </Typography>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Timeline card */}
      <Box
        sx={{
          p: "1px",
          borderRadius: "16px",
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
            p: 3,
            borderRadius: "15px",
            background: "rgba(18, 0, 50, 0.82)",
            backdropFilter: "blur(12px)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Link
            href={link}
            target="_blank"
            referrerPolicy="no-referrer"
            sx={{
              color: "inherit",
              display: "flex",
              justifyContent: "center",
              mb: 0.5,
            }}
          >
            {logo}
          </Link>

          <Chip
            label={duration}
            size="small"
            sx={{
              bgcolor: `${COLOR_PRIMARY}22`,
              color: COLOR_PRIMARY_LIGHT,
              border: `1px solid ${COLOR_PRIMARY}55`,
              borderRadius: "6px",
              fontSize: "0.68rem",
              fontWeight: 700,
              height: "22px",
              alignSelf: "flex-start",
            }}
          />

          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {company}
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

          <Typography
            variant="body2"
            sx={{ color: COLOR_PRIMARY_LIGHT, lineHeight: 1.5 }}
          >
            {role}
          </Typography>

          <Button
            color="secondary"
            variant="outlined"
            size="small"
            onClick={handleOpen}
            sx={{ alignSelf: "flex-start", mt: 0.5 }}
          >
            Learn more
          </Button>
        </Box>
      </Box>
    </>
  );
};
