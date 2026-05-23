"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Phase 1 (0 → 0.45): card tilts flat — rotate 20° → 0°, scale to normal
  // Phase 2 (0.45 → 1):  card shrinks so heading + annotations become visible
  const rotate = useTransform(scrollYProgress, [0, 0.45, 1], [20, 0, 0]);

  const scaleDesktop = useTransform(scrollYProgress, [0, 0.45, 1], [1.05, 1.0, 0.78]);
  const scaleMobile  = useTransform(scrollYProgress, [0, 0.45, 1], [0.7,  0.9,  0.72]);

  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    /* Outer div sets the scroll distance — keep same proportions as 21st.dev */
    <div
      ref={containerRef}
      style={{
        height: isMobile ? "55rem" : "72rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: isMobile ? "8px" : "80px",
      }}
    >
      {/* Perspective must live here, on the inner div — matches 21st.dev */}
      <div
        style={{
          paddingTop:    isMobile ? "40px" : "160px",
          paddingBottom: isMobile ? "40px" : "160px",
          width: "100%",
          position: "relative",
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card
          rotate={rotate}
          translate={translate}
          scale={isMobile ? scaleMobile : scaleDesktop}
          isMobile={isMobile}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div
    style={{
      translateY: translate,
      maxWidth: "64rem",
      margin: "0 auto",
      textAlign: "center" as const,
      marginBottom: "2rem",
    }}
  >
    {titleComponent}
  </motion.div>
);

export const Card = ({
  rotate,
  scale,
  isMobile,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  isMobile: boolean;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      /* original 21st.dev shadow */
      boxShadow:
        "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      maxWidth: "64rem",
      marginTop: "-3rem",   /* -mt-12 from original */
      marginLeft: "auto",
      marginRight: "auto",
      height: isMobile ? "26rem" : "34rem",
      width: "100%",
      border: "4px solid #4a4a4a",
      padding: isMobile ? "8px" : "12px",
      background: "#1c1c1c",
      borderRadius: "30px",
    }}
  >
    {/* inner screen */}
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        borderRadius: "20px",
        background: "var(--paper)",
      }}
    >
      {children}
    </div>
  </motion.div>
);
