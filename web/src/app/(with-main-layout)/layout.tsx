import { MainLayout } from "@/components/layouts/main-layout";

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <MainLayout>{children}</MainLayout>
);

export default Layout;
