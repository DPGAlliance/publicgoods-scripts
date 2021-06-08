import React from 'react';

function FAQ(props) {
  return (
    <>
    <div className="faq p-5">
    <h3>Frequently Asked Questions</h3>
    <br></br>
    <h5> {props.content.subHeading} </h5>
    <p>
        {props.content.text}
    </p>
    <div style={{color:"grey", marginTop:50}}>
        <h5 class="text-uppercase"> {props.content.name} RESOURCES </h5>
        <b>For additional resources about {props.content.name} please find in the link below <br></br>
        <a href={props.content.link} style={{color:'black'}}>{props.content.link}</a>
        </b>
    </div>
    </div>
    </>
  );
}

export default FAQ;