import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Container,
  HStack,
  VStack,
  Text,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function TopNav() {
  const navigate = useNavigate();
  const { student, logout, isAuthenticated } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box
      as="nav"
      bg="brand.600"
      color="white"
      py={4}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Box
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate("/")}
            _hover={{ opacity: 0.8 }}
          >
            Learning Hub
          </Box>

          <HStack spacing={6}>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  _hover={{ bg: "brand.700" }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/modules")}
                  _hover={{ bg: "brand.700" }}
                >
                  Modules
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/gamification")}
                  _hover={{ bg: "brand.700" }}
                >
                  Gamification
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/tutor")}
                  _hover={{ bg: "brand.700" }}
                >
                  Tutor
                </Button>
              </>
            )}

            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{ bg: "brand.700" }}
            />

            {isAuthenticated && student ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  cursor="pointer"
                  minW={0}
                  bg="transparent"
                  _hover={{ bg: "brand.700" }}
                >
                  <Avatar
                    size="sm"
                    name={student.name}
                    src={student.avatar_url}
                    bg="accent.500"
                  />
                </MenuButton>
                <MenuList color="neutral.900">
                  <MenuItem isDisabled>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold">{student.name}</Text>
                      <Text fontSize="sm" color="neutral.600">
                        {student.email}
                      </Text>
                    </VStack>
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
                  <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  _hover={{ bg: "brand.700" }}
                >
                  Login
                </Button>
                <Button
                  bg="accent.500"
                  _hover={{ bg: "accent.600" }}
                  onClick={() => navigate("/register")}
                  color="neutral.900"
                  fontWeight="bold"
                >
                  Sign Up
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
