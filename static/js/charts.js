function init(){
    // Reference for dropdown element
    var selector = d3.select("#selDataset");

    // Get list of sample names from dataset
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Get first sample from the list for init
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Fetch new sample data on selection
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Demographics Panel Object
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data by sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        
        // Select panel with metadata element
        var PANEL = d3.select("#sample-metadata")

        // Clear any existing metadata
        PANEL.html("");

        // Add key and value pair to the panel using a loop
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Build charts
function buildCharts(sample) {
    d3.json("samples.json").then(data => {
        var sample = d3.selectAll('#selDataset').node().value;
        // Filtered sample by sample number
        var filteredSample = data.samples.filter(sampleObj => sampleObj.id == sample);
        // Variables for otu_id, otu_label and sample_values
        var sampleValues = filteredSample[0].sample_values;
        var otuId = filteredSample[0].otu_ids;
        var otuLabel = filteredSample[0].otu_labels;
        var washFreq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
        // Debug variables using console
        console.log(washFreq);
        // Create ticks for bar chart
        var xticks = sampleValues.slice(0,10).reverse();
        var yticks = otuId.slice(0,10).reverse().map(otuID => `OTU ${otuID}`);
        var labels = otuLabel.slice(0,10).reverse();
        // Create trace for bar chart
        var barData = [
            {
                x: xticks,
                y: yticks,
                text: labels,
                // textposition: 'auto',
                type: 'bar',
                orientation: 'h',
                marker: {
                    color:'dodgerblue',
                    opacity: 0.6
                }
            }
        ];
        // Create layout for bar chart
        var barLayout = {
            title: 'Top 10 Bacteria Cultures Found',
            showlegend: false,
            xaxis: {
                title: 'Sample Value'
            },
            yaxis: {
                title: 'OTU Id'
            },
            margin: {
                l: 80,
                r: 100, 
                t: 40,
                b: 40
            },
            plot_bgcolor:"#FFF3",
            paper_bgcolor:"#FFF3"
        };

        // Use Plotly to plot the bar chart
        Plotly.newPlot('bar', barData, barLayout);

        // Create trace for bubble chart
        var bubbleData = [
            {
                x: otuId,
                y: sampleValues,
                text: labels,
                mode: 'markers',
                marker: {
                    color: otuId,
                    colorscale: 'YlGnBu',
                    size: sampleValues
                }
            }
        ];
        // Create layout for bubble chart
        var bubbleLayout = {
            title: 'Bacteria Cultures per Sample',
            // showlegend = false,
            xaxis: {title: 'OTU ID' },
            yaxis: {title: 'Sample Value'},
            plot_bgcolor:"#FFF3",
            paper_bgcolor:"#FFF3"
        };

        // Use Plotly to plot the bubble chart
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Create trace for gauge chart
        var gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: {text: 'Belly Button Washing Frequency' },
                type: 'indicator',
                mode: 'gauge+number',
                delta: {reference: 4},
                gauge: {
                    axis: {range: [0,10],tickwidth: 1},
                    bar: {color: 'black'},
                    steps: [
                        {range: [0,2], color: 'azure'},
                        {range: [2,4], color: 'lightcyan'},
                        {range: [4,6], color: 'paleturquoise'},
                        {range: [6,8], color: 'mediumturquoise'},
                        {range: [8,10], color: 'teal'}
                    ],
                    threshold: {
                        line: {color: 'red', width: 4},
                        thickness: 1,
                        value: 10
                    }
                }
            }
        ];

        // Create layout for gauge chart
        var gaugeLayout = {
            margin : { t: 25, r: 25, l: 25, b: 25},
            plot_bgcolor:"azure",
            paper_bgcolor:"#FFF3"
        };

        // Use Plotly to plot the gauge chart
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
} 

// Initialize page
init();

// References used
// https://plotly.com/javascript/bar-charts/
// https://plotly.com/javascript/bubble-charts/
// https://plotly.com/javascript/colorscales/
// https://plotly.com/javascript/gauge-charts/
// https://matplotlib.org/3.1.0/gallery/color/named_colors.html
