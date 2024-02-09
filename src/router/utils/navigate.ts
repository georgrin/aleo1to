import { MouseEvent } from "react";

// Navigate function to change the URL without reloading the page
export const navigate = (e: MouseEvent, url: string) => {
  e.preventDefault();
  window.history.pushState({}, "", url);

  const navEvent = new PopStateEvent("popstate");
  window.dispatchEvent(navEvent);
};
