const fs = require("fs");
const path = require("path");
const { loadContacts } = require("../server");

jest.mock("fs");

describe("Função loadContacts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deve retornar [] e registrar erro se fs.readFileSync lançar exceção", () => {
    // Simula exceção ao ler arquivo
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation(() => {
      throw new Error("Falha ao ler arquivo");
    });

    // Captura o console.error
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const resultado = loadContacts();

    expect(resultado).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith("Erro ao carregar contatos:", expect.any(Error));
  });
});
