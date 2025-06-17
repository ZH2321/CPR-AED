import React from 'react';
import { Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const EmergencyButton: React.FC = () => {
  const { t } = useLanguage();
  
  const handleEmergencyCall = () => {
    if (confirm('โทรเรียกหน่วยกู้ชีพ 1669?')) {
      window.open('tel:1669');
    }
  };
  
  return (
    <button
      onClick={handleEmergencyCall}
      className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 z-50"
      aria-label={t('call_emergency')}
    >
      <Phone className="w-6 h-6" />
    </button>
  );
};

export default EmergencyButton;