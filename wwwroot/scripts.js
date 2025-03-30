
// 📌 Utility function to make API requests
async function handleAPIRequest(url, method, data) {
    try {
        console.log("🔄 Sending Request To:", url);
        console.log("📦 Request Data:", JSON.stringify(data));

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        console.log("✅ Server Response:", responseData);

        if (!response.ok) {
            if (responseData.errors) {
                console.error("🔎 Validation Errors:", responseData.errors);
                alert("❌ Validation Error: " + JSON.stringify(responseData.errors));
            }
            throw new Error(responseData.message || "Request failed.");
        }

        return responseData;
    } catch (error) {
        console.error("❌ API Error:", error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}

// 📌 Validate Email Format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// 📌 Handle User Registration
document.getElementById("registerForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const experienceLevel = document.getElementById("experienceLevel").value.trim();
    const qualification = document.getElementById("qualification").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const securityQuestion = document.getElementById("security-question").value.trim();
    const securityAnswer = document.getElementById("security-answer").value.trim();

    // 🔍 Validate Email Format
    if (!validateEmail(email)) {
        document.getElementById("email-error").innerText = "Invalid email format!";
        return;
    } else {
        document.getElementById("email-error").innerText = "";
    }

    // 🔍 Validate Password Match
    if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
    }

    // 🔍 Ensure All Required Fields Are Filled
    if (!username || !email || !password || !experienceLevel || !qualification || !skills || !securityQuestion || !securityAnswer) {
        alert("❌ Please fill in all required fields!");
        return;
    }

    // ✅ Prepare Data for API Request
    const requestData = {
        username,
        email,
        password,
        experienceLevel,
        qualification,
        skills,
        securityQuestion,
        securityAnswer
    };

    try {
        const response = await handleAPIRequest("https://localhost:7121/api/user/register", "POST", requestData);
        alert("✅ Registration Successful! Redirecting to login...");
        window.location.href = "login.html";
    } catch (error) {
        console.error("❌ Registration Failed:", error);
    }
});

// 📌 Handle User Login
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("remember-me").checked;

    // Validate Email Format
    if (!validateEmail(email)) {
        document.getElementById("email-error").innerText = "Invalid email format!";
        return;
    } else {
        document.getElementById("email-error").innerText = "";
    }

    const requestData = { email, password };

    try {
        // 🔹 Send API Request
        const response = await handleAPIRequest("https://localhost:7121/api/auth/login", "POST", requestData);

        console.log("✅ Login Successful:", response);

        // 🔹 Store JWT Token & User Data
        if (response.token) {
            if (rememberMe) {
                localStorage.setItem("authToken", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
            } else {
                sessionStorage.setItem("authToken", response.token);
                sessionStorage.setItem("user", JSON.stringify(response.user));
            }
        } else {
            alert("❌ Login failed: No token received.");
            return;
        }

        alert("✅ Login Successful! Redirecting to dashboard...");
        window.location.href = "dashboard.html"; // Redirect to Dashboard Page

    } catch (error) {
        console.error("❌ Login Failed:", error);
        alert("❌ Login Failed: " + error.message);
    }
});


// 📌 Toggle Password Visibility
function togglePasswordVisibility(inputId) {
    const passwordField = document.getElementById(inputId);
    const toggleIcon = passwordField.nextElementSibling.querySelector("i");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}



// 📌 Logout Functionality
function logoutUser() {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    alert("✅ Logged out successfully!");
    window.location.href = "login.html";
}

// 📌 Check if User is Authenticated
function checkAuth() {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
        alert("❌ You must log in first!");
        window.location.href = "login.html";
    }
}

// 📌 Call `checkAuth()` on Protected Pages
if (window.location.pathname.includes("dashboard.html")) {
    checkAuth();
}


function loadPDFJs() {
    if (!window.pdfjsLib) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        script.onload = function () {
            console.log("✅ PDF.js Loaded");
        };
        document.head.appendChild(script);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadPDFJs();
});

// 📌 Load Questions from JSON
let questionsData = {}; // Stores JSON data

function loadQuestions() {
    fetch("questions.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            questionsData = data;
            console.log("✅ Questions loaded successfully:", questionsData); // Debugging
        })
        .catch(error => console.error("❌ Error loading questions:", error));
}

