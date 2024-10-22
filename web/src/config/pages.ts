export const authPages = {
  login: { route: "/auth/login", title: "Zaloguj się" },
  signup: { route: "/auth/signup", title: "Zarejestruj się" },
} as const;

export const dashboardPages = {
  mainPage: { route: "/", title: "Strona główna" },
  authRedirect: { route: "/auth-redirect", title: "Przekierowanie" },
};

export const pages = {
  auth: authPages,
  dashboard: dashboardPages,
} as const;
