import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Form from 'react-bootstrap/Form';
import nominees from './nominees.json';

const sdg_labels = ["1. No Poverty","2. Zero Hunger","3. Good Health and Well-being","4. Quality Education","5. Gender Equality","6. Clean Water and Sanitation","7. Affordable and Clean Energy","8. Decent Work and Economic Growth","9. Industry, Innovation and Infrastructure","10. Reduced Inequality","11. Sustainable Cities and Communities","12. Responsible Consumption and Production","13. Climate Action","14. Life Below Water","15. Life on Land","16. Peace and Justice Strong Institutions","17. Partnerships to achieve the Goal"]
const types = {
  "AI": {
    name: "AI Model"
  },
  "Content": {
    name: "Content"
  },
  "Data": {
    name: "Data"
  },
  "Software": {
    name: "Software"
  },
  "Standard": {
    name: "Standard"
  }
};
//const stage = [];
const sdgs = ["SDG1", "SDG2", "SDG3", "SDG4", "SDG5", "SDG6", "SDG7", "SDG8", "SDG9", "SDG10", "SDG11", "SDG12", "SDG13", "SDG14", "SDG15", "SDG16", "SDG17"];
let selectAllTypesToggle = true;
let selectAllSDGsToggle = true;
function trunc(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

nominees.sort(function(a, b) {
  if (!a.hasOwnProperty("id") || !b.hasOwnProperty("id")) {
    return(<div></div>)
  }
  let textA = a.name.toUpperCase();
  let textB = b.name.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, count: 0};
    this.handleChange = this.handleChange.bind(this);
    this.toggleVisible = this.toggleVisible.bind(this);
  }

  handleChange(event) {

    let checkboxId
    let display;
    if(event){
      checkboxId = event.target.id.split('-')[0];

      display = event.target.checked;

      if (checkboxId === 'selectAllTypesToggle') {
        this.selectAllTypes();
      }
      if (checkboxId === 'selectAllSDGsToggle') {
        this.selectAllSDGs();
      }

    } else {
      // When the page loads, handleChange() is called via componentDidMount()
      // We only want to display DPGs at page load, so nominees is unchecked
      // and so we set these two variables accordinly to get the desired behavior
      checkboxId='nominee'
      display=false
    }

    this.doFilter(checkboxId, display);
  }

  doFilter(checkboxId, display) {
    var elems = document.getElementsByClassName(checkboxId);

    for(let i=0; i < elems.length; i++) {

      let concurrentClasses;
      if(display) {
        concurrentClasses = elems[i].className.trim().split(' ');
      } else {
        concurrentClasses = elems[i].className.trim().split(' ').filter(function(a){ return a !== checkboxId });
      }
      let intersectionSet1 = concurrentClasses.filter(i => Object.keys(types).includes(i));

      let intersectionSet2 = concurrentClasses.filter(i => sdgs.includes(i));

      //let intersectionSet3 = concurrentClasses.filter(i => stage.includes(i));

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
      /* let intersection3 = false;
      for(let j=0; j < intersectionSet3.length; j++) {
        if(document.getElementById(intersectionSet3[j]+'-checkbox').checked){
          intersection3 = true;
          break;
        }
      } */

      if (intersection1 && intersection2) {
        elems[i].style.removeProperty('display');
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
      document.getElementById(splits[0]+'-options').style.removeProperty('display');
    }
  }

  componentDidMount() {
    this.handleChange();
  }

  selectAllTypes() {
    selectAllTypesToggle = !selectAllTypesToggle;
    let ele = document.getElementsByClassName('js-typeCheckbox');
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = selectAllTypesToggle;
      this.doFilter(ele[i].id.split('-')[0], selectAllTypesToggle);
    }

  }

  selectAllSDGs() {
    selectAllSDGsToggle = !selectAllSDGsToggle;
    let ele = document.getElementsByClassName('js-SDGCheckbox');
    for (let i = 0; i < ele.length; i++) {
      ele[i].checked = selectAllSDGsToggle;
      this.doFilter(ele[i].id.split('-')[0], selectAllSDGsToggle);
    }
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
          <Form>
          <Form.Check
                    type='checkbox'
                    id={`selectAllTypesToggle`}
                    label='Select all types'
                    defaultChecked={selectAllTypesToggle}
                    onChange = {this.handleChange}
                  />
          </Form>
            <div className="filterSectionTitle">

               <p className="filter_header">Type</p>
               <div className="icon" onClick={this.toggleVisible} id="type-toggle">
                <svg viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.35">
                  <path d="M7 1.053L4.027 4 1 1" stroke="currentColor" fill="none"></path>
                </svg>

               </div>
            </div>
            <div className="filteredContent" id="type-options">
                <Form>

                  {Object.keys(types).map((label, index) => (
                  <Form.Check
                    key={index}
                    className='typeCheckbox'
                    onChange = {this.handleChange}
                  >
                    <Form.Check.Input
                      type="checkbox"
                      className="js-typeCheckbox"
                      id={`${label}-checkbox`}
                      onChange={this.handleChange}
                      defaultChecked
                    />
                    <Form.Check.Label>{trunc(types[label]['name'],25)}</Form.Check.Label>
                  </Form.Check>
                  ))}
                </Form>
            </div>
          </div>

          <div className="filterSection">
            <div className="filterHead">
              <Form>
              <Form.Check
                      type='checkbox'
                      id={`selectAllSDGsToggle`}
                      label='Select all SDGs'
                      defaultChecked={selectAllSDGsToggle}
                      onChange = {this.handleChange}
                    />
              </Form>
              <div className="filterSectionTitle">
               <p className="filter_header">SDGs</p>
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
                    className='sdgs'
                  >
                    <Form.Check.Input
                      type="checkbox"
                      className="js-SDGCheckBox"
                      id={`SDG${index+1}-checkbox`}
                      defaultChecked={selectAllSDGsToggle}
                      onChange={this.handleChange}
                    />
                    <Form.Check.Label>{trunc(label, 25)}</Form.Check.Label>
                  </Form.Check>
                  ))}
                </Form>
            </div>
        </div>

      </div>
        );
  }
}