// 📌 Function to Display Questions
window.loadLanguageQuestions = function (language) {
    const questionsList = document.getElementById("programming-questions-list");
    const languageTitle = document.getElementById("category-title");

    if (!questionsData[language]) {
        console.error(`❌ No data found for language: ${language}`);
        questionsList.innerHTML = "<p>No questions available.</p>";
        return;
    }

    // Clear previous questions
    questionsList.innerHTML = "";
    languageTitle.innerText = `Questions - ${language.toUpperCase()}`;

    // Append questions and answers to the list
    questionsData[language].forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("qa-block");

        li.innerHTML = `
            <p class="question"><strong>${index + 1}. ${item.q}</strong></p>
            <p class="answer">${item.a}</p>
        `;

        questionsList.appendChild(li);
    });
};

// 📌 Load questions when the page loads
document.addEventListener("DOMContentLoaded", function () {
    loadQuestions();
});

document.addEventListener("DOMContentLoaded", function () {
    loadPDFJs();
});

// ✅ Store questions data globally
let interviewData = {};
let isDataLoaded = false; // Flag to prevent accessing data before it's ready

// ✅ Function to fetch JSON data
function loadInterviewQuestions() {
    fetch("questions.json") // Ensure the correct file path
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ Failed to load JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            interviewData = data;
            isDataLoaded = true;
            console.log("✅ Mock Interview Questions Loaded Successfully:", interviewData);
        })
        .catch(error => console.error("❌ Error loading interview questions:", error));
}

// ✅ Function to load questions when a user selects an interview type
window.loadMockInterview = function (type) {
    if (!isDataLoaded) {
        alert("⚠️ Please wait, questions are still loading...");
        return;
    }

    console.log("🟢 Loading questions for:", type);

    const questionsList = document.getElementById("interview-questions-list");
    const interviewTitle = document.getElementById("interview-title");

    if (!interviewData[type]) {
        console.error(`❌ No data found for interview type: ${type}`);
        questionsList.innerHTML = "<p>No questions available.</p>";
        return;
    }

    // ✅ Clear previous questions
    questionsList.innerHTML = "";
    interviewTitle.innerText = `Questions - ${type.toUpperCase()} Interview`;

    // ✅ Display Questions and Answers
    interviewData[type].forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("qa-block");

        li.innerHTML = `
            <p class="question"><strong>${index + 1}. ${item.q}</strong></p>
            <p class="answer">${item.a}</p>
        `;

        questionsList.appendChild(li);
    });

    console.log("✅ Questions Loaded Successfully");
};

// ✅ Load JSON when the page loads
document.addEventListener("DOMContentLoaded", loadInterviewQuestions);





// Function to submit feedback
function submitFeedback() {
    const feedbackText = document.getElementById("feedback").value;
    if (feedbackText.trim() === "") {
        alert("Please provide some feedback before submitting.");
        return;
    }
    alert("Thank you for your feedback!");
    document.getElementById("feedback").value = "";
}

// Function to toggle sidebar (if needed)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
        mainContent.style.marginLeft = "80px";
    } else {
        mainContent.style.marginLeft = "220px";
    }
}



// Function to toggle sidebar (if needed)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
}




// Load default questions when the page loads
function loadDefaultQuestions() {
    filterQuestions("java"); // Load Java questions by default
}

// Function to filter and display questions based on the selected category
function filterQuestions(category) {
    const questionList = document.getElementById("question-lists");
    questionList.innerHTML = ""; // Clear previous questions

    questions[category].forEach(question => {
        let questionItem = document.createElement("p");
        questionItem.textContent = question;
        questionList.appendChild(questionItem);
    });
}

// Function to load questions from a PDF file (Placeholder for actual implementation)
function loadQuestionsFromPDF(pdfFilePath) {
    console.log("Fetching questions from PDF:", pdfFilePath);
    // Use a library like PDF.js to extract text from the PDF and display it
}

// Sidebar Toggle Function (if needed)
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("collapsed");
}








function runCode(challengeNumber) {
    let editor = document.getElementById(`code-editor-${challengeNumber}`);
    let output = document.getElementById(`output-${challengeNumber}`);

    try {
        let userCode = editor.value;

        // Create a new function without using `eval()`
        let resultFunction = new Function(userCode);
        let result = resultFunction();

        output.textContent = result !== undefined ? result : "Code executed successfully!";
    } catch (error) {
        output.textContent = "Error: " + error.message;
        output.style.color = "red";
    }
}


