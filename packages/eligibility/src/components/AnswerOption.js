import React from "react";
import PropTypes from 'prop-types';

function AnswerOption(props) {

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }); 

  function handleKeyDown(e){ 

    if(e.keyCode === 37 || e.keyCode === 39) {
      e.preventDefault();
    }

    if(e.keyCode === 38 && props.answerContent === "Yes") {
      document.querySelector("#" + props.answerContent).click();
      e.preventDefault();
    }

    if(e.keyCode === 40 && props.answerContent === "No") {
      document.querySelector("#" + props.answerContent).click();
      e.preventDefault();
    }
  }

  return (
    <div className="answerOption" style={{marginTop:0}}>
      <label className="radioCustomLabel" htmlFor={props.answerContent}>
      <input
        id={props.answerContent}
        type="radio"
        className="radioCustomButton"
        checked={props.answer === props.answerContent}
        value={props.answerContent}
        onKeyDown={(e) => handleKeyDown(e)}
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