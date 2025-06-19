import React, { useRef } from 'react';
import { Download, Award, Calendar, User, Hash } from 'lucide-react';
import { useCourse } from '../contexts/CourseContext';
import { useAdmin } from '../contexts/AdminContext';

interface CertificateGeneratorProps {
  courseId: string;
  onClose: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ courseId, onClose }) => {
  const { generateCertificate, getCertificate, studentName, setStudentName } = useCourse();
  const { courses, certificateTemplates } = useAdmin();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const course = courses.find(c => c.id === courseId);
  const certificate = getCertificate(courseId);
  const template = certificateTemplates.find(t => t.isDefault) || certificateTemplates[0];
  
  const handleGenerateCertificate = () => {
    if (!studentName.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    
    const newCertificate = generateCertificate(courseId);
    if (newCertificate) {
      drawCertificate(newCertificate);
    }
  };
  
  const drawCertificate = (cert: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Header
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ใบประกาศนียบัตร', canvas.width / 2, 120);
    
    ctx.fillStyle = '#374151';
    ctx.font = '32px Arial';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 160);
    
    // Content
    ctx.fillStyle = '#1F2937';
    ctx.font = '28px Arial';
    ctx.fillText('ขอแสดงว่า', canvas.width / 2, 220);
    
    // Student name
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(cert.studentName, canvas.width / 2, 280);
    
    // Course completion text
    ctx.fillStyle = '#1F2937';
    ctx.font = '28px Arial';
    ctx.fillText('ได้ผ่านการอบรมหลักสูตร', canvas.width / 2, 340);
    
    // Course name
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(cert.courseName, canvas.width / 2, 390);
    
    // Score
    ctx.fillStyle = '#1F2937';
    ctx.font = '24px Arial';
    ctx.fillText(`คะแนน ${cert.score}/${cert.totalScore} (${cert.percentage}%)`, canvas.width / 2, 440);
    
    // Date
    const completedDate = new Date(cert.completedAt).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(`วันที่ ${completedDate}`, canvas.width / 2, 480);
    
    // Certificate number
    ctx.font = '20px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(`เลขที่ใบประกาศนียบัตร: ${cert.certificateNumber}`, canvas.width / 2, 520);
    
    // Organization
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('CPR & AED Rescue Training Center', canvas.width / 2, 600);
    
    // Signature line
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 150, 680);
    ctx.lineTo(canvas.width / 2 + 150, 680);
    ctx.stroke();
    
    ctx.fillStyle = '#6B7280';
    ctx.font = '20px Arial';
    ctx.fillText('ผู้อำนวยการ', canvas.width / 2, 710);
    
    // Logo/Seal placeholder
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 650, 60, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL', 150, 645);
    ctx.fillText('SEAL', 150, 665);
  };
  
  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `certificate-${course?.title}-${studentName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  
  if (!course) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">สร้างใบประกาศนียบัตร</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {!certificate ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">ข้อมูลหลักสูตร</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">ชื่อหลักสูตร:</span>
                    <span className="ml-2 font-medium">{course.title}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">หมวดหมู่:</span>
                    <span className="ml-2 font-medium">{course.category}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  ชื่อ-นามสกุล (ที่จะแสดงในใบประกาศนียบัตร)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleGenerateCertificate}
                disabled={!studentName.trim()}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center ${
                  studentName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Award className="w-5 h-5 mr-2" />
                สร้างใบประกาศนียบัตร
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">ข้อมูลใบประกาศนียบัตร</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700">ชื่อ:</span>
                    <span className="ml-2 font-medium">{certificate.studentName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700">วันที่สำเร็จ:</span>
                    <span className="ml-2 font-medium">
                      {new Date(certificate.completedAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700">คะแนน:</span>
                    <span className="ml-2 font-medium">
                      {certificate.score}/{certificate.totalScore} ({certificate.percentage}%)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-green-700">เลขที่:</span>
                    <span className="ml-2 font-medium">{certificate.certificateNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 rounded-lg shadow-lg max-w-full h-auto"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => drawCertificate(certificate)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  แสดงตัวอย่าง
                </button>
                <button
                  onClick={downloadCertificate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  ดาวน์โหลด
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;