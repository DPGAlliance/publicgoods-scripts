import React from 'react';
import PropTypes from 'prop-types';

function Question(props) {
  return (
    <h2 className="question pl-2 pr-2">{props.content}</h2>
  );
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;