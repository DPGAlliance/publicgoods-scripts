const fs = require('fs');
const glob = require('glob');

const path = '../publicgoods-candidates/candidates'
let candidates=[];

glob(path + '/*.json', {}, (err, files)=>{
  for (var i=0; i<files.length; i++) {
    candidates.push(JSON.parse(fs.readFileSync(files[i], 'utf8')));
  }

  let sdgs = new Array(17).fill(0);
  let type = {data:0, software:0, standard:0}
  candidates.forEach(function(e) {
    e['SDGs'].forEach(function(d){
      sdgs[d]++;
    })
    e['type'].forEach(function(d){
      type[d]++;
    })
  })
  let data={ name: 'SDGs', children: []};
  for(var i=0; i<sdgs.length; i++) {
    if (sdgs[i]) {
      data['children'].push({name: i, value: sdgs[i]});
    }
  }

  let t = 0;
  for(var key in type){
    t += type[key];
  }

  let ts = [];
  for (var key in type) {
    ts.push({name: key, value: Math.round(type[key]/t*100) });
  }
  console.log(data);
  console.log(type);
  console.log(ts);
});