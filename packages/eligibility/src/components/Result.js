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
        to nominate your product to DPG. Click <strong>Proceed</strong> to complete the Nomination Form! <br></br>
        Have questions? Contact us <a href="mailto:%20hello@digitalpublicgoods.net">here</a>.
      </div>
      </>
    )}

    {props.quizScore < 9 && props.questions.length === 0 && props.maybeQuestions.length > 0 && (
      <>
      <h2 className="text-center"> You may be eligible! </h2>
      <div className="pt-3 pl-5 pr-4 pb-4" style={{fontFamily:'Jost-light'}}>
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test. You may be eligible to nominate
        your product to DPG based on the conditions given below. 
      </div>
      <div className="summary">    
          
          {props.maybeQuestions.map((object, index) => (
              <Summary
                key={index}
                index={index}
                statement={props.maybeQuestions[index].statement}
                name={props.maybeQuestions[index].faq.name}
                link={props.maybeQuestions[index].faq.link}
              />
          ))}

      </div>
      </>
    )}

    {props.quizScore < 9 && props.questions.length > 0 && (
      <>
      <h2 className="text-center"> Sorry! You are not eligible. </h2>
      <div className="pt-3 pl-4 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/9</strong> in the Eligibility Test. You must correctly answer <strong>9/9</strong> in order to be eligible.
        Therefore, you currently do not qualify to nominate your product as a DPG. Let's take a deeper look:
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

          {props.maybeQuestions.length > 0 && (
            <>
            <div className="pl-5 pr-5 pt-4" style={{fontSize:20, textAlign:"left"}}>
              Furthermore,
            </div>
            {props.maybeQuestions.map((object, index) => (
                <Summary
                  key={index}
                  index={index}
                  statement={props.maybeQuestions[index].statement}
                  name={props.maybeQuestions[index].faq.name}
                  link={props.maybeQuestions[index].faq.link}
                />
            ))}
            </>
          )}
              
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