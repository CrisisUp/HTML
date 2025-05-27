document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("http://localhost:3000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();
    document.getElementById("responseMessage").textContent = data.message;
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("responseMessage").textContent = "Erro ao enviar dados!";
  }
});