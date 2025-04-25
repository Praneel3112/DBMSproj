document.getElementById("fineForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const data = {
      regNum: document.getElementById("regNum").value.trim(),
      violationType: document.getElementById("violationType").value.trim(),
      location: document.getElementById("location").value.trim(),
      penalty: document.getElementById("penalty").value,
      date: document.getElementById("date").value,
      officerId: document.getElementById("officerId").value
    };
  
    fetch("/api/violation-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        document.getElementById("responseMsg").innerText = res.message;
      })
      .catch(err => {
        document.getElementById("responseMsg").innerText = "Error submitting fine.";
        console.error(err);
      });
  });
  