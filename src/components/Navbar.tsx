import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('home') },
    { path: '/rescue', label: t('rescue_guide') },
    { path: '/articles', label: t('articles') },
    { path: '/classroom', label: t('classroom') }
  ];
  
  return (
    <nav className="bg-white shadow-lg border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {t('app_title')}
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <button
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-50 border-t">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;