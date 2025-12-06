import { Container, Heading, Text, VStack, SimpleGrid, Box, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

function PlaceholderCard({ title, description }: { title: string; description: string }) {
  const bg = useColorModeValue("neutral.50", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");

  return (
    <Box
      p={8}
      border="2px"
      borderColor={borderColor}
      borderRadius="lg"
      bg={bg}
      textAlign="center"
      minH="200px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading size="md" mb={4}>
        {title}
      </Heading>
      <Text color="neutral.600">{description}</Text>
    </Box>
  );
}

export default function Dashboard() {
  const { student } = useAuth();

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={12} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            Welcome, {student?.name}!
          </Heading>
          <Text fontSize="lg" color="neutral.600">
            This is your personalized learning dashboard.
          </Text>
        </Box>

        <SimpleGrid columns={[1, 2]} spacing={6}>
          <PlaceholderCard
            title="Recent Modules"
            description="Your active learning modules will appear here"
          />
          <PlaceholderCard title="Progress" description="Track your learning progress here" />
          <PlaceholderCard title="Achievements" description="Badges and milestones you've earned" />
          <PlaceholderCard title="Recommendations" description="Personalized learning suggestions" />
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
