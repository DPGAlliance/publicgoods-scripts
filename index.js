const fs = require('fs');
const glob = require('glob');
const replace = require('replace-in-file');
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const SDGS = ['No Poverty',
              'Zero Hunger',
              'Good Health and Well-being',
              'Quality Education',
              'Gender Equality',
              'Clean Water and Sanitation',
              'Affordable and Clean Energy',
              'Decent Work and Economic Growth',
              'Industry, Innovation and Infrastructure',
              'Reduced Inequality',
              'Sustainable Cities and Communities',
              'Responsible Consumption and Production',
              'Climate Action',
              'Life Below Water',
              'Life on Land',
              'Peace and Justice Strong Institutions',
              'Partnerships to achieve the Goal']

const sdgColors = ['#E5243B',
                   '#DDA63A',
                   '#4C9F38',
                   '#C5192D',
                   '#FF3A21',
                   '#26BDE2',
                   '#FCC30B',
                   '#A21942',
                   '#FD6925',
                   '#DD1367',
                   '#FD9D24',
                   '#BF8B2E',
                   '#3F7E44',
                   '#0A97D9',
                   '#56C02B',
                   '#00689D',
                   '#19486A']

path = '../publicgoods-candidates/nominees'
pathHtml = '../publicgoods-website/registry/index.html';
destHtml = './public/index.html';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
let candidates=[];

glob(path + '/*.json', {}, async (err, files) => {
  console.log(files);
  for (var i=0; i<files.length; i++) {
    candidates.push(JSON.parse(fs.readFileSync(files[i], 'utf8')));
  }
  console.log(candidates);
  let combos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  // Initialize SDG array to count occurences in candidates
  let sdgs = new Array(17).fill(0);
  // Initialize type array to count occurences in candidates
  const TYPE1='software';
  const TYPE2='data';
  const TYPE3='standard';
  const TYPE4='content';
  let types = {};
  types[TYPE1]=0;
  types[TYPE2]=0;
  types[TYPE3]=0;
  types[TYPE4]=0;
  let vettedDPGs = 0;
  // Iterate over candidates, and over each nested array and count
  candidates.forEach(function(e) {
    e['SDGs'].forEach(function(d){
      sdgs[d['SDGNumber']]++;
    })
    e['type'].forEach(function(d){
      types[d]++;
    })
    if     ( e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[0]++;}
    else if(!e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[1]++;}
    else if(!e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[2]++;}
    else if( e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[3]++;}
    else if( e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[4]++;}
    else if(!e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[5]++;}
    else if( e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) && !e['type'].includes(TYPE4)){ combos[6]++;}
    else if( e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[7]++;}
    else if(!e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[8]++;}
    else if(!e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[9]++;}
    else if( e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) && !e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[10]++;}
    else if( e['type'].includes(TYPE1) && !e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[11]++;}
    else if(!e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[12]++;}
    else if( e['type'].includes(TYPE1) &&  e['type'].includes(TYPE2) &&  e['type'].includes(TYPE3) &&  e['type'].includes(TYPE4)){ combos[13]++;}

    if(e['stage']=='DPG') {
      vettedDPGs++;
    }
  })

  // Prepare data for chart
  let sdgData = { name: 'SDGs', children: []};
  for(let i=0; i < sdgs.length; i++) {
    if (sdgs[i]) {
      sdgData['children'].push({name: i, value: sdgs[i]});
    }
  }

  var sets = [
                {sets: [1], size: types[TYPE1], value: types[TYPE1], label: TYPE1},
                {sets: [2], size: types[TYPE2], value: types[TYPE2], label: TYPE2},
                {sets: [3], size: types[TYPE3], value: types[TYPE3], label: TYPE3},
                {sets: [4], size: types[TYPE4], value: types[TYPE4], label: TYPE4},
                {sets: [1, 2], size: combos[3], value: combos[3]},
                {sets: [1, 3], size: combos[4], value: combos[4]},
                {sets: [1, 4], size: combos[7], value: combos[7]},
                {sets: [2, 3], size: combos[5], value: combos[5]},
                {sets: [2, 4], size: combos[8], value: combos[8]},
                {sets: [3, 4], size: combos[9], value: combos[9]},
                {sets: [1, 2, 3], size: combos[6], value: combos[6]},
                {sets: [1, 2, 4], size: combos[10], value: combos[10]},
                {sets: [1, 3, 4], size: combos[11], value: combos[11]},
                {sets: [2, 3 ,4], size: combos[12], value: combos[12]},
                {sets: [1, 2, 3, 4], size: combos[13], value: combos[13]}
                ];

  // Add total for types to get percentages below
  let t = 0;
  for(var key in types){
    t += types[key];
  }

  // Compute type as percetage
  let type = {};
  for (var key in types) {
    type[key]=Math.round(types[key]/t*100);
  }

  let typeData = [];
  for (var key in types) {
    typeData.push({name: key, value: Math.round(types[key]/t*100) });
  }

let htmlOutput = '<div class="row">';
htmlOutput += '<div class="col-xs-2 col-xs-offset-1"><span class="big-details">'+(candidates.length-vettedDPGs)+'</span><span class="small-title">nominees</span></div>'
htmlOutput += '<div class="col-xs-1"><img src="https://dpg-website.s3.amazonaws.com/img/right-arrows.svg" style="height:50px; margin-top:20px; display:block"></div>'
htmlOutput += '<div class="col-xs-2"><span class="big-details">'+vettedDPGs+'</span><span class="small-title">Digital<br/>Public<br/>Goods</span></div>'
htmlOutput += '<div class="col-xs-4" id="venn"><span class="small-title">distribution by type</span></div></div>'
htmlOutput += '<div class="row" style="margin-bottom:5em"><div class="col-xs-10 col-xs-offset-1" id="treemap"><span class="small-title">distribution by SDG</span><div id="treemap"></div></div>';
htmlOutput += '</div>';

