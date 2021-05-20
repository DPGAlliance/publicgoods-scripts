const fs = require('fs');
const path = require('path');
const glob = require("glob");
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
	'CC-BY-1.0': 'Creative Commons Attribution 1.0 Generic',
	'CC-BY-2.0': 'Creative Commons Attribution 2.0 Generic',
	'CC-BY-2.5': 'Creative Commons Attribution 2.5 Generic',
	'CC-BY-3.0': 'Creative Commons Attribution 3.0 Unported',
	'CC-BY-3.0-AT': 'Creative Commons Attribution 3.0 Austria',
	'CC-BY-4.0': 'Creative Commons Attribution 4.0 International',
	'CC-BY-NC-1.0': 'Creative Commons Attribution Non Commercial 1.0 Generic',
	'CC-BY-NC-2.0': 'Creative Commons Attribution Non Commercial 2.0 Generic',
	'CC-BY-NC-2.5': 'Creative Commons Attribution Non Commercial 2.5 Generic',
	'CC-BY-NC-3.0': 'Creative Commons Attribution Non Commercial 3.0 Unported',
	'CC-BY-NC-4.0': 'Creative Commons Attribution Non Commercial 4.0 International',
	'CC-BY-NC-SA-1.0': 'Creative Commons Attribution Non Commercial Share Alike 1.0 Generic',
	'CC-BY-NC-SA-2.0': 'Creative Commons Attribution Non Commercial Share Alike 2.0 Generic',
	'CC-BY-NC-SA-2.5': 'Creative Commons Attribution Non Commercial Share Alike 2.5 Generic',
	'CC-BY-NC-SA-3.0': 'Creative Commons Attribution Non Commercial Share Alike 3.0 Unported',
	'CC-BY-NC-SA-4.0': 'Creative Commons Attribution Non Commercial Share Alike 4.0 International',
	'CC-BY-SA-1.0': 'Creative Commons Attribution Share Alike 1.0 Generic',
	'CC-BY-SA-2.0': 'Creative Commons Attribution Share Alike 2.0 Generic',
	'CC-BY-SA-2.5': 'Creative Commons Attribution Share Alike 2.5 Generic',
	'CC-BY-SA-3.0': 'Creative Commons Attribution Share Alike 3.0 Unported',
	'CC-BY-SA-3.0-AT': 'Creative Commons Attribution Share Alike 3.0 Austria',
	'CC-BY-SA-4.0': 'Creative Commons Attribution Share Alike 4.0 International',
	'CC0-1.0': 'Creative Commons Zero v1.0 Universal',
	'ODbL-1.0': 'Open Data Commons Open Database License 1.0',
	'ODC-By-1.0': 'Open Data Commons Attribution License 1.0',
	'PDDL-1.0': 'Open Data Commons Public Domain Dedication and Licence 1.0',
	'0BSD': '0-clause BSD License',
	'AAL': 'Attribution Assurance License',
	'AFL-3.0': 'Academic Free License 3.0',
	'AGPL-3.0': 'GNU Affero General Public License version 3',
	'Apache-1.1': 'Apache Software License 1.1',
	'Apache-2.0': 'Apache License 2.0',
	'APL-1.0': 'Adaptive Public License',
	'APSL-2.0': 'Apple Public Source License',
	'Artistic-1.0': 'Artistic license 1.0',
	'Artistic-2.0': 'Artistic License 2.0',
	'BSD-1-Clause': '1-clause BSD License',
	'BSD-2-Clause': '2-clause BSD License',
	'BSD-2-Clause-Patent': 'BSD+Patent',
	'BSD-3-Clause': '3-clause BSD License',
	'BSD-3-Clause-LBNL': 'BSD-3-Clause-LBNL',
	'BSL-1.0': 'Boost Software License',
	'CAL-1.0': 'Cryptographic Autonomy License v.1.0',
	'CAL-1.0-Combined-Work-Exception': 'Cryptographic Autonomy License v.1.0',
	'CATOSL-1.1': 'Computer Associates Trusted Open Source License 1.1',
	'CDDL-1.0': 'Common Development and Distribution License 1.0',
	'CECILL-2.1': 'CeCILL License 2.1',
	'CNRI-Python': 'CNRI Python license',
	'CPAL-1.0': 'Common Public Attribution License 1.0',
	'CPL-1.0': 'Common Public License 1.0',
	'ECL-1.0': 'Educational Community License, Version 1.0',
	'ECL-2.0': 'Educational Community License, Version 2.0',
	'EFL-1.0': 'Eiffel Forum License V1.0',
	'EFL-2.0': 'Eiffel Forum License V2.0',
	'Entessa': 'Entessa Public License',
	'EPL-1.0': 'Eclipse Public License 1.0',
	'EPL-2.0': 'Eclipse Public License 2.0',
	'EUDatagrid': 'EU DataGrid Software License',
	'EUPL-1.2': 'European Union Public License 1.2',
	'Fair': 'Fair License',
	'Frameworx-1.0': 'Frameworx License',
	'GPL-2.0': 'GNU General Public License version 2',
	'GPL-3.0': 'GNU General Public License version 3',
	'HPND': 'Historical Permission Notice and Disclaimer',
	'IPA': 'IPA Font License',
	'IPL-1.0': 'IBM Public License 1.0',
	'ISC': 'ISC License',
	'LGPL-2.1': 'GNU Lesser General Public License version 2.1',
	'LGPL-3.0': 'GNU Lesser General Public License version 3',
	'LiLiQ-P-1.1': 'Licence Libre du Québec – Permissive',
	'LiLiQ-R-1.1': 'Licence Libre du Québec – Réciprocité',
	'LiLiQ-Rplus-1.1': 'Licence Libre du Québec – Réciprocité forte',
	'LPL-1.0': 'Lucent Public License',
	'LPL-1.02': 'Lucent Public License Version 1.02',
	'LPPL-1.3c': 'LaTeX Project Public License 1.3c',
	'MirOS': 'MirOS Licence',
	'MIT': 'MIT License',
	'MIT-0': 'MIT No Attribution License',
	'Motosoto': 'Motosoto License',
	'MPL-1.0': 'Mozilla Public License 1.0',
	'MPL-1.1': 'Mozilla Public License 1.1',
	'MPL-2.0': 'Mozilla Public License 2.0',
	'MPL-2.0-no-copyleft-exception': 'Mozilla Public License 2.0, no copyleft exception',
	'MS-PL': 'Microsoft Public License',
	'MS-RL': 'Microsoft Reciprocal License',
	'MulanPSL-2.0': 'Mulan Permissive Software License v2',
	'Multics': 'Multics License',
	'NASA-1.3': 'NASA Open Source Agreement 1.3',
	'Naumen': 'Naumen Public License',
	'NCSA': 'University of Illinois/NCSA Open Source License',
	'NGPL': 'Nethack General Public License',
	'Nokia': 'Nokia Open Source License',
	'NPOSL-3.0': 'Non-Profit Open Software License 3.0',
	'NTP': 'NTP License',
	'OCLC-2.0': 'OCLC Research Public License 2.0',
	'OFL-1.1': 'SIL Open Font License 1.1',
	'OFL-1.1-no-RFN': 'SIL Open Font License 1.1',
	'OFL-1.1-RFN': 'SIL Open Font License 1.1',
	'OGTSL': 'Open Group Test Suite License',
	'OLDAP-2.8': 'OpenLDAP Public License Version 2.8',
	'OSET-PL-2.1': 'OSET Public License version 2.1',
	'OSL-1.0': 'Open Software License 1.0',
	'OSL-2.1': 'Open Software License 2.1',
	'OSL-3.0': 'Open Software License 3.0',
	'PHP-3.0': 'PHP License 3.0',
	'PHP-3.01': 'PHP License 3.01',
	'PostgreSQL': 'The PostgreSQL License',
	'Python-2.0': 'Python License',
	'QPL-1.0': 'Q Public License',
	'RPL-1.1': 'Reciprocal Public License, version 1.1',
	'RPL-1.5': 'Reciprocal Public License 1.5',
	'RPSL-1.0': 'RealNetworks Public Source License V1.0',
	'RSCPL': 'Ricoh Source Code Public License',
	'SimPL-2.0': 'Simple Public License 2.0',
	'Sleepycat': 'Sleepycat License',
	'SPL-1.0': 'Sun Public License 1.0',
	'UCL-1.0': 'Upstream Compatibility License v1.0',
	'Unicode-DFS-2015': 'Unicode Data Files and Software License',
	'Unicode-DFS-2016': 'Unicode Data Files and Software License',
	'Unlicense': 'The Unlicense',
	'UPL-1.0': 'Universal Permissive License',
	'VSL-1.0': 'Vovida Software License v. 1.0',
	'W3C': 'W3C License',
	'Watcom-1.0': 'Sybase Open Watcom Public License 1.0',
	'Xnet': 'X.Net License',
	'wxWindows': 'wxWindows Library License',
	'Zlib': 'zlib/libpng license',
	'ZPL-2.0': 'Zope Public License 2.0'
}

