import React from 'react';

var quizQuestions = [
  {
      question: "Is the project relevant to one of the Sustainable Development Goals?",
      answer: "Yes",
      maybe: false,
      statement: "Projects must demonstrate relevance to SDGs",
      faq: {
              copy: [
                        {
                          subHeading: "What are the Sustainable Development Goals?",
                          text: "The 17 Sustainable Development Goals are the blueprint to achieve a better and more sustainable future for all. They address the global challenges we face, including poverty, inequality, climate change, environmental degradation, peace and justice."
                        },
                        {
                          subHeading: "What does it mean to demonstrate relevance to the sustainable development goals?",
                          text: "A project as a whole, or its subcomponents must contribute to the attainment of the Sustainable Development Goals. For example, a project with a goal, mission or vision relevant to an SDG, or a project that produces a data set relevant to an SDG could qualify. In either case, there must be clear intentions to further the SDG in question through your work."
                        }
                    ],
              name: "SDG",
              link: "https://sdgs.un.org/goals"
          }
  },
  {
      question: "Does it use an appropriate open license?",
      answer: "Yes",
      maybe: false,
      statement: "Projects must demonstrate the use of an approved open license.",
      faq: {
          copy: [
                  {
                    subHeading: "What is open source?",
                    text: <p>Open source commonly refers to software that uses an open development process and is licensed to include the source code. <a href="http://opensource.com/" style={{color:"#4D29BA"}}>(Source)</a></p>
                  },
                  {
                    subHeading: "What licenses are accepted?",
                    text: <p>For open source software, only <a href="https://opensource.org/licenses" style={{color:"#4D29BA"}}>OSI approved licenses</a> are accepted. 
                             For open content, the use of a <a href="https://creativecommons.org/licenses/" style={{color:"#4D29BA"}}>Creative Commons license</a> is required. 
                             For open data, an <a href="https://opendefinition.org/licenses/" style={{color:"#4D29BA"}}>Open Data Commons</a> approved license is required. 
                             See the <a href="https://github.com/unicef/publicgoods-candidates/blob/master/docs/licenses.md" style={{color:"#4D29BA"}}>full license list here</a> for reference.
                          </p>
                  },
                  {
                    subHeading: "If a project is open content, must all content have the same license?",
                    text: <p>While we encourage projects to use a license that allows for both derivatives and commercial 
                             reuse (CC-BY and CC-BY-SA) or dedicates content to the public domain (<a href="https://creativecommons.org/choose/zero/" style={{color:"#4D29BA"}}>CC0</a>); 
                             licenses that do not allow for commercial reuse (<a href="https://creativecommons.org/licenses/by-nc/4.0/" style={{color:"#4D29BA"}}>CC-BY-NC</a> and <a href="https://github.com/unicef/publicgoods-candidates/blob/master/docs/licenses.md" style={{color:"#4D29BA"}}>CC-BY-NC-SA</a>) are also accepted.
                          </p>
                  }
                ],
        name: "open license",
        link: "https://github.com/unicef/publicgoods-candidates/blob/master/docs/licenses.md"
      }
  },
  {
      question: "Is ownership clearly defined?",
      answer: "Yes",
      maybe: false,
      fieldName: "clearOwnership[isOwnershipExplicit]",
      statement: "Ownership of everything the project produces must be clearly defined and documented.",
      faq: {
        copy: [
                {
                  subHeading: "What is meant by ‘clear ownership’ and how is it demonstrated? ",
                  text: "Clear ownership can be demonstrated through copyright, trademark or other publicly available information. A link to, or a pdf of this documentation can be shared in order to qualify.  "
                }
              ],
        name: "clear ownership",
        link: ""
      }
  },
  {
      question: "Does the license of libraries/ dependencies undermine the openess of the project?",
      answer: "No",
      maybe: true,
      fieldName: "platformIndependence[mandatoryDepsCreateMoreRestrictions]",
      statement: "If the project has mandatory dependencies that create more restrictions than the original license, the project(s) must be able to demonstrate independence from the closed component(s) and/or indicate the existence of functional, open alternatives.",
      faq: {
        copy: [
          {
            subHeading: "What does it mean to be platform independent?",
            text: <p>Platform-independent software can be used in many different environments, hardware, or operating systems. <a href="https://www.gartner.com/en/information-technology/glossary/platform-independent" style={{color:"#4D29BA"}}>(Source)</a></p>
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
      question: "Is there documentation?",
      answer: "Yes",
      maybe: false,
      fieldName: "documentation[isDocumentationAvailable]",
      statement: "The project must have documentation of the source code, use cases, and/or functional requirements.",
      faq: {
        copy: [
                {
                  subHeading: "What type of project documentation is required?",
                  text: "The project must have documentation of the source code, use cases, and/or functional requirements. For content, this should include all relevant/compatible apps, software, or hardware required to access the content, and instructions regarding how to use it. For software projects, this should be technical documentation that would allow a technical person unfamiliar with the project to launch and run the software. For data projects, this should be documentation that describes all the fields in the set, and provides context on how data was collected, and how it should be interpreted."
                }
              ],
        name: "documentation",
        link: ""
      }
  },
  {
    question: "Does this project collect or use non-personally identifiable information (non-PII) data?",
    answer: "No",
    maybe: true,
    fieldName: "NonPII[collectsNonPII]",
    statement: "If the project has non personally identifiable information (PII) there must be a mechanism for extracting or importing non-PII data from the system in a non-proprietary format.",
    faq: {
      copy: [
              {
                subHeading: "What is “non personally identifiable data”?",
                text: "“Non personally identifiable data” refers to data that is anonymous. More specifically, this data cannot be used to identify an individual (eg. name, social security number, birth date, biometric data etc). Being able to extract or import non-PII data in a non-proprietary format is a measurement of openness – if data collected remains proprietary, there is limited utility of the data for other projects, use cases or attainment of the SDGs."
              },
              {
                subHeading: "What is the best practice when providing documentation on data extraction?",
                text: "Projects should list the mechanisms in place for data extraction such as exposure via API/ REST/ XML, access to CSV/ JSON/ XML files via download et al. Additionally, projects should ensure up to date documentation is publicly available regarding the mechanisms used for data extraction."
              }
            ],
      name: "mechanism of extracting data",
      link: ""
    }
  },
  {
    question: "Does the project adhere to privacy and other applicable international and domestic laws?",
    answer: "Yes",
    maybe: false,
    fieldName: "privacy[isPrivacyCompliant]",
    statement: "The project must state to the best of its knowledge that it complies with relevant privacy laws, and all applicable international and domestic laws.",
    faq: {
      copy: [
              {
                subHeading: "What is the best practice when providing documentation on adherence to privacy and applicable laws?",
                text: "The project must state to the best of its knowledge that it complies with relevant privacy laws, and all applicable international and domestic laws. The project must describe the steps taken to ensure adherence (including links to terms of service, privacy policy, or other relevant documentation)."
              }
            ],
      name: "adherence to privacy and other applicable laws",
      link: ""
    }
  },
  {
    question: "Does the project adhere to standards and best practices?",
    answer: "Yes",
    maybe: false,
    fieldName: "standards[supportStandards]",
    statement: "Projects must demonstrate adherence to standards, best practices, and/or principles.",
    faq: {
      copy: [
              {
                subHeading: "Is there a list of examples of applicable standards or best practices to refer to?",
                text: <p>Supported standards may include HTML, CSS, HTTP, JSON, REST, WCAG et al. Best practices may include <a href="https://digitalprinciples.org/principles/" style={{color:"#4D29BA"}}>Principles for Digital Development</a> or other industry/sector specific best practices. 
                      </p>
              }
            ],
      name: "adherence to standards & best practices",
      link: ""
    }
  },
  {
    question: "Does the project take steps to anticipate, prevent and do no harm?",
    answer: "Yes",
    maybe: false,
    fieldName: "doNoHarm[preventHarm[stepsToPreventHarm]]",
    statement: "All projects must demonstrate that they have taken steps to ensure the project anticipates, prevents, and does no harm.",
    faq: {
      copy: [
              {
                subHeading: "What does it mean to do no harm?",
                text: "Doing no harm is a key component of the UN Secretary-General’s definition of a digital public good. Projects must demonstrate what steps have been taken to mitigate and avoid harm in product design in regards to data security and privacy, inappropriate and illegal content, and protection from harassment."
              },
              {
                subHeading: "What if my project collects or stores personally identifiable information (PII) data?",
                text: "Projects collecting data must identify the types of data collected and stored. Projects must also demonstrate how they ensure the privacy and security of this data in addition to the steps taken to prevent adverse impacts resulting from its collection, storage, and distribution."
              },
              {
                subHeading: "What is considered interaction between users?",
                text: "Interaction between users could be via direct messaging or message boards, meeting platforms or collaborative mechanisms."
              }
            ],
      name: "do no harm",
      link: ""
    }
  }
];

export default quizQuestions;