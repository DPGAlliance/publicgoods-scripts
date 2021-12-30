import React from 'react';

var quizQuestions = [
  {
      question: "Is the digital solution relevant to one of the Sustainable Development Goals?",
      answer: "Yes",
      maybe: false,
      statement: "Digital solutions must demonstrate relevance to SDGs",
      faq: {
              copy: [
                        {
                          subHeading: "What are the Sustainable Development Goals (SDGs)?",
                          text: "The 17 Sustainable Development Goals  (SDGs) are a collection of 17 interlinked global goals designed as blueprint to achieve a better and more sustainable future for all.The SDGs were set up in 2015 by the United Nations General Assembly and are intended to be achieved by the year 2030. They address the global challenges we face, including poverty, inequality, climate change, environmental degradation, peace and justice."
                        },
                        {
                          subHeading: "What does it mean to demonstrate relevance to the sustainable development goals?",
                          text: "A digital solution as a whole, or its subcomponents must contribute to the attainment of the Sustainable Development Goals. For example, a digital solution with a goal, mission or vision relevant to an SDG, or a digital solution that produces a data set relevant to an SDG would qualify. In either case, there must be clear intentions to further the SDG in question through your work."
                        }
                    ],
              name: "SDG",
              link: "https://sdgs.un.org/goals"
          }
  },
  {
      question: "Does it use an approved open-source license?",
      answer: "Yes",
      maybe: false,
      statement: "Digital solutions must demonstrate the use of an approved open license.",
      faq: {
          copy: [
                  {
                    subHeading: "What is open source?",
                    text: <p style={{fontSize:"1rem"}}>Open source <a href="http://opensource.com/" rel="noopener noreferrer" target="_blank">commonly refers to</a> software that uses an open development process and is licensed to include the source code. Though originally referencing software, the open source model for software development inspired the use of the term to refer to other forms of open collaboration, such as open content and open data.</p>
                  },
                  {
                    subHeading: "What licenses are approved?",
                    text: <p style={{fontSize:"1rem"}}>For open source software, only <a href="https://opensource.org/licenses" rel="noopener noreferrer" target="_blank">OSI approved licenses</a> are accepted. 
                             For open content, the use of a <a href="https://creativecommons.org/licenses/" rel="noopener noreferrer" target="_blank">Creative Commons license</a> is required. 
                             For open data, an <a href="https://opendefinition.org/licenses/" rel="noopener noreferrer" target="_blank">Open Data Commons</a> approved license is required. 
                             See the <a href="https://github.com/DPGAlliance/publicgoods-candidates/blob/master/docs/licenses.md" rel="noopener noreferrer" target="_blank">full license list here</a> for reference.
                          </p>
                  },
                  {
                    subHeading: "If a digital solution is open content, must all content have the same license?",
                    text: <p style={{fontSize:"1rem"}}>
                            If a digital solution is being submitted as an open content DPG, then all of the content does not have to use the same license. 
                            However, all of the content contained in the collection must use one of the <a href="https://opendefinition.org/licenses/" rel="noopener noreferrer" target="_blank">approved creative commons licenses</a>. 
                          </p>
                  }
                ],
        name: "open license",
        link: "https://github.com/DPGAlliance/publicgoods-candidates/blob/master/docs/licenses.md"
      }
  },
  {
      question: "Is ownership clearly defined?",
      answer: "Yes",
      maybe: false,
      fieldName: "clearOwnership",
      keyName: "isOwnershipExplicit",
      statement: "Ownership of everything the digital solution produces must be clearly defined and documented.",
      faq: {
        copy: [
                {
                  subHeading: "What is meant by ‘clear ownership’ and how is it demonstrated? ",
                  text: "Clear ownership can be demonstrated through copyright, trademark or other publicly available information. A link to, or a pdf of this documentation should be shared in order to qualify.  "
                }
              ],
        name: "clear ownership",
        link: ""
      }
  },
  {
      question: "Is the digital solution platform-independent?",
      answer: "Yes",
      maybe: true,
      fieldName: "platformIndependence",
      keyName: "mandatoryDepsCreateMoreRestrictions",
      statement: "If the digital solution has mandatory dependencies that create more restrictions than the original license, the digital solution(s) must be able to demonstrate independence from the closed component(s) and/or indicate the existence of functional, open alternatives.",
      faq: {
        copy: [
          {
            subHeading: "What does it mean to be platform independent?",
            text: <p style={{fontSize:"1rem"}}>Platform-independent digital solutions <a href="https://en.wiktionary.org/wiki/platform-independent" rel="noopener noreferrer" target="_blank">can operate on any computer platform, </a> 
              environment, hardware, or operating system. In this context, platform independence means that the accessibility or functionality of a digital solution is not limited or dependent upon a closed component. 
              In order to ensure this, digital solutions must be able to show that they can function without the closed component.
              </p>
          },
          {
            subHeading: "If the project was forked from another project, is it platform independent?",
            text: "If the project has mandatory dependencies that create more restrictions than the original license, the project(s) must be able to demonstrate independence from the closed component(s) and/or indicate the existence of functional, open alternatives."
          }
        ],
        name: "platform independence",
        link: ""
      }
  },
  {
      question: "Is there documentation of the source code, use cases, and/or functional requirements for this digital solution?",
      answer: "Yes",
      maybe: false,
      fieldName: "documentation",
      keyName: "isDocumentationAvailable",
      statement: "The digital solution must have documentation of the source code, use cases, and/or functional requirements.",
      faq: {
        copy: [
                {
                  subHeading: "What type of documentation is required?",
                  text: "The digital solution must have documentation of the source code, use cases, and/or functional requirements. For content, this should include all relevant/compatible apps, software, or hardware required to access the content, and instructions regarding how to use it. For software digital solutions, this should be technical documentation that would allow a technical person unfamiliar with the digital solution to launch and run the software. For data digital solutions, this should be documentation that describes all the fields in the set, and provides context on how data was collected, and how it should be interpreted."
                }
              ],
        name: "documentation",
        link: ""
      }
  },
  {
    question: "Does this digital solution collect or use non-personally identifiable information (non-PII) data and/or content?",
    answer: "No",
    maybe: true,
    fieldName: "NonPII",
    keyName: "collectsNonPII",
    statement: "If the digital solution has non personally identifiable information (PII) there must be a mechanism for extracting or importing non-PII data and/or content from the system in a non-proprietary format.",
    faq: {
      copy: [
              {
                subHeading: "What is “non-personally identifiable data and/or content”?",
                text: "“Non-personally identifiable data and/or content” refers to data and/or content that is anonymous. More specifically, this data and/or content cannot be used to identify an individual. For example, a person’s name, social security number, birth date, biometric data etc is personally identifiable data since it could be used to identify the individual but their city or university would be considered non-personally identifiable data since it alone cannot be used to identify a specific individual. Being able to extract or import non-PII data in a non-proprietary format is a measurement of openness – if data collected remains proprietary, there is limited utility of the data for other projects, use cases or attainment of the SDGs."
              },
              {
                subHeading: "What is the best practice when providing documentation on data and/or content extraction?",
                text: "Digital solutions should list the mechanisms in place for data and/or content extraction such as exposure via API/ REST/ XML, access to CSV/ JSON/ XML files via download et al. Additionally, digital solutions should ensure up to date documentation is publicly available regarding the mechanisms used for data and/or content extraction."
              }
            ],
      name: "mechanism of extracting data and/or content",
      link: ""
    }
  },
  {
    question: "Are you the developer or owner of this digital solution?",
  },
  {
    question: "Does the digital solution adhere to privacy and other applicable international and domestic laws?",
    answer: "Yes",
    maybe: false,
    fieldName: "privacy",
    keyName: "isPrivacyCompliant",
    statement: "The digital solution must state to the best of its knowledge that it complies with relevant privacy laws, and all applicable international and domestic laws.",
    faq: {
      copy: [
              {
                subHeading: "What is the best practice when providing documentation on adherence to privacy and applicable laws?",
                text: "The digital solution must state to the best of its knowledge that it complies with relevant privacy laws, and all applicable international and domestic laws. The digital solution must describe the steps taken to ensure adherence (including links to terms of service, privacy policy, or other relevant documentation)."
              }
            ],
      name: "adherence to privacy and other applicable laws",
      link: ""
    }
  },
  {
    question: "Does the digital solution adhere to standards and best practices?",
    answer: "Yes",
    maybe: false,
    fieldName: "standards",
    keyName: "supportStandards",
    statement: "Digital solutions must demonstrate adherence to standards, best practices, and/or principles.",
    faq: {
      copy: [
              {
                subHeading: "Is there a list of examples of applicable standards or best practices to refer to?",
                text: <p style={{fontSize:"1rem"}}>Supported standards may include HTML, CSS, HTTP, JSON, REST, WCAG et al. Best practices may include <a href="https://digitalprinciples.org/principles/" rel="noopener noreferrer" target="_blank">Principles for Digital Development</a> or other industry/sector specific best practices. 
                      </p>
              }
            ],
      name: "adherence to standards & best practices",
      link: ""
    }
  },
  {
    question: "Does the digital solution take steps to anticipate, prevent and do no harm?",
    answer: "Yes",
    maybe: false,
    fieldName: "doNoHarm",
    keyName: "preventHarm",
    keyName2: "stepsToPreventHarm",
    statement: "All digital solutions must demonstrate that they have taken steps to ensure the digital solution anticipates, prevents, and does no harm by design.",
    faq: {
      copy: [
              {
                subHeading: "What does it mean to do no harm by design?",
                text: "Doing no harm by design is a key component of the UN Secretary-General’s definition of a digital public good. Digital solutions must demonstrate what steps have been taken to mitigate and avoid harm in product design in regards to data security and privacy, inappropriate and illegal content, and protection from harassment."
              },
              {
                subHeading: "What if my digital solution collects or stores personally identifiable information (PII) data and/or content?",
                text: "Digital solutions collecting data and/or content must identify the types of data and/or content collected and stored. Digital solutions must also demonstrate how they ensure the privacy and security of this data and/or content in addition to the steps taken to prevent adverse impacts resulting from its collection, storage, and distribution."
              }
            ],
      name: "do no harm",
      link: ""
    }
  }
];

export default quizQuestions;
