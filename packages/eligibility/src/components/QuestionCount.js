import React from 'react';
import PropTypes from 'prop-types';
import { RiArrowUpFill, RiArrowDownFill, RiArrowRightFill, RiArrowLeftFill } from 'react-icons/ri';
import { MdKeyboard } from 'react-icons/md';
import ReactTooltip from "react-tooltip";

function QuestionCount(props) { 

  return (
    <div className="questionCount">
      Question <span>{props.counter}</span> of <span style={{marginRight:8}}>{props.total}</span>
      <a data-tip="React-tooltip"> <MdKeyboard style={{ color: 'black', fontSize:'28px', paddingBottom:3 }} /> </a>
      <ReactTooltip place="right" type="dark" effect="float">
        <div style={{fontSize:'13px', color:'white'}}> 
            <div style={{marginBottom:5}}><strong>Keyboard shortcuts</strong></div>
            <div style={{marginBottom:2}}><span style={{marginRight:27}}><RiArrowUpFill style={{ color: '#A58EF0', marginRight:5, fontSize: '23px' }} /> Yes </span>
              <span><RiArrowDownFill style={{ color: '#A58EF0', marginRight:5, fontSize: '23px' }} /> No </span>
            </div>
            <span style={{marginRight:20}}><RiArrowRightFill style={{ color: '#A58EF0', marginRight:5, fontSize: '23px' }} /> Next </span>
            <span><RiArrowLeftFill style={{ color: '#A58EF0', marginRight:5, fontSize: '23px' }} /> Back </span>
          </div>
      </ReactTooltip>
    </div>
  );
}

QuestionCount.propTypes = {
  counter: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default QuestionCount;