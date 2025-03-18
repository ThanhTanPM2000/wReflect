import logger from '../logger';
import prisma from '../prisma';

const templatesData = [
  {
    id: 'txt_health_check_template_default',
    title: 'Health Check Template',
    isDefault: true,
    questions: [
      {
        id: 'txt_template_question_1',
        title: 'Objective',
        color: 'orange',
        description:
          'Bad: Objectives are not clear, specific, lack of commitment \nGood: Objectives are identified clearly, fully committed by all members.',
      },
      {
        id: 'txt_template_question_2',
        title: 'Roles & Responsibilities',
        color: 'blue',
        description:
          'Bad: The roles and responsibilities of each team member are not identified and shared clearly.\nGood: The roles and responsibilities of each team member are clear to everyone.',
      },
      {
        id: 'txt_template_question_3',
        title: 'Openness',
        color: 'purple',
        description:
          'Bad: When it comes to conversation and work, members are cautious.\nGood: In discussion and work, members are allowed to share their ideas, opinions, and thoughts.',
      },
      {
        id: 'txt_template_question_4',
        title: 'Trust',
        color: 'pink',
        description: 'Bad: Members have doubts and mistrust for one another.\nGood: Members trust each other.',
      },
      {
        id: 'txt_template_question_5',
        title: 'Conflict & Differentiation',
        color: 'green',
        description:
          'Bad: While working, members are either passive or try to avoid disputes and disagreements.\nGood: Members openly discuss problems and disagreements in order to find the best solution.',
      },
      {
        id: 'txt_template_question_6',
        title: 'Collaboration',
        color: 'lpink',
        description:
          'Bad: Members passively request to cooperate or aid.\nGood: Members actively coordinate with each other.',
      },
      {
        id: 'txt_template_question_7',
        title: 'Contribution',
        color: 'lblue',
        description:
          'Bad: A few members control the discussion and working process.\nGood: In conversations and tasks, all members actively participate.',
      },
      {
        id: 'txt_template_question_8',
        title: 'Decisions',
        color: 'orange',
        description:
          'Bad: A few members control the decision-making.\nGood: In decision-making, all members actively participate.',
      },
      {
        id: 'txt_template_question_9',
        title: 'Flexibility',
        color: 'blue',
        description:
          'Bad: Members are forced to strict regulations and principles.\nGood: Members flexibly adjust working rules to adapt to emergent conditions.',
      },
      {
        id: 'txt_template_question_10',
        title: 'Resources',
        color: 'purple',
        description:
          "Bad: Each individual's ability and experience are underutilized.\nGood: Each individual's ability and experience are put to the best possible use.",
      },
      {
        id: 'txt_template_question_11',
        title: 'Fun',
        color: 'pink',
        description:
          "Bad: We don't enjoy our work and look forward to coming to work.\nGood: We love going to work and have great fun working together.",
      },
      {
        id: 'txt_template_question_12',
        title: 'Learning',
        color: 'green',
        description:
          "Bad: We never have time to learn anything.\nGood: We're learning lots of interesting stuff all the time.",
      },
    ],
  },
];

(async () => {
  try {
    const question = templatesData[0].questions?.map((question) => ({
      id: question?.id,
      title: question?.title,
      description: question?.description,
      color: question?.color,
    }));
    const creatingTemplateHealthCheck = await prisma?.healthCheckTemplate?.create({
      data: {
        id: templatesData[0].id,
        title: templatesData[0].title,
        isDefault: true,
        healthCheckQuestions: {
          create: [...question],
        },
      },
    });
    logger.info('Creating template questions data successfully', creatingTemplateHealthCheck);
  } catch (error) {
    logger.error('Error occurred: ', error);
  }
})();
