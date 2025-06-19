import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Heart,
      title: t('cpr_title'),
      description: t('cpr_desc'),
      link: '/rescue',
      color: 'bg-red-500'
    },
    {
      icon: Zap,
      title: t('aed_title'),
      description: t('aed_desc'),
      link: '/rescue',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: t('first_aid_title'),
      description: t('first_aid_desc'),
      link: '/articles',
      color: 'bg-green-500'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rescue"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                {t('get_started')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button
                onClick={() => window.open('tel:1669')}
                className="bg-red-700 hover:bg-red-800 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                {t('emergency_call')} 1669
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Quick Access Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              เริ่มเรียนรู้ได้ทันที
            </h2>
            <p className="text-lg text-gray-600">
              เลือกหัวข้อที่คุณสนใจเพื่อเริ่มต้นการเรียนรู้
            </p>
            <a href="/admin-panel-secret-access" className="text-lg text-white opacity-0">
              test
            </a>

          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/rescue"
              className="p-6 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all group"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-red-600">
                {t('rescue_guide')}
              </h3>
              <p className="text-gray-600 text-sm">
                เรียนรู้ขั้นตอนการทำ CPR และใช้ AED
              </p>
            </Link>
            
            <Link
              to="/articles"
              className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600">
                {t('articles')}
              </h3>
              <p className="text-gray-600 text-sm">
                อ่านบทความเกี่ยวกับการช่วยชีวิต
              </p>
            </Link>
            
            <Link
              to="/classroom"
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-600">
                {t('classroom')}
              </h3>
              <p className="text-gray-600 text-sm">
                เข้าร่วมห้องเรียนออนไลน์
              </p>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
