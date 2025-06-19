import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Course } from '../contexts/AdminContext';
import { useCourse } from '../contexts/CourseContext';

interface TestComponentProps {
  course: Course;
  testType: 'pre' | 'post';
  onComplete: () => void;
  onBack: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ course, testType, onComplete, onBack }) => {
  const { startTest, submitTest, testResult, resetTest } = useCourse();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number }[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const questions = testType === 'pre' ? course.preTest : course.postTest;
  const testTitle = testType === 'pre' ? 'ทดสอบก่อนเรียน' : 'ทดสอบหลังเรียน';
  
  React.useEffect(() => {
    startTest(course, testType);
    return () => resetTest();
  }, [course, testType, startTest, resetTest]);
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, selectedAnswer: answerIndex } : a);
      }
      return [...prev, { questionId, selectedAnswer: answerIndex }];
    });
  };
  
  const handleSubmit = () => {
    submitTest(answers);
    setShowResults(true);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (answers.length === questions.length) {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.selectedAnswer;
  };
  
  const isAnswered = (questionId: string) => {
    return answers.some(a => a.questionId === questionId);
  };
  
  if (showResults && testResult) {
    const percentage = Math.round((testResult.score / testResult.totalQuestions) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? 
              <CheckCircle className="w-8 h-8 text-green-500" /> : 
              <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'ผ่านการทดสอบ!' : 'ไม่ผ่านการทดสอบ'}
          </h2>
          <p className="text-gray-600">
            คุณได้คะแนน {testResult.score} จาก {testResult.totalQuestions} คะแนน ({percentage}%)
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const userAnswer = testResult.answers.find(a => a.questionId === question.id);
            const isCorrect = userAnswer?.correct || false;
            
            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {index + 1}. {question.question}
                  </h3>
                  {isCorrect ? 
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" /> :
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                  }
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">คำตอบที่ถูก:</span> {question.options[question.correctAnswer]}
                </div>
                
                {userAnswer && userAnswer.selectedAnswer !== question.correctAnswer && (
                  <div className="text-sm text-red-600 mb-2">
                    <span className="font-medium">คำตอบของคุณ:</span> {question.options[userAnswer.selectedAnswer]}
                  </div>
                )}
                
                <div className="text-sm text-gray-500 bg-gray-50 rounded p-2">
                  <span className="font-medium">คำอธิบาย:</span> {question.explanation}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
          >
            ย้อนกลับ
          </button>
          {passed && (
            <button
              onClick={onComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              ดำเนินการต่อ
            </button>
          )}
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  const selectedAnswer = getCurrentAnswer(question.id);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{testTitle}</h2>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question.id, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={currentQuestion === 0 ? onBack : handlePrevious}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentQuestion === 0 ? 'ย้อนกลับ' : 'ก่อนหน้า'}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isAnswered(question.id)}
          className={`flex items-center px-6 py-3 rounded-lg font-medium ${
            isAnswered(question.id)
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'ส่งคำตอบ' : 'ถัดไป'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TestComponent;