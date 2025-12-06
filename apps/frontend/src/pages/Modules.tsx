import { Container, Heading, Text, VStack, SimpleGrid, Box, useColorModeValue } from "@chakra-ui/react";

function ModuleCard({ title, description }: { title: string; description: string }) {
  const bg = useColorModeValue("neutral.50", "neutral.800");
  const borderColor = useColorModeValue("neutral.200", "neutral.700");

  return (
    <Box
      p={6}
      border="2px"
      borderColor={borderColor}
      borderRadius="lg"
      bg={bg}
      cursor="pointer"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="neutral.600">{description}</Text>
    </Box>
  );
}

export default function Modules() {
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            Learning Modules
          </Heading>
          <Text fontSize="lg" color="neutral.600">
            Explore our comprehensive collection of learning modules
          </Text>
        </Box>

        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          <ModuleCard
            title="Module 1"
            description="Placeholder module - content coming soon"
          />
          <ModuleCard
            title="Module 2"
            description="Placeholder module - content coming soon"
          />
          <ModuleCard
            title="Module 3"
            description="Placeholder module - content coming soon"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
