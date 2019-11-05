
DEFAULT_PLOTLY_COLORS=['rgb(31, 119, 180)', 'rgb(255, 127, 14)',
'rgb(44, 160, 44)', 'rgb(214, 39, 40)',
'rgb(148, 103, 189)', 'rgb(140, 86, 75)',
'rgb(227, 119, 194)', 'rgb(127, 127, 127)',
'rgb(188, 189, 34)', 'rgb(23, 190, 207)']

// This function accepts a sample id (number)
// This function returns NULL
// This function adds list elements to a the Sample Metadata Bootstrap Card
function buildMetadata(sample) {
  // Retrieve data for a sample from /samples/<sample>
  d3.json(`/metadata/${sample}`).then((obj) => {

    // select the card list and append list elemets
    var list = d3.select("#metadata-list");

    list.html("");

    // get data from json object
    Object.entries(obj).forEach(([key, value]) => {

      // Append element for each metadatum
      list.append("li").text(`${key}: ${value}`).attr("class", "list-group-item");

     });
  
  });
}

// This function accepts a sample id (number)
// This function returns NULL
// This function createas a plotly graphical object in the form of a pie chart which represents the proportion of different types of bacteria found in the sample
function buildCharts(sample) {

  
  // Retrieve data for a sample from /samples/<sample>
  d3.json(`/samples/${sample}`).then((obj) => {
    // get data from json object
    sampleValues = obj.sample_values;
    otuIds = obj.otu_ids;
    otuLabels = obj.otu_labels;
    colorIds = otuIds.map(id => otuIds.indexOf(id));

    // Build plotly data object
    var data = [{
      // Slice the first 10 (largest) data points for the sample
      values: sampleValues.slice(0,10),
      labels: otuIds.slice(0,10),
      hovertemplate: otuLabels.slice(0,10),
      marker: {
        colors: DEFAULT_PLOTLY_COLORS
      },
      type: 'pie'
    }];

    // Build plotly layout object
    var layout = {
      title: {
        text:'Bacteria Species Breakdown',
        font: {size: 24}
      },
      height: 700,
      width: 700
    };

    // Build plot in the div with id='pie'  
    Plotly.newPlot('pie', data, layout);

    // Build plotly data object
    var data = [{
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: DEFAULT_PLOTLY_COLORS
      },
      hovertemplate: otuLabels
    }];

    // Build plotly layout object
    var layout = {
      title: {
        text:'Plot Title',
        font: {size: 24}
      },
      xaxis: {title: {text:'Bacteria Species Code', font: {size: 18}}},
      yaxis: {title: {text:'Bacteria Count', font: {size: 18}}},
      hovermode:'closest',
      height: 800,
      // Using md-col > 1200 pixels
      width: 1170
    };

    // Build plot in the div with id='bubble'  
    Plotly.newPlot('bubble', data, layout);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
