function buildMetadata(sample) {

 
    d3.json(`/metadata/${sample}`).then(metaData => {

     
      let PANEL = d3.select('#sample-metadata')
    
      PANEL.html("");

      Object.entries(metaData).forEach(([key, value]) => {
        PANEL.append('h6').text(`${key}: ${value}`);
      })
      // BONUS: Build the Gauge Chart 
      buildGauge(metaData.WFREQ);
    });

}

function buildCharts(sample) {

  
    d3.json(`/samples/${sample}`).then(sampleData => {
      console.log(sampleData);

      let otuId = sampleData.otu_ids;
      let sampleValues = sampleData.sample_values;
      let otuLabels = sampleData.otu_labels;

      let trace1 = {
        x: otuId,
        y: sampleValues,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuId,
          colorscale: 'Earth'
        }
      };

      let data = [trace1];

      let layout = {
        title: 'Bubble Chart'
      };

      Plotly.newPlot('bubble', data, layout);
      
      d3.json(`/samples/${sample}`).then(sampleData => {
        console.log(sampleData);

        let pie_values=sampleData.sample_values.slice(0,10);
        let pie_labels=sampleData.otu_ids.slice(0,10);
        let pie_hover=sampleData.otu_labels.slice(0,10);

        let data =[{
          values:pie_values,
          labels:pie_labels,
          hovertext:pie_hover,
          type:'pie'
        }];
        Plotly.newPlot('pie', data);
    });
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
