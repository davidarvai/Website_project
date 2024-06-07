document.addEventListener("DOMContentLoaded", function() {
    // Fájlbeviteli mező és feltöltés gomb kiválasztása
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

    // Feltöltés gomb eseménykezelőjének hozzáadása
    uploadButton.addEventListener('click', function() {
        // Kiválasztott fájl lekérése
        const file = fileInput.files[0];
        if (file) { // Ha van kiválasztott fájl
            // FileReader létrehozása
            const reader = new FileReader();
            // Fájl betöltése eseménykezelő
            reader.onload = function(event) {
                // Fájl tartalmának és nevének lekérése
                const fileContent = event.target.result;
                const fileName = file.name;
                // Fájl feltöltése az API-ra
                fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fileName, fileContent })
                })
                .then(response => response.json()) // Válasz JSON formátumba alakítása
                .then(data => {
                    alert(data.message); // Válasz üzenetének megjelenítése
                })
                .catch(error => {
                    console.error('Error:', error); // Hibakezelés
                });
            };
            // Fájl beolvasása
            reader.readAsDataURL(file);
        } else { // Ha nincs kiválasztott fájl
            alert('Nincs fájl kiválasztva!'); // Figyelmeztetés megjelenítése
        }
    });
});
