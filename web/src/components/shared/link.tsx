import { Button, ButtonProps } from "@mui/material";
import NextLink from "next/link";

interface LinkProps extends ButtonProps, React.PropsWithChildren<{}> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, sx, ...props }) => (
  <NextLink href={href} passHref>
    <Button
      sx={{
        textTransform: "none",
        textDecoration: "none",
        gap: "0.5rem",
        color: "white",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  </NextLink>
);
