import React from 'react';
import PropTypes from 'prop-types';
import Summary from './Summary'

function Result(props) {
  return (
    <div className="result">
    {props.quizScore === 9 && (
      <>
      <h2 className="text-center"> You are eligible! </h2>
      <div className="pt-3 pl-5 pr-4 pb-4" style={{fontFamily:'Jost-light'}}>
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test therefore you qualify
        to nominate your project to DPG. 
      </div>
      </>
    )}

    {props.quizScore < 9 && (
      <>
      <h2 className="text-center"> You are not eligible! </h2>
      <div className="pt-3 pl-5 pr-4 pb-4" style={{fontFamily:'Jost-light'}}>
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test therefore you do not qualify
        to nominate your project to DPG. You must correctly answer <strong>9/9</strong> in order to be eligible. Here's why.
      </div>
      <div className="summary">    
          
          {props.questions.map((object, index) => (
              <Summary
                key={index}
                index={index}
                statement={props.questions[index].statement}
                name={props.questions[index].faq.name}
                link={props.questions[index].faq.link}
              />
          ))}
              
      </div>
      </>
    )}  
    </div>
  );
}

Result.propTypes = {
  quizScore: PropTypes.string.isRequired,
};

export default Result;