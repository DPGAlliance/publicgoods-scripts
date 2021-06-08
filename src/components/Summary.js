import React from 'react';

function Summary(props) {
  return (
    <>
    <div className="pl-5 pr-5 pb-3">
        <br></br>
        <strong> {props.index + 1}. {props.statement} </strong>
        <div style={{color:"grey", marginTop:20}}>
            <h6 class="text-uppercase"> {props.name} RESOURCES </h6>
            For additional resources about {props.name} please find in the link below <br></br>
            <a href={props.link} style={{color:'black'}}>{props.link}</a>
        </div>
    </div>
    </>
  );
}

export default Summary;