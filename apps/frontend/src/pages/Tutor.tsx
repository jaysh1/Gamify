import { Container, Heading, Text, VStack, Box, useColorModeValue, Button } from "@chakra-ui/react";

export default function Tutor() {
  const bg = useColorModeValue("neutral.50", "neutral.800");

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            AI Tutor
          </Heading>
          <Text fontSize="lg" color="neutral.600">
            Get personalized help from our intelligent tutoring system
          </Text>
        </Box>

        <Box p={8} bg={bg} borderRadius="lg" minH="300px">
          <VStack spacing={4} height="100%" justify="center">
            <Heading size="md">Tutor Chat Interface</Heading>
            <Text color="neutral.600" textAlign="center">
              Ask any questions about your learning materials and get instant help
            </Text>
            <Button colorScheme="brand" size="lg">
              Start Tutoring Session
            </Button>
          </VStack>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>
            Frequently Asked Questions
          </Heading>
          <VStack spacing={3}>
            <Box p={4} bg={bg} borderRadius="lg">
              <Heading size="sm" mb={2}>
                How do I get started?
              </Heading>
              <Text color="neutral.600">You can ask me anything related to your modules.</Text>
            </Box>
            <Box p={4} bg={bg} borderRadius="lg">
              <Heading size="sm" mb={2}>
                Can I save conversations?
              </Heading>
              <Text color="neutral.600">Coming soon - save and review past tutoring sessions.</Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
