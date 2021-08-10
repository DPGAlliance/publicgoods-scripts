import React from 'react';
import PropTypes from 'prop-types';
import Summary from './Summary'

function Result(props) {
  return (
    <div className="result">
    {props.quizScore === props.total && props.total === 9 && (
      <>
      <h2 className="text-center"> Your digital solution is eligible! </h2>
      <div className="pt-3 pl-4 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/{props.total}</strong> in the Eligibility Test. Therefore, you qualify
        to nominate your digital solution to DPG. Click <strong>Proceed</strong> to complete the Nomination Form! <br></br>
        Have questions? Contact us <a href="mailto:%20hello@digitalpublicgoods.net">here</a>.
      </div>
      </>
    )}

    {props.quizScore <= props.total && props.questions.length === 0 && props.maybeQuestions.length > 0 && (
      <>
      <h2 className="text-center"> Your digital solution may be eligible! </h2>
      <div className="pt-3 pl-5 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/{props.total}</strong> in the Eligibility Test. You may be eligible to nominate
        your digital solution to DPG based on the conditions given below. 
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

    {props.quizScore < props.total && props.questions.length > 0 && (
      <>
      <h2 className="text-center"> Sorry! Your digital solution is not eligible. </h2>
      <div className="pt-3 pl-4 pr-4 pb-4">
        You correctly answered <strong>{props.quizScore}/{props.total}</strong> in the Eligibility Test. The digital solution you are considering to nominate is not currently eligible to become a DPG since you must correctly answer <strong>{props.total}/{props.total}</strong> in order to be eligible. 
        Take a look at the responses you provided and a summary of the changes required before becoming a DPG.
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