function showSolution(challengeNumber) {
    let solution = document.getElementById(`solution-${challengeNumber}`);
    let solutions = {
        1: `function fizzBuzz() {\n  for (let i = 1; i <= 100; i++) {\n    let output = '';\n    if (i % 3 === 0) output += 'Fizz';\n    if (i % 5 === 0) output += 'Buzz';\n    console.log(output || i);\n  }\n}\nfizzBuzz();`,
        2: `function reverseString(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverseString('hello'));`,
        3: `function findLargest(arr) {\n  return Math.max(...arr);\n}\nconsole.log(findLargest([3, 7, 2, 9, 5]));`
    };

    solution.textContent = solutions[challengeNumber] || "Solution not available.";
    solution.style.display = "block";
}

function hideSolution(challengeNumber) {
    let solution = document.getElementById(`solution-${challengeNumber}`);
    solution.style.display = "none";
}

function toggleSidebar() {
    let sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}


document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Mock Interview Page Loaded Successfully");
});

// ✅ Toggle Sidebar
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
}


document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Mock Interview Page Loaded Successfully");
});

// ✅ Toggle Sidebar
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
}


//document.addEventListener("DOMContentLoaded", function () {
//    const startQuizBtn = document.getElementById("startQuiz");
//    const userNameInput = document.getElementById("userName");
//    const quizLevel = document.getElementById("quizLevel");
//    const timerElement = document.querySelector(".timer");
//    const questionElement = document.getElementById("question");
//    const questionNumberElement = document.getElementById("question-number");
//    const optionsElement = document.getElementById("options");
//    const prevQuestionBtn = document.getElementById("prevQuestion");
//    const nextQuestionBtn = document.getElementById("nextQuestion");
//    const submitBtn = document.getElementById("submit");
//    const exitQuizBtn = document.getElementById("exitQuiz");
//    const resultContainer = document.querySelector(".result");
//    const scoreElement = document.getElementById("score");
//    const scoreboardTable = document.getElementById("scoreboard");
//    const quizContent = document.querySelector(".quiz-content");

//    let currentQuestionIndex = 0;
//    let score = 0;
//    let timer;
//    let timeLeft = 300;
//    let selectedLevel = "beginner";
//    let questions = [];
//    let userAnswers = [];
//    let userName = "";

//    async function loadQuestions() {
//        try {
//            let response = await fetch("questions.json");
//            let data = await response.json();
//            return data;
//        } catch (error) {
//            console.error("Error loading questions:", error);
//            alert("Error loading questions. Please check the JSON file.");
//            return null;
//        }
//    }

//    startQuizBtn.addEventListener("click", async function () {
//        userName = userNameInput.value.trim();
//        selectedLevel = quizLevel.value;

//        if (!userName) {
//            alert("Please enter your name before starting the quiz.");
//            return;
//        }

//        let data = await loadQuestions();
//        if (data) {
//            questions = data[selectedLevel] || [];
//            if (questions.length === 0) {
//                alert("No questions available for this level.");
//                return;
//            }

//            currentQuestionIndex = 0;
//            score = 0;
//            timeLeft = 300;
//            userAnswers = new Array(questions.length).fill(null); // Initialize answers array

//            // Show quiz elements and hide start elements
//            quizContent.classList.remove("hidden");
//            startQuizBtn.style.display = "none";
//            userNameInput.style.display = "none";
//            quizLevel.style.display = "none";

//            // Show navigation buttons
//            prevQuestionBtn.style.display = "inline-block";
//            nextQuestionBtn.style.display = "inline-block";
//            submitBtn.style.display = "inline-block";
//            exitQuizBtn.style.display = "inline-block";

//            startTimer();
//            loadQuestion();
//        }
//    });

//    function loadQuestion() {
//        if (currentQuestionIndex >= questions.length) {
//            endQuiz();
//            return;
//        }

//        let questionData = questions[currentQuestionIndex];
//        questionNumberElement.innerText = `Question ${currentQuestionIndex + 1}: `;
//        questionElement.innerText = questionData.question;
//        optionsElement.innerHTML = "";

//        questionData.options.forEach(option => {
//            let button = document.createElement("button");
//            button.innerText = option;
//            button.classList.add("option-btn");

//            // Highlight selected option
//            if (userAnswers[currentQuestionIndex] === option) {
//                button.classList.add("selected");
//            }

//            button.onclick = function () {
//                selectAnswer(option, button);
//            };
//            optionsElement.appendChild(button);
//        });

//        updateNavButtons();
//    }

