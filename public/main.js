console.log("main.js loaded"); // A fő JavaScript fájl betöltésének ellenőrzése

const productTable = document.querySelector('#productTable tbody'); // Termékek táblázatának kiválasztása
const serviceTable = document.querySelector('#serviceTable tbody'); // Szolgáltatások táblázatának kiválasztása

if (productTable) { // Ha van termékek táblázat
    fetch('/api/products') // Termékek lekérése az API-ból
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Hiba kezelése, ha a válasz nem volt rendben
            }
            return response.json();
        })
        .then(products => {
            console.log(products); // Termékek a konzolban
            products.forEach(product => {
                // Minden termék hozzáadása a táblázathoz
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                `;
                productTable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching products:', error)); // Hiba esetén hibaüzenet a konzolon
}

if (serviceTable) { // Ha van szolgáltatások táblázat
    fetch('/api/services') // Szolgáltatások lekérése az API-ból
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Hiba kezelése, ha a válasz nem volt rendben
            }
            return response.json();
        })
        .then(services => {
            console.log(services); // Szolgáltatások a konzolban
            services.forEach(service => {
                // Minden szolgáltatás hozzáadása a táblázathoz
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${service.name}</td>
                    <td>${service.description}</td>
                    <td>${service.price}</td>
                `;
                serviceTable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching services:', error)); // Hiba esetén hibaüzenet a konzolon
}
