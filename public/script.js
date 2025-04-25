// Wait for DOM to load
window.addEventListener('DOMContentLoaded', function () {
  const showAddBtn = document.getElementById('showAddOffenderFine');
  const showCheckBtn = document.getElementById('showCheckFine');
  const addOffenderFineForm = document.getElementById('addOffenderFineForm');
  const checkFineForm = document.getElementById('checkFineForm');
  const resultMsg = document.getElementById('resultMsg');

  // Hide all forms initially
  addOffenderFineForm.style.display = 'none';
  checkFineForm.style.display = 'none';

  showAddBtn.onclick = function() {
    addOffenderFineForm.style.display = '';
    checkFineForm.style.display = 'none';
    resultMsg.innerText = '';
  };
  showCheckBtn.onclick = function() {
    addOffenderFineForm.style.display = 'none';
    checkFineForm.style.display = '';
    resultMsg.innerText = '';
  };

  // Add Offender Form Submission
  addOffenderFineForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('offenderName').value.trim();
    const license = document.getElementById('offenderLicense').value.trim();
    const address = document.getElementById('offenderAddress').value.trim();
    const contact = document.getElementById('offenderContact').value.trim();
    const fineAmount = document.getElementById('fineAmountAdd').value.trim();
    resultMsg.style.color = '#d7263d';
    if (!name || !license || !address || !contact || !fineAmount || isNaN(fineAmount) || Number(fineAmount) <= 0) {
      resultMsg.innerText = 'All fields are required and fine amount must be valid.';
      return;
    }
    fetch('/api/add-offender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, license, address, contact, fineAmount: Number(fineAmount) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          resultMsg.style.color = 'green';
          resultMsg.innerText = 'Offender and fine added successfully!';
          addOffenderFineForm.reset();
        } else {
          resultMsg.innerText = data.message || 'Failed to add offender and fine.';
        }
      })
      .catch(() => {
        resultMsg.innerText = 'Error adding offender and fine.';
      });
  };

  // Check Fine Form Submission
  checkFineForm.onsubmit = function(e) {
    e.preventDefault();
    const reg = document.getElementById('regNumCheck').value.trim();
    resultMsg.style.color = '#d7263d';
    if (!reg) {
      resultMsg.innerText = 'Please enter a registration number.';
      return;
    }
    resultMsg.innerText = 'Checking...';
    fetch(`/api/fines?reg=${encodeURIComponent(reg)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const fine = data[0];
          resultMsg.style.color = 'green';
          resultMsg.innerText = `Status: ${fine.Payment_Status}, Fine Amount: ₹${fine.Amount}`;
        } else if (data && data.message) {
          resultMsg.innerText = data.message;
        } else {
          resultMsg.innerText = 'No fines found for the given details.';
        }
      })
      .catch(() => {
        resultMsg.innerText = 'Error checking fine.';
      });
  };
});
