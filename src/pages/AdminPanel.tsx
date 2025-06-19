import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Upload, Award } from 'lucide-react';
import { useAdmin, Course, Article, CertificateTemplate } from '../contexts/AdminContext';

const AdminPanel: React.FC = () => {
  const { 
    courses, articles, certificateTemplates,
    addCourse, updateCourse, deleteCourse, 
    addArticle, updateArticle, deleteArticle,
    addCertificateTemplate, deleteCertificateTemplate
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState<'courses' | 'articles' | 'certificates'>('courses');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);

  // Course form state
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    category: '',
    isActive: true,
    passingScore: 70,
    preTest: [],
    postTest: []
  });

  // Article form state
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'ทีมแพทย์',
    readTime: '',
    image: '',
    isPublished: true
  });

  // Certificate template form state
  const [certificateForm, setCertificateForm] = useState<Partial<CertificateTemplate>>({
    name: '',
    imageUrl: '',
    isDefault: false
  });

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      category: '',
      isActive: true,
      passingScore: 70,
      preTest: [],
      postTest: []
    });
    setEditingCourse(null);
    setShowCourseForm(false);
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: 'ทีมแพทย์',
      readTime: '',
      image: '',
      isPublished: true
    });
    setEditingArticle(null);
    setShowArticleForm(false);
  };

  const resetCertificateForm = () => {
    setCertificateForm({
      name: '',
      imageUrl: '',
      isDefault: false
    });
    setShowCertificateForm(false);
  };

  const handleSaveCourse = () => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseForm);
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseForm.title || '',
        description: courseForm.description || '',
        videoUrl: courseForm.videoUrl || '',
        duration: courseForm.duration || '',
        category: courseForm.category || '',
        isActive: courseForm.isActive || true,
        passingScore: courseForm.passingScore || 70,
        preTest: courseForm.preTest || [],
        postTest: courseForm.postTest || []
      };
      addCourse(newCourse);
    }
    resetCourseForm();
  };

  const handleSaveArticle = () => {
    if (editingArticle) {
      updateArticle(editingArticle.id, articleForm);
    } else {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: articleForm.title || '',
        excerpt: articleForm.excerpt || '',
        content: articleForm.content || '',
        category: articleForm.category || '',
        author: articleForm.author || 'ทีมแพทย์',
        readTime: articleForm.readTime || '',
        image: articleForm.image || '',
        isPublished: articleForm.isPublished || true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      addArticle(newArticle);
    }
    resetArticleForm();
  };

  const handleSaveCertificateTemplate = () => {
    const newTemplate: CertificateTemplate = {
      id: Date.now().toString(),
      name: certificateForm.name || '',
      imageUrl: certificateForm.imageUrl || '',
      isDefault: certificateForm.isDefault || false
    };
    
    // If this is set as default, remove default from others
    if (newTemplate.isDefault) {
      certificateTemplates.forEach(template => {
        if (template.isDefault) {
          // Update existing default template
          // This would need to be implemented in the context
        }
      });
    }
    
    addCertificateTemplate(newTemplate);
    resetCertificateForm();
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm(course);
    setShowCourseForm(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleForm(article);
    setShowArticleForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">จัดการเนื้อหาคอร์ส บทความ และใบประกาศนียบัตร</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            จัดการคอร์ส ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'articles'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            จัดการบทความ ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'certificates'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            เทมเพลตใบประกาศ ({certificateTemplates.length})
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">คอร์สทั้งหมด</h2>
              <button
                onClick={() => setShowCourseForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มคอร์สใหม่
              </button>
            </div>

            {/* Course Form Modal */}
            {showCourseForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingCourse ? 'แก้ไขคอร์ส' : 'เพิ่มคอร์สใหม่'}
                    </h3>
                    <button onClick={resetCourseForm}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อคอร์ส
                      </label>
                      <input
                        type="text"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        คำอธิบาย
                      </label>
                      <textarea
                        value={courseForm.description}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          หมวดหมู่
                        </label>
                        <input
                          type="text"
                          value={courseForm.category}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ระยะเวลา
                        </label>
                        <input
                          type="text"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          คะแนนผ่าน (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={courseForm.passingScore}
                          onChange={(e) => setCourseForm(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL วิดีโอ (YouTube Embed)
                      </label>
                      <input
                        type="url"
                        value={courseForm.videoUrl}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={courseForm.isActive}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        เปิดใช้งานคอร์ส
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetCourseForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveCourse}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="grid gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {course.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>หมวดหมู่: {course.category}</span>
                        <span>ระยะเวลา: {course.duration}</span>
                        <span>คะแนนผ่าน: {course.passingScore}%</span>
                        <span>ทดสอบก่อน: {course.preTest.length} ข้อ</span>
                        <span>ทดสอบหลัง: {course.postTest.length} ข้อ</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => updateCourse(course.id, { isActive: !course.isActive })}
                        className={`p-2 rounded-lg ${
                          course.isActive 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {course.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">บทความทั้งหมด</h2>
              <button
                onClick={() => setShowArticleForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มบทความใหม่
              </button>
            </div>

            {/* Article Form Modal */}
            {showArticleForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingArticle ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่'}
                    </h3>
                    <button onClick={resetArticleForm}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        หัวข้อบทความ
                      </label>
                      <input
                        type="text"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        สรุปบทความ
                      </label>
                      <textarea
                        value={articleForm.excerpt}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เนื้อหาบทความ
                      </label>
                      <textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          หมวดหมู่
                        </label>
                        <input
                          type="text"
                          value={articleForm.category}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ผู้เขียน
                        </label>
                        <input
                          type="text"
                          value={articleForm.author}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          เวลาอ่าน
                        </label>
                        <input
                          type="text"
                          value={articleForm.readTime}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, readTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL รูปภาพ
                      </label>
                      <input
                        type="url"
                        value={articleForm.image}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={articleForm.isPublished}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                        เผยแพร่บทความ
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetArticleForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveArticle}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="grid gap-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {article.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {article.isPublished ? 'เผยแพร่แล้ว' : 'ร่าง'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{article.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>หมวดหมู่: {article.category}</span>
                        <span>ผู้เขียน: {article.author}</span>
                        <span>เวลาอ่าน: {article.readTime}</span>
                        <span>วันที่: {article.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => updateArticle(article.id, { isPublished: !article.isPublished })}
                        className={`p-2 rounded-lg ${
                          article.isPublished 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {article.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEditArticle(article)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Templates Tab */}
        {activeTab === 'certificates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">เทมเพลตใบประกาศนียบัตร</h2>
              <button
                onClick={() => setShowCertificateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มเทมเพลตใหม่
              </button>
            </div>

            {/* Certificate Template Form Modal */}
            {showCertificateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">เพิ่มเทมเพลตใหม่</h3>
                    <button onClick={resetCertificateForm}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อเทมเพลต
                      </label>
                      <input
                        type="text"
                        value={certificateForm.name}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL รูปภาพเทมเพลต
                      </label>
                      <input
                        type="url"
                        value={certificateForm.imageUrl}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={certificateForm.isDefault}
                        onChange={(e) => setCertificateForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                        className="mr-2"
                      />
                      <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                        ตั้งเป็นเทมเพลตเริ่มต้น
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={resetCertificateForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveCertificateTemplate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Certificate Templates List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificateTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {template.imageUrl ? (
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      {template.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          เริ่มต้น
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteCertificateTemplate(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {certificateTemplates.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีเทมเพลตใบประกาศนียบัตร
                </h3>
                <p className="text-gray-500">
                  เพิ่มเทมเพลตเพื่อใช้สำหรับสร้างใบประกาศนียบัตร
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;