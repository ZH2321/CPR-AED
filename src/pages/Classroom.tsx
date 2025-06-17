import React from 'react';
import { Lock, BookOpen, Users, Award, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Classroom: React.FC = () => {
  const { t } = useLanguage();
  
  const upcomingFeatures = [
    {
      icon: BookOpen,
      title: 'คอร์สเรียนออนไลน์',
      description: 'เรียนรู้อย่างเป็นระบบผ่านวิดีโอและแบบทดสอบ'
    },
    {
      icon: Users,
      title: 'ห้องเรียนเสมือนจริง',
      description: 'เข้าร่วมการเรียนแบบสดกับผู้เชี่ยวชาญ'
    },
    {
      icon: Award,
      title: 'ใบประกาศนียบัตร',
      description: 'รับใบรับรองหลังจากผ่านการทดสอบ'
    },
    {
      icon: Calendar,
      title: 'ตารางการอบรม',
      description: 'จองเข้าร่วมการอบรมในพื้นที่ใกล้คุณ'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lock Icon and Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('classroom_title')}
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800 font-medium mb-2">
              {t('login_required')}
            </p>
            <p className="text-yellow-700 text-sm">
              {t('login_message')}
            </p>
          </div>
        </div>
        
        {/* Upcoming Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            ฟีเจอร์ที่จะเปิดให้บริการ
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 border-2 border-gray-100"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ติดตามข่าวสารล่าสุด
          </h3>
          <p className="text-gray-600 mb-6">
            ลงทะเบียนเพื่อรับแจ้งเตือนเมื่อห้องเรียนเปิดให้บริการ
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                ลงทะเบียน
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              เราจะไม่ส่งอีเมลขยะให้คุณ สัญญา!
            </p>
          </div>
        </div>
        
        {/* Development Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            กำลังพัฒนา - เร็วๆ นี้
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;