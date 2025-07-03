import React, { useState, useEffect } from 'react';

export default function QuizDisplay({ quizText }) {
  // quizText is now expected to be an array of question objects

  const [questions, setQuestions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (Array.isArray(quizText)) {
      // Initialize selected to null for each question
      const initializedQuestions = quizText.map(q => ({ ...q, selected: null }));
      setQuestions(initializedQuestions);
      setSubmitted(false);
      setScore(0);
    } else {
      setQuestions([]);
    }
  }, [quizText]);

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;
    const newQuestions = [...questions];
    newQuestions[qIndex].selected = option;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach(q => {
      if (q.selected === q.answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  };

  if (!questions || questions.length === 0) {
    return <p>No quiz questions found in the response.</p>;
  }

  return (
    <div className="quiz-container p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Generated Quiz</h2>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold">{i + 1}. {q.question}</p>
          <div className="ml-4 mt-2">
            {q.options.map((opt, idx) => (
              <label key={idx} className="block mb-1 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={opt}
                  checked={q.selected === opt}
                  onChange={() => handleOptionSelect(i, opt)}
                  disabled={submitted}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
          {submitted && (
            <p className={`mt-1 font-semibold ${
              q.selected === q.answer ? 'text-green-600' : 'text-red-600'
            }`}>
              Your answer: {q.selected || 'No answer selected'} - {q.selected === q.answer ? 'Correct' : `Wrong (Correct: ${q.answer})`}
            </p>
          )}
        </div>
      ))}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Answers
        </button>
      )}
      {submitted && (
        <p className="mt-4 font-bold text-lg">
          Your Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
}
