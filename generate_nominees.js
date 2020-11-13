const fs = require('fs');
const glob = require('glob');
const path = require('path');
const btoa = require('btoa');
const fetch = require("node-fetch");
const retry = require('async-retry');
const cheerio = require("cheerio");

require('dotenv').config()

const npath = '../publicgoods-candidates/nominees';
const spath = '../publicgoods-candidates/screening';
const dpath = './src';
const GITHUB_API = 'https://api.github.com';

const params = {
  method: 'GET',
  credentials: 'same-origin',
  redirect: 'follow',
  agent: null,
  headers: {
    'Content-Type': 'text/plain',
    'Authorization': 'Basic ' + btoa(process.env.CLIENTID+':'+process.env.CLIENTSECRET),
    'User-Agent': 'node-fetch/1.0 unicef/publicgoods-scripts'
  }
}

var candidates = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGithubActivity(org, item){

  let $, list=[];
  console.log('Fetching https://github.com/' + org + ' -> searching for '+item);
  let isOrg = true;
  let fetchLink = 'https://github.com/' + org + '?q=' + item;
  let output = '&nbsp;';

  await retry(async bail => {
    const data = await fetch(GITHUB_API+'/orgs/'+org, params);

    if(data.status == 404) { // Assume handle is a personal account
      isOrg = false;
      fetchLink = 'https://github.com/' + org + '?tab=repositories&q=' + item;
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
        // do nothing, it's fine
      }
      $ = cheerio.load(await data.text());
      list = $('body')
    }
  }

  if(list.length) {
    console.log('Activity chart found.');
    output = '<a href="https://github.com/'+org+'/'+item+'" target="_blank">' + list.html() + '</a>';
  } else {
    console.log('Activity chart NOT found ! ! ! ! !')
  }
  return output;
}

glob(path.join(npath, '/*.json'), {}, async (err, files) => {
  console.log(files);
  for (var i=0; i<files.length; i++) {
    let n = JSON.parse(fs.readFileSync(files[i], 'utf8'));

    let html = '';
    if(n.hasOwnProperty('repositoryURL')){
      var matchGithub = n.repositoryURL.match(/https:\/\/github.com\/(.*)\/(.*)/);
      if(matchGithub){
        html += await fetchGithubActivity(matchGithub[1], matchGithub[2]);
      }
    }
    n['githubActivity'] = html;
    if(n['stage'] === 'DPG' && fs.existsSync(path.join(spath, path.basename(files[i])))) {
      n['dpgLink'] = true;
    } else {
      n['dpgLink'] = false;
    }
    console.log(n)
    candidates.push(n);
  }

  fs.writeFileSync(
    path.join(dpath, './nominees.json'),
    JSON.stringify(candidates, 2),
    "utf8",
    function(err) {
      if (err) {
        console.log(
          "An error occured while writing JSON Object to file: " + fnames[e]
        );
        return console.log(err);
      }
    });
})
