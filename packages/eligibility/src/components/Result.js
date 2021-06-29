import React from 'react';
import PropTypes from 'prop-types';
import Summary from './Summary'

function Result(props) {
  return (
    <div className="result">
    {props.quizScore === 9 && (
      <>
      <h2 className="text-center"> You are eligible! </h2>
      <div className="pt-3 pl-4 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test. Therefore, you qualify
        to nominate your project to DPG. Click <strong>Proceed</strong> to complete the Nomination Form! <br></br>
        Have questions? Contact us <a href="mailto:%20hello@digitalpublicgoods.net">here</a>.
      </div>
      </>
    )}

    {props.quizScore < 9 && (
      <>
      <h2 className="text-center"> Sorry! You are not eligible. </h2>
      <div className="pt-3 pl-4 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test. You must correctly answer <strong>9/9</strong> in order to be eligible.
        Therefore, you currently do not qualify to nominate your project as a DPG. Let's take a deeper look:
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