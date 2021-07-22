import React, {useState, useCallback} from "react";
import {useCookies} from "react-cookie";
import {v4 as uuidv4} from "uuid";
import Quiz from './components/Quiz';
import Result from './components/Result';
import FAQ from './components/FAQ';
import quizQuestions from './api/quizQuestions';
import {Button} from "react-bootstrap";
import './index.css';

function Eligibility() {
  const [counter, setCounter] = useState(0);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);
  const [questionId, setQuestionId] = useState(1);
  const [question, setQuestion] = useState(quizQuestions[0].question);
  const [answer, setAnswer] = useState('');
  const [answersList, setAnswerList] = useState({});
  const [score, setScore] = useState(0);
  const [buttonName, setButtonName] = useState('');
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [maybeQuestions, setMaybeQuestions] = useState([]);
  const [resultClick, setResultClick] = useState(null);
  const [cookies, setCookie] = useCookies(["uuid"]);
  const [values, setValues] = useState({});

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeys);

    // Initialize cookie if not present
    const userId = uuidv4();
    if (!cookies.uuid) {
      setCookie("uuid", userId, {path: "/", maxAge: 2592000}); // maxAge: 30 days
    } 

    return () => {
      document.removeEventListener('keydown', handleKeys);
    };
  });

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  };

  const debouncedSave = useCallback(
    debounce((vals) => saveToDb(vals), 1000),
    [cookies.uuid]
  );

  async function saveToDb(vals) {
    if (cookies.uuid) {
      await fetch(`https://submission-digitalpublicgoods.vercel.app/api/saveDB/${cookies.uuid}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          values: vals,
        }),
      });
    }
  }

  function handleKeys(e){ 
    e.keyCode === 37 && document.querySelector('#backButton') && document.querySelector('#backButton').click() && e.preventDefault();
    e.keyCode === 39 && document.querySelector('#nextButton') && document.querySelector('#nextButton').click() && e.preventDefault();
  }

  function setUserAnswer(ans) {
    setAnswer(ans);
    answersList[counter] = ans;
  }

  function handleAnswerSelected(event) {
    setUserAnswer(event.currentTarget.value);
    if (questionId <= quizQuestions.length) {
      setNext(true);
    }
  }

  function handleClick(param) {
    if (param && counter<8) {
      setNextQuestion();      
    } else if (param && counter === quizQuestions.length-1) {
      getResults();
      setCounter(counter + 1);
    } else if (!param && counter > 1) {
      setPrevQuestion();
    } else if (counter === 1) {
      setPrev(false);
      setPrevQuestion();
    }
  }

  function handleResultClick(param) {
    if (!param) {
      setCounter(0);
      setPrev(false);
      setNext(false);
      setQuestionId(1);
      setQuestion(quizQuestions[0].question); 
      setAnswer('');
      setAnswerList({});
      setScore(0);
      setButtonName('');
      setWrongQuestions([]);         
    } else if (param) {
      debouncedSave(values);
      window.open("https://submission-digitalpublicgoods.vercel.app/");
    }
  }

  function setNextQuestion() {
    setQuestion(quizQuestions[counter+1].question);
    if(!answersList[counter+1]) {
      setNext(false);
      setAnswer('');
    }
    if(answersList[counter+1]) {
      setAnswer(answersList[counter+1]);
    }
    setCounter(counter + 1);
    setQuestionId(questionId + 1);    
    setPrev(true);
  }

  function setPrevQuestion() {
    setQuestion(quizQuestions[counter-1].question);
    setAnswer(answersList[counter-1]);
    setCounter(counter - 1);    
    setQuestionId(questionId - 1);
    setNext(true);    
  }

  function getResults() {
    let i = 0;
    let scoreValue = 0;
    let questionsList = [];
    let maybeList = [];
    let valueList = {};

    while (i < 9) {
      if(i > 1) {
        if(answersList[i] === quizQuestions[i].answer)
          valueList[quizQuestions[i].fieldName] = quizQuestions[i].answer;
        else {
          if(quizQuestions[i].answer === "Yes")
            valueList[quizQuestions[i].fieldName] = "No";
          else
            valueList[quizQuestions[i].fieldName] = "Yes";
        }
      }
      if(answersList[i] === quizQuestions[i].answer) {
        scoreValue += 1;
      } else if (answersList[i] !== quizQuestions[i].answer && quizQuestions[i].maybe) {
        maybeList.push(quizQuestions[i]);
      } else {
        questionsList.push(quizQuestions[i]);
      }
      i += 1;
    }

    setScore(scoreValue);
    setWrongQuestions(questionsList);
    setMaybeQuestions(maybeList); 
    setValues(valueList);
    
    if(scoreValue === quizQuestions.length || scoreValue + maybeList.length === quizQuestions.length) {
      setButtonName("Proceed");
      setResultClick(true);
    } else {
      setButtonName("Start Again")
      setResultClick(false);
    }
  }

    return (
      <>      
      <div>
      {counter < quizQuestions.length && (        
        <>
        <div className="App" style={{paddingBottom:40, textAlign: "left"}}>                
          <Quiz
          answer={answer}
          questionId={questionId}
          question={question}
          questionTotal={quizQuestions.length}
          onAnswerSelected={handleAnswerSelected}
          />
        </div>

        <div className="text-center">
          <Button 
            className="ml-2"
            variant="secondary"
            onClick={(e) => handleClick(false)}
            disabled={!prev}
            id="backButton">
            Back
          </Button>
          <Button
            className="mr-2"
            variant="secondary"
            onClick={(e) => handleClick(true)}
            disabled={!next}
            id="nextButton">
            Next
          </Button>
        </div>

        <div style={{backgroundColor:"#F4F4F4"}}>
        <FAQ content={quizQuestions[counter].faq} /> 
        </div>
        </>
        )}

        {counter === quizQuestions.length && (
          <>
          <Result quizScore={score} result={answersList} questions={wrongQuestions} maybeQuestions={maybeQuestions} />
          <div className="text-center">
            <Button 
              className="ml-2"
              variant="secondary"
              onClick={(e) => window.open("https://digitalpublicgoods.net/", "_self")}
              disabled={!prev}
              id="backButton">
              Back to home
            </Button>
            <Button
              className="mr-2"
              variant="secondary"
              onClick={(e) => handleResultClick(resultClick)}
              disabled={!next}
              id="nextButton">
              {buttonName}
            </Button>
          </div>
          </>
        )}
        </div> 

        </>
      );
  }
  
  export default Eligibility;


