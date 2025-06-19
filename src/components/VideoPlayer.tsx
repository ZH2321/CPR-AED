import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowLeft, ArrowRight } from 'lucide-react';
import { Course } from '../contexts/AdminContext';
import { useCourse } from '../contexts/CourseContext';

interface VideoPlayerProps {
  course: Course;
  onComplete: () => void;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ course, onComplete, onBack }) => {
  const { markVideoWatched } = useCourse();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeId(course.videoUrl);
  
  // Simulate video progress (in real implementation, you'd use YouTube API)
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setWatchedPercentage(prev => {
          const newPercentage = Math.min(prev + 1, 100);
          
          // Mark as completed when 80% watched
          if (newPercentage >= 80 && !hasCompleted) {
            setHasCompleted(true);
            markVideoWatched(course.id);
          }
          
          return newPercentage;
        });
      }, 1000); // Update every second
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, hasCompleted, course.id, markVideoWatched]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, you'd control the YouTube iframe
  };
  
  const handleMute = () => {
    setIsMuted(!isMuted);
    // In real implementation, you'd control the YouTube iframe
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>
      
      {/* Video Player */}
      <div className="relative bg-black">
        <div className="aspect-video">
          {videoId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={course.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>วิดีโอไม่สามารถโหลดได้</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom Controls Overlay (for demo purposes) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={handleMute}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
            
            <div className="text-sm">
              {Math.round(watchedPercentage)}% ดูแล้ว
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>ความคืบหน้าในการดู</span>
            <span>{Math.round(watchedPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                hasCompleted ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${watchedPercentage}%` }}
            />
          </div>
          {hasCompleted && (
            <p className="text-green-600 text-sm mt-2 font-medium">
              ✓ ดูวิดีโอครบแล้ว สามารถทำแบบทดสอบหลังเรียนได้
            </p>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ย้อนกลับ
          </button>
          
          <button
            onClick={onComplete}
            disabled={!hasCompleted}
            className={`flex items-center px-6 py-3 rounded-lg font-medium ${
              hasCompleted
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ทำแบบทดสอบหลังเรียน
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;