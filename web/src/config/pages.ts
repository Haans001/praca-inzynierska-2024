export const authPages = {
  login: { route: "/auth/login", title: "Zaloguj się" },
  signup: { route: "/auth/signup", title: "Zarejestruj się" },
} as const;

export const dashboardPages = {
  mainPage: { route: "/", title: "Strona główna" },
  authRedirect: { route: "/auth-redirect", title: "Przekierowanie" },
  repertoire: { route: "/repertoire", title: "Repertuar" },
  reservation: { route: "/reservation", title: "Rezerwacja" },
  profile: { route: "/profile", title: "Profil" },
};

export const adminPages = {
  movies: { route: "/admin/movies", title: "Baza filmów" },
};

export const pages = {
  auth: authPages,
  dashboard: dashboardPages,
  admin: adminPages,
} as const;
