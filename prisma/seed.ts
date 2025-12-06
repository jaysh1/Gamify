import { prisma } from '../src/lib/prisma';
import { initializeBadges } from '../src/services/badgeService';

async function main() {
  // Clear existing data
  await prisma.userBadge.deleteMany({});
  await prisma.xPTransaction.deleteMany({});
  await prisma.streakLog.deleteMany({});
  await prisma.userLevel.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.studentMilestone.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.masteryMilestone.deleteMany({});
  await prisma.mediaAsset.deleteMany({});
  await prisma.interactiveComponent.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a subject
  const subject = await prisma.subject.create({
    data: {
      name: 'Year 8 Dooren Syllabus',
      code: 'Y8-DOOR',
      description: 'Comprehensive Year 8 curriculum following the Dooren framework',
    },
  });

  // Create first module
  const module1 = await prisma.module.create({
    data: {
      name: 'Module 1: Introduction to Sustainability',
      description: 'Learn the fundamentals of sustainable development and its importance in today\'s world',
      subjectId: subject.id,
      order: 1,
    },
  });

  // Create lessons for Module 1
  const lesson1_1 = await prisma.lesson.create({
    data: {
      title: 'What is Sustainability?',
      description: 'Understanding the concept of sustainability',
      moduleId: module1.id,
      order: 1,
      content: 'Sustainability is the practice of using resources in a way that does not deplete them for future generations. It involves balancing environmental protection, social equity, and economic growth. In this lesson, we explore the three pillars of sustainability: environmental, social, and economic.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 12,
      mediaAssets: {
        create: [
          {
            type: 'video',
            url: 'https://example.com/videos/sustainability-intro.mp4',
            title: 'What is Sustainability?',
            metadata: JSON.stringify({ duration: 720, width: 1920, height: 1080 }),
            order: 1,
          },
          {
            type: 'image',
            url: 'https://example.com/images/sustainability-pillars.png',
            title: 'Three Pillars of Sustainability',
            metadata: JSON.stringify({ width: 800, height: 600 }),
            order: 2,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'Sustainability Quiz',
            prompt: 'What are the three pillars of sustainability?',
            options: JSON.stringify([
              { text: 'Environmental, Social, Economic', correct: true },
              { text: 'Political, Social, Cultural', correct: false },
              { text: 'Environmental, Industrial, Agricultural', correct: false },
              { text: 'Social, Economic, Religious', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'reflection_prompt',
            title: 'Reflection: Your Role',
            prompt: 'How can you contribute to sustainability in your daily life? List three specific actions.',
            order: 2,
          },
        ],
      },
    },
  });

  const lesson1_2 = await prisma.lesson.create({
    data: {
      title: 'Climate Change and Its Impact',
      description: 'Explore the causes and consequences of climate change',
      moduleId: module1.id,
      order: 2,
      content: 'Climate change refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities such as burning fossil fuels. The increase in greenhouse gases like CO2 leads to global warming, which has far-reaching consequences including rising sea levels, extreme weather events, and biodiversity loss.',
      videoUrl: 'https://www.youtube.com/embed/0T-s3_3wFEQ',
      duration: 15,
      mediaAssets: {
        create: [
          {
            type: 'video',
            url: 'https://example.com/videos/climate-change.mp4',
            title: 'Climate Change Overview',
            metadata: JSON.stringify({ duration: 900, width: 1920, height: 1080 }),
            order: 1,
          },
          {
            type: 'image',
            url: 'https://example.com/images/carbon-cycle.png',
            title: 'The Carbon Cycle',
            metadata: JSON.stringify({ width: 800, height: 600 }),
            order: 2,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'Climate Change Facts Quiz',
            prompt: 'What is the primary cause of climate change?',
            options: JSON.stringify([
              { text: 'Natural cyclical patterns', correct: false },
              { text: 'Human activities and fossil fuels', correct: true },
              { text: 'Solar radiation variation', correct: false },
              { text: 'Volcanic eruptions', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'reflection_prompt',
            title: 'Reflection: Local Impact',
            prompt: 'What climate-related changes have you noticed in your local area?',
            order: 2,
          },
        ],
      },
    },
  });

  const lesson1_3 = await prisma.lesson.create({
    data: {
      title: 'Sustainable Development Goals (SDGs)',
      description: 'Introduction to the UN Sustainable Development Goals',
      moduleId: module1.id,
      order: 3,
      content: 'The United Nations Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure that all people enjoy peace and prosperity by 2030. There are 17 SDGs that address global challenges including poverty, hunger, health, education, climate change, and more.',
      videoUrl: 'https://www.youtube.com/embed/oJ2tEluBIrU',
      duration: 10,
      mediaAssets: {
        create: [
          {
            type: 'image',
            url: 'https://example.com/images/sdg-wheel.png',
            title: 'The 17 Sustainable Development Goals',
            metadata: JSON.stringify({ width: 1000, height: 1000 }),
            order: 1,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'SDG Quiz',
            prompt: 'How many Sustainable Development Goals are there?',
            options: JSON.stringify([
              { text: '10', correct: false },
              { text: '15', correct: false },
              { text: '17', correct: true },
              { text: '20', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'discussion',
            title: 'SDG Discussion',
            prompt: 'Which SDG do you think is most important for your community? Why?',
            order: 2,
          },
        ],
      },
    },
  });

  // Create second module
  const module2 = await prisma.module.create({
    data: {
      name: 'Module 2: Renewable Energy Sources',
      description: 'Explore renewable energy alternatives and their role in sustainable development',
      subjectId: subject.id,
      order: 2,
    },
  });

  // Create lessons for Module 2
  const lesson2_1 = await prisma.lesson.create({
    data: {
      title: 'Solar Energy',
      description: 'Understanding solar power and its applications',
      moduleId: module2.id,
      order: 1,
      content: 'Solar energy is radiant light and heat from the Sun that is harnessed using a range of ever-evolving technologies. Solar power can be used for heating, cooling, electricity generation, and even desalination. Photovoltaic (PV) cells convert sunlight directly into electricity, while solar thermal systems use the sun\'s heat for warming water or air.',
      videoUrl: 'https://www.youtube.com/embed/KNqVjvPLa3A',
      duration: 14,
      mediaAssets: {
        create: [
          {
            type: 'video',
            url: 'https://example.com/videos/solar-energy.mp4',
            title: 'Solar Energy Explained',
            metadata: JSON.stringify({ duration: 840, width: 1920, height: 1080 }),
            order: 1,
          },
          {
            type: 'image',
            url: 'https://example.com/images/solar-panel.png',
            title: 'Solar Panel Cross Section',
            metadata: JSON.stringify({ width: 800, height: 600 }),
            order: 2,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'Solar Energy Quiz',
            prompt: 'What do PV cells stand for?',
            options: JSON.stringify([
              { text: 'Power Voltage cells', correct: false },
              { text: 'Photovoltaic cells', correct: true },
              { text: 'Photon Verification cells', correct: false },
              { text: 'Panel Volt cells', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'reflection_prompt',
            title: 'Reflection: Solar Potential',
            prompt: 'Could solar panels be installed on your school? What would be the benefits?',
            order: 2,
          },
        ],
      },
    },
  });

  const lesson2_2 = await prisma.lesson.create({
    data: {
      title: 'Wind Energy',
      description: 'How wind power is generated and utilized',
      moduleId: module2.id,
      order: 2,
      content: 'Wind energy is the process of using wind to generate electricity using wind turbines. Wind turbines convert the kinetic energy of wind into mechanical energy, which is then converted into electrical energy. Wind farms can be located on land (onshore) or at sea (offshore), with offshore wind farms having access to stronger and more consistent winds.',
      videoUrl: 'https://www.youtube.com/embed/Xqlx5-9Z2Yk',
      duration: 13,
      mediaAssets: {
        create: [
          {
            type: 'video',
            url: 'https://example.com/videos/wind-energy.mp4',
            title: 'Wind Energy Generation',
            metadata: JSON.stringify({ duration: 780, width: 1920, height: 1080 }),
            order: 1,
          },
          {
            type: 'image',
            url: 'https://example.com/images/wind-turbine.png',
            title: 'Modern Wind Turbine',
            metadata: JSON.stringify({ width: 800, height: 600 }),
            order: 2,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'Wind Energy Quiz',
            prompt: 'Which type of wind farm typically has stronger winds?',
            options: JSON.stringify([
              { text: 'Onshore', correct: false },
              { text: 'Offshore', correct: true },
              { text: 'Both are equal', correct: false },
              { text: 'Underground', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'reflection_prompt',
            title: 'Reflection: Wind in Your Region',
            prompt: 'Does your region have potential for wind energy development? Why or why not?',
            order: 2,
          },
        ],
      },
    },
  });

  const lesson2_3 = await prisma.lesson.create({
    data: {
      title: 'Hydroelectric and Other Renewables',
      description: 'Exploring hydroelectric, geothermal, and biomass energy',
      moduleId: module2.id,
      order: 3,
      content: 'Hydroelectric power harnesses the energy of flowing water to generate electricity through dams and water turbines. Geothermal energy comes from the heat inside the Earth and can be used for electricity generation and heating. Biomass energy comes from organic materials and can be converted to electricity, heat, or biofuels. Each renewable source has unique advantages and challenges.',
      videoUrl: 'https://www.youtube.com/embed/VGXbkVjF1B4',
      duration: 16,
      mediaAssets: {
        create: [
          {
            type: 'video',
            url: 'https://example.com/videos/renewables-overview.mp4',
            title: 'Alternative Renewable Energy Sources',
            metadata: JSON.stringify({ duration: 960, width: 1920, height: 1080 }),
            order: 1,
          },
          {
            type: 'image',
            url: 'https://example.com/images/energy-comparison.png',
            title: 'Renewable Energy Comparison',
            metadata: JSON.stringify({ width: 1000, height: 600 }),
            order: 2,
          },
        ],
      },
      interactiveComponents: {
        create: [
          {
            type: 'quiz',
            title: 'Renewable Energy Quiz',
            prompt: 'Which energy source comes from the heat inside the Earth?',
            options: JSON.stringify([
              { text: 'Solar', correct: false },
              { text: 'Geothermal', correct: true },
              { text: 'Wind', correct: false },
              { text: 'Biomass', correct: false },
            ]),
            order: 1,
          },
          {
            type: 'discussion',
            title: 'Energy Future Discussion',
            prompt: 'Which renewable energy source do you think has the most potential? Explain your reasoning.',
            order: 2,
          },
        ],
      },
    },
  });

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      name: 'Alice Smith',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      name: 'Bob Johnson',
    },
  });

  // Create mastery milestones
  const milestone1 = await prisma.masteryMilestone.create({
    data: {
      name: 'Getting Started',
      description: 'Completed your first lesson',
      threshold: 0,
    },
  });

  const milestone2 = await prisma.masteryMilestone.create({
    data: {
      name: 'Module Master',
      description: 'Completed all lessons in a module',
      threshold: 100,
    },
  });

  const milestone3 = await prisma.masteryMilestone.create({
    data: {
      name: 'Sustainability Expert',
      description: 'Completed all modules with 90%+ progress',
      threshold: 90,
    },
  });

  // Create lesson progress for user1
  await prisma.lessonProgress.create({
    data: {
      userId: user1.id,
      lessonId: lesson1_1.id,
      completed: true,
      progress: 100,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: user1.id,
      lessonId: lesson1_2.id,
      completed: true,
      progress: 100,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: user1.id,
      lessonId: lesson1_3.id,
      completed: false,
      progress: 65,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: user1.id,
      lessonId: lesson2_1.id,
      completed: false,
      progress: 30,
    },
  });

  // Create lesson progress for user2
  await prisma.lessonProgress.create({
    data: {
      userId: user2.id,
      lessonId: lesson1_1.id,
      completed: true,
      progress: 100,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: user2.id,
      lessonId: lesson1_2.id,
      completed: false,
      progress: 45,
    },
  });

  // Create student milestones for user1
  await prisma.studentMilestone.create({
    data: {
      userId: user1.id,
      milestoneId: milestone1.id,
      achievedAt: new Date(),
    },
  });

  // Initialize badges
  await initializeBadges();

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
