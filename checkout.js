document.getElementById("payBtn").addEventListener("click", async () => {
  const res = await fetch("https://YOUR_BACKEND_URL/create-checkout", {
    method: "POST"
  });

  const data = await res.json();
  window.location.href = data.url;
});
  
