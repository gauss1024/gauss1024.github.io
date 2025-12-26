import { defineConfig, transformerDirectives, presetUno, presetIcons } from "unocss";
import { presetTheme } from "unocss-preset-theme";

const themes = {
  dark: {
    colors: {
      primary: "#991b1b",
      text: "#e0e0e0",
      icon: "#e0e0e0",
      bg: "#1c1c1c",
      modal: '#2d2d2d'
    },
  } as any,
  light: {
    colors: {
      primary: "#7f1d1d",
      text: "#262626",
      icon: "rgba(60,60,60,1)",
      bg: "#fdfbf7",
      modal: '#fff'
    },
  },
};

export default defineConfig({
  transformers: [transformerDirectives({ enforce: "pre" })],
  presets: [
    presetUno({
      dark: "class",

    }),
    presetTheme({
      theme: {
        dark: themes.dark,
      },
    }),
    presetIcons({
      autoInstall: true,
    }),
    // ...other presets
  ],
  theme: themes.light,
  content: {
    filesystem: [
      'src/**/*.tsx'
    ]
  }
});
