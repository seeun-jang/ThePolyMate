import { useEffect, useState } from "react";

function currentRoute() {
  const [path, query = ""] = (window.location.hash.slice(1) || "/").split("?");
  return {
    path,
    topic:
      new URLSearchParams(query).get("topic") === "health" ? "health" : "study",
  };
}
export function useRoute() {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const change = () => {
      setRoute(currentRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  return route;
}
export const navigate = (path) => {
  window.location.hash = path;
};

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
