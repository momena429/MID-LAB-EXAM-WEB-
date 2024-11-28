// Select the profile picture and the personal info elements
const profilePic = document.getElementById("profile-pic");
const personalInfo = document.getElementById("personal-info");

// Function to show personal information
function showPersonalInfo() {
  personalInfo.style.display = "block"; // Show personal info
}

// Function to hide personal information
function hidePersonalInfo() {
  personalInfo.style.display = "none"; // Hide personal info
}

// Add event listeners for mouse enter and leave
profilePic.addEventListener("mouseenter", showPersonalInfo);
profilePic.addEventListener("mouseleave", hidePersonalInfo);
