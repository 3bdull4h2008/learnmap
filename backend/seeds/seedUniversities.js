import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnmap';

console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

try {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('Failed to connect to MongoDB. Make sure MongoDB is running.');
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

const majorSchema = new mongoose.Schema({
  name: String, nameEn: String, field: String,
  minMark: Number, annualCost: Number, duration: Number,
  description: String, careerPaths: [String]
}, { _id: false, strict: false });

const universitySchema = new mongoose.Schema({
  name: String, nameEn: String, type: String,
  location: { city: String, region: String, address: String },
  website: String, contact: { phone: String, email: String },
  majors: [majorSchema], description: String,
  ranking: { national: Number, regional: Number },
  facilities: [String], accreditation: [String], imageUrl: String
}, { strict: false });

const University = mongoose.model('University', universitySchema);

await University.deleteMany({});

const universities = [
  // ==================== PUBLIC UNIVERSITIES (11) ====================
  {
    name: 'الجامعة الأردنية', nameEn: 'University of Jordan',
    type: 'public',
    location: { city: 'عمان', region: 'center', address: 'عمان، الجامعة الأردنية' },
    website: 'https://www.ju.edu.jo',
    ranking: { national: 1, regional: 15 },
    facilities: ['مكتبة', 'سكن طلابي', 'مراكز بحثية', 'مدينة رياضية', 'مستشفى جامعي'],
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الطب', nameEn: 'Medicine', field: 'health', minMark: 98.5, annualCost: 1800, duration: 6 },
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 97.8, annualCost: 2000, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 94.9, annualCost: 1600, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 85, annualCost: 1300, duration: 4 },
      { name: 'المختبرات الطبية', nameEn: 'Medical Laboratory', field: 'health', minMark: 85, annualCost: 1300, duration: 4 },
      { name: 'العلاج الطبيعي', nameEn: 'Physiotherapy', field: 'health', minMark: 87, annualCost: 1400, duration: 4 },
      { name: 'العلاج الوظيفي', nameEn: 'Occupational Therapy', field: 'health', minMark: 82, annualCost: 1400, duration: 4 },
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 98.0, annualCost: 1400, duration: 5 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 90.1, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 91.4, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 95.0, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الصناعية', nameEn: 'Industrial Engineering', field: 'engineering-tech', minMark: 85, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الكيميائية', nameEn: 'Chemical Engineering', field: 'engineering-tech', minMark: 85, annualCost: 1400, duration: 5 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 90, annualCost: 1500, duration: 5 },
      { name: 'هندسة الميكاترونكس', nameEn: 'Mechatronics Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الطبية', nameEn: 'Biomedical Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1500, duration: 5 },
      { name: 'هندسة المساحة', nameEn: 'Surveying Engineering', field: 'engineering-tech', minMark: 78, annualCost: 1200, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 97.1, annualCost: 1300, duration: 4 },
      { name: 'نظم المعلومات الحاسوبية', nameEn: 'Computer Information Systems', field: 'engineering-tech', minMark: 88, annualCost: 1200, duration: 4 },
      { name: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', field: 'engineering-tech', minMark: 90, annualCost: 1300, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 87.2, annualCost: 1000, duration: 4 },
      { name: 'الفيزياء', nameEn: 'Physics', field: 'engineering-tech', minMark: 84.6, annualCost: 1000, duration: 4 },
      { name: 'الكيمياء', nameEn: 'Chemistry', field: 'engineering-tech', minMark: 82, annualCost: 1000, duration: 4 },
      { name: 'العلوم الحياتية', nameEn: 'Life Sciences', field: 'engineering-tech', minMark: 82, annualCost: 1000, duration: 4 },
      { name: 'الجيولوجيا', nameEn: 'Geology', field: 'engineering-tech', minMark: 79.5, annualCost: 1000, duration: 4 },
      { name: 'التكنولوجيا الحيوية', nameEn: 'Biotechnology', field: 'engineering-tech', minMark: 82, annualCost: 1200, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 82, annualCost: 1200, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 85, annualCost: 1200, duration: 4 },
      { name: 'العلوم المالية والمصرفية', nameEn: 'Finance and Banking', field: 'business', minMark: 85, annualCost: 1200, duration: 4 },
      { name: 'التسويق', nameEn: 'Marketing', field: 'business', minMark: 76, annualCost: 1100, duration: 4 },
      { name: 'إدارة الموارد البشرية', nameEn: 'Human Resources', field: 'business', minMark: 75, annualCost: 1100, duration: 4 },
      { name: 'نظم المعلومات الإدارية', nameEn: 'Management Information Systems', field: 'business', minMark: 76, annualCost: 1100, duration: 4 },
      { name: 'الاقتصاد', nameEn: 'Economics', field: 'business', minMark: 75, annualCost: 1000, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 85, annualCost: 900, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 87, annualCost: 900, duration: 4 },
      { name: 'اللغة الفرنسية', nameEn: 'French Language', field: 'languages-humanities', minMark: 80, annualCost: 900, duration: 4 },
      { name: 'علم النفس', nameEn: 'Psychology', field: 'languages-humanities', minMark: 85, annualCost: 1000, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 90, annualCost: 1400, duration: 4 },
      { name: 'علم الاجتماع', nameEn: 'Sociology', field: 'languages-humanities', minMark: 80, annualCost: 900, duration: 4 },
      { name: 'التاريخ', nameEn: 'History', field: 'languages-humanities', minMark: 78, annualCost: 900, duration: 4 },
      { name: 'الجغرافيا', nameEn: 'Geography', field: 'languages-humanities', minMark: 76, annualCost: 900, duration: 4 },
      { name: 'الصحافة والإعلام', nameEn: 'Journalism and Media', field: 'languages-humanities', minMark: 84, annualCost: 1100, duration: 4 },
      { name: 'العلاقات العامة', nameEn: 'Public Relations', field: 'languages-humanities', minMark: 78, annualCost: 1000, duration: 4 },
      { name: 'التربية', nameEn: 'Education', field: 'languages-humanities', minMark: 80, annualCost: 900, duration: 4 },
      { name: 'التربية الخاصة', nameEn: 'Special Education', field: 'languages-humanities', minMark: 82, annualCost: 900, duration: 4 },
      { name: 'المكتبات والمعلومات', nameEn: 'Library and Information Science', field: 'languages-humanities', minMark: 72, annualCost: 900, duration: 4 },
      { name: 'الدراسات الإسلامية', nameEn: 'Islamic Studies', field: 'languages-humanities', minMark: 80, annualCost: 900, duration: 4 },
      { name: 'الفلسفة', nameEn: 'Philosophy', field: 'languages-humanities', minMark: 72, annualCost: 900, duration: 4 },
    ]
  },
  {
    name: 'جامعة اليرموك', nameEn: 'Yarmouk University',
    type: 'public',
    location: { city: 'إربد', region: 'north', address: 'إربد، جامعة اليرموك' },
    website: 'https://www.yu.edu.jo',
    ranking: { national: 3, regional: 25 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الطب', nameEn: 'Medicine', field: 'health', minMark: 97.1, annualCost: 1800, duration: 6 },
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 95.5, annualCost: 2000, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 91.2, annualCost: 1600, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 82, annualCost: 1200, duration: 4 },
      { name: 'المختبرات الطبية', nameEn: 'Medical Laboratory', field: 'health', minMark: 84, annualCost: 1200, duration: 4 },
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 92.5, annualCost: 1300, duration: 5 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 85, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 86, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 86, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الصناعية', nameEn: 'Industrial Engineering', field: 'engineering-tech', minMark: 90.1, annualCost: 1300, duration: 5 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 85, annualCost: 1200, duration: 4 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 87, annualCost: 1400, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 90, annualCost: 1100, duration: 4 },
      { name: 'نظم المعلومات', nameEn: 'Information Systems', field: 'engineering-tech', minMark: 82, annualCost: 1000, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'الفيزياء', nameEn: 'Physics', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'الكيمياء', nameEn: 'Chemistry', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'العلوم الحياتية', nameEn: 'Life Sciences', field: 'engineering-tech', minMark: 87.9, annualCost: 900, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 78, annualCost: 1100, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 85.0, annualCost: 1100, duration: 4 },
      { name: 'الاقتصاد', nameEn: 'Economics', field: 'business', minMark: 75, annualCost: 1000, duration: 4 },
      { name: 'العلوم المالية والمصرفية', nameEn: 'Finance and Banking', field: 'business', minMark: 78, annualCost: 1100, duration: 4 },
      { name: 'نظم المعلومات الإدارية', nameEn: 'Management Information Systems', field: 'business', minMark: 74, annualCost: 1000, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 82, annualCost: 900, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 85, annualCost: 900, duration: 4 },
      { name: 'علم النفس', nameEn: 'Psychology', field: 'languages-humanities', minMark: 80, annualCost: 900, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 86, annualCost: 1200, duration: 4 },
      { name: 'علم الاجتماع', nameEn: 'Sociology', field: 'languages-humanities', minMark: 76, annualCost: 900, duration: 4 },
      { name: 'التاريخ', nameEn: 'History', field: 'languages-humanities', minMark: 74, annualCost: 900, duration: 4 },
      { name: 'الجغرافيا', nameEn: 'Geography', field: 'languages-humanities', minMark: 72, annualCost: 900, duration: 4 },
      { name: 'الصحافة والإعلام', nameEn: 'Journalism and Media', field: 'languages-humanities', minMark: 82, annualCost: 1000, duration: 4 },
      { name: 'التربية', nameEn: 'Education', field: 'languages-humanities', minMark: 76, annualCost: 900, duration: 4 },
      { name: 'التربية الخاصة', nameEn: 'Special Education', field: 'languages-humanities', minMark: 78, annualCost: 900, duration: 4 },
      { name: 'الآثار', nameEn: 'Archaeology', field: 'languages-humanities', minMark: 72, annualCost: 900, duration: 4 },
      { name: 'الفنون الجميلة', nameEn: 'Fine Arts', field: 'languages-humanities', minMark: 70, annualCost: 1100, duration: 4 },
      { name: 'الدراسات الإسلامية', nameEn: 'Islamic Studies', field: 'languages-humanities', minMark: 75, annualCost: 900, duration: 4 },
    ]
  },
  {
    name: 'جامعة العلوم والتكنولوجيا الأردنية', nameEn: 'Jordan University of Science and Technology',
    type: 'public',
    location: { city: 'اربد', region: 'north', address: 'اربد، الرمثا' },
    website: 'https://www.just.edu.jo',
    ranking: { national: 2, regional: 20 },
    facilities: ['مستشفى جامعي', 'مكتبة', 'سكن طلابي', 'مراكز بحثية', 'مدينة رياضية'],
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الطب', nameEn: 'Medicine', field: 'health', minMark: 98.1, annualCost: 1900, duration: 6 },
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 96.5, annualCost: 2100, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 93.9, annualCost: 1700, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 88, annualCost: 1300, duration: 4 },
      { name: 'المختبرات الطبية', nameEn: 'Medical Laboratory', field: 'health', minMark: 86, annualCost: 1300, duration: 4 },
      { name: 'طب الطوارئ', nameEn: 'Emergency Medicine', field: 'health', minMark: 80, annualCost: 1300, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الكيميائية', nameEn: 'Chemical Engineering', field: 'engineering-tech', minMark: 86, annualCost: 1400, duration: 5 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 90, annualCost: 1500, duration: 5 },
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 88, annualCost: 1400, duration: 5 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 87, annualCost: 1300, duration: 4 },
      { name: 'هندسة الميكاترونكس', nameEn: 'Mechatronics Engineering', field: 'engineering-tech', minMark: 86, annualCost: 1400, duration: 5 },
      { name: 'الهندسة الطبية', nameEn: 'Biomedical Engineering', field: 'engineering-tech', minMark: 93.5, annualCost: 1500, duration: 5 },
      { name: 'هندسة الطاقة', nameEn: 'Energy Engineering', field: 'engineering-tech', minMark: 85, annualCost: 1400, duration: 5 },
      { name: 'هندسة الطيران', nameEn: 'Aeronautical Engineering', field: 'engineering-tech', minMark: 91.2, annualCost: 1600, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 88, annualCost: 1300, duration: 4 },
      { name: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', field: 'engineering-tech', minMark: 94.8, annualCost: 1400, duration: 4 },
      { name: 'علم البيانات', nameEn: 'Data Science', field: 'engineering-tech', minMark: 88, annualCost: 1300, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'الفيزياء', nameEn: 'Physics', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'الكيمياء', nameEn: 'Chemistry', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'العلوم الحياتية', nameEn: 'Life Sciences', field: 'engineering-tech', minMark: 75, annualCost: 900, duration: 4 },
      { name: 'التكنولوجيا الحيوية', nameEn: 'Biotechnology', field: 'engineering-tech', minMark: 80, annualCost: 1200, duration: 4 },
    ]
  },
  {
    name: 'الجامعة الهاشمية', nameEn: 'Hashemite University',
    type: 'public',
    location: { city: 'الزرقاء', region: 'center', address: 'الزرقاء، الجامعة الهاشمية' },
    website: 'https://www.hu.edu.jo',
    ranking: { national: 5, regional: 40 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الطب', nameEn: 'Medicine', field: 'health', minMark: 96.9, annualCost: 1800, duration: 6 },
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 95.0, annualCost: 2000, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 90, annualCost: 1500, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 85, annualCost: 1200, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 82, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 82, annualCost: 1300, duration: 5 },
      { name: 'الهندسة الصناعية', nameEn: 'Industrial Engineering', field: 'engineering-tech', minMark: 80, annualCost: 1300, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 85, annualCost: 1100, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 70, annualCost: 900, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 75, annualCost: 1100, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 78, annualCost: 1100, duration: 4 },
      { name: 'الاقتصاد', nameEn: 'Economics', field: 'business', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 78, annualCost: 900, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 82, annualCost: 1100, duration: 4 },
      { name: 'التربية', nameEn: 'Education', field: 'languages-humanities', minMark: 72, annualCost: 900, duration: 4 },
    ]
  },
  {
    name: 'جامعة مؤتة', nameEn: 'Mutah University',
    type: 'public',
    location: { city: 'الكرك', region: 'south', address: 'الكرك، جامعة مؤتة' },
    website: 'https://www.mutah.edu.jo',
    ranking: { national: 6, regional: 45 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الطب', nameEn: 'Medicine', field: 'health', minMark: 94.5, annualCost: 1700, duration: 6 },
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 92, annualCost: 1900, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 88, annualCost: 1500, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 80, annualCost: 1100, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 82, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 82, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 80, annualCost: 1200, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 82, annualCost: 1000, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 68, annualCost: 900, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 74, annualCost: 1000, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 72, annualCost: 800, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 75, annualCost: 800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 80, annualCost: 1000, duration: 4 },
      { name: 'علم الاجتماع', nameEn: 'Sociology', field: 'languages-humanities', minMark: 68, annualCost: 800, duration: 4 },
    ]
  },
  {
    name: 'جامعة آل البيت', nameEn: 'Al al-Bayt University',
    type: 'public',
    location: { city: 'المفرق', region: 'north', address: 'المفرق، جامعة آل البيت' },
    website: 'https://www.aabu.edu.jo',
    ranking: { national: 7, regional: 50 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 78, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 76, annualCost: 1200, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 78, annualCost: 1000, duration: 4 },
      { name: 'نظم المعلومات', nameEn: 'Information Systems', field: 'engineering-tech', minMark: 74, annualCost: 900, duration: 4 },
      { name: 'الرياضيات', nameEn: 'Mathematics', field: 'engineering-tech', minMark: 65, annualCost: 800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 70, annualCost: 1000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'الاقتصاد', nameEn: 'Economics', field: 'business', minMark: 68, annualCost: 900, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 72, annualCost: 800, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 74, annualCost: 800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 78, annualCost: 1000, duration: 4 },
      { name: 'التاريخ', nameEn: 'History', field: 'languages-humanities', minMark: 65, annualCost: 800, duration: 4 },
      { name: 'الدراسات الإسلامية', nameEn: 'Islamic Studies', field: 'languages-humanities', minMark: 70, annualCost: 800, duration: 4 },
    ]
  },
  {
    name: 'جامعة البلقاء التطبيقية', nameEn: 'Al-Balqa Applied University',
    type: 'public',
    location: { city: 'السلط', region: 'center', address: 'السلط، جامعة البلقاء التطبيقية' },
    website: 'https://www.bau.edu.jo',
    ranking: { national: 4, regional: 35 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 78, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 78, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الصناعية', nameEn: 'Industrial Engineering', field: 'engineering-tech', minMark: 75, annualCost: 1200, duration: 5 },
      { name: 'الهندسة الكيميائية', nameEn: 'Chemical Engineering', field: 'engineering-tech', minMark: 75, annualCost: 1200, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 78, annualCost: 1000, duration: 4 },
      { name: 'نظم المعلومات الحاسوبية', nameEn: 'Computer Information Systems', field: 'engineering-tech', minMark: 74, annualCost: 900, duration: 4 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 80, annualCost: 1100, duration: 4 },
      { name: 'المختبرات الطبية', nameEn: 'Medical Laboratory', field: 'health', minMark: 76, annualCost: 1000, duration: 4 },
      { name: 'التغذية', nameEn: 'Nutrition', field: 'health', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 68, annualCost: 1000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'نظم المعلومات الإدارية', nameEn: 'Management Information Systems', field: 'business', minMark: 68, annualCost: 900, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 72, annualCost: 800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 76, annualCost: 1000, duration: 4 },
      { name: 'التربية الخاصة', nameEn: 'Special Education', field: 'languages-humanities', minMark: 70, annualCost: 800, duration: 4 },
      { name: 'تكنولوجيا المعلومات', nameEn: 'Information Technology', field: 'voc-it', minMark: 65, annualCost: 800, duration: 3 },
      { name: 'برمجة وتطوير الويب', nameEn: 'Web Development', field: 'voc-it', minMark: 60, annualCost: 700, duration: 3 },
      { name: 'التصميم الجرافيكي', nameEn: 'Graphic Design', field: 'voc-design', minMark: 58, annualCost: 700, duration: 3 },
      { name: 'فنون الطهي', nameEn: 'Culinary Arts', field: 'voc-hospitality', minMark: 55, annualCost: 700, duration: 3 },
      { name: 'إدارة الفنادق', nameEn: 'Hotel Management', field: 'voc-hospitality', minMark: 55, annualCost: 700, duration: 3 },
      { name: 'السياحة والسفر', nameEn: 'Tourism and Travel', field: 'voc-admin', minMark: 52, annualCost: 600, duration: 3 },
      { name: 'التسويق الإلكتروني', nameEn: 'Digital Marketing', field: 'voc-admin', minMark: 50, annualCost: 600, duration: 3 },
      { name: 'صيانة المعدات الطبية', nameEn: 'Medical Equipment Maintenance', field: 'voc-construction', minMark: 58, annualCost: 700, duration: 3 },
      { name: 'التبريد والتكييف', nameEn: 'HVAC Technology', field: 'voc-construction', minMark: 55, annualCost: 700, duration: 3 },
      { name: 'الإنتاج الزراعي', nameEn: 'Agricultural Production', field: 'voc-agriculture', minMark: 50, annualCost: 600, duration: 3 },
      { name: 'التمريض المساعد', nameEn: 'Practical Nursing', field: 'voc-healthcare', minMark: 55, annualCost: 700, duration: 3 },
      { name: 'التربية الرياضية', nameEn: 'Physical Education', field: 'voc-sports', minMark: 52, annualCost: 600, duration: 3 },
      { name: 'الحرف اليدوية', nameEn: 'Handicrafts', field: 'voc-crafts', minMark: 45, annualCost: 600, duration: 3 },
      { name: 'الخدمات اللوجستية', nameEn: 'Logistics Services', field: 'voc-logistics', minMark: 48, annualCost: 600, duration: 3 },
    ]
  },
  {
    name: 'الجامعة الألمانية الأردنية', nameEn: 'German Jordanian University',
    type: 'public',
    location: { city: 'مادبا', region: 'center', address: 'مادبا، الجامعة الألمانية الأردنية' },
    website: 'https://www.gju.edu.jo',
    ranking: { national: 8, regional: 55 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 85, annualCost: 3000, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 85, annualCost: 3000, duration: 5 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 82, annualCost: 2800, duration: 5 },
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 84, annualCost: 3000, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 84, annualCost: 2800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 75, annualCost: 2500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 76, annualCost: 2500, duration: 4 },
      { name: 'اللغة الإنجليزية والترجمة', nameEn: 'English and Translation', field: 'languages-humanities', minMark: 80, annualCost: 2200, duration: 4 },
      { name: 'تطوير التطبيقات', nameEn: 'App Development', field: 'voc-it', minMark: 65, annualCost: 2500, duration: 3 },
      { name: 'أمن الشبكات', nameEn: 'Network Security', field: 'voc-it', minMark: 68, annualCost: 2600, duration: 3 },
      { name: 'التصميم الداخلي', nameEn: 'Interior Design', field: 'voc-design', minMark: 60, annualCost: 2400, duration: 3 },
    ]
  },
  {
    name: 'جامعة الحسين بن طلال', nameEn: 'Al-Hussein Bin Talal University',
    type: 'public',
    location: { city: 'معان', region: 'south', address: 'معان، جامعة الحسين بن طلال' },
    website: 'https://www.ahu.edu.jo',
    ranking: { national: 10, regional: 65 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 72, annualCost: 1100, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 72, annualCost: 1100, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 72, annualCost: 1000, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 65, annualCost: 900, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 66, annualCost: 900, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 68, annualCost: 800, duration: 4 },
      { name: 'السياحة والضيافة', nameEn: 'Tourism and Hospitality', field: 'languages-humanities', minMark: 62, annualCost: 800, duration: 4 },
    ]
  },
  {
    name: 'جامعة الطفيلة التقنية', nameEn: 'Tafila Technical University',
    type: 'public',
    location: { city: 'الطفيلة', region: 'south', address: 'الطفيلة، جامعة الطفيلة التقنية' },
    website: 'https://www.ttu.edu.jo',
    ranking: { national: 9, regional: 60 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 75, annualCost: 1100, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 75, annualCost: 1100, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 74, annualCost: 1100, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 74, annualCost: 900, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 65, annualCost: 900, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 66, annualCost: 900, duration: 4 },
      { name: 'التربية', nameEn: 'Education', field: 'languages-humanities', minMark: 65, annualCost: 700, duration: 4 },
    ]
  },
  {
    name: 'الجامعة الأردنية / العقبة', nameEn: 'University of Jordan - Aqaba',
    type: 'public',
    location: { city: 'العقبة', region: 'south', address: 'العقبة، الجامعة الأردنية فرع العقبة' },
    website: 'https://aqaba.ju.edu.jo',
    ranking: { national: 11, regional: 70 },
    scholarships: { military: true, teachers: true, details: 'خصم 25% لموظفين القوات المسلحة وعائلاتهم، خصم 25% للمعلمين وعائلاتهم' },
    majors: [
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 70, annualCost: 900, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 72, annualCost: 900, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 72, annualCost: 800, duration: 4 },
      { name: 'السياحة والضيافة', nameEn: 'Tourism and Hospitality', field: 'languages-humanities', minMark: 65, annualCost: 800, duration: 4 },
    ]
  },

  // ==================== SPECIAL LAW UNIVERSITIES (2) ====================
  {
    name: 'جامعة العلوم الإسلامية العالمية', nameEn: 'World Islamic Sciences and Education University',
    type: 'special-law',
    location: { city: 'عمان', region: 'center', address: 'عمان، جامعة العلوم الإسلامية' },
    website: 'https://www.wise.edu.jo',
    ranking: { national: 19, regional: 85 },
    majors: [
      { name: 'الشريعة والقانون', nameEn: 'Sharia and Law', field: 'languages-humanities', minMark: 80, annualCost: 1500, duration: 4 },
      { name: 'الدراسات الإسلامية', nameEn: 'Islamic Studies', field: 'languages-humanities', minMark: 75, annualCost: 1300, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 75, annualCost: 1200, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 80, annualCost: 1500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 70, annualCost: 1400, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 72, annualCost: 1400, duration: 4 },
    ]
  },
  {
    name: 'جامعة الحسين التقنية', nameEn: 'Al-Hussein Technical University',
    type: 'special-law',
    location: { city: 'عمان', region: 'center', address: 'عمان، جامعة الحسين التقنية' },
    website: 'https://www.htu.edu.jo',
    ranking: { national: 24, regional: 90 },
    scholarships: { military: true, teachers: true, details: 'منح للموظفين العسكريين والمعلمين وعائلاتهم' },
    majors: [
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 72, annualCost: 3500, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 72, annualCost: 3500, duration: 5 },
      { name: 'هندسة الطاقة', nameEn: 'Energy Engineering', field: 'engineering-tech', minMark: 72, annualCost: 3500, duration: 5 },
      { name: 'الهندسة الصناعية', nameEn: 'Industrial Engineering', field: 'engineering-tech', minMark: 72, annualCost: 3500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 72, annualCost: 3200, duration: 4 },
      { name: 'الأمن السيبراني', nameEn: 'Cyber Security', field: 'engineering-tech', minMark: 74, annualCost: 3400, duration: 4 },
      { name: 'علم البيانات والذكاء الاصطناعي', nameEn: 'Data Science and AI', field: 'engineering-tech', minMark: 76, annualCost: 3600, duration: 4 },
      { name: 'تصميم وتطوير الألعاب', nameEn: 'Game Design and Development', field: 'engineering-tech', minMark: 70, annualCost: 3200, duration: 4 },
      { name: 'العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 70, annualCost: 3500, duration: 5 },
    ]
  },

  // ==================== PRIVATE UNIVERSITIES (16) ====================
  {
    name: 'جامعة عمان الأهلية', nameEn: 'Al-Ahliyya Amman University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، ضاحية الأقصى' },
    website: 'https://www.ammanu.edu.jo',
    ranking: { national: 12, regional: 70 },
    majors: [
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 82, annualCost: 8000, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 78, annualCost: 6000, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 70, annualCost: 4000, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 72, annualCost: 5000, duration: 5 },
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 74, annualCost: 5000, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 70, annualCost: 4500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 62, annualCost: 4000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 65, annualCost: 4000, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 72, annualCost: 4500, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 65, annualCost: 3500, duration: 4 },
    ]
  },
  {
    name: 'جامعة العلوم التطبيقية الخاصة', nameEn: 'Applied Science Private University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، الجبيهة' },
    website: 'https://www.asu.edu.jo',
    ranking: { national: 13, regional: 75 },
    majors: [
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 80, annualCost: 8500, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 76, annualCost: 6500, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 68, annualCost: 4200, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 70, annualCost: 5000, duration: 5 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 74, annualCost: 5500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 68, annualCost: 4200, duration: 4 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 70, annualCost: 4500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 60, annualCost: 3800, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 62, annualCost: 3800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 68, annualCost: 4200, duration: 4 },
      { name: 'مساعد صيدلي', nameEn: 'Pharmacy Assistant', field: 'voc-healthcare', minMark: 50, annualCost: 3500, duration: 3 },
      { name: 'اللياقة البدنية', nameEn: 'Fitness Training', field: 'voc-sports', minMark: 45, annualCost: 3000, duration: 3 },
    ]
  },
  {
    name: 'جامعة الزرقاء', nameEn: 'Zarqa University',
    type: 'private',
    location: { city: 'الزرقاء', region: 'center', address: 'الزرقاء، جامعة الزرقاء' },
    website: 'https://www.zu.edu.jo',
    ranking: { national: 14, regional: 78 },
    majors: [
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 74, annualCost: 5500, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 68, annualCost: 4000, duration: 4 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 70, annualCost: 4800, duration: 5 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 68, annualCost: 4500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 65, annualCost: 3800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 58, annualCost: 3500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 60, annualCost: 3500, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 68, annualCost: 4000, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 62, annualCost: 3200, duration: 4 },
      { name: 'برمجة الحاسوب', nameEn: 'Computer Programming', field: 'voc-it', minMark: 50, annualCost: 3000, duration: 3 },
      { name: 'التجميل والعناية', nameEn: 'Beauty and Care', field: 'voc-healthcare', minMark: 45, annualCost: 2800, duration: 3 },
    ]
  },
  {
    name: 'جامعة البترا', nameEn: 'University of Petra',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، شارع الملكة رانيا' },
    website: 'https://www.uop.edu.jo',
    ranking: { national: 15, regional: 80 },
    majors: [
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 75, annualCost: 6000, duration: 5 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 72, annualCost: 5500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 68, annualCost: 4000, duration: 4 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 70, annualCost: 4200, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 58, annualCost: 3500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 60, annualCost: 3500, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 65, annualCost: 3200, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 68, annualCost: 4000, duration: 4 },
      { name: 'التسويق', nameEn: 'Marketing', field: 'business', minMark: 55, annualCost: 3200, duration: 4 },
    ]
  },
  {
    name: 'جامعة الإسراء', nameEn: 'Isra University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، طريق المطار' },
    website: 'https://www.isra.edu.jo',
    ranking: { national: 16, regional: 82 },
    majors: [
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 72, annualCost: 5500, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 65, annualCost: 3800, duration: 4 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 68, annualCost: 4800, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 62, annualCost: 3600, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 55, annualCost: 3200, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 58, annualCost: 3200, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 65, annualCost: 3800, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 60, annualCost: 3000, duration: 4 },
    ]
  },
  {
    name: 'جامعة الزيتونة الأردنية', nameEn: 'Al-Zaytoonah University of Jordan',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، شفا بدران' },
    website: 'https://www.zuj.edu.jo',
    ranking: { national: 17, regional: 83 },
    majors: [
      { name: 'طب الأسنان', nameEn: 'Dentistry', field: 'health', minMark: 78, annualCost: 9000, duration: 5 },
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 74, annualCost: 5800, duration: 5 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 66, annualCost: 4000, duration: 4 },
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 68, annualCost: 4800, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 64, annualCost: 3800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 55, annualCost: 3400, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 58, annualCost: 3400, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 66, annualCost: 4000, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 62, annualCost: 3000, duration: 4 },
    ]
  },
  {
    name: 'كلية الأميرة سمية للتكنولوجيا', nameEn: 'Princess Sumaya University for Technology',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، الجبيهة' },
    website: 'https://www.psut.edu.jo',
    ranking: { national: 18, regional: 82 },
    majors: [
      { name: 'هندسة الحاسوب', nameEn: 'Computer Engineering', field: 'engineering-tech', minMark: 85, annualCost: 6500, duration: 5 },
      { name: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', field: 'engineering-tech', minMark: 85, annualCost: 6500, duration: 5 },
      { name: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', field: 'engineering-tech', minMark: 85, annualCost: 6500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 85, annualCost: 6000, duration: 4 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 85, annualCost: 6000, duration: 4 },
      { name: 'نظم المعلومات الحاسوبية', nameEn: 'Computer Information Systems', field: 'engineering-tech', minMark: 82, annualCost: 5500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 75, annualCost: 5000, duration: 4 },
      { name: 'تطوير الويب', nameEn: 'Web Development', field: 'voc-it', minMark: 68, annualCost: 4500, duration: 3 },
      { name: 'الذكاء الاصطناعي التطبيقي', nameEn: 'Applied AI', field: 'voc-it', minMark: 72, annualCost: 5000, duration: 3 },
      { name: 'التصميم الرقمي', nameEn: 'Digital Design', field: 'voc-design', minMark: 65, annualCost: 4200, duration: 3 },
    ]
  },
  {
    name: 'جامعة عمان العربية', nameEn: 'Amman Arab University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، شارع الأردن' },
    website: 'https://www.aau.edu.jo',
    ranking: { national: 20, regional: 86 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 62, annualCost: 3500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 55, annualCost: 3000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 58, annualCost: 3000, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 65, annualCost: 3500, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 60, annualCost: 2800, duration: 4 },
    ]
  },
  {
    name: 'جامعة الشرق الأوسط', nameEn: 'Middle East University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، طبربور' },
    website: 'https://www.meu.edu.jo',
    ranking: { national: 21, regional: 88 },
    majors: [
      { name: 'الصيدلة', nameEn: 'Pharmacy', field: 'health', minMark: 72, annualCost: 5200, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 62, annualCost: 3500, duration: 4 },
      { name: 'هندسة البرمجيات', nameEn: 'Software Engineering', field: 'engineering-tech', minMark: 64, annualCost: 3800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 52, annualCost: 3000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 55, annualCost: 3000, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 64, annualCost: 3500, duration: 4 },
      { name: 'الصحافة والإعلام', nameEn: 'Journalism and Media', field: 'languages-humanities', minMark: 60, annualCost: 3200, duration: 4 },
    ]
  },
  {
    name: 'جامعة جرش', nameEn: 'Jerash University',
    type: 'private',
    location: { city: 'جرش', region: 'north', address: 'جرش، جامعة جرش' },
    website: 'https://www.jpu.edu.jo',
    ranking: { national: 22, regional: 90 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 60, annualCost: 3200, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 52, annualCost: 2800, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 55, annualCost: 2800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 64, annualCost: 3200, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 58, annualCost: 2600, duration: 4 },
      { name: 'التمريض', nameEn: 'Nursing', field: 'health', minMark: 62, annualCost: 3500, duration: 4 },
    ]
  },
  {
    name: 'جامعة فيلادلفيا', nameEn: 'Philadelphia University',
    type: 'private',
    location: { city: 'عمان', region: 'center', address: 'عمان، فيلادلفيا' },
    website: 'https://www.philadelphia.edu.jo',
    ranking: { national: 23, regional: 92 },
    majors: [
      { name: 'هندسة العمارة', nameEn: 'Architecture', field: 'engineering-tech', minMark: 70, annualCost: 5000, duration: 5 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 68, annualCost: 4500, duration: 5 },
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 62, annualCost: 3500, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 55, annualCost: 3000, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 58, annualCost: 3000, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 66, annualCost: 3800, duration: 4 },
      { name: 'الصحافة والإعلام', nameEn: 'Journalism and Media', field: 'languages-humanities', minMark: 62, annualCost: 3500, duration: 4 },
      { name: 'التصميم الجرافيكي', nameEn: 'Graphic Design', field: 'languages-humanities', minMark: 55, annualCost: 3200, duration: 4 },
    ]
  },
  {
    name: 'جامعة إربد الأهلية', nameEn: 'Irbid National University',
    type: 'private',
    location: { city: 'اربد', region: 'north', address: 'اربد، جامعة إربد الأهلية' },
    website: 'https://www.inu.edu.jo',
    ranking: { national: 24, regional: 93 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 58, annualCost: 3000, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 50, annualCost: 2500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 52, annualCost: 2500, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 55, annualCost: 2200, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 60, annualCost: 2800, duration: 4 },
    ]
  },
  {
    name: 'جامعة جدارا', nameEn: 'Jadara University',
    type: 'private',
    location: { city: 'اربد', region: 'north', address: 'اربد، جامعة جدارا' },
    website: 'https://www.jadara.edu.jo',
    ranking: { national: 25, regional: 94 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 60, annualCost: 3200, duration: 4 },
      { name: 'الهندسة المدنية', nameEn: 'Civil Engineering', field: 'engineering-tech', minMark: 64, annualCost: 3800, duration: 5 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 50, annualCost: 2800, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 52, annualCost: 2800, duration: 4 },
      { name: 'القانون', nameEn: 'Law', field: 'languages-humanities', minMark: 62, annualCost: 3200, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 56, annualCost: 2600, duration: 4 },
    ]
  },
  {
    name: 'الجامعة الأمريكية في مادبا', nameEn: 'American University of Madaba',
    type: 'private',
    location: { city: 'مادبا', region: 'center', address: 'مادبا، الجامعة الأمريكية' },
    website: 'https://www.aum.edu.jo',
    ranking: { national: 26, regional: 95 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 70, annualCost: 5000, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 65, annualCost: 4500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 66, annualCost: 4500, duration: 4 },
      { name: 'اللغة الإنجليزية', nameEn: 'English Language', field: 'languages-humanities', minMark: 68, annualCost: 4000, duration: 4 },
      { name: 'العلوم المالية والمصرفية', nameEn: 'Finance and Banking', field: 'business', minMark: 64, annualCost: 4500, duration: 4 },
    ]
  },
  {
    name: 'جامعة عجلون الوطنية', nameEn: 'Ajloun National University',
    type: 'private',
    location: { city: 'عجلون', region: 'north', address: 'عجلون، جامعة عجلون' },
    website: 'https://www.anu.edu.jo',
    ranking: { national: 27, regional: 96 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 55, annualCost: 2800, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 48, annualCost: 2400, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 50, annualCost: 2400, duration: 4 },
      { name: 'اللغة العربية', nameEn: 'Arabic Language', field: 'languages-humanities', minMark: 52, annualCost: 2000, duration: 4 },
    ]
  },
  {
    name: 'جامعة العقبة للتكنولوجيا', nameEn: 'Aqaba University of Technology',
    type: 'private',
    location: { city: 'العقبة', region: 'south', address: 'العقبة، جامعة العقبة للتكنولوجيا' },
    website: 'https://www.atu.edu.jo',
    ranking: { national: 28, regional: 98 },
    majors: [
      { name: 'علم الحاسوب', nameEn: 'Computer Science', field: 'engineering-tech', minMark: 55, annualCost: 3000, duration: 4 },
      { name: 'إدارة الأعمال', nameEn: 'Business Administration', field: 'business', minMark: 48, annualCost: 2500, duration: 4 },
      { name: 'المحاسبة', nameEn: 'Accounting', field: 'business', minMark: 50, annualCost: 2500, duration: 4 },
      { name: 'السياحة والضيافة', nameEn: 'Tourism and Hospitality', field: 'languages-humanities', minMark: 48, annualCost: 2200, duration: 4 },
    ]
  },
];

try {
  await University.insertMany(universities);
  console.log(`Seeded ${universities.length} universities`);
} catch (err) {
  console.error('Seed error:', err.message);
  process.exit(1);
}

await mongoose.disconnect();
console.log('Done');
