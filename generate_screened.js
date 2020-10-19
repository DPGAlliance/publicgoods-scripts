const fs = require('fs');
const cheerio = require("cheerio");

const INDENT = 30;

const SDGS = ['1. No Poverty',
              '2. Zero Hunger',
              '3. Good Health and Well-being',
              '4. Quality Education',
              '5. Gender Equality',
              '6. Clean Water and Sanitation',
              '7. Affordable and Clean Energy',
              '8. Decent Work and Economic Growth',
              '9. Industry, Innovation and Infrastructure',
              '10. Reduced Inequality',
              '11. Sustainable Cities and Communities',
              '12. Responsible Consumption and Production',
              '13. Climate Action',
              '14. Life Below Water',
              '15. Life on Land',
              '16. Peace and Justice Strong Institutions',
              '17. Partnerships to achieve the Goal']

const licenses = {
	'MPL-2.0': 'Mozilla Public License 2.0'
}

function generateNewPage(html, filename) {
	const data = fs.readFileSync('./test.html', {encoding:'utf8', flag:'r'}); 
	$ = cheerio.load(data);
	$('p:contains("Placeholder")').parent().replaceWith(html);
	fs.writeFileSync(filename, $.html())
}

function parseURLs(text){
	const url = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	let output=text.replace(url, "<a href='$1' target='_blank'>$1</a>");
	output = output.replace(/(?:\r\n|\r|\n)/g, '<br>');
	return output;
}

function addElements(object, schema, level) {
	html += '<div style="padding-left:'+level*INDENT+'px">';
	for(const key in object){
		if(key != 'name') {
			console.log(key, typeof object[key])
			if(schema.properties.hasOwnProperty(key)) {
				html += `<p><b>${schema.properties[key].description}</b></p>`
			} else {
				html += `<b>${key}</b>`
			}
			if(Object.prototype.toString.call(object[key]) == '[object Array]'){
				if(!object[key][0] || object[key][0]=="") {
					html += `<p style="color:grey">Not Applicable</p>`
				} else {
					html += '<ul>'
					for(let i=0; i<object[key].length; i++){
						if(object[key][i]!="") {
							html += `<li>${parseURLs(object[key][i])}</li>`
						} else {

						}
					}
					html += '</ul>'
				}
			} else if(typeof object[key] == 'object'){
				addElements(object[key], schema.properties[key], level + 1)				
			} else {
				if(object[key]=="" || object[key]=="N/A"){
					html += `<p style="color:grey">Not Applicable</p>`
				} else {
					html += `<p>${parseURLs(object[key])}</p>`
				}
			}
		}
	}	
	html += '</div>';
}

const dataScreeningSchema = fs.readFileSync('../publicgoods-candidates/screening-schema.json', {encoding:'utf8', flag:'r'}); 
const screeningSchema = JSON.parse(dataScreeningSchema);

const dataNominee = fs.readFileSync('../publicgoods-candidates/nominees/opencrvs.json', {encoding:'utf8', flag:'r'}); 
const nominee = JSON.parse(dataNominee);

const dataScreening = fs.readFileSync('../publicgoods-candidates/screening/opencrvs.json', {encoding:'utf8', flag:'r'}); 
const screening = JSON.parse(dataScreening);

let html = `<div class="col-md-8 page-content-wrap  col-md-offset-2">
<h2>${nominee.name}</h2>
	<p>${nominee.description}</p>
	<p><b>Website: </b><a href="${nominee.website}">${nominee.website}</a></p>
	<p><b>Type of Digital Public Good</b>
	<ul style="padding-left:0">
`
for(item of ['content', 'data', 'software', 'standard', 'AI model']){
	if(nominee.type.includes(item)){
		html += `<li style="list-style:none; margin-right: 1.5em; text-transform: capitalize;">✅&nbsp;&nbsp;Open ${item}`
		if(nominee.hasOwnProperty('repositoryURL')){
			html+=`: <a href="${nominee.repositoryURL}" target="_blank">Source Code Repository</a>`
		}
		html += `</li>`
	} else {
		html += `<li style="display: block; list-style:none; margin-right: 1.5em; text-transform: capitalize;">
		<svg width="20" height="20" style="margin-right:5px">
  <rect width="20" height="20" style="stroke-width:1;stroke:rgb(0,0,0)" fill-opacity="0"/>
</svg> Open ${item}</li>`
	}
}


html+=`
	</ul>
	<p><b>1. Is it relevant to one of the Sustainable Development Goals?</b></p>
	<ul>
`

nominee.SDGs.forEach((item) => {
	html += `<li><b>${SDGS[item.SDGNumber-1]}</b>`
	if(item.evidenceText){
		html += `<p><span style="color:grey; font-weight:bold">Evidence:</span> ${parseURLs(item.evidenceText)}</p>`
	}
	if(item.evidenceURL){
		html += `<p><span style="color:grey; font-weight:bold">Link to Evidence:</span> ${parseURLs(item.evidenceURL)}</p>`
	}
	html += `</li>`
})

html += `</ul>
<p><b>2. Does it use an appropriate open license?</b></p>
<div style="padding-left: ${INDENT}px"><p>Yes, this project is licensed under the following license(s):</p>
<ul>`

nominee.license.forEach((item) => {
	html += `<li><a href="${item.licenseURL}" target="_blank">${licenses[item.spdx]}</a>`
})

html += `</ul></div>`

addElements(screening, screeningSchema, 0);

html += '</div>'

generateNewPage(html, 'opencrvs.html')
