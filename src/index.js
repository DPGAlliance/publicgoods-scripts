import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import Form from 'react-bootstrap/Form';

import nominees from './nominees.json';

const sdg_labels = ["1. No Poverty","2. Zero Hunger","3. Good Health and Well-being","4. Quality Education","5. Gender Equality","6. Clean Water and Sanitation","7. Affordable and Clean Energy","8. Decent Work and Economic Growth","9. Industry, Innovation and Infrastructure","10. Reduced Inequality","11. Sustainable Cities and Communities","12. Responsible Consumption and Production","13. Climate Action","14. Life Below Water","15. Life on Land","16. Peace and Justice Strong Institutions","17. Partnerships to achieve the Goal"]
const types = ["software", "data", "content", "standard"];
const stage = ["nominee", "DPG"];
const sdgs = ["sdg1", "sdg2", "sdg3", "sdg4", "sdg5", "sdg6", "sdg7", "sdg8", "sdg9", "sdg10", "sdg11", "sdg12", "sdg13", "sdg14", "sdg15", "sdg16", "sdg17"];

function trunc(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, count: 0};
    this.handleChange = this.handleChange.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);

  }

  handleChange(event) {
    const checkboxId = event.target.id.split('-')[0];
    const display = event.target.checked;

    var elems = document.getElementsByClassName(checkboxId);

    for(let i=0; i < elems.length; i++) {
      let concurrentClasses;
      if(display) {
        concurrentClasses = elems[i].className.trim().split(' ');
      } else {
        concurrentClasses = elems[i].className.trim().split(' ').filter(function(a){ return a !== checkboxId });
      }

      let intersectionSet1 = concurrentClasses.filter(i => types.includes(i));
      let intersectionSet2 = concurrentClasses.filter(i => sdgs.includes(i));
      let intersectionSet3 = concurrentClasses.filter(i => stage.includes(i));

      let intersection1 = false;
      for(let j=0; j < intersectionSet1.length; j++) {
        if(document.getElementById(intersectionSet1[j]+'-checkbox').checked){
          intersection1 = true;
          break;
        }
      }
      let intersection2 = false;
      for(let j=0; j < intersectionSet2.length; j++) {
        if(document.getElementById(intersectionSet2[j]+'-checkbox').checked){
          intersection2 = true;
          break;
        }
      }
      let intersection3 = false;
      for(let j=0; j < intersectionSet3.length; j++) {
        if(document.getElementById(intersectionSet3[j]+'-checkbox').checked){
          intersection3 = true;
          break;
        }
      }

      if (intersection1 && intersection2 && intersection3) {
        elems[i].style.display = 'table-row';
      } else {
        elems[i].style.display = 'none';
      }
    }
    this.countActive();
  }

  toggleVisible(event) {
    let parent;
    if(event.target.nodeName === 'path') {
      parent = event.target.parentNode.parentNode;
    } else if (event.target.nodeName === 'svg') {
      parent = event.target.parentNode;
    } else {
      parent = event.target;
    }
    let splits = parent.id.split('-');
    if(parent.style.transform === ''){
      parent.style.transform = 'rotate(180deg)';
      document.getElementById(splits[0]+'-options').style.display='none';
    } else {
      parent.style.transform = '';
      document.getElementById(splits[0]+'-options').style.display='block';
    }
  }

  componentDidMount() {
    this.countActive();
  }

  countActive() {
    const elems = document.getElementById('mytable').getElementsByTagName('tr');
    let count = 0;
    for(let i=0; i<elems.length; i++) {
      if(elems[i].style.display !== 'none'){
        count++;
      }
    }
    this.setState({count: count-1});
  }

  render() {
      return (
        <div>
          <div className="filterSection">
            <p>Displaying {this.state.count} of <b>{nominees.length}</b> items</p>
          </div>

          <div className="filterSection">
            <div className="filterSectionTitle">
               <p className="filter_header">status</p>
               <div className="icon" onClick={this.toggleVisible} id="type-toggle">
                <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.35">
                  <path d="M7 1.053L4.027 4 1 1" stroke="currentColor" fill="none"></path>
                </svg>
               </div>
            </div>
            <div className="filteredContent" id="type-options">
                <Form>
                  {stage.map((label, index) => (
                  <Form.Check 
                    key={index}
                    type='checkbox'
                    id={`${label}-checkbox`}
                  >
                    <Form.Check.Input type='checkbox' defaultChecked onChange = {this.handleChange}/>
                    <Form.Check.Label>
                      {(label==='DPG')?<span>digital public good <img src="dpgicon.svg" alt="DPG icon" height="30"/></span>:trunc(label,25)}
                      </Form.Check.Label>
                  </Form.Check>
                  ))}
                </Form>
            </div>
          </div>

          <div className="filterSection">
            <div className="filterSectionTitle">
               <p className="filter_header">type</p>
               <div className="icon" onClick={this.toggleVisible} id="type-toggle">
                <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.35">
                  <path d="M7 1.053L4.027 4 1 1" stroke="currentColor" fill="none"></path>
                </svg>
               </div>
            </div>
            <div className="filteredContent" id="type-options">
                <Form>
                  {types.map((label, index) => (
                  <Form.Check 
                    key={index}
                    type='checkbox'
                    id={`${label}-checkbox`}
                    label={trunc(label,25)}
                    defaultChecked
                    onChange = {this.handleChange}
                  />
                  ))}
                </Form>
            </div>
          </div>

          <div className="filterSection">
            <div className="filterHead">
              <div className="filterSectionTitle">
               <p className="filter_header">SDG</p>
               <div className="icon" onClick={this.toggleVisible} id="sdg-toggle">
                <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.35">
                  <path d="M7 1.053L4.027 4 1 1" stroke="currentColor" fill="none"></path>
                </svg>
               </div>
              </div>
            </div>
            <div className="filteredContent" id="sdg-options">
                <Form>
                  {sdg_labels.map((label, index) => (
                  <Form.Check 
                    key={index}
                    type='checkbox'
                    id={`sdg${index+1}-checkbox`}
                    label={trunc(label, 25)}
                    defaultChecked
                    onChange = {this.handleChange}
                  />
                  ))}
                </Form>
            </div>
        </div>
       
      </div>
        ); 
  }
}

