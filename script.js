// Importing question sets
const easyQuestions = {
    "1": {
        question: "In which group of the periodic table are the noble gases found?",
        "answer": "Group 18"
    },
    "2": {
        question: "Which of the following is the most electronegative element?",
        "answer": "Fluorine"
    },
    "3": {
        question: "Name the liquid metal at room temperature.",
        "answer": "Mercury"
    },
    "4": {
        question: "What is the valency of carbon?",
        "answer": "4"
    },
    "5": {
        question: "The functional group present in ethanol is:",
        "answer": "Hydroxyl (-OH)"
    },
    "6": {
        question: "Oxidation is a process which involves",
        "answer": "Addition of oxygen"
    },
    "7": {
        question: "When Ag is exposed to air it gets a black coating of",
        "answer": "AgNO₃"
    },
    "8": {
        question: "Tomato is a natural source of which acid?",
        "answer": "Oxalic acid"
    },
    "9": {
        question: "When an acid reacts with a base, what is formed?",
        "answer": "Salt"
    },
    "10": {
        question: "Who is known as the father of the modern periodic table?",
        "answer": "Henry Moseley"
    },
    "11": {
        question: "Which separation technique is used for removing sand from a mixture of sand and water?",
        "answer": "Filtration"
    },
    "12": {
        question: "The Tyndall effect is observed in",
        "answer": "Colloids"
    },
    "13": {
        question: "Which state of matter has a definite shape and volume?",
        "answer": "Solid"
    },
    "14": {
        question: "What is the boiling point of water in Celsius?",
        "answer": "100 degrees Celsius"
    },
    "15": {
        question: "Who discovered the electron?",
        "answer": "J.J. Thomson"
    },
    "16": {
        question: "What is the main component of natural gas?",
        "answer": "Methane"
    },
    "17": {
        question: "Which element is used in balloons due to its lightness and non-reactivity?",
        "answer": "Helium"
    },
    "18": {
        question: "Who developed the periodic table based on atomic mass and properties, leading to significant advancements in chemistry?",
        "answer": "Dmitri Mendeleev"
    }
}

const hardQuestions = {
    "1": {
        question: "I discovered the electron."
    },
    "2": {
        question: "I am the element found in all organic compounds."
    },
    "3": {
        question: "I am a Nobel Prize-winning chemist who worked on radioactivity."
    },
    "4": {
        question: "I created the first periodic table."
    },
    "5": {
        question: "I am used in balloons because I am lighter than air."
    },
    "6": {
        question: "I am the main element in hemoglobin."
    },
    "7": {
        question: "I am a yellow non-metal found in nature in pure form."
    },
    "8": {
        question: "I am a halogen used as an antiseptic."
    },
    "9": {
        question: "Guess the universal solvent."
    },
    "10": {
        question: "The formula for common table sugar."
    },
    "11": {
        question: "The process of converting nitrogen gas into ammonia."
    },
    "12": {
        question: "This is formed when an acid reacts with a base."
    },
    "13": {
        question: "A metalloid used in semiconductors."
    },
    "14": {
        question: "A chemical that speeds up a reaction but is not consumed."
    },
    "15": {
        question: "The bond type between sodium and chlorine in NaCl."
    },
    "16": {
        question: "The process of turning a solid directly into a gas without passing through the liquid phase."
    }
}


// DOM Element References
const levelStone = document.getElementById("level-stone");
const refreshStone = document.getElementById("refresh-stone");
const levelDisplay = document.getElementById("level");
const refreshSvg = document.getElementById("refresh-svg");
const questionBox = document.querySelector(".question-text-box");

// Game Variables
let level = "easy";
let shufflingMode = 1;
let animating = false;
let displayText = true;
let recentEasyQuestionNumbers = [];
let recentHardQuestionNumbers = [];
let availableEasyQuestions = Object.keys(easyQuestions).map(Number);
let availableHardQuestions = Object.keys(hardQuestions).map(Number);

// Initialize Hover Animations
initializeStoneHoverAnimations(levelStone);
initializeStoneHoverAnimations(refreshStone);

// Event Listeners for Level Stone
levelStone.addEventListener("mousemove", () => toggleLevelDisplay(true));
levelStone.addEventListener("mouseleave", () => toggleLevelDisplay(false));
levelStone.addEventListener("click", handleLevelChange);

// Event Listener for Refresh Stone
refreshStone.addEventListener("click", handleQuestionRefresh);

// Function: Initialize Hover Animation for Stones
function initializeStoneHoverAnimations(element) {
    element.addEventListener("mousemove", () => gsap.to(element, { filter: "hue-rotate(20deg)" }));
    element.addEventListener("mouseleave", () => gsap.to(element, { filter: "hue-rotate(0deg)" }));
}

// Function: Toggle Level Display (on hover)
function toggleLevelDisplay(show) {
    gsap.to(levelDisplay, { opacity: show ? 1 : 0 });
}

// Function: Handle Level Change on Click
function handleLevelChange() {
    displayText = (level === "easy");
    toggleLevelText(displayText);
    level = (displayText) ? "hard" : "easy";
    changeQuestion();
}

// Function: Change Level Text with Animation
function toggleLevelText(isEasy) {
    const easyText = document.getElementById("easy");
    const hardText = document.getElementById("hard");
    const disappearingText = isEasy ? hardText : easyText;
    const appearingText = isEasy ? easyText : hardText;

    // Animate disappearing text
    gsap.to(disappearingText, {
        opacity: 0,
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => gsap.set(disappearingText, { display: "none" })
    });

    // Animate appearing text
    gsap.to(appearingText, {
        opacity: 1,
        duration: 0.5,
        ease: "expo.inOut",
        onStart: () => appearingText.style.display = "block"
    });
}

// Function: Handle Question Refresh (rotate icon and change question)
function handleQuestionRefresh() {
    gsap.to(refreshSvg, {
        rotate: 360,
        ease: "expo.inOut",
        onComplete: () => gsap.set(refreshSvg, { rotate: 0 })
    });
    changeQuestion();
}

// Function: Change Question Based on Current Level
function changeQuestion() {
    let questionNumber;

    if (level === "easy") {
        questionNumber = getRandomQuestion(availableEasyQuestions, recentEasyQuestionNumbers);
    } else {
        questionNumber = getRandomQuestion(availableHardQuestions, recentHardQuestionNumbers);
    }

    gsap.to(questionBox, {
        text: (level === "easy") ? easyQuestions[questionNumber].question : hardQuestions[questionNumber].question
    });
}

// Function: Get a Random Question and Update Recent Questions List
function getRandomQuestion(availableQuestions, recentQuestionNumbers) {
    const filteredAvailableQuestions = availableQuestions.filter(q => !recentQuestionNumbers.includes(q));

    const questionNumber = getRandomElement(filteredAvailableQuestions);

    recentQuestionNumbers.push(questionNumber);

    if (recentQuestionNumbers.length > 5) {
        recentQuestionNumbers.shift();
    }

    return questionNumber;
}


// Utility Function: Get a Random Element from an Array
function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// Initialize the first level and question
toggleLevelText(displayText);
changeQuestion();
