/*
 * ChartJS: create actual chart from table data
 */
function BuildChart(chartName, chartTitle, labelTitle, data, horizontal) {
    Chart.defaults.set('plugins.datalabels', {
        color: '#FFF' // Default color
    });
    var ctx = document.getElementById(chartName).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                label: labelTitle,
                backgroundColor: [
                    'rgba(60, 60, 60, 0.60)',
                ],
                borderColor: [
                    'rgba(255, 99,  132, 0.5)',
                    'rgba( 54, 162, 235, 0.5)',
                    'rgba(255, 206,  86, 0.5)',
                    'rgba( 75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159,  64, 0.5)'
                ],
                borderWidth: 1, // Specify bar border width
                barPercentage: 1,
            }],
        },
        options: {
            ...(horizontal && { indexAxis: 'y' }),
            responsive: true,
            maintainAspectRatio: false, // Add to prevent default behavior of full width/height
            scaleShowLabels: false,
            aspectRatio: 2, // Default: 2
            layout: {
                padding: 10
            },
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                },
                labels: {
                    showZero: false,
                },
                legend: {
                    display: false
                },
                scales: {
                    display: false
                },
                datalabels: {
                    anchor: 'end',
                },
            },
        }       
    });
    return chart
}
Chart.register(ChartDataLabels);

/*
* Get values from HTML table to create charts with buildChart
*/
function tableJson(tableName) {
    var table = document.getElementById(tableName);
    var json = []; // First row needs to be headers 
    var headers = [];        
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }
    // Go through cells 
    for (i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (let j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        json.push(rowData);
    }
    return json
}