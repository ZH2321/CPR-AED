import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Articles: React.FC = () => {
  const { t } = useLanguage();
  
  const articles = [
    {
      id: 1,
      title: t('article1_title'),
      excerpt: t('article1_excerpt'),
      readTime: '5 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'CPR'
    },
    {
      id: 2,
      title: t('article2_title'),
      excerpt: t('article2_excerpt'),
      readTime: '3 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'ปฐมพยาบาล'
    },
    {
      id: 3,
      title: t('article3_title'),
      excerpt: t('article3_excerpt'),
      readTime: '7 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/7659731/pexels-photo-7659731.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'ปฐมพยาบาล'
    },
    {
      id: 4,
      title: 'การดูแลผู้ป่วยหมดสติ',
      excerpt: 'ขั้นตอนการตรวจสอบและดูแลผู้ป่วยที่หมดสติอย่างปลอดภัย',
      readTime: '4 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'ฉุกเฉิน'
    },
    {
      id: 5,
      title: 'การปฐมพยาบาลแผลไฟไหม้',
      excerpt: 'วิธีการช่วยเหลือและปฐมพยาบาลแผลจากไฟไหม้',
      readTime: '6 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'ปฐมพยาบาล'
    },
    {
      id: 6,
      title: 'การช่วยเหลือเด็กสำลัก',
      excerpt: 'เทคนิคพิเศษสำหรับการช่วยเหลือเด็กที่สำลักอาหาร',
      readTime: '4 นาที',
      author: 'ทีมแพทย์',
      image: 'https://images.pexels.com/photos/7659690/pexels-photo-7659690.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'เด็ก'
    }
  ];
  
  const categories = ['ทั้งหมด', 'CPR', 'ปฐมพยาบาล', 'ฉุกเฉิน', 'เด็ก'];
  const [selectedCategory, setSelectedCategory] = React.useState('ทั้งหมด');
  
  const filteredArticles = selectedCategory === 'ทั้งหมด' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('articles_title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            บทความและเนื้อหาเกี่ยวกับการช่วยชีวิตและปฐมพยาบาลเบื้องต้น
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center group">
                  {t('read_more')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              ไม่พบบทความในหมวดหมู่นี้
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;