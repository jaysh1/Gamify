import { Box } from "@chakra-ui/react";
import TopNav from "./TopNav";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <TopNav />
      <Box as="main" flex={1}>
        {children}
      </Box>
    </Box>
  );
}
