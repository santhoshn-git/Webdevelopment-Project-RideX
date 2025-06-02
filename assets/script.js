const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLink = document.querySelector("#nav-links");
const API_KEY = process.env.REACT_APP_MAPS_API_KEY;


hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  navLink.classList.toggle("active");
});

document.querySelectorAll(".nav-links").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    navLink.classList.remove("active");
  })
);



// Function to log out the user
function logout() {
  // Clear user session data (e.g., localStorage, sessionStorage, cookies)
  localStorage.removeItem('authToken'); // For token-based authentication
  sessionStorage.clear(); // Clears session storage
  
  // Optionally clear cookies if used
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // Redirect to the login page or home page
  window.location.href = 'http://127.0.0.1:5500/login/login1.html'; // Adjust the path as needed
}

// Example usage
document.getElementById('logoutButton').addEventListener('click', logout);


