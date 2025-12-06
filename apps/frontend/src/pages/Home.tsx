import { Container, Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            Welcome to Learning Hub
          </Heading>
          <Text fontSize="lg" color="neutral.600" maxW="2xl" mx="auto">
            An accessible, interactive learning platform designed with WCAG AA compliance in mind.
          </Text>
        </Box>

        {!isAuthenticated && (
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="brand"
              onClick={() => navigate("/login")}
              fontSize="md"
              px={8}
            >
              Login
            </Button>
            <Button
              size="lg"
              colorScheme="accent"
              onClick={() => navigate("/register")}
              fontSize="md"
              px={8}
              color="neutral.900"
            >
              Sign Up
            </Button>
          </HStack>
        )}

        {isAuthenticated && (
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="brand"
              onClick={() => navigate("/dashboard")}
              fontSize="md"
              px={8}
            >
              Go to Dashboard
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
}
