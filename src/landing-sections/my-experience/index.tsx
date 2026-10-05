import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useScroll, useMotionValue, useTransform } from "framer-motion";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { SiRiotgames } from "react-icons/si";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IExperienceProps } from "./experience";
import { ExperienceTimelineCard } from "./experience-timeline-card";
import { COLOR_PRIMARY, COLOR_PRIMARY_LIGHT } from "utils/constants/colors";

const CARD_WIDTH = 320;
const CARD_MX = 48;

export const MyExperience = () => {
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const translateDistanceRef = useRef(0);
  const [sectionHeight, setSectionHeight] = useState("500vh");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useMotionValue(0);

  useEffect(() => {
    const recalculate = () => {
      if (!trackRef.current) return;
      const dist = Math.max(
        0,
        trackRef.current.scrollWidth - window.innerWidth,
      );
      translateDistanceRef.current = dist;
      setSectionHeight(`${dist + window.innerHeight}px`);
      x.set(-scrollYProgress.get() * dist);
    };

    recalculate();
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, [scrollYProgress, x]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      x.set(-latest * translateDistanceRef.current);
    });
    return unsubscribe;
  }, [scrollYProgress, x]);

  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const experiences: Array<IExperienceProps> = useMemo(
    () => [
      {
        company: "Capital One",
        duration: "Apr 2026 - Present",
        role: "Senior Engineering Manager",
        link: "https://www.capitalone.com",
        logo: (
          <Image
            src="/assets/images/experience/capital-one-logo.png"
            alt="Capital One"
            width="150"
            height="84"
          />
        ),
        description: (
          <>
            Capital One is a Fortune 100 financial technology company
            reinventing banking through data, engineering, and a
            relentless bet on AI to redefine what a bank can be.
            <br />
            <br />
            I lead engineering initiatives at the Mexico Tech Hub, building
            and scaling teams at the frontier of this new era of
            AI-driven innovation. My focus is on translating emerging AI
            capabilities into resilient, production-grade systems, while
            growing a culture of technical excellence and ownership across
            the engineers I lead.
            <br />
            <br />
            From architecture decisions to talent development, I'm helping
            shape how the Mexico Tech Hub builds the next generation of
            intelligent financial products.
          </>
        ),
      },
      {
        company: "Riot Games",
        duration: "Oct 2022 - Apr 2026",
        role: "Senior Software Engineer",
        link: "https://riotgames.com",
        logo: <SiRiotgames size="50px" />,
        description: (
          <>
            Riot Games is a global gaming company behind some of the
            industry's most iconic titles, including League of Legends,
            Valorant, Teamfight Tactics, and Wild Rift.
            <br />
            <br />
            I work within the Global Player Support organization, where I
            design and ship new features while driving bug fixes across our
            internal platforms. I've led multiple tools and refactors that
            improved backend service performance, alongside modernizing our
            frontend platforms with TypeScript and React.
          </>
        ),
      },
      {
        company: "Siingly",
        duration: "Jan 2023 - Jan 2025",
        role: "Founder & Chief Technology Officer",
        link: "https://siingly.com",
        logo: (
          <Image
            src="/assets/images/experience/siingly-logo.svg"
            alt="Buscavi"
            width="150"
            height="50"
          />
        ),
        description: (
          <>
            Siingly is a dating app built on a simple premise: quality over
            quantity.
            <br />
            <br />
            I partnered with Daniel, my co-founder and CEO, after meeting him
            in 2019 while working together at Paxico Technologies. We built
            this company from the ground up, bootstrapping the product with
            little to no outside capital.
            <br />
            <br />
            As technical leader, I drove the end-to-end strategy behind our
            mobile app, website, internal dashboard, and cloud backend across
            AWS and GCP. I also built a CI/CD pipeline that cut our release
            cycle down to minutes, letting us ship and iterate with
            confidence.
          </>
        ),
      },

      {
        company: "The Institutes",
        duration: "Aug 2022 - Oct 2022",
        role: "Lead Software Engineer",
        link: "https://web.theinstitutes.org/",
        logo: (
          <Image
            src="/assets/images/experience/the-institutes-logo.png"
            alt="Buscavi"
            width="50"
            height="50"
          />
        ),
        description: (
          <>
            The Institutes is a leading provider of courses and
            certifications for professionals in risk management and
            insurance.
            <br />
            <br />
            As part of the technical leadership team, I owned architectural
            design decisions and drove prioritization and delivery across
            multiple platform features. I mentored junior developers and led
            the migration of our components library to React and TypeScript,
            strengthening the platform's long-term technical foundation.
          </>
        ),
      },
      {
        company: "Loadsy",
        duration: "Oct 2021 - Aug 2022",
        role: "Chief Technology Officer",
        link: "https://loadsy.io",
        logo: (
          <Image
            src="/assets/images/experience/loadsy-logo.svg"
            alt="Buscavi"
            width="100"
            height="50"
          />
        ),
        description: (
          <>
            Loadsy is a load testing platform built for engineering teams.
            <br />
            <br />
            Alongside the Paxico founders, I built this project from the
            ground up to bring load testing capabilities directly into
            engineering teams' CI/CD pipelines.
            <br />
            <br />I owned the architectural design and led a team of 5
            engineers, taking the product from concept to launch in 6 months.
            The backend ran on Golang microservices deployed to AWS via
            Kubernetes and ArgoCD, while the frontend was distributed as a
            static SPA on AWS S3 with CloudFront as our CDN.
          </>
        ),
      },
      {
        company: "Paxico",
        duration: "Jul 2019 - Aug 2022",
        role: "Partner & VP of Engineering",
        link: "https://paxicotech.com",
        logo: (
          <Image
            src="/assets/images/experience/paxico-logo.png"
            alt="Buscavi"
            width="150"
            height="50"
          />
        ),
        description: (
          <>
            Paxico is a staff augmentation company and a launchpad for
            entrepreneurship — alongside providing engineering talent to
            clients, we built internal ventures such as Loadsy and Siingly.
            <br />
            <br />I joined as an intern in 2019 and grew quickly, progressing
            from Software Engineer to team leader. Through consistent
            delivery and technical ownership, I earned a partnership in the
            company and went on to lead the Engineering department as Vice
            President of Engineering.
          </>
        ),
      },
      {
        company: "Tecnológico de Monterrey",
        duration: "Jul 2019 - Aug 2022",
        role: "Programming Teacher",
        link: "https://tec.mx/es/estado-de-mexico",
        logo: (
          <Image
            src="/assets/images/experience/itesm-logo.svg"
            alt="Buscavi"
            width="50"
            height="50"
          />
        ),
        description: (
          <>
            Tecnológico de Monterrey is one of the most prestigious private
            universities in Mexico, and my alma mater.
            <br />
            <br />
            My passion for teaching led me to guide students aged 15 to 18
            through the fundamentals of programming using Python's Turtle
            library. Over the course of a semester, I mentored them from
            concept to completion as they designed and built their own video
            games from scratch.
          </>
        ),
      },
      {
        company: "Maestro Interactive",
        duration: "Dec 2019 - Jun 2020",
        role: "Lead Software Engineer",
        link: "https://maestro.io",
        logo: (
          <Image
            src="/assets/images/experience/maestro-logo.svg"
            alt="Buscavi"
            width="140"
            height="50"
          />
        ),
        description: (
          <>
            Maestro is a streaming platform that empowers individuals and
            organizations to broadcast content to millions of viewers while
            keeping the earnings for themselves and directing traffic to
            their own site instead of a third-party platform.
            <br />
            <br />I joined as a Software Engineer and quickly stepped into a
            leadership role, designing and building — alongside a small team
            of 3 — many of the core features Maestro relies on today, as well
            as internal mechanisms to safeguard against service outages.
          </>
        ),
      },
      {
        company: "Buscavi",
        duration: "Oct 2018 - Dec 2021",
        role: "Founder & Chief Technology Officer",
        link: "https://buscavi.com",
        logo: (
          <Image
            src="/assets/images/experience/buscavi-logo.png"
            alt="Buscavi"
            width="60"
            height="50"
          />
        ),
        description: (
          <>
            Buscavi is a real estate company built on a technology-first
            foundation, helping people make confident decisions when
            purchasing a home. We provide end-to-end guidance — from
            financial analysis and credit selection to housing evaluation and
            legal process support. Beyond our core business, Buscavi also
            serves as a launchpad for new technology ventures across
            different industries.
            <br />
            <br />I kickstarted my career as a developer and leader on this
            family project. My family has worked in real estate for years,
            and together we built this company from scratch by pairing that
            industry expertise with technology.
            <br />
            <br />I designed and developed multiple internal tools that
            helped our agents deliver a higher standard of service, guiding
            clients toward better decisions whether they were buying a home
            or investing.
          </>
        ),
      },
    ],
    [],
  );

  return (
    <section
      id="my-experience-section"
      ref={sectionRef}
      style={{ height: sectionHeight, position: "relative" }}
    >
      {/* ── Sticky viewport container ── */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {/* Progress bar */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(to right, ${COLOR_PRIMARY}, ${COLOR_PRIMARY_LIGHT})`,
            scaleX: progressScaleX,
            transformOrigin: "left center",
            zIndex: 50,
          }}
        />

        {/* ── Horizontal scrolling track ── */}
        <motion.div
          ref={trackRef}
          style={{
            x,
            display: "flex",
            alignItems: "stretch",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* ── Title slide ── */}
          <Box
            sx={{
              minWidth: { xs: "85vw", md: "52vw" },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              pl: { xs: 4, md: 10 },
              pr: 4,
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              My{" "}
              <span style={{ color: theme.palette.primary.main }}>
                Experience
              </span>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "rgba(255,255,255,0.45)", mb: 4, maxWidth: "380px" }}
            >
              A career built on passion, leadership, and continuous growth
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.15em",
                  mr: 0.5,
                }}
              >
                SCROLL TO EXPLORE
              </Typography>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], x: [0, 5, 0] }}
                  transition={{
                    duration: 1.6,
                    delay: i * 0.22,
                    repeat: Infinity,
                  }}
                  style={{
                    color: COLOR_PRIMARY,
                    fontSize: "1.3rem",
                    lineHeight: 1,
                  }}
                >
                  ›
                </motion.span>
              ))}
            </Box>
          </Box>

          {/* ── Timeline cards area ── */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "stretch",
              flexShrink: 0,
            }}
          >
            {/* Continuous horizontal line */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "2px",
                transform: "translateY(-50%)",
                background: `linear-gradient(to right, transparent, ${COLOR_PRIMARY}88 8%, ${COLOR_PRIMARY}88 92%, transparent)`,
                pointerEvents: "none",
              }}
            />

            {experiences.map((entry, index) => {
              const isAbove = index % 2 === 0;

              return (
                <Box
                  key={entry.company}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: `${CARD_WIDTH}px`,
                    flexShrink: 0,
                    mx: `${CARD_MX}px`,
                  }}
                >
                  {/* Top half */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      pb: 2,
                      width: "100%",
                    }}
                  >
                    {isAbove && <ExperienceTimelineCard {...entry} />}
                  </Box>

                  {/* Connector stem + glowing dot */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: "2px",
                        height: "52px",
                        background: isAbove
                          ? `linear-gradient(to bottom, transparent, ${COLOR_PRIMARY}cc)`
                          : "transparent",
                      }}
                    />
                    <Box
                      sx={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        bgcolor: COLOR_PRIMARY,
                        border: "3px solid rgba(255,255,255,0.85)",
                        boxShadow: `0 0 10px ${COLOR_PRIMARY}, 0 0 22px ${COLOR_PRIMARY}66`,
                        flexShrink: 0,
                      }}
                    />
                    <Box
                      sx={{
                        width: "2px",
                        height: "52px",
                        background: !isAbove
                          ? `linear-gradient(to top, transparent, ${COLOR_PRIMARY}cc)`
                          : "transparent",
                      }}
                    />
                  </Box>

                  {/* Bottom half */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      pt: 2,
                      width: "100%",
                    }}
                  >
                    {!isAbove && <ExperienceTimelineCard {...entry} />}
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* ── End cap ── */}
          <Box
            sx={{
              minWidth: { xs: "50vw", md: "30vw" },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ fontSize: "2rem", color: COLOR_PRIMARY, opacity: 0.65 }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.15em",
                }}
              >
                CONTINUE SCROLLING
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </section>
  );
};
