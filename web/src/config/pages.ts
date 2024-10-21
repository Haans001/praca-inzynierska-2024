export const authPages = {
  login: { route: "/auth/login", title: "Zaloguj się" },
  signup: { route: "/auth/signup", title: "Zarejestruj się" },
} as const;

export const pages = {
  auth: authPages,
} as const;
