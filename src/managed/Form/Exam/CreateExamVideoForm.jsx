// import React, { Component } from "react";
// import InputVideoFile from "./InputVideoFile";
// import InputVideoQuestion from "./InputVideoQuestion";
// import "bootstrap/dist/css/bootstrap.min.css";

// export class ExamForm extends Component {
//   // state = {
//   //   step: 1,
//   //   videoLanguage: "",
//   //   questionNum: "",
//   //   inputFile: "",
//   //   videoFile: "",
//   // };
//   constructor(props) {
//     // 初始化
//     super(props);
//     // 設定初始條件
//     this.state = {
//       // 控制表單當前頁數
//       step: 1,
//       // 測驗用表單預設1
//       watchMode: 1,
//       videoFile: "",
//       videoName: "",
//       videoLanguage: "",
//       questionNum: "",
//       // 整修中
//       // choice: { choiceValue: 1, A: "", B: "", C: "", D: "" },
//     };

//     this.handleClick = this.handleClick.bind(this);
//   }

//   // proceed to next step
//   nextStep = () => {
//     const { step } = this.state;
//     this.setState({
//       step: step + 1,
//     });
//   };

//   // Go vack to previous step
//   preStep = () => {
//     const { step } = this.state;
//     this.setState({
//       step: step - 1,
//     });
//   };

//   // 編修中
//   // addChoiceField = () => {
//   //   let choiceObj = {};
//   // };

//   // handle field change
//   handleChange = (input) => (e) => {
//     this.setState({
//       [input]: e.target.value,
//     });
//   };

//   handleClick = (input, fileName) => (e) => {
//     this.setState({
//       [input]: e.target.files[0],
//       [fileName]: e.target.files[0].name,
//     });
//   };

//   render = () => {
//     const { step } = this.state;
//     const { videoLanguage, questionNum, videoFile, videoName } = this.state;
//     const values = { videoLanguage, questionNum, videoFile, videoName };
//     switch (step) {
//       case 1:
//         return (
//           <InputVideoFile
//             nextStep={this.nextStep}
//             handleClick={this.handleClick}
//             values={values}
//             step={step}
//           />
//         );
//       case 2:
//         return (
//           <EditVideoInfo
//             nextStep={this.nextStep}
//             preStep={this.preStep}
//             handleChange={this.handleChange}
//             values={values}
//           />
//         );
//       case 3:
//         return (
//           <InputVideoQuestion
//             nextStep={this.nextStep}
//             preStep={this.preStep}
//             handleChange={this.handleChange}
//             values={values}
//           />
//         );
//       case 4:
//         return <h1>表單預覽</h1>;
//     }

//     // return (
//     //   <>
//     //
//     //     <div className="d-grid  gap-3">
//     //       <div>
//     //         {" "}
//     //         <SelectFormLanguage />
//     //       </div>
//     //       <div>
//     //         <InputFormQuestionNum />
//     //       </div>

//     //       <div></div>
//     //       <div>
//     //         <btn.PrimaryBtn Text={"下一步"} />
//     //       </div>
//     //     </div>
//     //   </>
//     // );
//   };
// }
// export default ExamForm;
import React, { useState } from 'react';

function DynamicForm() {
  const [questions, setQuestions] = useState([{ text: '', answer: '' }]);

  // const handleAddQuestion = () => {
  //   setQuestions([...questions, { text: '', answer: '' }]);
  // }

  const handleQuestionTextChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  }

  const handleAnswerChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = event.target.value;
    setQuestions(newQuestions);
  }

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <label>
            Question {index + 1}:
            {/* <input type="text" value={question.text} onChange={event => handleQuestionTextChange(index, event)} /> */}
          </label>

          {/* <label>
            Answer:
            <input type="text" value={question.answer} onChange={event => handleAnswerChange(index, event)} />
          </label> */}
        </div>
      ))}

      {/* <button onClick={handleAddQuestion}>Add Question</button> */}
    </div>
  );
}

export default DynamicForm;