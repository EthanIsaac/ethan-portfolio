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
            Riot Games is a videogame company, responsible for publishing some
            of the most famous games such as League of Legends, Valorant,
            Teamfight Tactics, Wild Rift and some others.
            <br />
            <br />I work with the Global Player Support team and I am
            responsible for creating new features and bug fixing of our internal
            platforms. I have proposed multiple tools and refactors to improve
            the backend services performance along with some Typescript and
            React updates for our frontend platforms.
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
            Siingly is a revolutionary Dating App that focuses on Quality Over
            Quantity.
            <br />
            <br />
            I met Daniel (my partner and CEO at Siingly) in 2019 when I started
            working at Paxico Technologies. We became partners and started
            working on this project with little to no money or investment.
            <br />
            <br />
            As the technical leader I have successfully launched the mobile app,
            website, internal dashboard platform, and our backend architecture
            using the aws and gcp platforms. Also, I implemented a CI/CD
            pipeline that allows us to distribute new versions of our
            applications in minutes.
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
            The Institutes is a company that provides courses and certifications
            for agents working on risk management and insurances.
            <br />
            <br />
            As part of the technical leadership I was responsible for the
            architectural design, prioritization and tracking of multiple
            features for the platform. I provided technical knowledge of the app
            for junior developers and was responsible for the migration of the
            components library to React + Typescript.
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
            Loadsy is a Load Testing Tool for engineering folks.
            <br />
            <br />
            Along with the Paxico Founders, we built this project from scratch
            to provide load testing capabilities to the engineering teams CI/CD
            pipeline.
            <br />
            <br />I took full responsibility for the architectural design and
            development of this project. Leading a team of 5 engineers we
            brought this project to life after 6 months of development. All the
            architecture was deployed in AWS using Kubernetes + ArgoCD for the
            backend Golang microservices and the frontent was deployed as a
            static SPA in AWS S3 with CloudFront as our CDN.
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
            Paxico is a Staff Augmentation company, but also cradle of
            entrepreneurship. So along with providing engineering force to our
            clients, we developed internal projects (such as Loadsy and
            Siingly).
            <br />
            <br />I joined as an intern back in 2019, quickly grew my knowledge
            to become a Software Engineer, then team leader and finally, due to
            my commitment, hard work and excellent skills I became partner of
            the company and led the Engineering department as Vice President of
            Engineering.
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
            The Tecnológico de Monterrey is one of the most prestigious private
            universities in Mexico, and, my Alma Máter.
            <br />
            <br />
            My skills and desire to help others sent me in the direction of
            teaching. I educated students from 15 to 18 years old to learn the
            basics or programming using a small Python library called Turtle. I
            guided them through the semester to create, from scratch, the
            conceptual design, materials, and developent of their own video
            game.
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
            Maestro is a Streaming Platform for individuals or organizations
            looking to create and broadcast content to millions of users while
            keeping the earnings for themselves, and directing the traffic to
            their own site instead of a streaming platform.
            <br />
            <br />I joined as a Software Engineer and quickly became a leader,
            designing and building with a small team of 3 people multiple of the
            features that Maestro offers nowadays, but also, some of the
            internal mechanisms to handle potential service outtages.
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
            Buscavi is a real estate company with a technological foundation
            that seeks to advise people to make the best decision in the
            purchase of their home. We offer a comprehensive service from the
            analysis of the financial situation, choice of credit, financial
            plans, analysis and choice of housing, as well as advice on legal
            processes. In addition to the main business, Buscavi is the cradle
            of entrepreneurship, which is why we create and develop
            technological projects in different areas.
            <br />
            <br />I kickstarted my career as developer and leader with a small
            familiar project. My family has been in the industry of real estate
            for years and with my technological knowledge we built this company
            from scratch.
            <br />
            <br />I designed and developer multiple internal tools to allow our
            real estate agents to provide a better quality of service to our
            clients. Those tools were designed to help clients make a better
            choice, depending of their intentions, either for buying a home or
            investing.
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
