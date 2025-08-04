// Paso 1: Cargar datos desde Google Sheets (usando la API pública)
async function fetchData() {
    const sheetId = "2PACX-1vRSYFRG8sb61AiPcOU8ZkZ-qB78TTeznBcqEs-ey45ANLr7kK7X8iqN34IupCOR0dZEqwBlgkJ6VLY";
    const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`;
    
    try {
        const response = await fetch(url);
        const csvData = await response.text();
        const parsedData = parseCSV(csvData);
        generateCharts(parsedData);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Paso 2: Parsear CSV (simplificado)
function parseCSV(csv) {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, j) => {
                row[header.trim()] = values[j].trim();
            });
            rows.push(row);
        }
    }
    return rows;
}

// Paso 3: Generar gráficos con patrones clave
function generateCharts(data) {
    // Ejemplo: Gráfico de síntomas frecuentes
    const symptoms = {};
    data.forEach(row => {
        const symptomList = row["Síntomas principales"]?.split(";") || [];
        symptomList.forEach(s => {
            symptoms[s] = (symptoms[s] || 0) + 1;
        });
    });

    new Chart(document.getElementById('symptomsChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(symptoms),
            datasets: [{
                label: 'Frecuencia de síntomas',
                data: Object.values(symptoms),
                backgroundColor: '#3498db'
            }]
        }
    });

    // Ejemplo 2: Edad de diagnóstico
    const ages = data.map(row => row["Edad de diagnóstico"]);
    new Chart(document.getElementById('ageDiagnosisChart'), {
        type: 'pie',
        data: {
            labels: [...new Set(ages)], // Valores únicos
            datasets: [{
                data: ages.reduce((acc, age) => {
                    acc[age] = (acc[age] || 0) + 1;
                    return acc;
                }, {}),
                backgroundColor: ['#e74c3c', '#2ecc71', '#f1c40f']
            }]
        }
    });
}

// Iniciar
fetchData();
