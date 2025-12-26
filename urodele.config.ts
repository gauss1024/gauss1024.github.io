export const config = {
  github: {
    login: "gauss1024", // github login name, not user name
    repo: "gauss1024.github.io", //"urodele",
    logInUrl: "",
    logInAuthUrl: "",
  },
  head: {
    title: "Redshift",
    brand: "Proletarier aller Länder, vereinigt euch!",
    description: "Proletarier aller Länder, vereinigt euch!",
  },
  footer: {
    copyright: "© gauss1024",
    copyrightUrl: "https://github.com/gauss1024",
  },
  pagination: {
    size: 10,
  },
  giscus: false as object | true,
} as const;

export default config;
