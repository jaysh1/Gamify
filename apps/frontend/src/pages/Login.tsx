import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Box textAlign="center">
          <Heading as="h1" size="xl">
            Sign In
          </Heading>
        </Box>

        {(error || authError) && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error || authError}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>

        <Button
          type="submit"
          width="full"
          colorScheme="brand"
          size="lg"
          isDisabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Sign In"}
        </Button>

        <Box textAlign="center" fontSize="sm">
          Don't have an account?{" "}
          <ChakraLink as={Link} to="/register" color="brand.500" fontWeight="bold">
            Create one
          </ChakraLink>
        </Box>
      </VStack>
    </Container>
  );
}
