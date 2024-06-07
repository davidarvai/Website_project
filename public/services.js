console.log("services.js loaded"); // Az eszközkonzolra üzenet küldése, hogy a services.js fájl betöltődött

fetch('/api/services') // HTTP kérés küldése a /api/services végpontra
    .then(response => { // A válasz feldolgozása
        if (!response.ok) { // Ellenőrzi, hogy a válasz sikeres volt-e
            throw new Error('Network response was not ok'); // Hibát dob, ha a válasz nem volt sikeres
        }
        return response.json(); // Visszatér a válasszal, ha az sikeres, és átalakítja a JSON formátumot JS objektummá
    })
    .then(services => { // A szolgáltatások feldolgozása
        console.log(services); // Az eszközkonzolra kiírja a szolgáltatásokat
        const tbody = document.querySelector('#serviceTable tbody'); // A szolgáltatások táblázat tbody elemének lekérése
        if (!tbody) { // Ellenőrzi, hogy a tbody elem létezik-e
            throw new Error('serviceTable tbody element not found'); // Hibát dob, ha a tbody elem nem található
        }
        services.forEach(service => { // Végigmegy a szolgáltatásokon
            const tr = document.createElement('tr'); // Létrehoz egy új tr elemet
            tr.innerHTML = `
                <td>${service.name}</td> <!-- Az első oszlopban a szolgáltatás neve -->
                <td>${service.description}</td> <!-- A második oszlopban a szolgáltatás leírása -->
                <td>${service.price}</td> <!-- A harmadik oszlopban a szolgáltatás ára -->
            `;
            tbody.appendChild(tr); // Hozzáadja a tr elemet a szolgáltatások táblázathoz
        });

        // Kereső funkció hozzáadása a szolgáltatások betöltése után
        addServiceSearchFunctionality();
    })
    .catch(error => console.error('Error fetching services:', error)); // Hibakezelés, kiírja a hibát az eszközkonzolra

function addServiceSearchFunctionality() { // A kereső funkció hozzáadása
    const serviceSearchInput = document.getElementById('serviceSearchInput'); // A szolgáltatások keresőmezőjének lekérése
    const serviceRows = document.querySelectorAll('#serviceTable tbody tr'); // A szolgáltatások táblázat sorainak lekérése

    serviceSearchInput.addEventListener('input', function() { // Eseményfigyelő hozzáadása a keresőmezőhöz
        const searchTerm = serviceSearchInput.value.toLowerCase().trim(); // A keresőmező értékének lekérése, kisbetűsítése és levágása a felesleges szóközökről

        serviceRows.forEach(row => { // Végigmegy a szolgáltatások táblázat sorain
            const name = row.getElementsByTagName('td')[0].innerText.toLowerCase(); // A sor első oszlopának szövege kisbetűsítve
            if (name.includes(searchTerm)) { // Ellenőrzi, hogy a név tartalmazza-e a keresett szót
                row.style.display = ''; // Ha igen, megjeleníti a sort
            } else {
                row.style.display = 'none'; // Ha nem, elrejti a sort
            }
        });
    });
}