htmlOutput += `

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js" charset="utf-8"></script>
<script src="/wp-content/themes/hestia/js/venn.js"></script>
<script>

// set the dimensions and margins of the graph
var width = 960, height = 500;

// append the svg object to the body of the page
var svg = d3.select("#treemap")
.append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 1000 300")
`
htmlOutput += 'var data_sdg = '+JSON.stringify(sdgData)+';';
htmlOutput += 'var data_type = '+JSON.stringify(typeData)+';';
htmlOutput += 'var sdg_labels = '+JSON.stringify(SDGS)+';';
htmlOutput += 'var sdg_colors = '+JSON.stringify(sdgColors)+';';
htmlOutput += 'var sets = '+JSON.stringify(sets)+';';

htmlOutput += `

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data_sdg).sum(function(d){ return d.value}) // Here the size of each leave is given in the 'value' field in input data

  var tool = d3.select("body").append("div").attr("class", "toolTip");

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(2)
    (root)

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "white")
      .style("fill", function (d) { return sdg_colors[d.data.name-1]; })
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.name })
      .attr("font-size", "30px")
      .attr("fill", "white")

  function handleMouseOver(d) {  // Add interactivity
    // Use D3 to select element, change color and size
    d3.select(this).style('fill','grey');
  }

  function handleMouseMove(d) {
    tool.style("left", d3.event.pageX + 10 + "px")
    tool.style("top", d3.event.pageY - 20 + "px")
    tool.style("display", "inline-block");
    tool.html('SDG '+d.data.name+': '+sdg_labels[d.data.name-1]+'<br/>'+d.data.value+' nominees');
  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).style('fill', function (d) { return sdg_colors[d.data.name-1]; }); 

    // Select text by id and then remove
    tool.style("display", "none");
  }

  var color = d3.scaleOrdinal()
      .range(['#48b8d0', '#e91e63', '#4b5c73', '#FCC30B']);

  var colort = d3.scaleOrdinal()
      .range(['white', 'black', 'black', 'black']);

  var chart = venn.VennDiagram()
    .width(350)
    .height(200);
  var div = d3.select("#venn")
    .datum(sets)
    .call(chart);

  d3.selectAll("#venn .venn-circle path")
    .style("stroke", function(d,i) { return color[i]; })
    .style("fill-opacity", .8)
    .style('fill', (d,i) => color(i))

  d3.selectAll("#venn .venn-circle text")
    .style('fill', (d,i) => colort(i));

  div.selectAll("path")
      .style("stroke-opacity", 0)
      .style("stroke", "#fff")
      .style("stroke-width", 3)

  div.selectAll('g')
    .on("mouseover", handleVennMouseOver)
    .on("mousemove", handleVennMouseMove)
    .on("mouseout", handleVennMouseOut);

  function handleVennMouseOver(d) {  // Add interactivity
    venn.sortAreas(div, d);
    // Use D3 to select element, change color and size
    d3.select(this)
      .style("fill-opacity", 1)
      .select("path")
        .style("stroke-opacity", 1);
  }

  function handleVennMouseMove(d) {
    tool.style("left", d3.event.pageX + 10 + "px")
    tool.style("top", d3.event.pageY - 20 + "px")
    tool.style("display", "inline-block");
    tool.html(d.value+' nominees');
  }

  function handleVennMouseOut(d, i) {
      venn.sortAreas(div, d);

    // Use D3 to select element, change color back to normal
    d3.select(this)
      .style("fill-opacity", 0.9)
      .select("path")
        .style("stroke-opacity", 0);


    // Select text by id and then remove
    tool.style("display", "none");
  }


</script>

`;

  htmlOutput += `
    <div id="main-content" class="container clearfix" style="position: relative">
      <div id="sidebar">
        <div class="sidebar__inner" id="filters" style="position:relative">
            
        </div>
      </div>
      <div id="content" style="margin-left: 240px; min-height:700px">
        <div id="mytable">
                
        </div>
      </div>
    </div>
`;

  const endHtml = `
  <script type="text/javascript" src="./ResizeSensor.js"></script>
    <script type='text/javascript' src="./sticky-sidebar.min.js"></script>

    <script type='text/javascript'>
       var sidebar = new StickySidebar('#sidebar', {
           containerSelector: '#main-content',
           innerWrapperSelector: '.sidebar__inner',
           topSpacing: 60,
           bottomSpacing: 0,
       });
    </script>
  </body>
  `
  
  replace({files: pathHtml, from: '<p>Placeholder</p>', to: htmlOutput}, (error, changedFiles) => {
    if (error) {
      return console.error('Error occurred:', error);
    }
    console.log('Modified files:', changedFiles.join(', '));

    replace({files: pathHtml, from: 'class="col-md-8 page-content-wrap  col-md-offset-2"', to: 'class="col-lg-12 page-content-wrap"'}, (error, changedFiles) => {
      if (error) {
        return console.error('Error occurred:', error);
      }
      console.log('Modified files:', changedFiles.join(', '));

      replace({files: pathHtml, from: '</body>', to: endHtml}, (error, changedFiles) => {
        if (error) {
          return console.error('Error occurred:', error);
        }

        fs.copyFileSync(pathHtml, destHtml);

      });
    });
  });
})
