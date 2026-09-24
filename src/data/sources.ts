import { SourceRecord } from '../types';

export const SOURCES: SourceRecord[] = [
  {
    sourceId: 'SRC_KNTT_SGK',
    sourceType: 'SGK',
    curriculum: 'KNTT',
    title: 'Khoa học tự nhiên 8 - Sách giáo khoa (Kết nối tri thức với cuộc sống)',
    fileOrUrl: 'KHTN 8 KNTT SGK (NXB Giáo dục Việt Nam)',
    location: 'Chương I - VIII, Bài 1 - Bài 47',
    status: 'VERIFIED',
    notes: 'Vũ Văn Hùng (Tổng Chủ biên), Mai Văn Hưng, Lê Kim Long, Vũ Trọng Rỹ (đồng Chủ biên)'
  },
  {
    sourceId: 'SRC_KNTT_SGV',
    sourceType: 'SGV',
    curriculum: 'KNTT',
    title: 'Khoa học tự nhiên 8 - Sách giáo viên (Kết nối tri thức với cuộc sống)',
    fileOrUrl: 'KHTN 8 KNTT SGV (NXB Giáo dục Việt Nam)',
    location: 'Hướng dẫn dạy học các bài cụ thể 1 - 47',
    status: 'VERIFIED',
    notes: 'Cung cấp mục tiêu, phương pháp sư phạm, gợi ý câu trả lời và bảng biểu thực hành'
  },
  {
    sourceId: 'SRC_KNTT_SBT',
    sourceType: 'SBT',
    curriculum: 'KNTT',
    title: 'Bài tập Khoa học tự nhiên 8 (Kết nối tri thức với cuộc sống)',
    fileOrUrl: 'KHTN 8 KNTT SBT (NXB Giáo dục Việt Nam)',
    location: 'Bài tập 2.1 - 47.10 và Hướng dẫn giải',
    status: 'VERIFIED',
    notes: 'Hệ thống câu hỏi trắc nghiệm, bài tập định lượng và lời giải chi tiết'
  },
  {
    sourceId: 'SRC_CD_SGV',
    sourceType: 'SGV',
    curriculum: 'CD',
    title: 'Khoa học tự nhiên 8 - Sách giáo viên (Cánh Diều)',
    fileOrUrl: 'KHTN 8 CD SGV (NXB Đại học Sư phạm)',
    location: 'Chủ đề 1 - 9, Bài mở đầu đến Bài 43',
    status: 'VERIFIED',
    notes: 'Đinh Quang Báo, Nguyễn Văn Khánh, Đặng Thị Oanh (đồng Chủ biên)'
  },
  {
    sourceId: 'SRC_CD_SBT',
    sourceType: 'SBT',
    curriculum: 'CD',
    title: 'Bài tập Khoa học tự nhiên 8 (Cánh Diều)',
    fileOrUrl: 'KHTN 8 CD SBT (NXB Đại học Sư phạm)',
    location: 'Đề bài 1 - 43 và Phần đáp án hướng dẫn giải',
    status: 'VERIFIED',
    notes: 'Hệ thống bài tập Cánh Diều tương ứng với cấu trúc 43 bài'
  },
  {
    sourceId: 'SRC_REAL_MOH_VN',
    sourceType: 'REALWORLD_SOURCE',
    curriculum: 'SHARED',
    title: 'Bộ Y Tế Việt Nam & Viện Dinh Dưỡng Quốc Gia (2016, 2022)',
    fileOrUrl: 'Khuyến nghị dinh dưỡng cho người Việt Nam & Hướng dẫn sơ cứu đột quỵ',
    location: 'Tài liệu tích hợp trong SGK KNTT tr. 131, 140',
    status: 'EXTERNAL_VERIFIED',
    notes: 'Nguồn chính thức được SGK dẫn chiếu'
  },
  {
    sourceId: 'SRC_SCENARIO_EXP',
    sourceType: 'SCENARIO',
    curriculum: 'SHARED',
    title: 'Tình huống mô phỏng phòng thí nghiệm KHTN 8',
    fileOrUrl: 'Mô phỏng sư phạm chuẩn quy chuẩn an toàn PTN THCS',
    location: 'Module thí nghiệm & tình huống giáo dục',
    status: 'DERIVED',
    notes: 'Được thiết kế dựa trên các thí nghiệm thực hành trong SGK và SGV'
  }
];
