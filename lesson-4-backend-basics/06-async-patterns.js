console.log("=== 1. CALLBACK ===");
function fetchDataCallback(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "Jan Kowalski" };
    callback(null, data);
  }, 1000);
}

fetchDataCallback((error, data) => {
  if (error) {
    console.error("Błąd:", error);
    return;
  }
  console.log("Dane (callback):", data);
});

console.log("\n=== 2. PROMISE ===");
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({ id: 2, name: "Anna Nowak" });
      } else {
        reject(new Error("Błąd pobierania danych"));
      }
    }, 1000);
  });
}

fetchDataPromise()
  .then((data) => {
    console.log("Dane (promise):", data);
    return data.id;
  })
  .then((id) => {
    console.log("ID:", id);
  })
  .catch((error) => {
    console.error("Błąd:", error.message);
  });

console.log("\n=== 3. ASYNC/AWAIT ===");
async function fetchDataAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 3, name: "Piotr Wiśniewski" });
    }, 1000);
  });
}

async function main() {
  try {
    const data = await fetchDataAsync();
    console.log("Dane (async/await):", data);

    const [user1, user2] = await Promise.all([
      fetchDataAsync(),
      fetchDataAsync(),
    ]);
    console.log("Równoległe dane:", user1, user2);
  } catch (error) {
    console.error("Błąd:", error.message);
  }
}

main();

console.log("\n=== 4. OBSŁUGA BŁĘDÓW ===");

function badExample() {
  fetchDataCallback((error, data1) => {
    if (error) return console.error(error);

    fetchDataCallback((error, data2) => {
      if (error) return console.error(error);

      fetchDataCallback((error, data3) => {
        if (error) return console.error(error);
        console.log("Callback hell:", data1, data2, data3);
      });
    });
  });
}

async function goodExample() {
  try {
    const data1 = await fetchDataAsync();
    const data2 = await fetchDataAsync();
    const data3 = await fetchDataAsync();
    console.log("Czytelny kod:", data1, data2, data3);
  } catch (error) {
    console.error("Błąd:", error);
  }
}

console.log("\n=== 5. PROMISE RACE ===");
const slowPromise = new Promise((resolve) =>
  setTimeout(() => resolve("Wolny"), 3000)
);
const fastPromise = new Promise((resolve) =>
  setTimeout(() => resolve("Szybki"), 1000)
);

Promise.race([slowPromise, fastPromise]).then((result) =>
  console.log("Zwycięzca:", result)
);

console.log("\n=== 6. PROMISE ALLSETTLED ===");
const promises = [
  Promise.resolve("Sukces 1"),
  Promise.reject("Błąd 1"),
  Promise.resolve("Sukces 2"),
];

Promise.allSettled(promises).then((results) => {
  console.log("Wszystkie wyniki:");
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`  ${index}: Sukces -`, result.value);
    } else {
      console.log(`  ${index}: Błąd -`, result.reason);
    }
  });
});
