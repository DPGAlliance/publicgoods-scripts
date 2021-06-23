import React, {useState} from "react";
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
  const [resultClick, setResultClick] = useState(null);

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
    while (i < 9) {
      if(answersList[i] === "Yes") {
        scoreValue += 1;
      } else if(answersList[i] === "No") {
        questionsList.push(quizQuestions[i]);
      }
      i += 1;
    }
    setScore(scoreValue);
    setWrongQuestions(questionsList);
    if(scoreValue === quizQuestions.length) {
      setButtonName("Proceed");
      setResultClick(true);
    } else if (scoreValue < 9) {
      setButtonName("Start Again")
      setResultClick(false);
    }
    console.log(questionsList);
    console.log(wrongQuestions);
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
            className="mr-4 ml-2"
            style={{width: "200px", marginBottom:80, borderRadius:0, borderColor:"#4D29BA", backgroundColor:"white", color:"#4D29BA", fontFamily:'NowAlt-Light'}}
            variant="secondary"
            onClick={(e) => handleClick(false)}
            disabled={!prev}>
            Back
          </Button>
          <Button
            className="ml-4 mr-2"
            style={{width: "200px", marginBottom:80, borderRadius:0, backgroundColor:"#4D29BA", fontFamily:'NowAlt-Light'}}
            variant="secondary"
            onClick={(e) => handleClick(true)}
            disabled={!next}>
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
          <Result quizScore={score} result={answersList} questions={wrongQuestions} />
          <div className="text-center">
            <Button 
              className="mr-4 ml-2"
              style={{width: "200px", marginBottom:80, borderRadius:0, borderColor:"#4D29BA", backgroundColor:"white", color:"#4D29BA", fontFamily:'NowAlt-Light'}}
              variant="secondary"
              onClick={(e) => window.open("https://digitalpublicgoods.net/", "_self")}
              disabled={!prev}>
              Back to home
            </Button>
            <Button
              className="ml-4 mr-2"
              style={{width: "200px", marginBottom:80, borderRadius:0, backgroundColor:"#4D29BA", fontFamily:'NowAlt-Light'}}
              variant="secondary"
              onClick={(e) => handleResultClick(resultClick)}
              disabled={!next}>
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


