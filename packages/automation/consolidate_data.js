const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const retry = require('async-retry');

const dpath = '../registry/src';
const GITHUB_API = 'https://api.github.com';

const params = {
    method: 'GET',
    credentials: 'same-origin',
    redirect: 'follow',
    agent: null,
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': 'Basic ' + btoa(process.env.CLIENTID+':'+process.env.CLIENTSECRET),
      'User-Agent': 'node-fetch/1.0 DPGAlliance/publicgoods-scripts'
    }
  }
var missingRepoActivity = [];

async function start() {
  // Fetch all migrated DPGs from new app api at https://app.digitalpublicgoods.net/api/dpgs
  let dpgjson = await fetch("https://api.digitalpublicgoods.net/dpgs");
  dpgjson = await dpgjson.json();
    
  let nomineejson = await fetch("https://api.digitalpublicgoods.net/nominees");
  nomineejson = await nomineejson.json();
  
  // const response = await fetch('https://app.digitalpublicgoods.net/api/dpgs');
  const dpgs = [...dpgjson, ...nomineejson];
let allData = []
//   Generate github activity
  dpgs.forEach(async (dpg)=>{
    let html = '';
    if(dpg.hasOwnProperty('repositories')){
      let repoIndex = 0;
      if(dpg.repositories.length > 0) {
        for(item in dpg.repositories) {
          if(dpg.repositories[item].name === 'main'){
            repoIndex = item
            break
          }
        }
        var matchGithub = dpg.repositories[repoIndex].url.match(/https:\/\/github.com\/([^\/]*)\/([^\/]*)/);
        if(matchGithub){
          html += await fetchGithubActivity(matchGithub[1], matchGithub[2]);
        }
      }  
    }
    dpg['githubActivity'] = html;
    dpg['dpgLink'] = true;
    allData.push(dpg);
  })

  // write to nominees.json file
  fs.writeFileSync(
    path.join(dpath, './nominees.json'),
    JSON.stringify(allData, 2),
    "utf8",
    function(err) {
      if (err) {
        console.log(
          "An error occured while writing JSON Object to file: " + fnames[e]
        );
        return console.log(err);
      }
    });
}



async function fetchGithubActivity(org, item){

    let $, list=[];
    console.log('Fetching https://github.com/' + org + ' -> searching for '+item);
    let isOrg = true;
    let fetchLink = 'https://github.com/orgs/' + org + '/repositories?q=' + item +'&sort=stargazers';
    let output = '&nbsp;';
  
    await retry(async bail => {
      const data = await fetch(GITHUB_API+'/orgs/'+org, params);
  
      if(data.status == 404) { // Assume handle is a personal account
        isOrg = false;
      } else {
        let response = JSON.parse(await data.text())
        if(response.hasOwnProperty('message') && response['message']==='Not Found') {
          isOrg = false;
        }
      }
  
      if(!isOrg){
        fetchLink = 'https://github.com/' + org + '/?tab=repositories&q=' + item;
      }
      // otherwise we have an org
      return
    }, {
      retries: 5,
      minTimeout: 5000
    });
  
    try {
      data = await retry(async bail => {
  
        const data = await fetch(fetchLink, params);
  
        console.log(data.status);
        if(data.status == 404){
          console.log('Page not found for https://' + org + '. Aborting search for ' + item);
          bail()
        } else if (data.status == 429) {
          throw 'Rate limit hit. Retrying...';
        }
  
        return data;
      }, {
        retries: 5,
        minTimeout: 5000
      });
    } catch(e) {
      return output
    }
  
    $ = cheerio.load(await data.text());
  
    if(isOrg) { // it is an organization, else it is a user
      list = $("div.repo-list").find('a.d-inline-block:contains("'+item+'")').filter(
        function(){return $(this).text().trim() === item;}).parent().parent().next();
    } else {
      list = $("#user-repositories-list").find('a:contains("'+item+'")').filter(
        function(){return $(this).text().trim() === item;}).parent().parent().parent().next();
    }
  
    // The chart is not immediately visible, but it is included as a fragment like:
    //   <div class="text-right hide-lg hide-md hide-sm hide-xs ">
    //     <poll-include-fragment src="/chrisekelley/zeprs/graphs/participation?w=155&amp;h=28&amp;type=sparkline)">
    //     </poll-include-fragment>
    //  </div>
    // so we extract the src to fetch
    if(list.length){
      let poll = list.find('poll-include-fragment').attr('src');
      if(poll){
        try {
          data = await retry(async bail => {
            const data = await fetch(`https://github.com/`+poll, params);
            return data;
          }, {
            retries: 5,
            minTimeout: 5000
          });
        } catch {
          console.log('Error fetching the chart from the fragment, not found')
          // do nothing, it's fine
        }
        $ = cheerio.load(await data.text());
        list = $('body')
      }
    }
  
    if(list.length) {
      // The activity chart should always be a child of a <span class="tooltipped">
      // If that's not the case, GitHub has changed its code, and we need to adjust
      if(list.find('span.tooltipped').length) {
        console.log('Activity chart found.');
        output = '<a href="https://github.com/'+org+'/'+item+'" target="_blank">' + list.html() + '</a>';
      } else {
        console.log('Found something else where the activity chart is expected. This most likely indicates that GitHub has changed the HTML, and this code needs adjustment.');
        process.exit(1);
      }
    } else {
      console.log('Activity chart NOT found ! ! ! ! !')
      missingRepoActivity.push('https://github.com/'+org+'/'+item)
    }
    return output;
  }

  start();