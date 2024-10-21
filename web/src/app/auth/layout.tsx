import { AuthLayout } from "@/components/layouts/auth-layout";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
