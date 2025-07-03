import React, { useState } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import QuizDisplay from './components/QuizDisplay';
import EduMateIcon from './assets/EduMate Circle icon.png';

export default function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summarize');
  const [showAskModal, setShowAskModal] = useState(false);
  const [askInput, setAskInput] = useState('');
  const [quizData, setQuizData] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setOutput('');
    setExtractedText('');
    setQuizData(null);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExtractedText(res.data.text);
    } catch (error) {
      setOutput('Error extracting text from file.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (activeTab === 'ask') {
      if (!askInput.trim()) {
        setOutput('Please enter your question.');
        return;
      }
    } else if (activeTab === 'quiz') {
      if (!extractedText) {
        setOutput('Please upload a file and extract text first.');
        return;
      }
    } else if (!extractedText) {
      setOutput('Please upload a file and extract text first.');
      return;
    }
    setLoading(true);
    setOutput('');
    try {
      let endpoint = '';
      let payload = {};
      if (activeTab === 'summarize') {
        endpoint = 'summarize';
        payload = { content: extractedText };
      } else if (activeTab === 'quiz') {
        endpoint = 'quiz';
        payload = { content: extractedText };
      } else if (activeTab === 'ask') {
        endpoint = 'ask';
        payload = { question: askInput };
      }
      const res = await axios.post(`http://localhost:8080/api/${endpoint}`, payload);
      if (activeTab === 'quiz') {
        setQuizData(res.data.response);
      } else {
        setOutput(res.data.response);
      }
      if (activeTab === 'ask') {
        setShowAskModal(false);
        setAskInput('');
      }
    } catch (error) {
      setOutput('Error fetching AI response.');
    } finally {
      setLoading(false);
    }
  };

  const openAskModal = () => {
    setActiveTab('ask');
    setShowAskModal(true);
  };

  const closeAskModal = () => {
    setShowAskModal(false);
    setAskInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">EduMate</h1>

      <img
        src={EduMateIcon}
        alt="EduMate Icon"
        className="fixed top-2 left-2 w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg z-50"
      />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 mb-4">
            <input type="file" accept=".pdf,.txt,.png,.jpg,.jpeg" onChange={handleFileChange} className="mb-2" />
            {extractedText && activeTab !== 'quiz' && (
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded resize-none"
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
              />
            )}
          </div>
          <div className="flex-1">
            <ChatBox />
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'summarize' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('summarize');
              setQuizData(null);
            }}
          >
            Summarize
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab('quiz');
              setQuizData(null);
            }}
          >
            Generate Quiz
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'ask' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={openAskModal}
          >
            Ask Doubt
          </button>
        </div>

        <div className="mb-4">
          {activeTab === 'quiz' && quizData ? (
            <>
              {console.log('Quiz Data:', quizData)}
              <QuizDisplay quizText={quizData} />
            </>
          ) : (
            <button
              onClick={handleAction}
              disabled={loading || (activeTab !== 'ask' && !extractedText) || (activeTab === 'ask' && !askInput.trim())}
              className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          )}
        </div>

        {output && activeTab !== 'quiz' && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>

      {showAskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask Doubt</h2>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded resize-none mb-4"
              value={askInput}
              onChange={(e) => setAskInput(e.target.value)}
              placeholder="Type your question here..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                onClick={closeAskModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                onClick={handleAction}
                disabled={loading || !askInput.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
