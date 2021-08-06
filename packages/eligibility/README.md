# Eligibility Form

The [Eligibility Form](https://digitalpublicgoods.net/eligibility/) consists of nine questions that will help users quickly determine if their digital solution can be nominated as a Digital Public Good (DPG) at this time. If the digital solution is eligible, the user may continue with their nomination submission via the [submission form](https://submission-digitalpublicgoods.vercel.app/). If the digital solution is not currently eligible, the user will be given pointers on how they can improve the product in order to make it eligible. 

If you want to know whether your favorite open, social impact project can become a DPG, we welcome you to fill out this quick and easy form. 

## 📝 Data

The `api` directory in the `src` folder contains the `quizQuestions.js` file which uses a list to store all the data being used in the form. If you want to update the language of a particular question, FAQ or want to add more questions or FAQs, this is where you need to go. Each question is defined as a dictionary in the list and it stores the following information:
   
- `question` - This consists of a string which refers to the question statement to be displayed.
- `answer` - This consists of a string which says either `Yes` or `No` to refer to the correct answer for this question.
- `maybe` - This stores a boolean value. If this value is `true` then the user may still be eligible to nominate their digital solution to DPG even if they don't choose the correct answer. If the value is `false`, the user will not be eligible to to nominate their digital solution to DPG if they don't choose the correct answer.
- `statement` - This stores a string which will be displayed on the final Result page if the user does not choose the correct answer in this particular question.
- `faq` - This consists of a dictionary which stores all the data to be displayed in the FAQ section of the form. It stores the following information :
    - `copy` - This is a list which stores all FAQs for the particular question. It consists of a `subheading` which refers to the question and `text` which stores the response.
    - `name` - This stores the keywords used to define the question.
    - `link` - This stores a URL which can direct users to some additional resources related to the question. It can be left blank.

## 👩‍💻 Components

The `components` directory in the `src` folder contains all the React components used in developing the Eligibility Form. Detailed information about each components is given below:

- **QuestionCount** - This component displays the question number the user is at and the keyboard shortcuts tooltip. 

- **AnswerOption** - This component displays the `Yes` and `No` answer options and records the selected answer for each question.

- **FAQ** - This component renders the entire FAQ section for each question. It fetches the data from `api/quizQuestions.js` and uses `map` to display all the respective questions and answers. It also renders a URL which directs users additional resources if a link is given.

- **Summary** - All questions in which the user does not select the correct answer are added to a list and passed to the `Summary` component one at a time. This component then displays a statement on the Result page to let users know why they may not be eligible.

- **Result** - This component displays the score of the user and a corresponding message to let users know if they are eligible or not. It then uses `map` and the `Summary` component to display what steps the user can take in order to ensure that their digital solution becomes eligible.

- **Eligibility** - This component defines most of the functionality. It conditionally renders the Introductory page, Quiz pages or the Result page. It stores the user's answers, implements the `Next` and `Back` functionality and calculates the result based on the collected answers.

## 🛠 Development

To run this eligibility form on your local machine, follow the development instructions in [publicgoods-scripts/README.md](https://github.com/unicef/publicgoods-scripts/blob/main/README.md). Then point your browser to http://localhost:8080/eligibility/ to see the result.

Every time you make changes to the package, you need not repeat the entire development process. The steps to test your changes in the eligibility package in your local machine are given below:
- Move to directory `/publicgoods-scripts/packages/eligibility`
- Execute `npm run build`
- Move back to `/publicgoods-scripts`
- Execute `./scripts/moveFiles.bash`

The changes will be reflected at http://localhost:8080/eligibility/.



