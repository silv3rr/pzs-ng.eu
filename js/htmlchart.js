/*
 * Create actual chart from table data using ChartJS
 */
function buildChart(chartName, chartTitle, labelTitle, labels, data, horizontal) {
    Chart.defaults.set('plugins.datalabels', {
        color: '#FFF' // Default color
    });
    var ctx = document.getElementById(chartName).getContext('2d');
    return new Chart(ctx, {
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
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 99,
                    }
                }
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
    //return chart
}
Chart.register(ChartDataLabels);

/*
* Get values from HTML table as JSON
*/
function tableJson(tableName) {
    var table = document.getElementById(tableName);
    var json = []; // First row needs to be headers 
    var headers = [];        
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
    }
    // Go through cells 
    for (let i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (let j = 0; j < tableRow.cells.length; j++) {
            rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        json.push(rowData);
    }
    return json
}

/*
 * Parse table data from html
 */
 function parseTableData() {

    var filter = []
    var labels = []
    var data = []

    // dataTableAuthor

    let chartName = 'authorChart'
    let chartTitle = 'authors avg # of commits per year'
    let labelTitle = 'commits per year'
    let json = tableJson('dataTableAuthor')
    filter = json.filter(e => e.commits > 10) // need at least 10 commits
    filter.forEach(e => {
        labels.push([Object.values(e)[0], `(${String(e.to-e.from)}y)`])
    });
    for (let i = 0; i < filter.length; i++) {
        data[i] = Math.round(filter[i].commits/(filter[i].to-filter[i].from))
    }
    buildChart(chartName, chartTitle, labelTitle, labels, data, false);

    // dataTableYear

    /*
    chartName = 'yearChart'
    chartTitle =  'total commits per year'
    labelTitle = 'commits'
    data, labels = []
    json = tableJson('dataTableYear')
    labels = json.map(e => Object.values(e)[0])
    data = json.map(e => e.total_commits)
    BuildChart(chartName, chartTitle, labelTitle, data, true);
    */
}