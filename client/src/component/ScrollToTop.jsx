import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll to the top-left corner of the window
    window.scrollTo(0, 0);
  }, [pathname]); // Trigger this effect every time the path changes

  return null;
};

export default ScrollToTop;