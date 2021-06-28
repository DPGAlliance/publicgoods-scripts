import React from 'react';

function FAQ(props) {
  return (
    <>
    <div className="faq p-5">
      <h2 style={{fontFamily:'NowAlt-Regular', color:'#2b209a'}}>Frequently Asked Questions</h2>
      <br></br>
      {props.content.copy && props.content.copy.map((copy, index) =>
                      <>
                        <h5> {copy.subHeading} </h5>
                        <p style={{marginBottom:30}}>
                          {copy.text}
                        </p>
                      </>
                      )}

      <div style={{marginTop:40, textAlign:"left"}}>
          <h5 class="text-uppercase"> {props.content.name} RESOURCES </h5>
          <p>For additional resources about {props.content.name}, please review the link below : <br></br>
          <a href={props.content.link} rel="noopener noreferrer" target="_blank" style={{color:'black'}}>{props.content.link}</a> </p>
      </div>
    </div>
    </>
  );
}

export default FAQ;