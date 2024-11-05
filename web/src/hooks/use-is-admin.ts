"use client";

import { useUser } from "@clerk/nextjs";

export const useIsAdmin = () => {
  const { user, isLoaded } = useUser();

  const isAdmin = user?.publicMetadata.role === "ADMIN";

  return { isAdmin, isLoaded };
};
