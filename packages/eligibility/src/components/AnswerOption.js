import React from "react";
import PropTypes from 'prop-types';

function AnswerOption(props) {

  return (
    <div className="answerOption" style={{marginTop:0}}>
      <label className="radioCustomLabel" htmlFor={props.answerContent}>
      <input
        id={props.answerContent}
        type="radio"
        className="radioCustomButton"
        checked={props.answer === props.answerContent}
        value={props.answerContent}
        onChange={props.onAnswerSelected}
      />
      <span className="optionContent"> {props.answerContent} </span>
      </label>
    </div>
  );
}

AnswerOption.propTypes = {
  answerContent: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;