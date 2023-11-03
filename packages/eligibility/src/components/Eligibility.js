import React, {useState} from "react";
import {useCookies} from "react-cookie";
import {v4 as uuidv4} from "uuid";
import Result from './Result';
import FAQ from './FAQ';
import AnswerOption from './AnswerOption';
import QuestionCount from './QuestionCount';
import quizQuestions from '../api/quizQuestions';
import {Button} from "react-bootstrap";
import "react-step-progress-bar/styles.css";
import {ProgressBar} from "react-step-progress-bar";
import Paper from '@material-ui/core/Paper';

function Eligibility() {
    const [counter, setCounter] = useState(0);
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(false);
    const [questionId, setQuestionId] = useState(0);
    const [question, setQuestion] = useState(quizQuestions[0].question);
    const [answer, setAnswer] = useState('');
    const [answersList, setAnswerList] = useState({});
    const [score, setScore] = useState(1);
    const [buttonName, setButtonName] = useState('');
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [maybeQuestions, setMaybeQuestions] = useState([]);
    const [resultClick, setResultClick] = useState(null);
    const [cookies, setCookie] = useCookies(["uuid"]);
    const [startQuiz, setStartQuiz] = useState(false);
    const [isOwner, setIsOwner] = useState(true);
    const [total, setTotal] = useState(7);

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

    function handleKeys(e) {
        e.keyCode === 37 && document.querySelector('#backButton') && document.querySelector('#backButton').click() && e.preventDefault();
        e.keyCode === 39 && document.querySelector('#nextButton') && document.querySelector('#nextButton').click() && e.preventDefault();
    }

    function setUserAnswer(ans) {
        setAnswer(ans);
        answersList[counter] = ans;
        if (counter === 6 && ans === "No") {
            setIsOwner(false);
            setTotal(7);
        }
        if (counter === 6 && ans === "Yes") {
            setIsOwner(true);
            setTotal(quizQuestions.length);
        }
    }

    function handleAnswerSelected(event) {
        setUserAnswer(event.currentTarget.value);
        if (questionId <= quizQuestions.length) {
            setNext(true);
        }
    }

    function handleClick(param) {
        if (param && !isOwner && counter === total - 1) {
            getResultsNotOwner();
            setCounter(quizQuestions.length);
        } else if (param && counter < quizQuestions.length - 1) {
            setNextQuestion();
        } else if (param && counter === quizQuestions.length - 1) {
            getResultsIsOwner();
            setCounter(quizQuestions.length);
        } else if (!param && counter > 1) {
            setPrevQuestion();
        } else if (counter === 1) {
            setPrev(false);
            setPrevQuestion();
        }
    }

    async function handleResultClick(param) {
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
            setTotal(7);
            setIsOwner(true);
        } else if (param) {
            window.open("https://app.digitalpublicgoods.net/signup");
        }
    }

    function setNextQuestion() {
        setQuestion(quizQuestions[counter + 1].question);
        if (!answersList[counter + 1]) {
            setNext(false);
            setAnswer('');
        }
        if (answersList[counter + 1]) {
            setAnswer(answersList[counter + 1]);
        }
        setCounter(counter + 1);
        setQuestionId(questionId + 1);
        setPrev(true);
    }

    function setPrevQuestion() {
        setQuestion(quizQuestions[counter - 1].question);
        setAnswer(answersList[counter - 1]);
        setCounter(counter - 1);
        setQuestionId(questionId - 1);
        setNext(true);
    }

    function getResultsNotOwner() {
        let i = 0;
        let scoreValue = 1;
        let questionsList = [];
        let maybeList = [];
        let valueList = {};

        while (i < 6) {
            if (i > 1) {
                let tempList = {};
                if (quizQuestions[i].keyName2) {
                    let tempList2 = {};
                    tempList2[quizQuestions[i].keyName2] = answersList[i];
                    tempList[quizQuestions[i].keyName] = tempList2;
                } else {
                    tempList[quizQuestions[i].keyName] = answersList[i];
                }

                valueList[quizQuestions[i].fieldName] = tempList;
            }
            if (answersList[i] === quizQuestions[i].answer) {
                scoreValue += 1;
            } else if (answersList[i] !== quizQuestions[i].answer && quizQuestions[i].maybe) {
                maybeList.push(quizQuestions[i]);
            } else {
                questionsList.push(quizQuestions[i]);
            }
            i += 1;
        }
        maybeList.push(quizQuestions[7]);
        maybeList.push(quizQuestions[8]);
        maybeList.push(quizQuestions[9]);
        setScore(scoreValue);
        setWrongQuestions(questionsList);
        setMaybeQuestions(maybeList);

        if (scoreValue === 7 || scoreValue + maybeList.length - 3 === 7) {
            setButtonName("Proceed");
            setResultClick(true);
        } else {
            setButtonName("Start Again")
            setResultClick(false);
        }
    }

    function getResultsIsOwner() {
        let i = 0;
        let scoreValue = 1;
        let questionsList = [];
        let maybeList = [];
        let valueList = {};

        while (i < 10) {
            if (i !== 6) {
                if (i > 1) {
                    let tempList = {};
                    if (quizQuestions[i].keyName2) {
                        let tempList2 = {};
                        tempList2[quizQuestions[i].keyName2] = answersList[i];
                        tempList[quizQuestions[i].keyName] = tempList2;
                    } else {
                        tempList[quizQuestions[i].keyName] = answersList[i];
                    }

                    valueList[quizQuestions[i].fieldName] = tempList;
                }
                if (answersList[i] === quizQuestions[i].answer) {
                    scoreValue += 1;
                } else if (answersList[i] !== quizQuestions[i].answer && quizQuestions[i].maybe) {
                    maybeList.push(quizQuestions[i]);
                } else {
                    questionsList.push(quizQuestions[i]);
                }
            }
            i += 1;
        }
        setScore(scoreValue);
        setWrongQuestions(questionsList);
        setMaybeQuestions(maybeList);

        if (scoreValue === quizQuestions.length || scoreValue + maybeList.length === quizQuestions.length) {
            setButtonName("Proceed");
            setResultClick(true);
        } else {
            setButtonName("Start Again")
            setResultClick(false);
        }
    }

    return (
        <>
            <center>
                <div className="pt-2 pb-3" style={{width: "60%"}}>
                    <ProgressBar
                        filledBackground="linear-gradient(to right, #cdbdff, #4d29ba)"
                        percent={(questionId / total) * 100}
                    />
                </div>

                <Paper className="pt-4 card" variant="outlined" elevation={5}>
                    <div>
                        {!startQuiz && (
                            <>
                                <div className="p-3">
                                    <h3 className="pl-3 pr-3 text-center" style={{fontFamily: "NowAlt-Regular", color: "#2b209a"}}> Is your digital solution
                                        ready to be a Digital Public Good? </h3>
                                    <div className="text-left p-4">
                                        The Eligibility Form requires you to answer 7 or 10 questions that will help you quickly determine if your digital
                                        solution can be nominated as a Digital Public Good (DPG) at this time. If your solution is eligible, you may continue
                                        with your nomination submission via the submission form. If your digital solution is not currently eligible, you will be
                                        given pointers on how you can improve it in order to make it eligible.
                                        <br/><br/>Want to know whether your favorite open, social impact project can become a DPG? Fill out this form and find
                                        out for yourself!
                                    </div>
                                </div>

                                <Button
                                    className="mr-2"
                                    style={{width: "200px", marginLeft: 25, marginBottom: 30, borderRadius: 0, backgroundColor: "#4D29BA"}}
                                    variant="secondary"
                                    onClick={(e) => {
                                        setStartQuiz(true);
                                        setQuestionId(1);
                                    }}
                                    id="nextButton">
                                    Get Started
                                </Button>
                            </>
                        )}
                        {startQuiz && counter < quizQuestions.length && (
                            <>
                                <div className="pb-3">
                                    <div className="quiz pt-0 pl-3 pr-3 text-left">
                                        <QuestionCount
                                            counter={questionId}
                                            total={total}
                                        />

                                        <h4 className="question pl-4">{question} {counter !== 6 && (
                                            <a href="#FAQ" style={{fontSize: 13, textDecoration: "underline", color: "#4D29BA"}}> Not sure? </a>)} </h4>

                                        <ul className="answerOptions">
                                            <AnswerOption
                                                answerContent="Yes"
                                                answer={answer}
                                                onAnswerSelected={handleAnswerSelected}
                                            />

                                            <AnswerOption
                                                answerContent="No"
                                                answer={answer}
                                                onAnswerSelected={handleAnswerSelected}
                                            />
                                        </ul>
                                    </div>
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

                                {counter !== 6 && (
                                    <div style={{backgroundColor: "#F4F4F4"}}>
                                        <a href="/#" name="FAQ" style={{fontSize: 1, textDecoration: "none", color: "#F4F4F4"}}>.</a><FAQ
                                        content={quizQuestions[counter].faq}/>
                                    </div>
                                )}

                            </>
                        )}

                        {startQuiz && counter === quizQuestions.length && (
                            <>
                                <Result quizScore={score} total={total} result={answersList} questions={wrongQuestions} maybeQuestions={maybeQuestions}/>
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
                </Paper>
            </center>

        </>
    );
}

export default Eligibility;