const htmlPath = '../publicgoods-website/registry/'
const templateHtml = path.join(htmlPath, 'index.html')
const dpgsPath = '../publicgoods-candidates/digitalpublicgoods/'
const nomineesPath = '../publicgoods-candidates/nominees/'

function generateNewPage(html, filename) {
	const data = fs.readFileSync(templateHtml, {encoding:'utf8', flag:'r'});
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

function addElements(object, schema, level, html) {
	html += '<div style="padding-left:'+level*INDENT+'px">';
	for(const key in object){
		if(key != 'name') {
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
							// do nothing, it's an empty array
						}
					}
					html += '</ul>'
				}
			} else if(typeof object[key] == 'object'){
				html = addElements(object[key], schema.properties[key], level + 1, html)
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
	return html;
}

const dataScreeningSchema = fs.readFileSync('../publicgoods-candidates/screening-schema.json', {encoding:'utf8', flag:'r'}); 
const screeningSchema = JSON.parse(dataScreeningSchema);

glob("*.json", { cwd: dpgsPath }, async (err, productFiles) => {
	for (let i = 0; i < productFiles.length; i++) {
		const dataNominee = fs.readFileSync(
			path.join(nomineesPath, productFiles[i]), {encoding:'utf8', flag:'r'}); 
		const nominee = JSON.parse(dataNominee);

		const dataDPG = fs.readFileSync(
			path.join(dpgsPath, productFiles[i]), {encoding:'utf8', flag:'r'}); 
		const dpgs = JSON.parse(dataDPG);

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

		html = addElements(dpgs, screeningSchema, 0, html);

		html += '</div>'

		generateNewPage(html, path.join(htmlPath, productFiles[i].replace(/.json/g, ".html")));
		console.log('HTML page generated for registry/' + productFiles[i].replace(/.json/g, ".html"));
	}
})
