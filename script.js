const availableCounselors = [
  { name: "Dr Shelby McGraw", slots: ["09:00", "10:00", "11:00"] },
  { name: "Prof Ben Smith", slots: ["12:00", "13:00", "14:00"] },
  { name: "Dr Harrison Ford", slots: ["15:00", "16:00", "17:00"] }
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('bookingForm');
  const summary = document.getElementById('summary');
  const counselorSelect = document.getElementById('counselor');
  const ageInput = document.getElementById('age');
  const minorNote = document.getElementById('minorNote');
  const slotSelect = document.getElementById('slot');

  // Populate the counselor dropdown
  function populateCounselors() {
    availableCounselors.forEach(counselor => {
      const option = document.createElement('option');
      option.value = counselor.name;
      option.textContent = counselor.name;
      counselorSelect.appendChild(option);
    });
  }

  // Generate all time slots from 09:00 to 18:00
  function generateFullTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      slots.push(time);
    }
    return slots;
  }

  // Populate slots from 9:00 AM to 6:00 PM
  function populateSlots() {
    const slots = generateFullTimeSlots();
    slotSelect.innerHTML = ''; // Clear previous options

    slots.forEach(slot => {
      const slotOption = document.createElement('option');
      slotOption.value = slot;
      slotOption.textContent = slot;
      slotSelect.appendChild(slotOption);
    });
  }

  counselorSelect.addEventListener('change', () => {
    populateSlots();
  });

  slotSelect.addEventListener('change', () => {
    const selectedCounselor = availableCounselors.find(counselor => counselor.name === counselorSelect.value);
    const selectedSlot = slotSelect.value;

    if (selectedCounselor && !selectedCounselor.slots.includes(selectedSlot)) {
      alert(`${selectedSlot} is not available for ${selectedCounselor.name}. Please choose a different slot.`);
      slotSelect.value = ''; // Clear the invalid selection
    }
  });

  ageInput.addEventListener('input', () => {
    // Remove non-numeric characters from age input
    ageInput.value = removeNonNumericCharacters(ageInput.value);

    const age = parseInt(ageInput.value, 10);
    minorNote.textContent = age < 18 ? ' (Minor)' : '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const slot = slotSelect.value;
    const type = document.getElementById('type').value;
    const duration = document.getElementById('duration').value;
    const counselor = counselorSelect.value;

    // Validate empty field
    if (!name || !age || !phone || !email || !date || !slot || !type || !duration || !counselor) {
      alert('Please fill in all fields.');
      return;
    }

    // Validate age input
    if (!validateAge(age)) {
      alert('Please enter a valid age (minimum 5).');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate phone number format
    if (!validatePhone(phone)) {
      alert('Please enter a valid phone number (11-14 characters, including optional + to include country code).');
      return;
    }

    const selectedCounselor = availableCounselors.find(c => c.name === counselor);

    if (!selectedCounselor.slots.includes(slot)) {
      alert(`${counselor} is not available at ${slot}. Please choose a different slot.`);
      return;
    }

    const cost = calculateCost(type, duration);

    summary.innerHTML = `
      <h2>Session Details</h2><br/>
      <p><strong>Full Name:</strong> ${name}</p><br/>
      <p><strong>Age:</strong> ${age} ${age < 18 ? '(Minor)' : ''}</p><br/>
      <p><strong>Phone No. :</strong> ${phone}</p><br/>
      <p><strong>Email Address:</strong> ${email}</p><br/>
      <p><strong>Booking Date:</strong> ${date}</p><br/>
      <p><strong>Slot:</strong> ${slot}</p><br/>
      <p><strong>Type of Counselling:</strong> ${type}</p><br/>
      <p><strong>Duration:</strong> ${duration} minutes</p><br/>
      <p><strong>Counselor:</strong> ${counselor}</p><br/>
      <p><strong>Total Cost:</strong> NGN ${cost.toFixed(2)}</p>
    `;
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
  });

  function calculateCost(type, duration) {
    const baseRate = 15000; // Base rate per hour
    const typeMultiplier = {
      'Individual': 1,
      'Couples': 1.5,
      'Family': 2
    };
    return baseRate * (duration / 60) * typeMultiplier[type];
  }

  // Validate Email Input
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  // Validate Phone Number Input
  function validatePhone(phone) {
    const re = /^\+?\d{11,14}$/;
    return re.test(phone);
  }

  // Validate Age Input
  function validateAge(age) {
    const re = /^\d+$/;
    return re.test(age) && parseInt(age, 10) >= 5;
  }

  // Remove non-numeric characters from input
  function removeNonNumericCharacters(input) {
    return input.replace(/\D/g, '');
  }

  populateCounselors();
  populateSlots(); // Initial population of slots based on the default selected counselor
});
