import * as React from "jsx-dom";

export const mountThemeToggle = (selector: string) => {
  const btn = document.querySelector(selector);
  if (!btn) return;

  const isDark = () => document.documentElement.classList.contains("dark");
  
  const toggle = () => {
    const dark = isDark();
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    updateIcon();
  };

  const updateIcon = () => {
    const dark = isDark();
    // Assuming the button has an icon child
    const icon = btn.querySelector("div");
    if (icon) {
      icon.className = dark ? "i-ri:moon-line text-xl" : "i-ri:sun-line text-xl";
    }
  };

  btn.addEventListener("click", toggle);
  updateIcon();
};
