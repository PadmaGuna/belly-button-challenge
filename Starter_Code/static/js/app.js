// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let samplesMetadata = data.metadata;
    console.log("###"+samplesMetadata);
    
    // Filter the metadata for the object with the desired sample number
    let metadata = samplesMetadata.filter(sampleObj => sampleObj.id == sample);
    let result = metadata[0];
    console.log("###Results"+ result);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let demoPanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    demoPanel.html("");
    //let metaKeys = Object.keys(sampleMetadata);
    //let metaValues = Object.values(sampleMetadata);
    // Inside a loop, you will need to use d3 to append new
    // for (i=0; i<Result.size; i++){
    //   // tags for each key-value in the filtered metadata.
    //   // Create a new div for each key-value pair
    //   demoPanel.append("h4").text(Result[i] + ": " + Result[i]);
    // }
    for (key in result)
    {
      demoPanel.append("h6").text(`${key} : ${result[key]}`); 
      //console.log(key + ": " + result[key])
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesSample = data.samples;
    //console.log(samplesSample);
    // Filter the samples for the object with the desired sample number
    let sampleData = samplesSample.filter(sampleObj => sampleObj.id == sample);
    //console.log(sampleData);
    let chartData = sampleData[0];
    // Get the otu_ids, otu_labels, and sample_values
    let sampleOtu_ids = chartData.otu_ids;
    let sampleOtu_labels = chartData.otu_labels;
    let sample_values = chartData.sample_values;
    

    // Build a Bubble Chart
     // Sample data
     let dataBubble = [{
      x: sampleOtu_ids, 
      y: sample_values,
      text: sampleOtu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: sampleOtu_ids,
          colorscale: 'Viridis', // color scale
          showscale: true // show color scale
      }
     }];
    // Layout configuration
    let layoutBubble = {
       title: 'Bacteria Cultures Per Sample',
       xaxis: {title: 'OTU IDs'},
       yaxis: {title: 'Number of Bacteria'}
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', dataBubble, layoutBubble);

    // Build a Bar Chart
    
    // Don't forget to slice and reverse the input data appropriately
    
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yvalues = sampleOtu_ids.map(otuID => `OTU ${otuID} `);
    let dataBar = [{
      x: sample_values.slice(0,10).reverse(),
      y: yvalues.slice(0,10).reverse(),
      type:'bar',
      orientation:'h',
      text:sampleOtu_labels.slice(0,10).reverse()
    }];
    // Layout configuration
    let layoutBar = {
         title: 'Tob 10 Bacteria Cultures',
         xaxis: {title: 'Number of Bacteria'},
         yaxis: {title: 'OTU IDs'},
         margin: { t: 30, l: 150 }
      };
    // Render the Bar Chart
    Plotly.newPlot("bar", dataBar, layoutBar);
    

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    //console.log(data);
    names = data.names;
    //console.log(names);
    //metadata = data.metadata;
    //console.log(metadata);
    //samples = data.samples;
    //console.log(samples);
    // Use d3 to select the dropdown with id of `#selDataset`
    const nameDropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options

    // Append an option for each sample name
    names.forEach(name => {
      nameDropdown.append("option")
              .text(name) // Set the text for the option
              .property("value", name); // Set the value for the option
    });
  
      // // Get the first sample from the list
      const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
    
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

//when user selects a name call optionChanged function to display charts and metadata
d3.selectAll("#selDataSet").on("change",getName);
function getName(){
  let name = nameDropdown.property("value");
  //console.log(name);
  optionChanged(name);
}

// Initialize the dashboard
init();