function ListItem(props){

  let item = props.item;
  let index = props.index;

  let name;
  let nameText;

  if(item.hasOwnProperty('aliases') && item.aliases[0]) {
    nameText = item.name + ' (' + item.aliases[0] + ')';
  } else {
    nameText = item.name;
  }

  if(item.hasOwnProperty('website') && item.website !== '') {
      name = <a href={item.website} target="_blank" rel="noopener noreferrer">{nameText}</a>;
  } else if(item.hasOwnProperty('repositoryURL') && item.repositoryURL !== '') {
      name = <a href={item.repositoryURL} target="_blank" rel="noopener noreferrer">{nameText}</a>;
  } else {
      name = {nameText}
  }

  if(item.stage === 'DPG') {
    if(item.dpgLink){
      name = <span>{name} <a href={'/registry/'+item.name.toLowerCase().replace(/ /g,'-')+'.html'}><img src="dpgicon.svg" alt="DPG icon" height="25"/></a></span>
    } else {
      name = <span>{name} <a href="/blog/announcing-the-first-vetted-digital-public-goods-for-foundational-literacy-and-early-grade-reading/"><img src="dpgicon.svg" alt="DPG icon" height="25"/></a></span>;
    }
  }

  let itemClass='';
  for (var j=0; j<item.SDGs.length; j++) {
    itemClass += 'sdg'+item.SDGs[j].SDGNumber+' '
  }

  for (var k=0; k<item.type.length; k++) {
    itemClass += item.type[k] + ' ';
  }

  itemClass += item.stage;

  let license;
  for (let j=0; j<item.license.length; j++) {
    license = <a href={item.license[j].licenseURL} target="_blank" rel="noopener noreferrer">{item.license[j].spdx} </a>
  }

  let linkName = item.name.replace(/ /g,'_')

  return(
    <tr key={index} className={itemClass}>
      <td>{name}</td>
      {/* eslint-disable-next-line */}
      <td><a id={linkName} className="anchor"></a>{item.description}</td>
      <td>{license}</td>
      <td><div dangerouslySetInnerHTML={{__html: item.githubActivity}} /></td>
    </tr>
  )

}

class List extends Component {
  render() {
    return(
        <table className="table"> 
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>License</th>
              <th>Past year of activity</th>
            </tr>
          </thead>
          <tbody>
            {nominees.map((item, index) => (
              <ListItem item={item} index={index} key={index}/>
            ))}
          </tbody>
        </table>
      )
  }
}

ReactDOM.render(<List />, document.querySelector('#mytable'));
ReactDOM.render(<Filters />, document.querySelector('#filters'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