function ListItemBeta(props){

  let item = props.item;
  let index = props.index;

  if (!item.hasOwnProperty("id")) {
    return(<div></div>)
  }

  let name;
  let nameText = item.name;

  if(item.stage === 'DPG') {
    name = <a href={'https://app.digitalpublicgoods.net/a/' + item.id} target="_blank" rel="noopener noreferrer">{nameText}</a>;
    if(item.dpgLink){
      name = <span>{name} <img src="dpgicon.svg" alt="DPG icon" height="25"/></span>
    }
    else {
      name = <span><a href="/blog/announcing-the-first-vetted-digital-public-goods-for-foundational-literacy-and-early-grade-reading/" target="_blank" rel="noopener noreferrer">{nameText} <img src="dpgicon.svg" alt="DPG icon" height="25"/></a></span>;
    }
  }
  else{
    name = <a href={'https://app.digitalpublicgoods.net/a/' + item.id} target="_blank" rel="noopener noreferrer">{nameText}</a>;
  }

  let itemClass='';
  if(item.hasOwnProperty("sdgs")){
    for (var j=0; j<item.sdgs.sdg.length; j++) {

      let thesdg = item.sdgs.sdg[j];
      thesdg = thesdg.split(':')[0]
      itemClass += thesdg + " "
      //itemClass += 'sdg'+item.sdgs[j].sdg.spilt(':',1)[0]+' '
    }
  }

  if(item.hasOwnProperty("categories")){
    for (var k=0; k<item.categories.length; k++) {
      itemClass += item.categories[k] + ' ';
    }
  }

  itemClass += item.stage;

  let license;
  if (item.hasOwnProperty("openlicenses")) {
    license = item.openlicenses[0].openLicense;
  }

  let linkName = item.name



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
              <ListItemBeta item={item} index={index} key={index}/>
            ))}
          </tbody>
        </table>
      )
  }
}

function MobileListItemBeta(props){

  let item = props.item;
  let index = props.index;

  if (!item.hasOwnProperty("id")) {
    return(<div></div>)
  }

  let name;
  let nameText = item.name;

  if(item.stage === 'DPG') {
    name = <a href={'https://app.digitalpublicgoods.net/a/' + item.id} target="_blank" rel="noopener noreferrer">{nameText}</a>;
    if(item.dpgLink){
      name = <span>{name} <img src="dpgicon.svg" alt="DPG icon" height="25"/></span>
    }
    else {
      name = <span><a href="/blog/announcing-the-first-vetted-digital-public-goods-for-foundational-literacy-and-early-grade-reading/" target="_blank" rel="noopener noreferrer">{nameText} <img src="dpgicon.svg" alt="DPG icon" height="25"/></a></span>;
    }
  }
  else{
    name = <a href={'https://app.digitalpublicgoods.net/a/' + item.id} target="_blank" rel="noopener noreferrer">{nameText}</a>;
  }

  let itemClass='';
  if(item.hasOwnProperty("sdgs")){
    for (var j=0; j<item.sdgs.sdg.length; j++) {

      let thesdg = item.sdgs.sdg[j];
      thesdg = thesdg.split(':')[0]
      itemClass += thesdg + " "
      //itemClass += 'sdg'+item.sdgs[j].sdg.spilt(':',1)[0]+' '
    }
  }

  if(item.hasOwnProperty("categories")){
    for (var k=0; k<item.categories.length; k++) {
      itemClass += item.categories[k] + ' ';
    }
  }

  itemClass += item.stage;

  let linkName = item.name

  return(
      <tr key={index} className={itemClass}>
        <td>{name}</td>
        {/* eslint-disable-next-line */}
        <td><a id={linkName} className="anchor"></a>{item.description}</td>
      </tr>
  )

}

class MobileList extends Component {
  render() {
    return(
        <table className="table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          {nominees.map((item, index) => (
              <MobileListItemBeta item={item} index={index} key={index}/>
          ))}
          </tbody>
        </table>
    )
  }
}

ReactDOM.render(<List />, document.querySelector('#mytable'));
ReactDOM.render(<Filters />, document.querySelector('#filters'));

ReactDOM.render(<MobileList />, document.querySelector('#mobiledpgalist'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
