document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const loginButton = document.getElementById("loginButton");

    // Clear any previous error message
    errorMessage.textContent = "";

    // Basic input validation
    if (!email || !password) {
        errorMessage.textContent = "Email and password are required.";
        return;
    }

    try {
        // Disable button to prevent multiple clicks
        loginButton.disabled = true;

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user info
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userName", data.user.name);

            // Inform user and redirect
            alert("Login successful!");
            window.location.href = "http://127.0.0.1:5500/index.html"; // Redirect to homepage
        } else {
            // Show error message from the server
            errorMessage.textContent = data.message || "Invalid email or password.";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "Unable to connect to the server. Please try again later.";
    } finally {
        // Re-enable the button
        loginButton.disabled = false;
    }
});

  

