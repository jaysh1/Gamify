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

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name) {
      setError("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(email, password, name, studentClass);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} as="form" onSubmit={handleSubmit}>
        <Box textAlign="center">
          <Heading as="h1" size="xl">
            Create Account
          </Heading>
        </Box>

        {(error || authError) && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error || authError}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Class/Grade</FormLabel>
          <Input
            type="text"
            placeholder="e.g., Class 10A"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            isDisabled={isLoading}
          />
        </FormControl>

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
            placeholder="At least 6 characters"
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
          {isLoading ? <Spinner size="sm" /> : "Create Account"}
        </Button>

        <Box textAlign="center" fontSize="sm">
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="brand.500" fontWeight="bold">
            Sign in
          </ChakraLink>
        </Box>
      </VStack>
    </Container>
  );
}
