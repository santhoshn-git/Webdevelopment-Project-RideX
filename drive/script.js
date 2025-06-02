document.querySelector('.btn').addEventListener('click', () => {
    alert("Fill the below form!");
});

const registerButton = document.querySelector('#register-btn');
const registerFormContainer = document.querySelector('#register-form-container');
const registerForm = document.querySelector('#register-form');
const successMessage = document.querySelector('#success-message');

// Show the registration form when "Register" is clicked
registerButton.addEventListener('click', () => {
    registerFormContainer.style.display = 'block'; // Show the form
    successMessage.style.display = 'none'; // Hide success message if visible
});

// Handle form submission
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload

    // Get form data
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const profilePhoto = document.querySelector('#profile-photo').files[0];
    const drivingLicense = document.querySelector('#driving-license').files[0];

    // Simple validation
    if (!name || !email || !phone || !profilePhoto || !drivingLicense) {
        alert('Please fill out all fields and upload required documents.');
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('profile-photo', profilePhoto);
    formData.append('driving-license', drivingLicense);

    try {
        const response = await fetch('http://localhost:3000/api/register-driver', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            // Display success message
            registerFormContainer.style.display = 'none'; // Hide the form
            successMessage.style.display = 'block'; // Show success message
            successMessage.textContent = result.message; // Show success message
            alert(result.message); // Show success alert
        } else {
            // Handle error from server with more detailed feedback
            console.error('Error:', result); // Log detailed error for debugging
            alert(result.message || 'An unexpected error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error); // Log any network or other errors
        alert('An error occurred during registration. Please check your internet connection and try again.');
    }
});

// Select the "Cities" link by ID
const citiesLink = document.getElementById('cities-link');

// Add an event listener for the "Cities" link
citiesLink.addEventListener('click', function(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Create a link element
    const link = document.createElement('a');
    
    // Set the download attribute with the file name (ensure the PDF file is in the same folder)
    link.href = 'RideX cities.pdf'; // Replace 'yourfile.pdf' with the name of your PDF file
    link.download = 'cities-transportation-needs.pdf'; // This is the file name that will be saved
    
    // Programmatically click the link to trigger the download
    link.click();
});

// Send the form data to your email using EmailJS
// Initialize EmailJS with your user ID
emailjs.init('prarn8NsUUDycnOoW');

// Get the form and button elements
const form = document.getElementById('form');
const btn = document.getElementById('button');

// Add event listener to handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    btn.value = 'Sending...'; // Change the button text to "Sending..."

    const serviceID = 'default_service'; // EmailJS service ID
    const templateID = 'template_oyp55hm'; // EmailJS template ID

    // Send form data using EmailJS
    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.value = 'Send Email'; // Reset the button text
            alert('Sent!'); // Show success message
        }, (err) => {
            btn.value = 'Send Email'; // Reset the button text
            alert('Failed to send email. Please try again.'); // Improved error message
        });
});
