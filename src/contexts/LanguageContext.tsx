import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  th: {
    // Navigation
    home: 'หน้าหลัก',
    rescue_guide: 'คู่มือช่วยชีวิต',
    articles: 'บทความ',
    classroom: 'ห้องเรียน',
    
    // Home page
    app_title: 'CPR & AED Rescue',
    app_subtitle: 'แอปช่วยชีวิต',
    hero_title: 'เรียนรู้เทคนิคการช่วยชีวิต',
    hero_subtitle: 'ความรู้ที่อาจช่วยชีวิตคนที่คุณรักได้',
    get_started: 'เริ่มต้นเรียนรู้',
    emergency_call: 'โทรเรียกความช่วยเหลือ',
    
    // Features
    cpr_title: 'CPR',
    cpr_desc: 'การปั๊มหัวใจและช่วยหายใจ',
    aed_title: 'AED',
    aed_desc: 'การใช้เครื่องกระตุ้นหัวใจ',
    first_aid_title: 'ปฐมพยาบาล',
    first_aid_desc: 'เทคนิคการช่วยเหลือเบื้องต้น',
    
    // CPR Guide
    cpr_guide_title: 'คู่มือ CPR และ AED',
    step: 'ขั้นตอนที่',
    cpr_steps: {
      step1: 'ตรวจสอบการตอบสนอง',
      step1_desc: 'เขย่าไหล่และตะโกนเรียก หากไม่มีการตอบสนอง ให้โทรเรียก 1669',
      step2: 'วางตำแหน่งมือ',
      step2_desc: 'วางมือบนกึ่งกลางของช่วงอก ระหว่างหัวนม ให้มือทั้งสองข้างทับซ้อนกัน',
      step3: 'กดอก',
      step3_desc: 'กดลึกอย่างน้อย 2 นิ้ว ด้วยอัตรา 100-120 ครั้งต่อนาที',
      step4: 'ช่วยหายใจ',
      step4_desc: 'เปิดทางเดินหายใจ และช่วยหายใจ 2 ครั้ง',
      step5: 'ทำต่อเนื่อง',
      step5_desc: 'ทำ CPR ต่อเนื่องจนกว่าจะมีความช่วยเหลือมาถึง'
    },
    
    // AED Guide
    aed_guide_title: 'การใช้ AED',
    aed_steps: {
      step1: 'เปิดเครื่อง AED',
      step1_desc: 'เปิดเครื่อง AED และปฏิบัติตามคำแนะนำเสียง',
      step2: 'ติด Pads',
      step2_desc: 'ติด pads ตามตำแหน่งที่แสดงในภาพ',
      step3: 'วิเคราะห์จังหวะหัวใจ',
      step3_desc: 'อย่าแตะต้องผู้ป่วยขณะเครื่องวิเคราะห์',
      step4: 'กดปุ่มช็อก',
      step4_desc: 'หากเครื่องแนะนำให้ช็อก ให้กดปุ่มช็อกทันที'
    },
    
    // Articles
    articles_title: 'บทความเกี่ยวกับการช่วยชีวิต',
    article1_title: 'สัญญาณของการหัวใจหยุดเต้น',
    article1_excerpt: 'เรียนรู้วิธีการสังเกตสัญญาณเตือนของการหัวใจหยุดเต้น',
    article2_title: 'การช่วยเหลือผู้ป่วยสำลัก',
    article2_excerpt: 'วิธีการช่วยเหลือเมื่อมีคนสำลักอาหารหรือของแปลกปลอม',
    article3_title: 'ปฐมพยาบาลเบื้องต้น',
    article3_excerpt: 'ความรู้พื้นฐานในการช่วยเหลือผู้บาดเจ็บ',
    read_more: 'อ่านต่อ',
    
    // Classroom
    classroom_title: 'ห้องเรียนออนไลน์',
    login_required: 'กรุณาเข้าสู่ระบบเพื่อเข้าถึงห้องเรียน',
    login_message: 'ฟีเจอร์นี้จะเปิดให้ใช้งานในเร็วๆ นี้',
    
    // Common
    back: 'ย้อนกลับ',
    next: 'ถัดไป',
    previous: 'ก่อนหน้า',
    emergency: 'เหตุฉุกเฉิน',
    call_emergency: 'โทร 1669'
  },
  
  en: {
    // Navigation
    home: 'Home',
    rescue_guide: 'Rescue Guide',
    articles: 'Articles',
    classroom: 'Classroom',
    
    // Home page
    app_title: 'CPR & AED Rescue',
    app_subtitle: 'Life-Saving App',
    hero_title: 'Learn Life-Saving Techniques',
    hero_subtitle: 'Knowledge that could save the life of someone you love',
    get_started: 'Get Started',
    emergency_call: 'Emergency Call',
    
    // Features
    cpr_title: 'CPR',
    cpr_desc: 'Cardiopulmonary Resuscitation',
    aed_title: 'AED',
    aed_desc: 'Automated External Defibrillator',
    first_aid_title: 'First Aid',
    first_aid_desc: 'Basic Emergency Response',
    
    // CPR Guide
    cpr_guide_title: 'CPR & AED Guide',
    step: 'Step',
    cpr_steps: {
      step1: 'Check Responsiveness',
      step1_desc: 'Tap shoulders and shout. If no response, call emergency services',
      step2: 'Hand Placement',
      step2_desc: 'Place hands on center of chest, between nipples, interlock fingers',
      step3: 'Chest Compressions',
      step3_desc: 'Compress at least 2 inches deep at 100-120 compressions per minute',
      step4: 'Rescue Breathing',
      step4_desc: 'Open airway and give 2 rescue breaths',
      step5: 'Continue CPR',
      step5_desc: 'Continue CPR cycles until help arrives'
    },
    
    // AED Guide
    aed_guide_title: 'Using AED',
    aed_steps: {
      step1: 'Turn on AED',
      step1_desc: 'Turn on the AED and follow voice prompts',
      step2: 'Attach Pads',
      step2_desc: 'Place pads as shown in the diagram',
      step3: 'Analyze Rhythm',
      step3_desc: 'Do not touch patient while AED analyzes',
      step4: 'Deliver Shock',
      step4_desc: 'If advised, press shock button immediately'
    },
    
    // Articles
    articles_title: 'Life-Saving Articles',
    article1_title: 'Signs of Cardiac Arrest',
    article1_excerpt: 'Learn to recognize the warning signs of cardiac arrest',
    article2_title: 'Choking Emergency Response',
    article2_excerpt: 'How to help someone who is choking on food or objects',
    article3_title: 'Basic First Aid',
    article3_excerpt: 'Essential knowledge for helping injured persons',
    read_more: 'Read More',
    
    // Classroom
    classroom_title: 'Online Classroom',
    login_required: 'Please log in to access the classroom',
    login_message: 'This feature will be available soon',
    
    // Common
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    emergency: 'Emergency',
    call_emergency: 'Call Emergency'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};