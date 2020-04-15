sublconst fs = require('fs');
const glob = require('glob');
const path = require('path');
const fetch = require("node-fetch");
const cheerio = require("cheerio");


npath = '../publicgoods-candidates/nominees';
dpath = './src';

var candidates = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGithubActivity(link, item){
  let page = 1;
  let data, $, list=[];
  console.log('Fetching '+link+' -> searching for '+item);
  while(page==1 || (!list.length && page < 20)){
    data = await fetch(link+'?tab=repositories&page='+page);
    $ = cheerio.load(await data.text());
    list = $("div.repo-list")
    if(list.length) { // it is an organization, else it is a user
      list = list.find('a.d-inline-block:contains("'+item+'")').filter(
        function(){return $(this).text().trim() === item;}).parent().parent().next();
    } else {
      list = $("#user-repositories-list").find('a:contains("'+item+'")').filter(
        function(){return $(this).text().trim() === item;}).parent().parent().parent().next();
    }
    if(list.length){
      let poll = list.find('poll-include-fragment').attr('src');
      if(poll){
        data = await fetch(`https://github.com/`+poll);
        $ = cheerio.load(await data.text());
        list = $('body')
      }
    }
    page+=1;
    await sleep(2000);  // sleep for 2s to avoid being rate-limited by Github (in the CI)
  }
  let output;
  if(list.length) {
    console.log('Activity chart found.');
    output = list.html();
  } else {
    output = '&nbsp;'
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
        html += await fetchGithubActivity('https://github.com/'+matchGithub[1], matchGithub[2]);
      }
    }
    n['githubActivity'] = html;
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
