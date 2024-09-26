// Importing question sets
import { easyQuestions, hardQuestions } from "/assests/Question.js";

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
