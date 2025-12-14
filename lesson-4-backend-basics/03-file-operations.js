const fs = require("fs");
const path = require("path");

console.log("=== Odczyt synchroniczny ===");
try {
  const data = fs.readFileSync(__filename, "utf-8");
  console.log("Plik odczytany pomyślnie, długość:", data.length, "znaków");
} catch (error) {
  console.error("Błąd odczytu:", error.message);
}

console.log("\n=== Odczyt asynchroniczny (callback) ===");
fs.readFile(__filename, "utf-8", (error, data) => {
  if (error) {
    console.error("Błąd:", error.message);
    return;
  }
  console.log(
    "Plik odczytany asynchronicznie, długość:",
    data.length,
    "znaków"
  );
});

console.log("\n=== Odczyt z Promise ===");
const fsPromises = require("fs").promises;

fsPromises
  .readFile(__filename, "utf-8")
  .then((data) => {
    console.log(
      "Plik odczytany przez Promise, długość:",
      data.length,
      "znaków"
    );
  })
  .catch((error) => {
    console.error("Błąd:", error.message);
  });

const dataToWrite = {
  timestamp: new Date().toISOString(),
  message: "Testowe dane",
  numbers: [1, 2, 3, 4, 5],
};

const filePath = path.join(__dirname, "data.json");

fs.writeFile(filePath, JSON.stringify(dataToWrite, null, 2), (error) => {
  if (error) {
    console.error("Błąd zapisu:", error.message);
    return;
  }
  console.log("\n=== Zapis do pliku ===");
  console.log("Dane zapisane do:", filePath);
});

const logPath = path.join(__dirname, "log.txt");
const logMessage = `[${new Date().toISOString()}] Aplikacja uruchomiona\n`;

fs.appendFile(logPath, logMessage, (error) => {
  if (error) {
    console.error("Błąd dołączania:", error.message);
    return;
  }
  console.log("Log zapisany do:", logPath);
});

console.log("\n=== Sprawdzanie istnienia pliku ===");
fs.access(__filename, fs.constants.F_OK, (error) => {
  console.log(`Plik ${__filename} ${error ? "nie istnieje" : "istnieje"}`);
});

const testDir = path.join(__dirname, "test-folder");

fs.mkdir(testDir, { recursive: true }, (error) => {
  if (error) {
    console.error("Błąd tworzenia katalogu:", error.message);
    return;
  }
  console.log("\n=== Katalog utworzony ===");

  setTimeout(() => {
    fs.rmdir(testDir, (error) => {
      if (error) {
        console.error("Błąd usuwania katalogu:", error.message);
        return;
      }
      console.log("Katalog usunięty");
    });
  }, 2000);
});
