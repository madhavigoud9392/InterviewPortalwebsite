


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

    // Validate Email Format
    if (!validateEmail(email)) {
        document.getElementById("email-error").innerText = "Invalid email format!";
        return;
    } else {
        document.getElementById("email-error").innerText = "";
    }

    // Validate Password Match
    if (password !== confirmPassword) {
        alert("❌ Passwords do not match!");
        return;
    }

    const requestData = { username, email, password }; // 🔄 Fixed: Changed "passwordHash" to "password"

    try {
        const response = await handleAPIRequest("https://localhost:7121/api/auth/register", "POST", requestData);
        alert("✅ Registration Successful! Redirecting to login...");
        window.location.href = "login.html";
    } catch (error) {
        console.error("❌ Registration Failed:", error);
    }
});

// 📌 Handle User Login
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get Form Data
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

    const requestData = { email, password }; // 🔄 Fixed: Changed "passwordHash" to "password"

    try {
        const data = await handleAPIRequest("https://localhost:7121/api/auth/login", "POST", requestData);
        alert("✅ Login Successful!");

        // Store token in LocalStorage if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem("authToken", data.token);
        } else {
            sessionStorage.setItem("authToken", data.token);
        }

        // Redirect to Dashboard
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("❌ Login Failed:", error);
    }
});

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



document.addEventListener("DOMContentLoaded", function () {
    loadPDFJs();
});

// Function to dynamically load PDF.js
function loadPDFJs() {
    if (!window.pdfjsLib) {
        let script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
        script.onload = function () {
            console.log("PDF.js Loaded");
        };
        document.head.appendChild(script);
    }
}

// Function to start Mock Interview
function startMockInterview(type) {
    let pdfPath = "";

    switch (type) {
        case "technical":
            pdfPath = "../pdfs/technical_interview.pdf";
            break;
        case "hr":
            pdfPath = "../pdfs/hr_interview.pdf";
            break;
        case "aptitude":
            pdfPath = "../pdfs/aptitude_interview.pdf";
            break;
    }

    if (pdfPath) {
        loadPDFQuestions(pdfPath);
    }
}

// Function to load and extract text from PDF
function loadPDFQuestions(pdfUrl) {
    const questionList = document.getElementById("questions-list");
    questionList.innerHTML = "<p>Loading questions...</p>";

    if (!window.pdfjsLib) {
        questionList.innerHTML = "<p>Error: PDF.js not loaded.</p>";
        return;
    }

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdf => {
        let textContent = "";
        let totalPages = pdf.numPages;
        let pagePromises = [];

        for (let i = 1; i <= totalPages; i++) {
            pagePromises.push(
                pdf.getPage(i).then(page => {
                    return page.getTextContent().then(text => {
                        return text.items.map(s => s.str).join(" ");
                    });
                })
            );
        }

        Promise.all(pagePromises).then(pages => {
            textContent = pages.join("\n\n");
            questionList.innerHTML = `<pre>${textContent}</pre>`;
        });
    }).catch(error => {
        questionList.innerHTML = `<p>Error loading PDF: ${error.message}</p>`;
    });
}

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

document.addEventListener("DOMContentLoaded", function () {
    loadNotifications();
    addDismissEventListeners();
});

// Function to load notifications dynamically (can be modified to fetch from a database)
function loadNotifications() {
    const notifications = [
        {
            title: "New Technical Challenge",
            message: "We have added a new technical challenge to help you practice!",
            time: "10 mins ago"
        },
        {
            title: "Upcoming Mock Interview",
            message: "Your mock interview is scheduled for tomorrow at 2 PM. Prepare well!",
            time: "1 hour ago"
        }
    ];

    const container = document.querySelector(".notifications-container");
    container.innerHTML = ""; // Clear previous notifications

    notifications.forEach(notification => {
        const notificationElement = document.createElement("div");
        notificationElement.classList.add("notification");
        notificationElement.innerHTML = `
            <p class="notification-title"><strong>${notification.title}</strong></p>
            <p>${notification.message}</p>
            <span class="timestamp">${notification.time}</span>
            <button class="dismiss-btn">Dismiss</button>
        `;
        container.appendChild(notificationElement);
    });

    addDismissEventListeners();
}

// Function to add event listeners to dismiss buttons
function addDismissEventListeners() {
    document.querySelectorAll(".dismiss-btn").forEach(button => {
        button.addEventListener("click", function () {
            this.parentElement.remove(); // Remove notification from UI
        });
    });
}

// Function to toggle sidebar (if needed)
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
}


document.addEventListener("DOMContentLoaded", function () {
    loadDefaultQuestions();
});

