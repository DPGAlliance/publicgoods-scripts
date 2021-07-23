import React from 'react';
import PropTypes from 'prop-types';

function Question(props) {
  return (
    <h4 className="question pl-4">{props.content}</h4>
  );
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;