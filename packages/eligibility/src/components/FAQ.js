import React from 'react';

function FAQ(props) {
  return (
    <>
    <div className="faq pr-5 pl-5 text-left">
      <h4 style={{fontFamily:'NowAlt-Regular', color:'#2b209a', marginBottom:20}}>Frequently Asked Questions</h4>
      {props.content.copy && props.content.copy.map((copy, index) =>
        <>
          <h5 style={{fontSize:"1.1rem"}}> {copy.subHeading} </h5>
          <p style={{fontSize:"1rem", marginBottom:25}}>
            {copy.text}
          </p>
        </>
      )}

      {props.content.link !== "" && (
        <div style={{marginTop:20, textAlign:"left"}}>
            <h5 style={{fontSize:"1.1rem"}} class="text-uppercase"> {props.content.name} RESOURCES </h5>
            <p style={{fontSize:"1rem"}}>For additional resources about {props.content.name}, please review the link below : <br></br>
            <a href={props.content.link} rel="noopener noreferrer" target="_blank" style={{color:'black'}}>{props.content.link}</a> 
            </p>
        </div>
      )}
    </div>
    </>
  );
}

export default FAQ;