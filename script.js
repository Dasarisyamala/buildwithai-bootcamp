/* ============================================
   AI Study Buddy – Professional Application Logic
   ============================================ */

;(function () {
  'use strict';

  // ─── DOM Elements ───
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const topicInput = $('#topic-input');
  const generateBtn = $('#generate-btn');
  const clearBtn = $('#clear-btn');
  const loadingSection = $('#loading-section');
  const resultsSection = $('#results-section');
  const loadingStatus = $('#loading-status');
  const loadingBarFill = $('#loading-bar-fill');
  const topicNameEl = $('#topic-name');
  const copyAllBtn = $('#copy-all-btn');
  const downloadBtn = $('#download-btn');
  const newTopicBtn = $('#new-topic-btn');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  const themeToggle = $('#theme-toggle');
  const historySection = $('#history-section');
  const historyChips = $('#history-chips');
  const historyClearBtn = $('#history-clear-btn');
  const revealAllBtn = $('#reveal-all-btn');
  const resetQuizBtn = $('#reset-quiz-btn');
  const backToTopBtn = $('#back-to-top');
  const kbdHint = $('#kbd-hint');
  const statTopics = $('#stat-topics');

  // ─── State ───
  let currentTopic = '';
  let currentData = null;
  let topicsGenerated = parseInt(localStorage.getItem('sb_topics_count') || '0', 10);
  let searchHistory = JSON.parse(localStorage.getItem('sb_history') || '[]');

  // ─── Initialize ───
  function init() {
    updateStatCounter();
    renderHistory();
    loadTheme();
    showKbdHint();

    // Animate stat counter on load
    animateCounter(statTopics, topicsGenerated, 1200);
  }

  // ─── Sample Study Data ───
  const sampleData = {
    default: (topic) => ({
      explanation: `${topic} is a fascinating and important subject that spans multiple areas of knowledge. At its core, it involves understanding fundamental principles that govern how things work in this domain. Students who master ${topic} develop critical thinking skills and gain practical knowledge applicable in academic settings and real-world situations. The study of ${topic} has evolved significantly over the years, incorporating modern insights and methodologies that make it more accessible and relevant than ever before. Researchers and educators continue to explore new dimensions of ${topic}, revealing its interconnection with various other disciplines and its impact on our daily lives.`,
      keyPoints: [
        `${topic} is built upon foundational principles that connect theory with practical applications, making it essential for a well-rounded education.`,
        `Understanding ${topic} requires both conceptual clarity and the ability to analyze specific examples and case studies in context.`,
        `Modern research in ${topic} has introduced new frameworks and perspectives that challenge traditional understanding and open new possibilities.`,
        `${topic} intersects with several other disciplines, creating opportunities for interdisciplinary study and innovative problem-solving approaches.`,
        `Mastering ${topic} can lead to diverse career opportunities and a deeper appreciation of the complex systems that shape our world.`
      ],
      quiz: [
        { q: `What is the primary focus of studying ${topic}?`, a: `Understanding the fundamental principles and concepts that define ${topic} and applying them in practical contexts.` },
        { q: `How has the study of ${topic} evolved in recent decades?`, a: `It has incorporated modern research, technology, and interdisciplinary approaches to provide deeper and more nuanced understanding.` },
        { q: `Name one practical application of knowledge in ${topic}.`, a: `Knowledge of ${topic} can be applied in problem-solving, decision-making, and innovation across various professional fields.` },
        { q: `Why is ${topic} considered interdisciplinary?`, a: `Because it connects with multiple other fields of study, allowing for cross-pollination of ideas and holistic understanding.` },
        { q: `What skills does studying ${topic} help develop?`, a: `Critical thinking, analytical reasoning, research methodology, and the ability to synthesize complex information.` }
      ],
      summary: `${topic} is a vital area of study that combines theoretical foundations with practical applications. It has evolved to include modern research and interdisciplinary connections, making it relevant across multiple fields. Students who engage deeply with ${topic} develop essential critical thinking and analytical skills that serve them throughout their academic and professional careers.`,
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: `Start by reading introductory material on ${topic}. Focus on understanding core definitions, key terminology, and the historical context. Take structured notes and create a concept map connecting the main ideas.` },
        { title: 'Deep Dive & Practice (Day 4–6)', description: `Study detailed explanations, work through examples and case studies, and attempt practice problems. Watch educational videos and engage with interactive resources to reinforce your understanding of ${topic}.` },
        { title: 'Review & Master (Day 7)', description: `Take the quiz above, review your notes, and identify weak areas. Teach the concepts to someone else or write a summary in your own words. Create flashcards for key facts and revisit them regularly.` }
      ]
    }),

    'photosynthesis': {
      explanation: `Photosynthesis is the remarkable biological process by which green plants, algae, and certain bacteria convert light energy — primarily from the Sun — into chemical energy stored in glucose. This process takes place mainly in the chloroplasts of plant cells, using a green pigment called chlorophyll. During photosynthesis, plants absorb carbon dioxide (CO₂) from the air through tiny pores called stomata and water (H₂O) from the soil through their roots. Using sunlight as an energy source, they transform these simple inorganic molecules into glucose (C₆H₁₂O₆) and release oxygen (O₂) as a byproduct. The overall equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process is the foundation of nearly all food chains on Earth.`,
      keyPoints: [
        'Photosynthesis occurs in two main stages: the Light-Dependent Reactions (in thylakoid membranes) and the Calvin Cycle or Light-Independent Reactions (in the stroma of chloroplasts).',
        'Chlorophyll, the green pigment in chloroplasts, absorbs red and blue light most efficiently while reflecting green light — this is why leaves appear green to our eyes.',
        'The process produces glucose for the plant\'s energy needs and releases oxygen as a byproduct — the oxygen we breathe comes largely from photosynthesis.',
        'Factors like light intensity, CO₂ concentration, temperature, and water availability directly affect the rate of photosynthesis in a measurable way.',
        'Photosynthesis is the foundation of nearly all food chains on Earth, converting solar energy into chemical energy that sustains life in virtually every ecosystem.'
      ],
      quiz: [
        { q: 'What is the overall chemical equation for photosynthesis?', a: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂' },
        { q: 'Where do the light-dependent reactions of photosynthesis occur?', a: 'In the thylakoid membranes of the chloroplasts.' },
        { q: 'What is the role of chlorophyll in photosynthesis?', a: 'Chlorophyll absorbs sunlight (primarily red and blue wavelengths) and converts it into chemical energy to drive the photosynthetic reactions.' },
        { q: 'What are the two main products of photosynthesis?', a: 'Glucose (C₆H₁₂O₆) and oxygen (O₂).' },
        { q: 'Name three factors that affect the rate of photosynthesis.', a: 'Light intensity, carbon dioxide concentration, and temperature.' }
      ],
      summary: 'Photosynthesis is the process by which plants convert sunlight, water, and CO₂ into glucose and oxygen using chlorophyll in chloroplasts. It occurs in two stages — light-dependent reactions and the Calvin Cycle — and is fundamental to life on Earth, providing food and oxygen for most living organisms.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Learn the basic equation of photosynthesis, identify the raw materials and products, and understand where in the plant it occurs. Draw and label a chloroplast diagram. Study the role of sunlight and chlorophyll.' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Study the light-dependent reactions and Calvin Cycle in detail. Understand ATP, NADPH, and how glucose is synthesized step by step. Practice diagram-based questions and experiment analysis.' },
        { title: 'Review & Master (Day 7)', description: 'Attempt the quiz, create flashcards for key terms (stomata, thylakoid, stroma, ATP), and explain photosynthesis to a peer. Review factors affecting the rate and solve graph-based questions.' }
      ]
    },

    'machine learning': {
      explanation: `Machine Learning (ML) is a transformative branch of Artificial Intelligence that enables computers to learn from data and improve their performance on tasks without being explicitly programmed for every scenario. Instead of writing specific rules, ML algorithms identify patterns in large datasets and use those patterns to make predictions or decisions. For example, a spam filter uses ML to learn which emails are spam by analyzing thousands of labeled examples. The three main types of ML are: Supervised Learning (learning from labeled data), Unsupervised Learning (finding hidden patterns in unlabeled data), and Reinforcement Learning (learning through trial-and-error with rewards). ML powers technologies like voice assistants, recommendation systems, self-driving cars, fraud detection, and medical diagnosis tools.`,
      keyPoints: [
        'Machine Learning is a subset of AI that focuses on building systems that learn from data rather than following hard-coded rules — it\'s the engine behind most modern AI applications.',
        'Supervised Learning uses labeled training data (input-output pairs) to learn a mapping function — common algorithms include Linear Regression, Decision Trees, Random Forests, and Neural Networks.',
        'Unsupervised Learning discovers hidden patterns and structures in data without labels — techniques include K-Means Clustering, PCA (Principal Component Analysis), and Association Rules.',
        'Reinforcement Learning trains agents to make sequences of decisions by maximizing rewards — used in game AI (AlphaGo), robotics, autonomous driving, and resource optimization.',
        'The ML workflow includes data collection, preprocessing, feature engineering, model training, hyperparameter tuning, evaluation (using metrics like accuracy, F1-score), and deployment.'
      ],
      quiz: [
        { q: 'What is the main difference between supervised and unsupervised learning?', a: 'Supervised learning uses labeled data (with known outputs), while unsupervised learning works with unlabeled data to discover hidden patterns and structures.' },
        { q: 'Give two real-world applications of machine learning.', a: 'Email spam filtering, Netflix/YouTube recommendations, voice assistants (Siri/Alexa), self-driving cars, medical image diagnosis, and fraud detection.' },
        { q: 'What is overfitting in machine learning and how can it be prevented?', a: 'Overfitting occurs when a model memorizes training data (including noise) and performs poorly on new data. It can be prevented using regularization, cross-validation, more training data, and dropout.' },
        { q: 'What role does training data play in machine learning?', a: 'Training data teaches the ML model by providing examples to learn patterns from. The quality, quantity, and representativeness of data directly affect model performance.' },
        { q: 'Explain Reinforcement Learning with one example.', a: 'RL is a type of ML where an agent learns by interacting with an environment and receiving rewards or penalties. Example: AlphaGo learned to play Go by playing millions of games against itself.' }
      ],
      summary: 'Machine Learning enables computers to learn patterns from data and make intelligent decisions without explicit programming. It encompasses supervised, unsupervised, and reinforcement learning approaches. ML is transforming industries from healthcare to entertainment and is a foundational technology behind modern AI applications including ChatGPT, self-driving cars, and recommendation engines.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Understand what ML is, how it differs from traditional programming, and learn the three main types. Study basic concepts like features, labels, training/testing split, and model evaluation. Review 5 real-world examples.' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Study key algorithms (Linear Regression, Decision Trees, K-Means). Understand overfitting, underfitting, bias-variance tradeoff, and cross-validation. Try simple hands-on exercises with sample datasets.' },
        { title: 'Review & Master (Day 7)', description: 'Take the quiz, review all algorithms and their use cases, create comparison charts (supervised vs unsupervised vs RL), and explain ML concepts in your own words to solidify understanding.' }
      ]
    },

    'solar system': {
      explanation: `The Solar System is the gravitationally bound system comprising the Sun and all the objects that orbit it. At its center is the Sun, a medium-sized G-type main-sequence star that contains 99.86% of the system's total mass. Orbiting the Sun are eight major planets divided into two groups: the inner rocky (terrestrial) planets — Mercury, Venus, Earth, and Mars — and the outer gas and ice giants — Jupiter, Saturn, Uranus, and Neptune. Beyond the planets lie dwarf planets like Pluto, the asteroid belt between Mars and Jupiter, the Kuiper Belt, and the distant Oort Cloud. The Solar System formed approximately 4.6 billion years ago from the gravitational collapse of a giant molecular cloud (the Nebular Hypothesis). Earth is the only known planet to harbor life, thanks to its ideal distance from the Sun, liquid water, and protective atmosphere.`,
      keyPoints: [
        'The Sun is a G-type main-sequence star containing 99.86% of the Solar System\'s mass, providing the gravitational anchor and the heat/light energy that sustains life on Earth.',
        'The four inner planets (Mercury, Venus, Earth, Mars) are small, rocky/terrestrial worlds, while the four outer planets (Jupiter, Saturn, Uranus, Neptune) are massive gas or ice giants.',
        'The asteroid belt between Mars and Jupiter contains millions of rocky bodies, while the Kuiper Belt beyond Neptune hosts icy objects including the dwarf planet Pluto.',
        'Earth is uniquely positioned in the habitable zone (the "Goldilocks zone") — the range of distances from the Sun where liquid water can exist on a planet\'s surface.',
        'The Solar System is approximately 4.6 billion years old and spans about 287 billion miles to the theoretical edge of the Oort Cloud.'
      ],
      quiz: [
        { q: 'How many officially recognized planets are in our Solar System? Name them in order.', a: 'Eight: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.' },
        { q: 'Which planet is the largest in the Solar System and why is it significant?', a: 'Jupiter — it is so massive that over 1,300 Earths could fit inside it. Its strong gravity influences asteroids, comets, and other objects in the Solar System.' },
        { q: 'What is the habitable zone and why is it important?', a: 'The habitable zone is the range of distances from a star where liquid water could exist on a planet\'s surface (also called the "Goldilocks zone"). Earth lies within this zone, enabling life as we know it.' },
        { q: 'What separates the inner planets from the outer planets?', a: 'The asteroid belt, located between the orbits of Mars and Jupiter, roughly divides the inner terrestrial planets from the outer gas/ice giants.' },
        { q: 'How did the Solar System form according to the Nebular Hypothesis?', a: 'About 4.6 billion years ago, a giant molecular cloud collapsed under gravity, forming a spinning disk. The center became the Sun, and the remaining material coalesced into planets, moons, and other objects.' }
      ],
      summary: 'The Solar System consists of the Sun, eight planets, dwarf planets, asteroids, comets, and other objects bound by gravity. Formed 4.6 billion years ago from a collapsing molecular cloud, it features rocky inner planets and gaseous outer planets. Earth occupies a unique position in the habitable zone, making it the only known planet capable of supporting life.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Learn the names, order, and basic characteristics of all eight planets. Understand the difference between terrestrial and gas giant planets. Study the Sun\'s role and the Nebular Hypothesis of formation.' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Explore the asteroid belt, Kuiper Belt, dwarf planets, and the Oort Cloud. Compare planetary atmospheres, sizes, orbital periods, and unique features (rings, moons, storms). Study key missions like Voyager and James Webb.' },
        { title: 'Review & Master (Day 7)', description: 'Take the quiz, create a scale diagram or comparison table, and review key facts about each planet. Practice explaining the Solar System\'s formation, structure, and the concept of the habitable zone from memory.' }
      ]
    },

    'dna replication': {
      explanation: `DNA Replication is the biological process by which a cell makes an identical copy of its DNA before cell division. This ensures that each daughter cell receives a complete set of genetic instructions. The process follows a semi-conservative model, meaning each new DNA molecule consists of one original (parent) strand and one newly synthesized strand. Replication begins at specific sites called origins of replication, where the enzyme helicase unwinds the double helix by breaking hydrogen bonds between base pairs, creating a replication fork. DNA polymerase then reads the template strand (3' to 5') and synthesizes a new complementary strand (5' to 3') by adding nucleotides following base pairing rules: Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C). The leading strand is synthesized continuously, while the lagging strand is synthesized in short Okazaki fragments, later joined by DNA ligase.`,
      keyPoints: [
        'DNA replication follows the semi-conservative model: each new DNA molecule retains one original parent strand and one newly synthesized complementary strand.',
        'Key enzymes include Helicase (unwinds DNA), Primase (adds RNA primer), DNA Polymerase III (synthesizes new strand), and DNA Ligase (joins Okazaki fragments on the lagging strand).',
        'Replication proceeds in the 5\' to 3\' direction — the leading strand is synthesized continuously toward the replication fork, while the lagging strand is synthesized in discontinuous Okazaki fragments away from it.',
        'Base pairing rules are essential: Adenine (A) always pairs with Thymine (T), and Guanine (G) always pairs with Cytosine (C), ensuring accurate genetic copying.',
        'DNA proofreading and repair mechanisms (by DNA polymerase\'s exonuclease activity) ensure extremely high fidelity, with an error rate of only about 1 in 10 billion base pairs.'
      ],
      quiz: [
        { q: 'What does "semi-conservative replication" mean?', a: 'Each new DNA molecule consists of one original parent strand and one newly synthesized strand, hence "semi" (half) conservative.' },
        { q: 'What is the role of DNA helicase in replication?', a: 'Helicase unwinds and separates the two strands of the DNA double helix by breaking the hydrogen bonds between complementary base pairs, creating a replication fork.' },
        { q: 'Why is the lagging strand synthesized in Okazaki fragments?', a: 'Because DNA polymerase can only synthesize in the 5\' to 3\' direction, and the lagging strand runs 3\' to 5\' relative to the replication fork, so it must be synthesized in short fragments away from the fork.' },
        { q: 'What are the base pairing rules in DNA?', a: 'Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds, and Guanine (G) pairs with Cytosine (C) via 3 hydrogen bonds.' },
        { q: 'What enzyme joins Okazaki fragments together?', a: 'DNA Ligase — it seals the gaps between Okazaki fragments on the lagging strand by forming phosphodiester bonds.' }
      ],
      summary: 'DNA replication is a semi-conservative process where the double helix is unwound by helicase, and DNA polymerase synthesizes new complementary strands following base pairing rules (A-T, G-C). The leading strand is built continuously while the lagging strand is assembled from Okazaki fragments joined by ligase. Proofreading mechanisms ensure remarkably accurate copying of genetic information.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Learn the structure of DNA (double helix, nucleotides, base pairs). Understand the semi-conservative model and Meselson-Stahl experiment. Study the key enzymes and their roles at the replication fork.' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Study leading vs lagging strand synthesis in detail. Understand Okazaki fragments, primers, and the role of DNA ligase. Draw and label the replication fork. Practice identifying steps in diagrams.' },
        { title: 'Review & Master (Day 7)', description: 'Take the quiz, create a summary table of all enzymes, draw the complete replication process from memory, and explain leading vs lagging strand synthesis to a study partner.' }
      ]
    },

    "newton's laws": {
      explanation: `Newton's Laws of Motion are three fundamental principles formulated by Sir Isaac Newton in 1687 in his groundbreaking work "Principia Mathematica." These laws describe the relationship between forces acting on an object and the motion of that object, forming the foundation of classical mechanics. The First Law (Law of Inertia) states that an object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force. The Second Law (F = ma) establishes that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The Third Law (Action-Reaction) states that for every action force, there is an equal and opposite reaction force. Together, these laws explain everything from why we wear seatbelts to how rockets propel through space.`,
      keyPoints: [
        'First Law (Inertia): An object remains at rest or in uniform motion unless acted upon by a net external force — this explains why passengers lurch forward when a car brakes suddenly.',
        'Second Law (F = ma): Force equals mass times acceleration — doubling the force doubles the acceleration, while doubling the mass halves it. This is the most used equation in physics problem-solving.',
        'Third Law (Action-Reaction): Every action has an equal and opposite reaction — when you push a wall, the wall pushes back with equal force. A rocket works by expelling gas downward (action) and moving upward (reaction).',
        'These three laws form the foundation of classical mechanics and are used to analyze forces, motion, and equilibrium in physics, engineering, sports science, and aerospace.',
        'Newton\'s Laws work accurately for everyday objects moving at normal speeds but break down at very high speeds (near light speed) or very small scales (atomic level), where Einstein\'s Relativity and Quantum Mechanics take over.'
      ],
      quiz: [
        { q: 'State Newton\'s First Law of Motion and give a real-life example.', a: 'An object at rest stays at rest, and an object in motion stays in motion at constant velocity unless acted upon by a net external force. Example: Passengers lurch forward when a car brakes suddenly due to inertia.' },
        { q: 'Write the mathematical expression for Newton\'s Second Law and explain each term.', a: 'F = ma, where F is the net force (in Newtons), m is mass (in kg), and a is acceleration (in m/s²). Force and acceleration are directly proportional.' },
        { q: 'How does Newton\'s Third Law explain how rockets work?', a: 'The rocket expels exhaust gases downward at high speed (action force), and the gases push the rocket upward with an equal and opposite force (reaction), propelling it into space.' },
        { q: 'If a 5 kg object experiences a net force of 20 N, what is its acceleration?', a: 'Using F = ma: 20 = 5 × a, so a = 4 m/s². The object accelerates at 4 meters per second squared.' },
        { q: 'Under what conditions do Newton\'s Laws fail to apply accurately?', a: 'At velocities approaching the speed of light (where Special Relativity applies) and at the atomic/subatomic scale (where Quantum Mechanics governs behavior).' }
      ],
      summary: 'Newton\'s three Laws of Motion form the bedrock of classical mechanics: the Law of Inertia (objects resist changes in motion), F = ma (force equals mass times acceleration), and Action-Reaction (every force has an equal and opposite counterpart). They explain everyday phenomena from car crashes to rocket propulsion and remain essential in physics and engineering.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Memorize all three laws with their formal statements. Understand inertia, force, mass, and acceleration as concepts. Study 3 real-world examples for each law (seatbelts, sports, rockets, etc.).' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Solve numerical problems using F = ma. Draw free-body diagrams for various scenarios. Study friction, normal force, tension, and how multiple forces combine. Practice identifying which law applies in each scenario.' },
        { title: 'Review & Master (Day 7)', description: 'Take the quiz, review all formulas and units, solve 10 mixed problems from scratch, and create a one-page visual summary connecting all three laws with diagrams and examples.' }
      ]
    },

    'world war ii': {
      explanation: `World War II (1939–1945) was the deadliest and most destructive conflict in human history, involving virtually every part of the world. The war began when Nazi Germany, led by Adolf Hitler, invaded Poland on September 1, 1939, prompting Britain and France to declare war. The conflict was fought between two major alliances: the Allies (primarily the United Kingdom, Soviet Union, United States, China, and France) and the Axis powers (Germany, Italy, and Japan). Key events include the fall of France (1940), the Battle of Britain, Operation Barbarossa (German invasion of the Soviet Union), the attack on Pearl Harbor (bringing the US into the war), D-Day (the Allied invasion of Normandy on June 6, 1944), and the atomic bombings of Hiroshima and Nagasaki. The war ended with Germany's surrender in May 1945 (V-E Day) and Japan's surrender in August 1945 (V-J Day). An estimated 70–85 million people perished, including the 6 million Jews killed in the Holocaust. The war reshaped the global political order, leading to the United Nations, the Cold War, decolonization, and the modern international system.`,
      keyPoints: [
        'WWII lasted from 1939 to 1945 and was fought between the Allies (UK, USSR, USA, China, France) and the Axis powers (Germany, Italy, Japan), involving over 100 million military personnel.',
        'The war began with Germany\'s invasion of Poland (Sept 1, 1939) and ended with atomic bombs dropped on Hiroshima (Aug 6) and Nagasaki (Aug 9, 1945), followed by Japan\'s surrender.',
        'The Holocaust was the systematic genocide of 6 million Jews and millions of others (Roma, disabled, political prisoners) by the Nazi regime — one of the darkest chapters in human history.',
        'Key turning points included the Battle of Stalingrad (1942–43), D-Day invasion of Normandy (June 6, 1944), Battle of Midway (1942), and the fall of Berlin (1945).',
        'The aftermath reshaped the world: the United Nations was founded, the Cold War began between the USA and USSR, European colonies gained independence, and the Marshall Plan rebuilt Europe.'
      ],
      quiz: [
        { q: 'When did World War II begin and what event triggered it?', a: 'WWII began on September 1, 1939, when Nazi Germany invaded Poland. Britain and France declared war on Germany two days later.' },
        { q: 'Name the major countries in the Allied and Axis powers.', a: 'Allies: United Kingdom, Soviet Union, United States, China, France. Axis: Germany, Italy, Japan.' },
        { q: 'What was the significance of D-Day (June 6, 1944)?', a: 'D-Day was the Allied invasion of Normandy, France — the largest amphibious military operation in history. It opened a second front in Europe and was a major turning point leading to Germany\'s defeat.' },
        { q: 'What was the Holocaust?', a: 'The Holocaust was the systematic, state-sponsored persecution and murder of approximately 6 million Jews by the Nazi regime and its collaborators, along with millions of others including Roma, disabled people, and political prisoners.' },
        { q: 'How did WWII end and what were its major consequences?', a: 'Germany surrendered in May 1945 (V-E Day). Japan surrendered in August 1945 after atomic bombs were dropped on Hiroshima and Nagasaki. Major consequences: founding of the UN, start of the Cold War, decolonization, and the Marshall Plan.' }
      ],
      summary: 'World War II (1939–1945) was the deadliest conflict in history, fought between the Allies and Axis powers. Triggered by Germany\'s invasion of Poland, it encompassed the Holocaust, pivotal battles like Stalingrad and D-Day, and ended with the atomic bombings of Japan. The war killed 70–85 million people and fundamentally reshaped the global political order.',
      studyPlan: [
        { title: 'Foundation Building (Day 1–3)', description: 'Learn the key dates, countries involved, major leaders (Hitler, Churchill, Roosevelt, Stalin), and the causes of WWII (Treaty of Versailles, rise of fascism, appeasement policy). Create a timeline of events from 1939–1945.' },
        { title: 'Deep Dive & Practice (Day 4–6)', description: 'Study major battles and turning points (Stalingrad, Midway, D-Day, Battle of the Bulge). Understand the Holocaust, the Pacific Theater, and the decision to use atomic weapons. Analyze primary sources and maps.' },
        { title: 'Review & Master (Day 7)', description: 'Take the quiz, review the timeline, study the war\'s consequences (UN, Cold War, decolonization, Marshall Plan). Write a short essay connecting causes, events, and outcomes. Discuss with peers.' }
      ]
    }
  };

  // ─── Get Study Data ───
  function getStudyData(topic) {
    const key = topic.toLowerCase().trim();
    if (sampleData[key]) return sampleData[key];
    return sampleData.default(topic);
  }

  // ─── Loading System ───
  const loadingMessages = [
    'Analyzing the topic',
    'Generating explanation',
    'Identifying key points',
    'Creating quiz questions',
    'Building study plan'
  ];

  let loadingInterval = null;

  function startLoading() {
    loadingSection.style.display = 'block';
    resultsSection.style.display = 'none';
    loadingBarFill.style.width = '0%';

    // Reset loading steps
    $$('.l-step').forEach((step) => {
      step.classList.remove('active', 'done');
      step.querySelector('.l-check').textContent = '○';
    });

    let step = 0;
    const totalSteps = loadingMessages.length;

    loadingInterval = setInterval(() => {
      if (step < totalSteps) {
        // Mark previous as done
        if (step > 0) {
          const prevStep = $(`.l-step[data-step="${step - 1}"]`);
          prevStep.classList.remove('active');
          prevStep.classList.add('done');
          prevStep.querySelector('.l-check').textContent = '✓';
        }

        // Mark current as active
        const currentStep = $(`.l-step[data-step="${step}"]`);
        currentStep.classList.add('active');
        currentStep.querySelector('.l-check').textContent = '◉';

        loadingStatus.textContent = loadingMessages[step];
        loadingBarFill.style.width = `${((step + 1) / totalSteps) * 100}%`;
        step++;
      }
    }, 400);

    // Scroll to loading
    loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function stopLoading() {
    clearInterval(loadingInterval);
    loadingBarFill.style.width = '100%';

    // Mark all as done
    $$('.l-step').forEach((step) => {
      step.classList.remove('active');
      step.classList.add('done');
      step.querySelector('.l-check').textContent = '✓';
    });

    setTimeout(() => {
      loadingSection.style.display = 'none';
    }, 400);
  }

  // ─── Render Results ───
  function renderResults(topic, data) {
    currentTopic = topic;
    currentData = data;
    topicNameEl.textContent = topic;

    // Explanation
    $('#explanation-content').innerHTML = `<p>${data.explanation}</p>`;

    // Key Points
    $('#keypoints-content').innerHTML = data.keyPoints.map((point, i) =>
      `<div class="key-point">
        <span class="key-point-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="key-point-text">${point}</span>
      </div>`
    ).join('');

    // Quiz
    $('#quiz-content').innerHTML = data.quiz.map((item, i) =>
      `<div class="quiz-item" data-index="${i}">
        <div class="quiz-question">
          <span class="q-num">Q${i + 1}</span>
          <span>${item.q}</span>
        </div>
        <div class="quiz-answer hidden-answer" data-answer="${encodeURIComponent(item.a)}" onclick="window.StudyBuddy.toggleAnswer(this)">
          🔒 Click to reveal answer
        </div>
      </div>`
    ).join('');

    // Update quiz score
    updateQuizScore();

    // Summary
    $('#summary-content').innerHTML = `<p>${data.summary}</p>`;

    // Study Plan
    $('#studyplan-content').innerHTML = data.studyPlan.map((step, i) =>
      `<div class="study-step">
        <div class="step-number">${i + 1}</div>
        <div class="step-content">
          <h4>${step.title}</h4>
          <p>${step.description}</p>
        </div>
      </div>`
    ).join('');

    // Show all tabs
    setActiveTab('all');

    // Show results
    resultsSection.style.display = 'block';

    // Re-trigger card animations
    $$('.result-card').forEach((card, i) => {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = `cardReveal 0.5s var(--ease-out) ${i * 0.08}s forwards`;
    });

    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
  }

  // ─── Quiz Functions ───
  function toggleAnswer(el) {
    if (el.classList.contains('hidden-answer')) {
      el.classList.remove('hidden-answer');
      el.classList.add('revealed');
      el.textContent = '✅ ' + decodeURIComponent(el.dataset.answer);
    } else {
      el.classList.add('hidden-answer');
      el.classList.remove('revealed');
      el.textContent = '🔒 Click to reveal answer';
    }
    updateQuizScore();
  }

  function updateQuizScore() {
    const total = $$('.quiz-answer').length;
    const revealed = $$('.quiz-answer.revealed').length;
    const scoreEl = $('#quiz-score');
    const scoreText = $('#score-text');

    if (revealed > 0) {
      scoreEl.style.display = 'block';
      scoreText.textContent = `${revealed}/${total}`;
    } else {
      scoreEl.style.display = 'none';
    }
  }

  // ─── Tab Navigation ───
  function setActiveTab(tabName) {
    $$('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    $$('.result-card').forEach(card => {
      const category = card.dataset.category;
      if (tabName === 'all' || category === tabName) {
        card.classList.remove('hidden-card');
      } else {
        card.classList.add('hidden-card');
      }
    });
  }

  // ─── Copy & Download ───
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  function showToast(message = 'Copied to clipboard!') {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function getCardText(elementId) {
    const el = document.getElementById(elementId);
    return el ? (el.innerText || el.textContent || '').trim() : '';
  }

  function getAllContentText() {
    if (!currentData || !currentTopic) return '';

    let text = `📖 STUDY MATERIAL: ${currentTopic}\n`;
    text += '═'.repeat(50) + '\n\n';

    text += '💡 SIMPLE EXPLANATION\n';
    text += '─'.repeat(30) + '\n';
    text += currentData.explanation + '\n\n';

    text += '🔑 KEY POINTS\n';
    text += '─'.repeat(30) + '\n';
    currentData.keyPoints.forEach((p, i) => {
      text += `${i + 1}. ${p}\n`;
    });
    text += '\n';

    text += '❓ QUIZ QUESTIONS\n';
    text += '─'.repeat(30) + '\n';
    currentData.quiz.forEach((q, i) => {
      text += `Q${i + 1}. ${q.q}\n`;
      text += `A${i + 1}. ${q.a}\n\n`;
    });

    text += '📝 SUMMARY\n';
    text += '─'.repeat(30) + '\n';
    text += currentData.summary + '\n\n';

    text += '📅 3-STEP STUDY PLAN\n';
    text += '─'.repeat(30) + '\n';
    currentData.studyPlan.forEach((s, i) => {
      text += `Step ${i + 1}: ${s.title}\n`;
      text += `${s.description}\n\n`;
    });

    text += '═'.repeat(50) + '\n';
    text += 'Generated by AI Study Buddy – Built for Built with AI Bootcamp – Tadepalligudem\n';

    return text;
  }

  function downloadContent() {
    const text = getAllContentText();
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Study_Material_${currentTopic.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('📥 Downloaded successfully!');
  }

  // ─── History ───
  function addToHistory(topic) {
    searchHistory = searchHistory.filter(t => t.toLowerCase() !== topic.toLowerCase());
    searchHistory.unshift(topic);
    if (searchHistory.length > 8) searchHistory.pop();
    localStorage.setItem('sb_history', JSON.stringify(searchHistory));
    renderHistory();
  }

  function renderHistory() {
    if (searchHistory.length === 0) {
      historySection.style.display = 'none';
      return;
    }

    historySection.style.display = 'block';
    historyChips.innerHTML = searchHistory.map(topic =>
      `<button class="history-chip" data-topic="${topic}">${topic}</button>`
    ).join('');

    historyChips.querySelectorAll('.history-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        topicInput.value = chip.dataset.topic;
        clearBtn.style.display = 'flex';
        handleGenerate();
      });
    });
  }

  function clearHistory() {
    searchHistory = [];
    localStorage.removeItem('sb_history');
    renderHistory();
    showToast('History cleared');
  }

  // ─── Stats ───
  function updateStatCounter() {
    statTopics.textContent = topicsGenerated;
  }

  function incrementTopics() {
    topicsGenerated++;
    localStorage.setItem('sb_topics_count', String(topicsGenerated));
    animateCounter(statTopics, topicsGenerated, 500);
  }

  function animateCounter(el, target, duration) {
    const start = parseInt(el.textContent, 10) || 0;
    if (start === target) { el.textContent = target; return; }

    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ─── Theme ───
  function loadTheme() {
    const saved = localStorage.getItem('sb_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sb_theme', next);
  }

  // ─── Keyboard Shortcut Hint ───
  function showKbdHint() {
    setTimeout(() => {
      kbdHint.classList.add('show');
      setTimeout(() => kbdHint.classList.remove('show'), 4000);
    }, 2000);
  }

  // ─── Generate Handler ───
  function handleGenerate() {
    const topic = topicInput.value.trim();
    if (!topic) {
      topicInput.focus();
      topicInput.style.borderColor = '#ff6b6b';
      topicInput.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.15)';
      setTimeout(() => {
        topicInput.style.borderColor = '';
        topicInput.style.boxShadow = '';
      }, 1500);
      return;
    }

    generateBtn.disabled = true;
    startLoading();
    addToHistory(topic);

    // Simulate AI processing delay
    const delay = 2200 + Math.random() * 800;
    setTimeout(() => {
      stopLoading();
      const data = getStudyData(topic);
      renderResults(topic, data);
      incrementTopics();
      generateBtn.disabled = false;
    }, delay);
  }

  // ─── Event Listeners ───

  // Generate
  generateBtn.addEventListener('click', handleGenerate);

  // Enter key
  topicInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGenerate();
  });

  // Ctrl+K shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      topicInput.focus();
      topicInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Input clear button
  topicInput.addEventListener('input', () => {
    clearBtn.style.display = topicInput.value.length > 0 ? 'flex' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    topicInput.value = '';
    clearBtn.style.display = 'none';
    topicInput.focus();
  });

  // Quick topic chips
  $$('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      topicInput.value = chip.dataset.topic;
      clearBtn.style.display = 'flex';
      handleGenerate();
    });
  });

  // Copy individual sections
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = getCardText(btn.dataset.target);
      if (text) {
        copyToClipboard(text);
        btn.classList.add('copied');
        showToast('Section copied to clipboard!');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      }
    });
  });

  // Copy all
  copyAllBtn.addEventListener('click', () => {
    const text = getAllContentText();
    if (text) {
      copyToClipboard(text);
      showToast('📋 All content copied to clipboard!');
    }
  });

  // Download
  downloadBtn.addEventListener('click', downloadContent);

  // New topic
  newTopicBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    topicInput.value = '';
    clearBtn.style.display = 'none';
    topicInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Tab navigation
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  // Quiz actions
  revealAllBtn.addEventListener('click', () => {
    $$('.quiz-answer.hidden-answer').forEach(el => toggleAnswer(el));
  });

  resetQuizBtn.addEventListener('click', () => {
    $$('.quiz-answer.revealed').forEach(el => toggleAnswer(el));
  });

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // History clear
  historyClearBtn.addEventListener('click', clearHistory);

  // Back to top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Navbar scroll effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const navbar = $('#navbar');
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── Public API ───
  window.StudyBuddy = { toggleAnswer };

  // ─── Start ───
  init();

})();
