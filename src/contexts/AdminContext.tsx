import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  category: string;
  preTest: Question[];
  postTest: Question[];
  isActive: boolean;
  certificateTemplate?: string;
  passingScore: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  imageUrl: string;
  isDefault: boolean;
}

interface AdminContextType {
  courses: Course[];
  articles: Article[];
  certificateTemplates: CertificateTemplate[];
  setCourses: (courses: Course[]) => void;
  setArticles: (articles: Article[]) => void;
  setCertificateTemplates: (templates: CertificateTemplate[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addCertificateTemplate: (template: CertificateTemplate) => void;
  deleteCertificateTemplate: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const defaultCourses: Course[] = [
  {
    id: '1',
    title: 'CPR พื้นฐานสำหรับผู้ใหญ่',
    description: 'เรียนรู้เทคนิค CPR สำหรับผู้ใหญ่ ตามมาตรฐาน American Heart Association รวมถึงการใช้ AED เบื้องต้น',
    videoUrl: 'https://www.youtube.com/embed/VASywEuqFd8',
    duration: '25 นาที',
    category: 'CPR',
    isActive: true,
    passingScore: 70,
    preTest: [
      {
        id: '1',
        question: 'อัตราการกดอกที่ถูกต้องสำหรับ CPR ผู้ใหญ่คือเท่าไร?',
        options: ['80-100 ครั้งต่อนาที', '100-120 ครั้งต่อนาที', '120-140 ครั้งต่อนาที', '60-80 ครั้งต่อนาที'],
        correctAnswer: 1,
        explanation: 'อัตราการกดอกที่ถูกต้องตามมาตรฐาน AHA คือ 100-120 ครั้งต่อนาที เพื่อให้การไหลเวียนของเลือดมีประสิทธิภาพสูงสุด'
      },
      {
        id: '2',
        question: 'ความลึกในการกดอกที่เหมาะสมสำหรับผู้ใหญ่คือเท่าไร?',
        options: ['1-2 นิ้ว (2.5-5 ซม.)', '2-2.4 นิ้ว (5-6 ซม.)', '3-4 นิ้ว (7.5-10 ซม.)', '1 นิ้ว (2.5 ซม.)'],
        correctAnswer: 1,
        explanation: 'ควรกดลึกอย่างน้อย 2 นิ้ว (5 ซม.) แต่ไม่เกิน 2.4 นิ้ว (6 ซม.) เพื่อให้เลือดไหลเวียนได้ดีโดยไม่ทำให้เกิดการบาดเจ็บ'
      },
      {
        id: '3',
        question: 'ก่อนเริ่มทำ CPR ควรตรวจสอบอะไรก่อน?',
        options: ['ชีพจรที่ข้อมือ', 'การตอบสนองและการหายใจ', 'อุณหภูมิร่างกาย', 'ความดันโลหิต'],
        correctAnswer: 1,
        explanation: 'ต้องตรวจสอบการตอบสนอง (เขย่าไหล่และตะโกนเรียก) และการหายใจปกติก่อน หากไม่มีการตอบสนองและไม่หายใจปกติให้เริ่ม CPR ทันที'
      }
    ],
    postTest: [
      {
        id: '1',
        question: 'อัตราส่วนการกดอกต่อการช่วยหายใจสำหรับผู้ใหญ่คือเท่าไร?',
        options: ['15:2', '30:2', '20:2', '25:2'],
        correctAnswer: 1,
        explanation: 'อัตราส่วนที่ถูกต้องคือ 30:2 (30 ครั้งกดอก : 2 ครั้งช่วยหายใจ) สำหรับผู้ใหญ่และเด็กอายุมากกว่า 8 ปี'
      },
      {
        id: '2',
        question: 'ควรวางมือตรงตำแหน่งใดเมื่อทำ CPR?',
        options: ['บนท้อง', 'กึ่งกลางของกระดูกอก', 'ด้านซ้ายของอก', 'บริเวณคอ'],
        correctAnswer: 1,
        explanation: 'วางมือที่กึ่งกลางของกระดูกอก (sternum) ระหว่างหัวนม ใช้ส้นมือข้างหนึ่งวางบนกระดูกอก มืออีกข้างทับซ้อน'
      },
      {
        id: '3',
        question: 'เมื่อไหร่ควรหยุดทำ CPR?',
        options: ['เมื่อเหนื่อยมาก', 'เมื่อทำไป 5 นาที', 'เมื่อผู้ป่วยฟื้นคืนสติหรือมีเจ้าหน้าที่การแพทย์มาถึง', 'เมื่อมีคนอื่นมาช่วย'],
        correctAnswer: 2,
        explanation: 'ควรทำ CPR ต่อเนื่องจนกว่าผู้ป่วยจะฟื้นคืนสติ มีการหายใจปกติ หรือเจ้าหน้าที่การแพทย์มาถึงและรับช่วงต่อ'
      },
      {
        id: '4',
        question: 'หากมี AED ควรใช้เมื่อไหร่?',
        options: ['หลังทำ CPR 10 นาที', 'ทันทีที่มี AED พร้อมใช้งาน', 'หลังโทรเรียกความช่วยเหลือ', 'เมื่อผู้ป่วยฟื้นคืนสติ'],
        correctAnswer: 1,
        explanation: 'ควรใช้ AED ทันทีที่มีพร้อมใช้งาน เพราะการกระตุ้นหัวใจด้วยไฟฟ้าในช่วงแรกจะมีโอกาสช่วยชีวิตได้สูงที่สุด'
      },
      {
        id: '5',
        question: 'การช่วยหายใจที่ถูกต้องควรใช้เวลาเท่าไร?',
        options: ['0.5 วินาที', '1 วินาที', '2 วินาที', '3 วินาที'],
        correctAnswer: 1,
        explanation: 'การช่วยหายใจแต่ละครั้งควรใช้เวลา 1 วินาที เป่าลมให้เห็นอกขยับขึ้น หลีกเลี่ยงการเป่าแรงเกินไปที่อาจทำให้อากาศเข้าท้อง'
      }
    ]
  },
  {
    id: '2',
    title: 'การใช้เครื่อง AED อย่างปลอดภัย',
    description: 'เรียนรู้วิธีการใช้เครื่องกระตุ้นหัวใจอัตโนมัติ (AED) อย่างถูกต้องและปลอดภัย พร้อมการปฏิบัติตามขั้นตอนมาตรฐาน',
    videoUrl: 'https://www.youtube.com/embed/BQdNbXgAhc4',
    duration: '18 นาที',
    category: 'AED',
    isActive: true,
    passingScore: 80,
    preTest: [
      {
        id: '1',
        question: 'AED ย่อมาจากอะไร?',
        options: ['Automatic Emergency Device', 'Automated External Defibrillator', 'Advanced Emergency Device', 'Automatic External Device'],
        correctAnswer: 1,
        explanation: 'AED ย่อมาจาก Automated External Defibrillator หรือเครื่องกระตุ้นหัวใจอัตโนมัติภายนอก'
      },
      {
        id: '2',
        question: 'AED สามารถใช้กับผู้ป่วยในสถานการณ์ใดบ้าง?',
        options: ['ผู้ป่วยที่หมดสติทุกราย', 'ผู้ป่วยหัวใจหยุดเต้นเท่านั้น', 'ผู้ป่วยที่มีอาการชัก', 'ผู้ป่วยที่หายใจลำบาก'],
        correctAnswer: 1,
        explanation: 'AED ใช้เฉพาะกับผู้ป่วยหัวใจหยุดเต้น (cardiac arrest) ที่ไม่มีการตอบสนองและไม่หายใจปกติเท่านั้น'
      }
    ],
    postTest: [
      {
        id: '1',
        question: 'ขั้นตอนแรกในการใช้ AED คืออะไร?',
        options: ['ติด electrode pads', 'เปิดเครื่อง AED', 'ตรวจสอบการตอบสนอง', 'กดปุ่ม analyze'],
        correctAnswer: 2,
        explanation: 'ต้องตรวจสอบการตอบสนองของผู้ป่วยก่อน หากไม่มีการตอบสนองและไม่หายใจปกติ จึงเปิดเครื่อง AED'
      },
      {
        id: '2',
        question: 'ก่อนกด shock ต้องทำอะไร?',
        options: ['ตะโกนเตือน "ห่างออก" และตรวจสอบไม่มีใครสัมผัสผู้ป่วย', 'นับ 1-2-3', 'ตรวจชีพจร', 'ปิดตาผู้ป่วย'],
        correctAnswer: 0,
        explanation: 'ต้องตะโกนเตือน "ห่างออก" (Clear) และตรวจสอบให้แน่ใจว่าไม่มีใครสัมผัสผู้ป่วยก่อนกด shock เพื่อความปลอดภัย'
      },
      {
        id: '3',
        question: 'หลังจาก shock แล้วควรทำอะไรต่อ?',
        options: ['รอดูผลลัพธ์', 'ตรวจชีพจร', 'เริ่มทำ CPR ทันที', 'ถอด electrode pads'],
        correctAnswer: 2,
        explanation: 'หลัง shock ให้เริ่มทำ CPR ทันที 30:2 เป็นเวลา 2 นาที จากนั้น AED จะวิเคราะห์จังหวะหัวใจอีกครั้ง'
      },
      {
        id: '4',
        question: 'electrode pads ควรติดตรงตำแหน่งใด?',
        options: ['ทั้งสองข้างของอก', 'ด้านขวาของอกและด้านซ้ายของซี่โครง', 'บนหัวใจ', 'บนหลังและหน้าอก'],
        correctAnswer: 1,
        explanation: 'ติด pad หนึ่งแผ่นที่ด้านขวาของอก (ใต้กระดูกไหปลาร้า) และอีกแผ่นที่ด้านซ้ายของซี่โครง (ใต้รักแร้ซ้าย)'
      }
    ]
  },
  {
    id: '3',
    title: 'ปฐมพยาบาลเด็กและทารก',
    description: 'เทคนิคการช่วยชีวิตเด็กและทารก รวมถึง CPR สำหรับเด็ก การช่วยเหลือเด็กสำลัก และการประเมินสถานการณ์เฉพาะ',
    videoUrl: 'https://www.youtube.com/embed/R-6K2VNVz5c',
    duration: '22 นาที',
    category: 'ปฐมพยาบาล',
    isActive: true,
    passingScore: 75,
    preTest: [
      {
        id: '1',
        question: 'CPR สำหรับเด็กอายุ 1-8 ปี ควรใช้กี่มือในการกดอก?',
        options: ['1 มือ', '2 มือ', '2 นิ้ว', 'ส้นมือข้างเดียว'],
        correctAnswer: 3,
        explanation: 'สำหรับเด็กอายุ 1-8 ปี ใช้ส้นมือข้างเดียวกดอก เพื่อให้เหมาะสมกับขนาดร่างกายของเด็ก'
      },
      {
        id: '2',
        question: 'อัตราส่วน CPR สำหรับเด็กเมื่อมีผู้ช่วยเหลือ 2 คนคือเท่าไร?',
        options: ['30:2', '15:2', '20:2', '25:2'],
        correctAnswer: 1,
        explanation: 'เมื่อมีผู้ช่วยเหลือ 2 คน อัตราส่วน CPR สำหรับเด็กคือ 15:2 เพื่อให้การช่วยหายใจมีประสิทธิภาพมากขึ้น'
      }
    ],
    postTest: [
      {
        id: '1',
        question: 'การกดอกสำหรับทารกอายุต่ำกว่า 1 ปี ควรใช้อะไร?',
        options: ['ส้นมือ 2 ข้าง', 'ส้นมือข้างเดียว', '2 นิ้ว (นิ้วชี้และนิ้วกลาง)', 'หัวแม่มือ'],
        correctAnswer: 2,
        explanation: 'สำหรับทารกใช้ 2 นิ้ว (นิ้วชี้และนิ้วกลาง) กดที่กึ่งกลางอก ใต้เส้นเชื่อมหัวนมประมาณ 1 นิ้ว'
      },
      {
        id: '2',
        question: 'ความลึกในการกดอกสำหรับเด็กควรเป็นเท่าไร?',
        options: ['1/3 ของความหนาอก', '1/2 ของความหนาอก', '2 นิ้ว', '3 นิ้ว'],
        correctAnswer: 0,
        explanation: 'สำหรับเด็กและทารก ควรกดลึกประมาณ 1/3 ของความหนาอก หรือประมาณ 1.5-2 นิ้วสำหรับเด็ก และ 1.5 นิ้วสำหรับทารก'
      },
      {
        id: '3',
        question: 'เด็กสำลักควรใช้วิธีใด?',
        options: ['Heimlich maneuver', 'การตบหลัง 5 ครั้ง แล้วกดอก 5 ครั้ง', 'การกดท้อง', 'การเขย่าตัว'],
        correctAnswer: 1,
        explanation: 'สำหรับเด็กสำลัก ให้ตบหลัง 5 ครั้ง แล้วกดอก 5 ครั้ง สลับกันไปจนกว่าสิ่งแปลกปลอมจะออกหรือเด็กหมดสติ'
      }
    ]
  }
];

const defaultArticles: Article[] = [
  {
    id: '1',
    title: 'สัญญาณเตือนของการหัวใจหยุดเต้นกะทันหัน',
    excerpt: 'เรียนรู้วิธีการสังเกตสัญญาณเตือนของการหัวใจหยุดเต้นกะทันหัน เพื่อการช่วยเหลือที่รวดเร็วและมีประสิทธิภาพ',
    content: `การหัวใจหยุดเต้นกะทันหัน (Sudden Cardiac Arrest) เป็นภาวะฉุกเฉินที่อันตรายถึงชีวิต ซึ่งหัวใจหยุดสูบฉีดเลือดไปเลี้ยงอวัยวะต่างๆ ในร่างกายอย่างกะทันหัน

## สัญญาณเตือนที่ควรสังเกต:

### สัญญาณก่อนเกิดเหตุ (อาจเกิดขึ้นก่อนหน้าหลายวันหรือหลายสัปดาห์):
- เจ็บแน่นหน้าอกที่มาและหายไป
- หายใจลำบาก โดยเฉพาะเมื่อออกแรง
- เหนื่อยง่ายผิดปกติ
- เวียนศีรษะหรือเป็นลม
- หัวใจเต้นผิดจังหวะ

### สัญญาณขณะเกิดเหตุ:
- หมดสติกะทันหัน
- ไม่มีการตอบสนอง
- ไม่หายใจหรือหายใจผิดปกติ (หอบ ครางเสียงดัง)
- ไม่มีชีพจร
- ผิวหนังเปลี่ยนเป็นสีน้ำเงินหรือซีด

## การช่วยเหลือเบื้องต้น:

1. **ตรวจสอบการตอบสนอง** - เขย่าไหล่และตะโกนเรียก
2. **โทรเรียกความช่วยเหลือ** - โทร 1669 ทันที
3. **เริ่มทำ CPR** - หากไม่มีการตอบสนองและไม่หายใจปกติ
4. **ใช้ AED** - หากมีเครื่องพร้อมใช้งาน

## ข้อควรจำ:
- เวลาเป็นสิ่งสำคัญที่สุด ทุกนาทีที่ผ่านไปโอกาสรอดชีวิตจะลดลง 7-10%
- การทำ CPR และใช้ AED ในช่วง 3-5 นาทีแรกจะช่วยเพิ่มโอกาสรอดชีวิตได้มากที่สุด
- อย่าลังเลที่จะช่วยเหลือ แม้จะไม่มีประสบการณ์ การช่วยเหลือที่ไม่สมบูรณ์ยังดีกว่าการไม่ช่วยเลย`,
    category: 'CPR',
    author: 'ทีมแพทย์โรงพยาบาลจุฬาลงกรณ์',
    readTime: '8 นาที',
    image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPublished: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'การช่วยเหลือผู้ป่วยสำลัก: เทคนิคที่อาจช่วยชีวิตได้',
    excerpt: 'วิธีการช่วยเหลือเมื่อมีคนสำลักอาหารหรือของแปลกปลอม พร้อมเทคนิคสำหรับผู้ใหญ่ เด็ก และทารก',
    content: `การสำลักเป็นภาวะฉุกเฉินที่พบได้บ่อย โดยเฉพาะในเด็กเล็กและผู้สูงอายุ การรู้วิธีช่วยเหลือที่ถูกต้องอาจช่วยชีวิตคนที่เรารักได้

## สัญญาณของการสำลัก:

### การสำลักบางส่วน (ยังพูดได้):
- ไอแรงๆ
- พูดได้แต่เสียงแหบ
- หายใจลำบาก
- ใบหน้าแดง

### การสำลักสมบูรณ์ (อันตราย):
- ไม่สามารถพูด ไอ หรือหายใจได้
- จับคอด้วยมือทั้งสอง (สัญญาณสากล)
- ใบหน้าเปลี่ยนเป็นสีน้ำเงิน
- หมดสติ

## วิธีการช่วยเหลือ:

### สำหรับผู้ใหญ่และเด็กอายุมากกว่า 1 ปี:
1. **ยืนข้างหลังผู้ป่วย** โอบแขนรอบเอว
2. **กำมือข้างหนึ่ง** วางหัวแม่มือที่กึ่งกลางท้องส่วนบน (เหนือสะดือ ใต้กระดูกอก)
3. **ใช้มืออีกข้างจับมือที่กำไว้** ดึงเข้าหาตัวและดันขึ้นอย่างแรง
4. **ทำซ้ำ** จนกว่าสิ่งแปลกปลอมจะออกหรือผู้ป่วยหมดสติ

### สำหรับทารกอายุต่ำกว่า 1 ปี:
1. **วางทารกคว่ำบนแขน** หัวต่ำกว่าลำตัว
2. **ตบหลัง 5 ครั้ง** ระหว่างสะบัก
3. **พลิกทารกหงาย** วางบนแขนอีกข้าง
4. **กดอก 5 ครั้ง** ใช้ 2 นิ้วกดที่กึ่งกลางอก
5. **สลับกัน** จนกว่าสิ่งแปลกปลอมจะออก

## ข้อควรระวัง:
- หากผู้ป่วยยังไอได้ ให้สนับสนุนให้ไอต่อไป
- อย่าใช้นิ้วคีบเอาสิ่งแปลกปลอมออก อาจทำให้ดันลึกเข้าไปมากขึ้น
- หากผู้ป่วยหมดสติ ให้เริ่มทำ CPR ทันที
- โทรเรียกความช่วยเหลือ 1669 ทันทีที่สถานการณ์อนุญาต`,
    category: 'ปฐมพยาบาล',
    author: 'ทีมแพทย์ฉุกเฉินโรงพยาบาลศิริราช',
    readTime: '6 นาที',
    image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPublished: true,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'การปฐมพยาบาลแผลและการห้ามเลือด',
    excerpt: 'เทคนิคการดูแลแผลเบื้องต้นและวิธีการห้ามเลือดที่มีประสิทธิภาพ สำหรับการบาดเจ็บทั่วไป',
    content: `การบาดเจ็บและแผลสามารถเกิดขึ้นได้ทุกที่ทุกเวลา การรู้วิธีปฐมพยาบาลเบื้องต้นจะช่วยลดความรุนแรงและป้องกันการติดเชื้อ

## ประเภทของแผล:

### แผลถลอก (Abrasion):
- ผิวหนังถูกขูดหรือเสียดสี
- มักมีเศษสิ่งสกปรกติดอยู่
- เลือดออกน้อย

### แผลฉีกขาด (Laceration):
- แผลที่มีขอบไม่เรียบ
- เกิดจากวัตุมีคม
- อาจเลือดออกมาก

### แผลแทง (Puncture):
- แผลลึกแต่ปากแผลเล็ก
- เกิดจากวัตุแหลมคม
- เสี่ยงต่อการติดเชื้อสูง

## การปฐมพยาบาลแผล:

### ขั้นตอนพื้นฐาน:
1. **ล้างมือ** ให้สะอาดก่อนสัมผัสแผล
2. **ห้ามเลือด** โดยการกดทับด้วยผ้าสะอาด
3. **ทำความสะอาดแผล** ด้วยน้ำสะอาดหรือน้ำเกลือ
4. **ใส่ยาฆ่าเชื้อ** หากมี
5. **ปิดแผล** ด้วยผ้าพันแผลหรือพลาสเตอร์

### การห้ามเลือด:
1. **การกดทับตรง** - กดที่แผลด้วยผ้าสะอาด
2. **การยกสูง** - ยกส่วนที่บาดเจ็บให้สูงกว่าหัวใจ
3. **การกดจุดกดเลือด** - กดหลอดเลือดแดงหลักก่อนถึงแผล

## เมื่อไหร่ต้องพบแพทย์:
- แผลลึกมากหรือเห็นกระดูก เอ็น
- เลือดออกไม่หยุดหลังกดทับ 10-15 นาที
- แผลใหญ่กว่า 1 ซม. หรือยาวกว่า 2 ซม.
- มีเศษสิ่งแปลกปลอมในแผลที่เอาออกไม่ได้
- แผลเกิดจากสัตว์กัดหรือวัตุสกปรก
- ไม่ได้ฉีดวัคซีนบาดทะยัก

## ข้อห้าม:
- อย่าใช้แอลกอฮอล์หรือไอโอดีนใส่แผลโดยตรง
- อย่าเป่าแผลหรือใช้ปากดูด
- อย่าใช้สำลีขนสัตว์ปิดแผล
- อย่าถอดเศษแก้วหรือโลหะที่ฝังลึก`,
    category: 'ปฐมพยาบาล',
    author: 'ทีมพยาบาลฉุกเฉิน รพ.รามาธิบดี',
    readTime: '7 นาที',
    image: 'https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPublished: true,
    createdAt: '2024-01-05'
  },
  {
    id: '4',
    title: 'การช่วยเหลือผู้ป่วยโรคหัวใจ: สัญญาณและการดูแลเฉพาะหน้า',
    excerpt: 'รู้จักสัญญาณของโรคหัวใจเฉียบพลันและวิธีการช่วยเหลือเบื้องต้นก่อนส่งโรงพยาบาล',
    content: `โรคหัวใจเป็นสาเหตุการเสียชีวิตอันดับต้นๆ ของคนไทย การรู้จักสัญญาณและการช่วยเหลือเบื้องต้นอาจช่วยชีวิตได้

## โรคหัวใจเฉียบพลันที่พบบ่อย:

### กล้ามเนื้อหัวใจขาดเลือด (Myocardial Infarction):
- เจ็บแน่นหน้าอกรุนแรง เหมือนถูกช้างเหยียบ
- ปวดแผ่ไปที่แขน คอ ขากรรไกร หลัง
- หายใจลำบาก เหงื่อออกมาก
- คลื่นไส้ อาเจียน
- วิงเวียนศีรษะ

### หัวใจเต้นผิดจังหวะ (Arrhythmia):
- หัวใจเต้นเร็วหรือช้าผิดปกติ
- เวียนศีรษะ เป็นลม
- เจ็บแน่นหน้าอก
- หายใจลำบาก

## การช่วยเหลือเบื้องต้น:

### สำหรับผู้ป่วยที่ยังมีสติ:
1. **ให้ผู้ป่วยนั่งหรือนอน** ในท่าที่สบาย
2. **คลายเสื้อผ้า** ให้หายใจสะดวก
3. **ให้ยาไนโตรกลีเซอรีน** หากผู้ป่วยมีประจำตัว
4. **ให้แอสไพริน** 1 เม็ด (300 มก.) เคี้ยวกลืน หากไม่แพ้
5. **โทรเรียกความช่วยเหลือ** 1669 ทันที
6. **เตรียมทำ CPR** หากผู้ป่วยหมดสติ

### สำหรับผู้ป่วยหมดสติ:
1. **ตรวจสอบการตอบสนอง** และการหายใจ
2. **โทร 1669** ทันที
3. **เริ่มทำ CPR** หากไม่มีชีพจร
4. **ใช้ AED** หากมีพร้อมใช้งาน

## ข้อควรระวัง:
- อย่าให้ผู้ป่วยเดินหรือออกแรง
- อย่าให้น้ำหรืออาหาร
- อย่าทิ้งผู้ป่วยไว้คนเดียว
- จดบันทึกเวลาที่เกิดอาการและการให้ยา

## การป้องกัน:
- ควบคุมความดันโลหิต น้ำตาลในเลือด
- ออกกำลังกายสม่ำเสมอ
- เลิกสูบบุหรี่
- รับประทานอาหารที่มีไขมันต่ำ
- ตรวจสุขภาพประจำปี`,
    category: 'CPR',
    author: 'ทีมแพทย์หัวใจ รพ.ธรรมศาสตร์',
    readTime: '9 นาที',
    image: 'https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?auto=compress&cs=tinysrgb&w=800',
    isPublished: true,
    createdAt: '2024-01-20'
  }
];

const defaultCertificateTemplates: CertificateTemplate[] = [
  {
    id: '1',
    name: 'เทมเพลตมาตรฐาน CPR',
    imageUrl: 'https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=800',
    isDefault: true
  }
];

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>(defaultCertificateTemplates);

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const addArticle = (article: Article) => {
    setArticles(prev => [...prev, article]);
  };

  const updateArticle = (id: string, updatedArticle: Partial<Article>) => {
    setArticles(prev => prev.map(article => 
      article.id === id ? { ...article, ...updatedArticle } : article
    ));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  const addCertificateTemplate = (template: CertificateTemplate) => {
    setCertificateTemplates(prev => [...prev, template]);
  };

  const deleteCertificateTemplate = (id: string) => {
    setCertificateTemplates(prev => prev.filter(template => template.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      courses,
      articles,
      certificateTemplates,
      setCourses,
      setArticles,
      setCertificateTemplates,
      addCourse,
      updateCourse,
      deleteCourse,
      addArticle,
      updateArticle,
      deleteArticle,
      addCertificateTemplate,
      deleteCertificateTemplate
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export type { Course, Question, Article, CertificateTemplate };