export const authPages = {
  login: { route: "/auth/login", title: "Zaloguj się" },
  signup: { route: "/auth/signup", title: "Zarejestruj się" },
} as const;

export const protectedPages = {
  authRedirect: { route: "/auth-redirect", title: "Przekierowanie" },
  reservation: { route: "/reservation", title: "Rezerwacja" },
  profile: { route: "/profile", title: "Profil" },
};

export const publicPages = {
  repertoire: { route: "/repertoire", title: "Repertuar" },
  mainPage: { route: "/", title: "Strona główna" },
};

export const adminPages = {
  movies: { route: "/admin/movies", title: "Baza filmów" },
  clientsReservation: { route: "/admin/clients-reservation", title: "Rezerwacje klientów" }
};

export const pages = {
  auth: authPages,
  protectedPages: protectedPages,
  publicPages: publicPages,
  admin: adminPages,
} as const;
