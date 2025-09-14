"use client";

import { useEffect, useState } from "react";

const AnimationLottie = ({ animationPath, width }) => {
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    // Dynamically import lottie-react only in the browser
    import("lottie-react").then((mod) => setLottie(() => mod.default));
  }, []);

  if (!Lottie) return null; // or a loader

  return (
    <Lottie
      loop
      autoplay
      animationData={animationPath}
      style={{ width: width || "95%" }}
    />
  );
};

export default AnimationLottie;
