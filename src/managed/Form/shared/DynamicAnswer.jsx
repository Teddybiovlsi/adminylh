import React, { useState } from "react";

function DynamicAnswer() {
  const [numOptions, setNumOptions] = useState(2);

  const handleOptionChange = (event) => {
    setNumOptions(parseInt(event.target.value));
  };

  const answerInputs = [];
  for (let i = 0; i < numOptions; i++) {
    const answer = String.fromCharCode(65 + i); // answerNumber為1~4的數字
    answerInputs.push(
      <div key={i}>
        <label>Answer {answer}:</label>
        <input type="text" name={`answer-${answer}`} />
      </div>
    );
  }

  return (
    <div>
      <label>Number of options:</label>
      <select value={numOptions} onChange={handleOptionChange}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      {answerInputs}
    </div>
  );
}

export default DynamicAnswer;
