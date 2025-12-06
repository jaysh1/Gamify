import { Container, Heading, Text, VStack, Box, useColorModeValue } from "@chakra-ui/react";

function LeaderboardCard({ rank, name, points }: { rank: number; name: string; points: number }) {
  const bg = useColorModeValue("neutral.50", "neutral.800");

  return (
    <Box p={4} bg={bg} borderRadius="lg" display="flex" justifyContent="space-between" alignItems="center">
      <Heading size="sm">#{rank}</Heading>
      <Text fontWeight="bold">{name}</Text>
      <Text color="accent.500" fontWeight="bold">
        {points} pts
      </Text>
    </Box>
  );
}

export default function Gamification() {
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            Gamification & Challenges
          </Heading>
          <Text fontSize="lg" color="neutral.600">
            Earn points, unlock achievements, and compete on leaderboards
          </Text>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>
            Leaderboard
          </Heading>
          <VStack spacing={2}>
            <LeaderboardCard rank={1} name="Student 1" points={2500} />
            <LeaderboardCard rank={2} name="Student 2" points={2300} />
            <LeaderboardCard rank={3} name="Student 3" points={2100} />
            <LeaderboardCard rank={4} name="Student 4" points={1900} />
            <LeaderboardCard rank={5} name="Student 5" points={1700} />
          </VStack>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>
            Your Badges
          </Heading>
          <Text color="neutral.600">Badges will appear here as you complete challenges</Text>
        </Box>
      </VStack>
    </Container>
  );
}