//    function selectAnswer(answer, button) {
//        userAnswers[currentQuestionIndex] = answer;
//        let correctAnswer = questions[currentQuestionIndex].correct;

//        // Remove previous selection highlight
//        document.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));

//        // Highlight selected button
//        button.classList.add("selected");

//        // Store answer correctness
//        userAnswers[currentQuestionIndex] = {
//            question: questions[currentQuestionIndex].question,
//            userAnswer: answer,
//            correctAnswer: correctAnswer,
//            isCorrect: answer === correctAnswer
//        };
//    }

//    function startTimer() {
//        timerElement.querySelector("#time").innerText = timeLeft;

//        timer = setInterval(() => {
//            timeLeft--;
//            timerElement.querySelector("#time").innerText = timeLeft;

//            if (timeLeft === 0) {
//                clearInterval(timer);
//                endQuiz();
//            }
//        }, 1000);
//    }

//    function endQuiz() {
//        clearInterval(timer);
//        quizContent.classList.add("hidden");
//        resultContainer.classList.remove("hidden");
//        displayResults();
//        saveScore(userName, score);
//        displayScoreboard();
//    }

//    function displayResults() {
//        score = userAnswers.filter(ans => ans && ans.isCorrect).length; // Count correct answers
//        scoreElement.innerText = `${score} / ${questions.length}`;

//        let reviewHTML = `<h2>📊 ${userName}, Your Score: ${score} / ${questions.length}</h2>`;
//        reviewHTML += `<h3>📈 Performance Review:</h3>`;

//        if (score / questions.length > 0.7) {
//            reviewHTML += `<p>🎉 Excellent job, ${userName}! Keep it up!</p>`;
//        } else if (score / questions.length > 0.4) {
//            reviewHTML += `<p>⚡ Good effort! Keep practicing.</p>`;
//        } else {
//            reviewHTML += `<p>🔄 Needs improvement. Try again!</p>`;
//        }

//        reviewHTML += `<h3>✅ Correct Answers</h3>`;
//        userAnswers.forEach(answer => {
//            if (answer && answer.isCorrect) {
//                reviewHTML += `<p>✔️ <b>${answer.question}</b><br>👉 Your Answer: ${answer.userAnswer} ✅</p>`;
//            }
//        });

//        reviewHTML += `<h3>❌ Incorrect Answers</h3>`;
//        userAnswers.forEach(answer => {
//            if (answer && !answer.isCorrect) {
//                reviewHTML += `<p>❌ <b>${answer.question}</b><br>👉 Your Answer: ${answer.userAnswer} ❌<br>✔️ Correct Answer: ${answer.correctAnswer} ✅</p>`;
//            }
//        });

//        reviewHTML += `<button id="restartQuizBtn" class="restart-btn">🔄 Restart Quiz</button>`;
//        resultContainer.innerHTML = reviewHTML;

//        document.getElementById("restartQuizBtn").addEventListener("click", restartQuiz);
//    }

//    function saveScore(name, score) {
//        let scores = JSON.parse(localStorage.getItem("quizScores")) || [];
//        scores.push({ name, score, date: new Date().toLocaleDateString() });
//        localStorage.setItem("quizScores", JSON.stringify(scores));
//    }

//    function displayScoreboard() {
//        let scores = JSON.parse(localStorage.getItem("quizScores")) || [];
//        scoreboardTable.innerHTML = "";
//        scores.forEach(({ name, score, date }) => {
//            const row = document.createElement("tr");
//            row.innerHTML = `<td>${name}</td><td>${score}</td><td>${date}</td>`;
//            scoreboardTable.appendChild(row);
//        });
//    }

//    function updateNavButtons() {
//        prevQuestionBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
//        nextQuestionBtn.style.display = currentQuestionIndex === questions.length - 1 ? "none" : "inline-block";
//    }

//    prevQuestionBtn.addEventListener("click", function () {
//        if (currentQuestionIndex > 0) {
//            currentQuestionIndex--;
//            loadQuestion();
//        }
//    });

//    nextQuestionBtn.addEventListener("click", function () {
//        if (currentQuestionIndex < questions.length - 1) {
//            currentQuestionIndex++;
//            loadQuestion();
//        }
//    });

//    submitBtn.addEventListener("click", function () {
//        if (confirm("Are you sure you want to submit the quiz?")) {
//            endQuiz();
//        }
//    });

//    exitQuizBtn.addEventListener("click", function () {
//        if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
//            location.reload();
//        }
//    });

//    displayScoreboard();
//});



