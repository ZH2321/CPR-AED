import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Zap, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RescueGuide: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'cpr' | 'aed'>('cpr');
  const [currentStep, setCurrentStep] = useState(1);
  
  const cprSteps = [
    {
      title: t('cpr_steps.step1'),
      description: t('cpr_steps.step1_desc'),
      image: '🫵'
    },
    {
      title: t('cpr_steps.step2'),
      description: t('cpr_steps.step2_desc'),
      image: '🫴'
    },
    {
      title: t('cpr_steps.step3'),
      description: t('cpr_steps.step3_desc'),
      image: '👐'
    },
    {
      title: t('cpr_steps.step4'),
      description: t('cpr_steps.step4_desc'),
      image: '💨'
    },
    {
      title: t('cpr_steps.step5'),
      description: t('cpr_steps.step5_desc'),
      image: '🔄'
    }
  ];
  
  const aedSteps = [
    {
      title: t('aed_steps.step1'),
      description: t('aed_steps.step1_desc'),
      image: '🔌'
    },
    {
      title: t('aed_steps.step2'),
      description: t('aed_steps.step2_desc'),
      image: '🏥'
    },
    {
      title: t('aed_steps.step3'),
      description: t('aed_steps.step3_desc'),
      image: '📊'
    },
    {
      title: t('aed_steps.step4'),
      description: t('aed_steps.step4_desc'),
      image: '⚡'
    }
  ];
  
  const currentSteps = activeTab === 'cpr' ? cprSteps : aedSteps;
  const maxSteps = currentSteps.length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('cpr_guide_title')}
          </h1>
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 inline-flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              เหตุฉุกเฉิน: โทร 1669
            </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <button
            onClick={() => {
              setActiveTab('cpr');
              setCurrentStep(1);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'cpr'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            CPR
          </button>
          <button
            onClick={() => {
              setActiveTab('aed');
              setCurrentStep(1);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'aed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Zap className="w-5 h-5 inline mr-2" />
            AED
          </button>
        </div>
        
        {/* Step Counter */}
        <div className="flex justify-center mb-6">
          <span className="text-sm text-gray-500">
            {t('step')} {currentStep} / {maxSteps}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              activeTab === 'cpr' ? 'bg-red-600' : 'bg-blue-600'
            }`}
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {currentSteps[currentStep - 1].image}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentSteps[currentStep - 1].title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {currentSteps[currentStep - 1].description}
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {t('previous')}
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: maxSteps }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i + 1)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentStep === i + 1
                    ? activeTab === 'cpr' ? 'bg-red-600' : 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
            disabled={currentStep === maxSteps}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === maxSteps
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : activeTab === 'cpr'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {t('next')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescueGuide;