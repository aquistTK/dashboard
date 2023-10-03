
import { csv } from "https://cdn.skypack.dev/d3-fetch@3";

const fileInput = document.getElementById('inputFile');
fileInput.onchange = () => {
    const selectedFile = fileInput.files[0];
    const selectedURL = URL.createObjectURL(selectedFile);
    console.log(selectedURL);

    csv(selectedURL).then((data) => {
        parseRows(data);
        // console.log(data); // [{"Hello": "world"}, …]
    });
}

const attributeHeatmap = {};
const viewMap = {};
const sessionInfo = {}

function parseRows(rowData) {

    rowData.forEach(row => {

        const configArray = JSON.parse(row['current_configuration']);

        const sessionID = row['session_id'];

        let sessionExists = true;
        if (!(sessionID in sessionInfo)) {
            sessionExists = false;
            sessionInfo[sessionID] = {};
        }

        for (const [key, value] of Object.entries(configArray)) {



            let attributeChoice = value;
            if (typeof attributeChoice === "object") {
                // attributeChoice = 'not chosen';
                if (!('assetId' in attributeChoice)) {
                    // attributeChoice = JSON.stringify(attributeChoice);
                    attributeChoice = 'other';
                }
                else {
                    attributeChoice = attributeChoice['assetId'];
                }
            }
            if (attributeChoice === "") {
                attributeChoice = 'not chosen';
            }

            if (!sessionExists) {
                if ((key in attributeHeatmap)) {
                    if (!(attributeChoice in attributeHeatmap[key])) {
                        attributeHeatmap[key][attributeChoice] = 1;
                    } else {
                        attributeHeatmap[key][attributeChoice] += 1;
                    }
                } else {
                    attributeHeatmap[key] = {}
                }
            }

            if ((key in viewMap)) {
                if (!(attributeChoice in viewMap[key])) {
                    viewMap[key][attributeChoice] = 1;
                } else {
                    viewMap[key][attributeChoice] += 1;
                }
            } else {
                viewMap[key] = {}
            }
            
        }

    });

    console.log(attributeHeatmap);

    showBothCharts("Alcove");

    var select = document.getElementById("attributeSelect");
    var options = Object.keys(attributeHeatmap);

    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

    select.addEventListener('change', function() {
        showBothCharts(this.value);
      });
}


function showBothCharts(keyName) {
    aChart.data = {
        datasets: [{
            label: keyName,
            data: attributeHeatmap[keyName],
        },
        {
            label: "views",
            data: viewMap[keyName],
        }]
    };
    aChart.update();
}


function showEndConfigChart(keyName) {
    aChart.data = {
        datasets: [{
            label: keyName,
            data: attributeHeatmap[keyName],
        }]
    };
    aChart.update();
}

function showHeatMapChart(keyName) {
    aChart.data = {
        datasets: [{
            label: keyName,
            data: viewMap[keyName],
        }]
    };
    aChart.update();
}

const ctx = document.getElementById('myChart');

var aChart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [{
            label: "option 1",
            data: { one: 12, two: 19, three: 3, four: 5, five: 2, six: 3 },
        },
        {
            label: "option 2",
            data: { a: 12, b: 19, c: 3, d: 5, e: 2, f: 3 },
        }],
        options: {
            autopPadding: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }

});