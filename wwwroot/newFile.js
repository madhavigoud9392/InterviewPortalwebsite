//
document.addEventListener("DOMContentLoaded", function() {
    //    const startQuizBtn = document.getElementById("startQuiz");
    //    const quizLevel = document.getElementById("quizLevel");
    //    const timerElement = document.querySelector(".timer");
    //    const questionElement = document.querySelector(".question");
    //    const optionsElement = document.querySelector(".options");
    //    const submitBtn = document.getElementById("submit");
    //    const resultContainer = document.querySelector(".result");
    //    const scoreElement = document.getElementById("score");
    //    let currentQuestionIndex = 0;
    //    let score = 0;
    //    let timer;
    //    let timeLeft = 300;
    //    let selectedLevel = "beginner";
    //    let questions = [];
    //    let userAnswers = [];
    //    // ?? Load Questions from questions.json
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
    //    // ?? Start Quiz Event Listener
    //    startQuizBtn.addEventListener("click", async function () {
    //        selectedLevel = quizLevel.value;
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
    //            userAnswers = [];
    //            startQuiz();
    //        }
    //    });
    //    // ?? Start Quiz Function
    //    function startQuiz() {
    //        startQuizBtn.style.display = "none";
    //        quizLevel.style.display = "none";
    //        timerElement.style.display = "block";
    //        questionElement.style.display = "block";
    //        optionsElement.style.display = "block";
    //        submitBtn.style.display = "block";
    //        resultContainer.style.display = "none";
    //        loadQuestion();
    //        startTimer();
    //    }
    //    // ?? Load Questions
    //    function loadQuestion() {
    //        if (currentQuestionIndex >= questions.length) {
    //            endQuiz();
    //            return;
    //        }
    //        let questionData = questions[currentQuestionIndex];
    //        questionElement.innerText = questionData.question;
    //        optionsElement.innerHTML = "";
    //        questionData.options.forEach(option => {
    //            let button = document.createElement("button");
    //            button.innerText = option;
    //            button.classList.add("option-btn");
    //            button.onclick = () => selectAnswer(option);
    //            optionsElement.appendChild(button);
    //        });
    //    }
    //    // ?? Handle Answer Selection
    //    function selectAnswer(answer) {
    //        let correctAnswer = questions[currentQuestionIndex].correct;
    //        userAnswers.push({
    //            question: questions[currentQuestionIndex].question,
    //            userAnswer: answer,
    //            correctAnswer: correctAnswer,
    //            isCorrect: answer === correctAnswer
    //        });
    //        if (answer === correctAnswer) {
    //            score++;
    //        }
    //        currentQuestionIndex++;
    //        loadQuestion();
    //    }
    //    // ?? Timer Function
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
    //    // ?? End Quiz and Show Results
    //    function endQuiz() {
    //        clearInterval(timer);
    //        questionElement.style.display = "none";
    //        optionsElement.style.display = "none";
    //        submitBtn.style.display = "none";
    //        timerElement.style.display = "none";
    //        resultContainer.style.display = "block";
    //        displayResults();
    //    }
    //    // ?? Display Results
    //    function displayResults() {
    //        scoreElement.innerText = `${score} / ${questions.length}`;
    //        let reviewHTML = `<h2>?? Score: ${score} / ${questions.length}</h2>`;
    //        reviewHTML += `<h3>?? Performance Review:</h3>`;
    //        if (score / questions.length > 0.7) {
    //            reviewHTML += `<p>?? Excellent job! Keep it up!</p>`;
    //        } else if (score / questions.length > 0.4) {
    //            reviewHTML += `<p>? Good effort! Keep practicing.</p>`;
    //        } else {
    //            reviewHTML += `<p>?? Needs improvement. Try again!</p>`;
    //        }
    //        reviewHTML += `<h3>? Correct Answers</h3>`;
    //        userAnswers.forEach(answer => {
    //            if (answer.isCorrect) {
    //                reviewHTML += `<p>?? <b>${answer.question}</b><br>?? Your Answer: ${answer.userAnswer} ?</p>`;
    //            }
    //        });
    //        reviewHTML += `<h3>? Incorrect Answers (Review & Learn)</h3>`;
    //        userAnswers.forEach(answer => {
    //            if (!answer.isCorrect) {
    //                reviewHTML += `<p>? <b>${answer.question}</b><br>?? Your Answer: ${answer.userAnswer} ?<br>?? Correct Answer: ${answer.correctAnswer} ?</p>`;
    //            }
    //        });
    //        reviewHTML += `<button id="restartQuizBtn" class="restart-btn">?? Restart Quiz</button>`;
    //        resultContainer.innerHTML = reviewHTML;
    //        // Attach event listener after button is added to DOM
    //        document.getElementById("restartQuizBtn").addEventListener("click", restartQuiz);
    //    }
    //    // ?? Restart Quiz
    //    function restartQuiz() {
    //        currentQuestionIndex = 0;
    //        score = 0;
    //        timeLeft = 300;
    //        userAnswers = [];
    //        startQuizBtn.style.display = "block";
    //        quizLevel.style.display = "block";
    //        resultContainer.style.display = "none";
    //    }
    //});
    document.addEventListener("DOMContentLoaded", function() {
        function toggleSidebar() {
            const sidebar = document.querySelector(".sidebar");
            const mainContent = document.querySelector(".main-content");

            // Toggle 'active' class
            sidebar.classList.toggle("active");

            // Adjust margin based on sidebar state
            if (sidebar.classList.contains("active")) {
                sidebar.style.width = "60px"; // Collapsed sidebar width
                mainContent.style.marginLeft = "60px";
            } else {
                sidebar.style.width = "240px"; // Expanded sidebar width
                mainContent.style.marginLeft = "240px";
            }
        }

        // Attach click event to menu button
        document.querySelector(".menu-toggle").addEventListener("click", toggleSidebar);
    });


    function navigateTo(page) {
        window.location.href = page;
    }

    // Ensure DOM is fully loaded before executing scripts
    document.addEventListener("DOMContentLoaded", function() {
        initEventListeners();
        applyStoredSettings();
    });

    // Function to initialize all event listeners
    function initEventListeners() {
        document.querySelector(".menu-toggle")?.addEventListener("click", toggleSidebar);
        document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);
    }

    // Ensure DOM is fully loaded before executing scripts
    document.addEventListener("DOMContentLoaded", function() {
        initEventListeners();
        applyStoredSettings();
    });

    // Function to initialize all event listeners
    function initEventListeners() {
        document.querySelector(".menu-toggle")?.addEventListener("click", toggleSidebar);
        document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);
    }

    // Toggle Sidebar and Save State
    function toggleSidebar() {
        const sidebar = document.querySelector(".sidebar");
        if (!sidebar) return;

        sidebar.classList.toggle("collapsed");
        localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
    }

    // Toggle Light/Dark Theme and Save Preference
    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
        showToast("?? Theme Changed!", "success");
    }

    // Apply Stored Theme and Sidebar State
    function showIndustryDropdown() {
        document.getElementById("industry-selection").classList.remove("hidden");
    }

    function applyStoredSettings() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-theme");
        }
        if (localStorage.getItem("sidebarCollapsed") === "true") {
            document.querySelector(".sidebar")?.classList.add("collapsed");
        }
    }

    // ========================= ?? AI Mock Interview =========================
    const aiQuestions = [
        "Tell me about yourself.",
        "What are your strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why do you want to work for this company?",
        "Describe a challenge you faced and how you handled it."
    ];

    let currentQuestionIndex = 0;

    // Start AI Mock Interview
    function startAIMockInterview() {
        resetInterviewSections();
        toggleSection("ai-interview");
        currentQuestionIndex = 0;
        displayAIQuestion();
    }

    // Display AI Question with Animation
    function displayAIQuestion() {
        const questionElement = document.getElementById("ai-question");
        if (!questionElement || currentQuestionIndex >= aiQuestions.length) {
            showToast("?? You have completed the mock interview!", "success");
            return;
        }

        questionElement.style.opacity = 0;
        setTimeout(() => {
            questionElement.innerText = aiQuestions[currentQuestionIndex];
            questionElement.style.opacity = 1;
        }, 300);
    }

    // AI Voice Recognition
    function startVoiceRecognition() {
        if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            showToast("?? Voice recognition is not supported in this browser.", "error");
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";

        recognition.onstart = () => showToast("?? Listening... Speak now.", "info");
        recognition.onresult = event => {
            document.getElementById("ai-response").value = event.results[0][0].transcript;
            showToast("? Voice input received!", "success");
        };
        recognition.onerror = event => showToast(`?? Voice recognition error: ${event.error}`, "error");
        recognition.onend = () => showToast("?? Voice recognition stopped.", "info");

        recognition.start();
    }

    // Submit AI Response and Load Next Question
    function submitAIResponse() {
        let response = document.getElementById("ai-response")?.value.trim();
        if (!response) return showToast("?? Please enter a response.", "warning");

        showToast("? Response recorded! Next question loading...", "success");
        setTimeout(() => {
            document.getElementById("ai-response").value = "";
            currentQuestionIndex++;
            displayAIQuestion();
        }, 1000);
    }

    // ========================= ?? Industry-Specific Mock Interview =========================
    const industryQuestions = {
        "Software Developer": [
            "Explain the difference between OOP and functional programming.",
            "How do you handle version control using Git?",
            "What are design patterns? Can you give an example?",
            "How do you optimize database queries?",
            "Describe your experience with API integrations."
        ],
        "Data Scientist": [
            "What is the difference between supervised and unsupervised learning?",
            "How do you handle missing data in a dataset?",
            "Explain the importance of feature engineering."
        ],
        "Cybersecurity Analyst": [
            "What are the key principles of cybersecurity?",
            "How do you perform a vulnerability assessment?",
            "Explain the importance of encryption in data security."
        ],
        "Cloud Engineer": [
            "What are the benefits of cloud computing?",
            "Explain the differences between SaaS, PaaS, and IaaS.",
            "How do you ensure security in cloud deployments?"
        ],
        "UX/UI Designer": [
            "What is the difference between UX and UI design?",
            "How do you conduct user research for a new product?",
            "Explain the importance of wireframing in the design process."
        ],
        "Business Analyst": [
            "What techniques do you use for business process modeling?",
            "How do you gather and document business requirements?",
            "Explain the role of a Business Analyst in Agile development."
        ]
    };


    let industryQuestionIndex = 0;
    let selectedIndustry = "";

    // Start Industry-Specific Mock Interview
    function startIndustrySpecificInterview() {
        resetInterviewSections();
        let dropdown = document.getElementById("industry-select");
        selectedIndustry = dropdown.value;

        if (!industryQuestions[selectedIndustry]) return showToast("?? Please select a valid industry.", "error");

        toggleSection("industry-interview");
        industryQuestionIndex = 0;
        displayIndustryQuestion();
    }

    // Display Industry-Specific Question
    function displayIndustryQuestion() {
        const questionElement = document.getElementById("industry-question");
        if (!questionElement || industryQuestionIndex >= industryQuestions[selectedIndustry].length) {
            showToast("?? Interview Completed!", "success");
            return;
        }
        questionElement.innerText = industryQuestions[selectedIndustry][industryQuestionIndex];
    }

    // Submit Industry Response
    function submitIndustryResponse() {
        let response = document.getElementById("industry-response")?.value.trim();
        if (!response) return showToast("?? Please enter a response.", "warning");

        showToast("? Response saved! Loading next question...", "success");
        setTimeout(() => {
            document.getElementById("industry-response").value = "";
            industryQuestionIndex++;
            displayIndustryQuestion();
        }, 1000);
    }

    // ========================= ?? Peer-to-Peer Video Interview (WebRTC) =========================
    let peerConnection;
    const config = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };

    function startPeerToPeerInterview() {
        resetInterviewSections();
        toggleSection("peer-interview");
        setupVideoCall();
    }

    // Set up WebRTC Video Call
    function setupVideoCall() {
        const videoElement = document.getElementById("peer-video");
        if (!navigator.mediaDevices?.getUserMedia) return showToast("?? Your browser does not support WebRTC.", "error");

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                videoElement.srcObject = stream;
                peerConnection = new RTCPeerConnection(config);
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                peerConnection.onicecandidate = event => {
                    if (event.candidate) console.log("New ICE candidate:", event.candidate);
                };

                showToast("?? Peer-to-Peer Interview Started!", "success");
            })
            .catch(() => showToast("?? Camera access denied.", "error"));
    }

    // ========================= ?? Helper Functions =========================
    function resetInterviewSections() {
        document.querySelectorAll(".interview-section").forEach(section => section.classList.add("hidden"));
    }

    function showToast(message, type) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "center",
            style: { background: getToastColor(type) }
        }).showToast();
    }

    function getToastColor(type) {
        return { success: "#28a745", error: "#dc3545", warning: "#ffc107", info: "#17a2b8" }[type] || "#343a40";
    }

    function toggleSection(sectionId) {
        resetInterviewSections();
        document.getElementById(sectionId)?.classList.remove("hidden");
    }





    document.addEventListener("DOMContentLoaded", function() {
        const dropdownBtn = document.querySelector(".dropdown .btn-primary");
        const dropdownContent = document.querySelector(".dropdown-content");

        dropdownBtn.addEventListener("click", function(event) {
            event.stopPropagation(); // Prevent immediate closing
            dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function(event) {
            if (!dropdownBtn.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = "none";
            }
        });
    });
});
