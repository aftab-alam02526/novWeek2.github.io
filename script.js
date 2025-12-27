const pincodeInput = document.getElementById("pincodeInput");
const lookupBtn = document.getElementById("lookupBtn");
const errorDiv = document.getElementById("error");
const loader = document.getElementById("loader");
const resultsDiv = document.getElementById("results");
const filterSection = document.getElementById("filterSection");
const filterInput = document.getElementById("filterInput");
const messageDiv = document.getElementById("message");

let postOffices = [];

lookupBtn.addEventListener("click", lookupPincode);
filterInput.addEventListener("input", filterResults);

function lookupPincode() {
  const pincode = pincodeInput.value.trim();

  errorDiv.textContent = "";
  resultsDiv.innerHTML = "";
  messageDiv.textContent = "";
  filterSection.style.display = "none";

  if (!/^\d{6}$/.test(pincode)) {
    errorDiv.textContent = "Please enter a valid 6-digit pincode.";
    return;
  }

  loader.style.display = "block";

  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then(res => res.json())
    .then(data => {
      loader.style.display = "none";

      if (data[0].Status !== "Success") {
        errorDiv.textContent = data[0].Message;
        return;
      }

      postOffices = data[0].PostOffice;
      filterSection.style.display = "block";
      displayResults(postOffices);
    })
    .catch(() => {
      loader.style.display = "none";
      errorDiv.textContent = "Something went wrong. Please try again.";
    });
}

function displayResults(data) {
  resultsDiv.innerHTML = "";
  messageDiv.textContent = "";

  if (data.length === 0) {
    messageDiv.textContent =
      "Couldn’t find the postal data you’re looking for…";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p><strong>Post Office:</strong> ${item.Name}</p>
      <p><strong>Pincode:</strong> ${item.Pincode}</p>
      <p><strong>District:</strong> ${item.District}</p>
      <p><strong>State:</strong> ${item.State}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

function filterResults() {
  const value = filterInput.value.toLowerCase();

  const filtered = postOffices.filter(po =>
    po.Name.toLowerCase().includes(value)
  );

  displayResults(filtered);
}
