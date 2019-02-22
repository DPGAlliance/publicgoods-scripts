const fs = require('fs');
const glob = require('glob');
const replace = require('replace-in-file');

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

path = '../publicgoods-candidates/candidates'
pathHtml = '../publicgoods-website/candidate/index.html';

let candidates=[];
let htmlOutput='<table class="table">';
htmlOutput += '<tr><th>Candidate</th><th>Description</th><th>Type</th><th>SDGs</th><th>License</th></tr>';

glob(path + '/*.json', {}, (err, files)=>{
  console.log(files);
  for (var i=0; i<files.length; i++) {
    candidates.push(JSON.parse(fs.readFileSync(files[i], 'utf8')));
  }
  console.log(candidates);
  for (var i=0; i<candidates.length; i++) {
    htmlOutput += '<tr>';
    htmlOutput += '<td><a href="'+ candidates[i].website +'" target="_blank">' + candidates[i].name + '</a></td>';
    htmlOutput += '<td>' + candidates[i].description + '</td>';
    htmlOutput += '<td>';
    for (var j=0; j<candidates[i].type.length; j++) {
      htmlOutput += candidates[i].type[j];
      if (j < candidates[i].type.length-1) {
        htmlOutput += ', ';
      }
    }
    htmlOutput += '</td>';
    htmlOutput += '<td>';
    for (var j=0; j<candidates[i].SDGs.length; j++) {
      htmlOutput += '<a href="https://sustainabledevelopment.un.org/sdg'+candidates[i].SDGs[j]+'" target="_blank">';
      htmlOutput += '<img src="/wp-content/uploads/2019/02/SDG'+candidates[i].SDGs[j]+'.png" width="40" alt="'+SDGS[candidates[i].SDGs[j]]+'" class="sdgicon">';
      htmlOutput += '</a>';
    }
    htmlOutput += '</td>';
    htmlOutput += '<td><a href="'+ candidates[i].license_link +'" target="_blank">' + candidates[i].license + '</a></td>';
    htmlOutput += '</tr>';
  }
  htmlOutput += '</table>';
  replace({files: pathHtml, from: '<p>Placeholder</p>', to: htmlOutput}, (error, changedFiles) => {
    if (error) {
      return console.error('Error occurred:', error);
    }
    console.log('Modified files:', changedFiles.join(', '));

    replace({files: pathHtml, from: 'class="col-md-8 page-content-wrap  col-md-offset-2"', to: 'class="col-md-10 page-content-wrap  col-md-offset-1"'}, (error, changedFiles) => {
    if (error) {
      return console.error('Error occurred:', error);
    }
    console.log('Modified files:', changedFiles.join(', '));
  });
  });

  console.log(htmlOutput);
})
