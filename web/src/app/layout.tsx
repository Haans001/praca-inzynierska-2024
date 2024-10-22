import { MainLayout } from "@/components/layouts/main-layout";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import theme from "@/theme";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ReactQueryProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <MainLayout>{props.children}</MainLayout>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