// Sample question data (Replace this with actual PDF-based loading)
const questions = {
    java: [
        "What is Java and its main features?",
        "Explain OOP concepts in Java.",
        "What is the difference between HashMap and HashTable?"
    ],
    python: [
        "What are Python's key features?",
        "Explain Python's memory management.",
        "What is the difference between deep copy and shallow copy?"
    ],
    c: [
        "What is the difference between C and C++?",
        "Explain pointers in C.",
        "What is the purpose of the `static` keyword?"
    ],
    csharp: [
        "What is C# used for?",
        "Explain the concept of delegates in C#.",
        "What is the difference between `ref` and `out` parameters?"
    ],
    cpp: [
        "What is polymorphism in C++?",
        "Explain the difference between `new` and `malloc()`.",
        "What are friend functions in C++?"
    ]
};

// Load default questions when the page loads
function loadDefaultQuestions() {
    filterQuestions("java"); // Load Java questions by default
}

// Function to filter and display questions based on the selected category
function filterQuestions(category) {
    const questionList = document.getElementById("question-list");
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









//// 📌 Utility function to make API requests
//async function handleAPIRequest(url, method, data) {
//    try {
//        console.log("🔄 Sending Request To:", url);
//        console.log("📦 Request Data:", JSON.stringify(data));

//        const response = await fetch(url, {
//            method: method,
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(data),
//        });

//        const responseData = await response.json();
//        console.log("✅ Server Response:", responseData);

//        if (!response.ok) {
//            throw new Error(responseData.message || "Request failed.");
//        }

//        return responseData;
//    } catch (error) {
//        console.error("❌ API Error:", error);
//        alert(`Error: ${error.message}`);
//        throw error;
//    }
//}

//// 📌 Validate Email Format
//function validateEmail(email) {
//    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//    return emailPattern.test(email);
//}

//// 📌 Handle User Registration
//document.getElementById("registerForm")?.addEventListener("submit", async function (event) {
//    event.preventDefault();

//    const username = document.getElementById("username").value.trim();
//    const email = document.getElementById("email").value.trim();
//    const password = document.getElementById("password").value.trim();
//    const confirmPassword = document.getElementById("confirm-password").value.trim();

//    // Validate Email Format
//    if (!validateEmail(email)) {
//        document.getElementById("email-error").innerText = "Invalid email format!";
//        return;
//    } else {
//        document.getElementById("email-error").innerText = "";
//    }

//    // Validate Password Match
//    if (password !== confirmPassword) {
//        alert("❌ Passwords do not match!");
//        return;
//    }

//    const requestData = { username, email, passwordHash: password };

//    try {
//        const response = await handleAPIRequest("https://localhost:7121/api/auth/register", "POST", requestData);
//        alert("✅ Registration Successful! Redirecting to login...");
//        window.location.href = "login.html";
//    } catch (error) {
//        console.error("❌ Registration Failed:", error);
//    }
//});

//// 📌 Handle User Login
//document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
//    event.preventDefault();

//    // Get Form Data
//    const email = document.getElementById("email").value.trim();
//    const password = document.getElementById("password").value.trim();
//    const rememberMe = document.getElementById("remember-me").checked;

//    // Validate Email Format
//    if (!validateEmail(email)) {
//        document.getElementById("email-error").innerText = "Invalid email format!";
//        return;
//    } else {
//        document.getElementById("email-error").innerText = "";
//    }

//    const requestData = { email, passwordHash: password };

//    try {
//        const data = await handleAPIRequest("https://localhost:7121/api/auth/login", "POST", requestData);
//        alert("✅ Login Successful!");

//        // Store token in LocalStorage if "Remember Me" is checked
//        if (rememberMe) {
//            localStorage.setItem("authToken", data.token);
//        } else {
//            sessionStorage.setItem("authToken", data.token);
//        }

//        // Redirect to Dashboard
//        window.location.href = "dashboard.html";
//    } catch (error) {
//        console.error("❌ Login Failed:", error);
//    }
//});

//// 📌 Logout Functionality
//function logoutUser() {
//    localStorage.removeItem("authToken");
//    sessionStorage.removeItem("authToken");
//    alert("✅ Logged out successfully!");
//    window.location.href = "login.html";
//}

//// 📌 Check if User is Authenticated
//function checkAuth() {
//    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
//    if (!token) {
//        alert("❌ You must log in first!");
//        window.location.href = "login.html";
//    }
//}

//// 📌 Call `checkAuth()` on Protected Pages
//if (window.location.pathname.includes("dashboard.html")) {
//    checkAuth();
//}
