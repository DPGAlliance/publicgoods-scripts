import React from "react";
import PropTypes from 'prop-types';
import AnswerOption from './AnswerOption';
import QuestionCount from './QuestionCount';

function Quiz(props) {

    return (
        <div className="quiz pt-0 pl-3 pr-3">
          <QuestionCount
            counter={props.questionId}
            total={props.questionTotal}
          />
          <h4 className="question pl-4">{props.question} <a href="#FAQ" style={{fontSize:13, textDecoration:"underline", color:"#4D29BA"}}> Not sure? </a></h4>
          <ul className="answerOptions">            
            <AnswerOption
                answerContent="Yes"
                answer={props.answer}
                onAnswerSelected={props.onAnswerSelected}
            />            
             
            <AnswerOption
                answerContent="No"
                answer={props.answer}
                onAnswerSelected={props.onAnswerSelected}
            />             
          </ul>
        </div>
    );
  }
  
  Quiz.propTypes = {
    answer: PropTypes.string.isRequired,
    answerOptions: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
    questionTotal: PropTypes.number.isRequired,
    onAnswerSelected: PropTypes.func.isRequired
  };
  
  export default Quiz;