// Função para exibir mensagens
function showMessage(text, type) {
  const msgElement = document.getElementById("responseMessage");
  msgElement.textContent = text;
  msgElement.style.color = type === "error" ? "red" : "green";
}

// Função para carregar e exibir contatos
async function loadContacts() {
  try {
    const response = await fetch("http://localhost:3000/api/contacts");
    if (!response.ok) throw new Error("Erro ao carregar contatos");
    
    const contacts = await response.json();
    const tbody = document.getElementById("contactsTableBody");
    tbody.innerHTML = contacts.map(c => `
      <tr><td>${c.name}</td><td>${c.email}</td></tr>
    `).join("");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Evento de submit do formulário
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("http://localhost:3000/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao salvar!");
    }

    const data = await response.json();
    showMessage(data.message, "success");
    
    // Limpa o formulário e recarrega a lista
    document.getElementById("contactForm").reset();
    await loadContacts();
    
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// Carrega os contatos quando a página é aberta
document.addEventListener("DOMContentLoaded", loadContacts);