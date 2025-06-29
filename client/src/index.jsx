    import './index.css';

document.addEventListener("DOMContentLoaded", function () {
  const profilePhotoInput = document.getElementById("profilePhoto");
  const photoPreview = document.getElementById("photoPreview");
  const usernameInput = document.getElementById("username");
  const usernameFeedback = document.getElementById("usernameFeedback");
  const newPasswordInput = document.getElementById("newPassword");
  const passwordMeter = document.getElementById("passwordStrengthMeter");
  const passwordStrengthText = document.getElementById("passwordStrengthText");

  const step1Form = document.getElementById("step1-form");
  const step2Form = document.getElementById("step2-form");
  const step3Form = document.getElementById("step3-form");
  const professionSelect = document.getElementById("profession");
  const companySection = document.getElementById("companySection");
  const companyNameInput = document.getElementById("companyName");
    
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
const formDataStore = {};

  // Profile Photo Format
  profilePhotoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.src = e.target.result;
          photoPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        alert("File too large. Max size is 2MB.");
        profilePhotoInput.value = "";
        photoPreview.style.display = "none";
      }
    } else {
      alert("Only JPG and PNG allowed.");
      profilePhotoInput.value = "";
      photoPreview.style.display = "none";
    }
  });

  // Username Availability Check (mock/future API)
  usernameInput.addEventListener("input", async function () {
    const username = this.value.trim();

    if (!/^[^\s]{4,20}$/.test(username)) {
      usernameFeedback.textContent = "Username must be 4-20 characters with no spaces.";
      usernameFeedback.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/check-username?username=${username}`);
      const data = await res.json();

      if (data.available) {
        usernameFeedback.textContent = "Username is available";
        usernameFeedback.style.color = "green";
      } else {
        usernameFeedback.textContent = "Username is taken";
        usernameFeedback.style.color = "red";
      }
    } catch (err) {
      console.error("Error checking username:", err);
    }
  });

  // Password Strength Meter
  newPasswordInput.addEventListener("input", function () {
    const pwd = this.value;
    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;

    passwordMeter.value = strength;

    const levels = ["Too weak", "Weak", "Good", "Strong", "Very strong"];
    passwordStrengthText.textContent = levels[strength];
    passwordStrengthText.style.color = strength < 2 ? "red" : strength < 3 ? "orange" : "green";
  });
  // 1. Populate country dropdown (sample static list for now)
  const countries = [
    { id: "in", name: "India", states: [
      { id: "dl", name: "Delhi", cities: ["New Delhi", "Dwarka", "Rohini", "Pratanagar","LajpatNagar"] },
      { id: "mh", name: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur"] }
    ]},
    { id: "us", name: "United States", states: [
      { id: "ca", name: "California", cities: ["Los Angeles", "San Francisco", "San Diego"] },
      { id: "ny", name: "New York", cities: ["New York City", "Buffalo", "Rochester"] }
    ]}
  ];
  countries.forEach(c => countrySelect.add(new Option(c.name, c.id)));

  // 2. On country change → load states
  countrySelect.addEventListener("change", () => {
    stateSelect.innerHTML = '<option value="">--Select State--</option>';
    citySelect.innerHTML = '<option value="">--Select City--</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;

    const country = countries.find(c => c.id === countrySelect.value);
    if (country) {
      country.states.forEach(s => stateSelect.add(new Option(s.name, s.id)));
      stateSelect.disabled = false;
    }
  });

  // 3. On state change → load cities
  stateSelect.addEventListener("change", () => {
    citySelect.innerHTML = '<option value="">--Select City--</option>';
    citySelect.disabled = true;
    const country = countries.find(c => c.id === countrySelect.value);
    if (country) {
      const state = country.states.find(s => s.id === stateSelect.value);
      if (state) {
        state.cities.forEach(city => citySelect.add(new Option(city, city)));
        citySelect.disabled = false;
      }
    }
  });

  // Step 1 Submit → Move to Step 2
  step1Form.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = newPasswordInput.value;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;

    if (password && strength < 3) {
      alert("Password is too weak. It must have at least 8 characters, 1 special char, 1 number, and 1 uppercase letter.");
      return;
    }
 // Save data
  formDataStore.username = usernameInput.value;
  formDataStore.currentPassword = document.getElementById("currentPassword").value;
  formDataStore.newPassword = newPasswordInput.value;

  // For profile photo, save the File object for later
  formDataStore.profilePhoto = profilePhotoInput.files[0];
    // Move to Step 2
    step1Form.style.display = "none";
    step2Form.style.display = "block";
  });

  // Profession dropdown logic
  professionSelect.addEventListener("change", function () {
    if (this.value === "Entrepreneur") {
      companySection.style.display = "block";
    } else {
      companySection.style.display = "none";
      companyNameInput.value = "";
    }
  });

  // Step 2 Submit
  step2Form.addEventListener("submit", function (e) {
    e.preventDefault();

    const profession = professionSelect.value;
    const company = companyNameInput.value.trim();
    const address = document.getElementById("address1").value.trim();

    if (profession === "") {
      alert("Please select a profession.");
      return;
    }

    if (profession === "Entrepreneur" && company === "") {
      alert("Company name is required for Entrepreneurs.");
      return;
    }

    if (!address) {
      alert("Address Line 1 is required.");
      return;
    }

    alert("Step 2 validated. Ready for Step 3!");
    // Save data
  formDataStore.profession = professionSelect.value;
  formDataStore.companyName = companyNameInput.value.trim();
  formDataStore.address1 = document.getElementById("address1").value.trim();
  });
//  Move from Step 2 → Step 3
  step2Form.addEventListener("submit", function(e){
    e.preventDefault();
    // ... (existing Step 2 validations)
    step2Form.style.display = "none";
    step3Form.style.display = "block";
  });

  //  Step 3 submission → Summary
  step3Form.addEventListener("submit", function(e) {
    e.preventDefault();


    if (!countrySelect.value) return alert("Select a country.");
    if (!stateSelect.value) return alert("Select a state.");
    if (!citySelect.value) return alert("Select a city.");
// Save data
  formDataStore.country = countrySelect.value;
  formDataStore.state = stateSelect.value;
  formDataStore.city = citySelect.value;
  formDataStore.plan = document.querySelector('input[name="plan"]:checked').value;
  formDataStore.newsletter = document.getElementById("newsletter").checked;
    showSummary();
  });

  //  Show summary function
  function showSummary() {
    const summaryHtml = `
    <div class="container">
      <div class="form-area" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
      <h2>Confirm Your Details</h2>
      <ul style="list-style:none; padding: 0; max-width: 400px; width: 100%;">
          <li><strong>Username:</strong> ${formDataStore.username}</li>
          <li><strong>Profession:</strong> ${formDataStore.profession}${formDataStore.profession==="Entrepreneur"? " at "+formDataStore.companyName:""}</li>
          <li><strong>Address Line 1:</strong> ${formDataStore.address1}</li>
          <li><strong>Location:</strong> ${getTextByValue(countrySelect, formDataStore.country)}, ${getTextByValue(stateSelect, formDataStore.state)}, ${formDataStore.city}</li>
          <li><strong>Plan:</strong> ${formDataStore.plan}</li>
          <li><strong>Newsletter Subscribed:</strong> ${formDataStore.newsletter ? "Yes" :"No"}</li>
      </ul>
      <button id="final-submit">Confirm & Submit</button>
      </div>
      </div>
    `;

    document.getElementById("app").innerHTML = summaryHtml;

    document.getElementById("final-submit").addEventListener("click", submitFinal);
  }
function getTextByValue(selectElement, value) {
  const option = Array.from(selectElement.options).find(o => o.value === value);
  return option ? option.text : value;
}
  //  Final submission handler
  function submitFinal() {
    if (!formDataStore.profilePhoto) {
    alert("Please upload a profile photo.");
    return;
  }

  const fd = new FormData();
  fd.append("username", formDataStore.username);
  fd.append("profession", formDataStore.profession);
  fd.append("companyName", formDataStore.companyName);
  fd.append("address1", formDataStore.address1);
  fd.append("country", formDataStore.country);
  fd.append("state", formDataStore.state);
  fd.append("city", formDataStore.city);
  fd.append("plan", formDataStore.plan);
  fd.append("newsletter", formDataStore.newsletter);
  fd.append("profilePhoto", formDataStore.profilePhoto);

  fetch("http://localhost:5000/api/profile", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert(data.message || "Profile saved successfully!");
        // Reload form UI for step 1 again
        location.reload();
      }
    })
    .catch((err) => {
      console.error("Error submitting profile:", err);
      alert("Failed to submit profile.");
    });
}


  // Sidebar steps clickable handling
const stepsListItems = document.querySelectorAll(".steps-list .step");
const progressCircles = document.querySelectorAll(".step-progress .circle");

function showStep(stepNumber) {
  // Hide all forms
  step1Form.style.display = "none";
  step2Form.style.display = "none";
  step3Form.style.display = "none";

  // Show the current step form
  if (stepNumber === 1) step1Form.style.display = "block";
  else if (stepNumber === 2) step2Form.style.display = "block";
  else if (stepNumber === 3) step3Form.style.display = "block";

  // Update sidebar active step
  stepsListItems.forEach(item => {
    item.classList.toggle("active", parseInt(item.dataset.step) === stepNumber);
  });

  // Update progress circles active
  progressCircles.forEach((circle, idx) => {
    circle.classList.toggle("active", idx < stepNumber);
  });
}

// Add click listeners to sidebar steps
stepsListItems.forEach(item => {
  item.addEventListener("click", () => {
    const stepNum = parseInt(item.dataset.step);
    showStep(stepNum);
  });
});


showStep(1);

 

step1Form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  showStep(2);
});

step2Form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  showStep(3);
});

step3Form.addEventListener("submit", function (e) {
  e.preventDefault();
  showSummary();
});

});
