document.getElementById("gform").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get all input fields and their corresponding error spans
  const fields = [
    { id: "firstName", message: "Please enter your first name" },
    { id: "lastName", message: "Please enter your last name" },
    { id: "email", message: "Please enter a valid email address" },
    { id: "phoneNumber", message: "Please enter your phone number" },
    { id: "address", message: "Please enter your address" },
    { id: "city", message: "Please enter your city" },
  ];

  let formIsValid = true; // Assume the form is valid initially

  fields.forEach(function (field) {
    const inputElement = document.getElementById(field.id);
    const errorElement = inputElement.nextElementSibling;
    const value = inputElement.value.trim();

    // Check if the field is empty
    if (value === "") {
      errorElement.textContent = `*${field.message}`; // Set error message
      errorElement.style.display = "block"; // Show the error
      formIsValid = false; // Mark form as invalid
    } else {
      errorElement.style.display = "none"; // Hide the error if filled
    }
  });

  // If the form is valid, you can now proceed with form submission logic
  if (formIsValid) {
    alert("Order submitted successfully!");
    // You can uncomment the next line to submit the form if needed.
    // event.target.submit();
  }
});
