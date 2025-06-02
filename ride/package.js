let map;
let directionsService;
let directionsRenderer;
const packageOptionsContainer = document.getElementById("package-options"); // Package options container

function initMap() {
    const initialLocation = { lat: 20.5937, lng: 78.9629 }; // Center map on India
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 5,
    });

    // Initialize Directions API
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Initialize autocomplete for inputs
    const pickupInput = document.getElementById("pickup");
    const dropoffInput = document.getElementById("dropoff");

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
    });

    const dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
    });

    // Event listener for calculating package delivery price
    document.getElementById("see-prices").addEventListener("click", displayPackageDelivery);
}

// Function to calculate package price based on distance and selected item
function calculatePackagePrice(distanceInKm, selectedItem) {
    const baseFare = 50; // ₹50 base fare

    const perKmRates = {
        electronics: 20, // ₹20 per km
        "washing-machine": 35, // ₹35 per km
        fridge: 40, // ₹40 per km
        other: 15, // ₹15 per km
    };

    let totalPrice = baseFare + (perKmRates[selectedItem] * distanceInKm);

    // Apply a 10% discount if distance > 20 km
    if (distanceInKm > 20) {
        totalPrice *= 0.9; // 10% discount
    }

    return totalPrice.toFixed(2); // Ensure two decimal places
}


// Function to display package delivery details
function displayPackageDelivery() {
    console.log("Display package delivery triggered");

    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;
    const selectedItem = document.getElementById("item").value;

    if (!pickup || !dropoff || !selectedItem) {
        alert("Please enter both Pickup and Dropoff locations and select an item.");
        return;
    }

    // Request route and calculate distance for package delivery
    const request = {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0].legs[0];
            const distanceInKm = (route.distance.value / 1000).toFixed(2);

            // Calculate package delivery price based on selected item
            const price = calculatePackagePrice(distanceInKm, selectedItem);

            // Display the price for package delivery
            packageOptionsContainer.innerHTML = ""; // Clear existing options
            const packageOption = document.createElement("div");
            packageOption.className = "package-option";
            packageOption.innerHTML = `
                <div class="package-info">
                    <h3>Package: ${selectedItem}</h3>
                    <p>Distance: ${distanceInKm} km</p>
                    <p>Price: ₹${price}</p>
                </div>
            `;

            packageOption.addEventListener("click", () => bookPackageDelivery(price, selectedItem, pickup, dropoff, distanceInKm));
            packageOptionsContainer.appendChild(packageOption);

            // Update route on the map
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(result);
        } else {
            alert("Could not calculate route. Please check your locations.");
        }
    });
}

async function bookPackageDelivery(price, selectedItem, pickup, dropoff, distanceInKm) {
    const date = document.getElementById("delivery-date").value;
    const time = document.getElementById("delivery-time").value;

    if (!pickup || !dropoff || !date || !time || !selectedItem) {
        alert("Please fill in all fields.");
        return;
    }

    const userToken = localStorage.getItem("userToken"); // Fetch the token from localStorage
    if (!userToken) {
        alert("Authentication token is missing. Please log in.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/book-package", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userToken}`, // Add the token to the Authorization header
            },
            body: JSON.stringify({
                pickup,
                dropoff,
                item: selectedItem,
                price,
                date,
                time,
                distance: distanceInKm
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error booking package delivery:", error);
        alert("An error occurred. Please try again.");
    }
}

