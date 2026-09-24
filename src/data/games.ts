import { GameMetadata } from '../types';

export const GAME_REGISTRY: GameMetadata[] = [
  {
    id: 'G01',
    name: 'Flashcard Thuật ngữ',
    description: 'Lật thẻ ghi nhớ nhanh các khái niệm, định nghĩa và kí hiệu khoa học then chốt.',
    targetCompetency: 'Nhận biết thuật ngữ & Bản chất khoa học',
    iconName: 'BookOpen'
  },
  {
    id: 'G02',
    name: 'Ghép cặp Thông minh',
    description: 'Nối hai cột tương ứng: Cơ quan ↔ Chức năng, Hoá chất ↔ Hiện tượng, Đại lượng ↔ Đơn vị.',
    targetCompetency: 'Liên hệ cấu trúc và chức năng sinh lí, hoá lí',
    iconName: 'Link'
  },
  {
    id: 'G03',
    name: 'Phân loại Khoa học',
    description: 'Kéo thả các chất và hiện tượng vào đúng nhóm: Biến đổi lí/hoá, Oxide acid/base, Đòn bẩy 1/2/3.',
    targetCompetency: 'Năng lực phân loại và tư duy hệ thống',
    iconName: 'Layers'
  },
  {
    id: 'G04',
    name: 'Lắp ráp Công thức',
    description: 'Sắp xếp các mảnh ghép đại lượng để hoàn chỉnh công thức tính n, V, C%, CM, p, D, FA, M.',
    targetCompetency: 'Khắc sâu cấu trúc công thức và các mối liên hệ đại lượng',
    iconName: 'Puzzle'
  },
  {
    id: 'G06',
    name: 'Đổi đơn vị Tốc độ cao',
    description: 'Quy đổi chính xác các đơn vị thể tích, khối lượng, nồng độ, áp suất để tránh bẫy tính toán.',
    targetCompetency: 'Kỹ năng đổi đơn vị đo lường chuẩn SI và thực tế',
    iconName: 'ArrowRightLeft'
  },
  {
    id: 'G08',
    name: 'Tính nhanh Khoa học',
    description: 'Thử thách giải nhanh các bài toán tính số mol, thể tích khí, áp suất và lực đẩy trong 30 giây.',
    targetCompetency: 'Kỹ năng định lượng và thao tác phản xạ số học',
    iconName: 'Zap'
  },
  {
    id: 'G11',
    name: 'Dự đoán Hiện tượng',
    description: 'Dự đoán kết quả thí nghiệm khi thay đổi điều kiện (nhiệt độ, nồng độ, tiếp xúc, áp lực).',
    targetCompetency: 'Tư duy giả thuyết và kiểm chứng khoa học',
    iconName: 'Sparkles'
  },
  {
    id: 'G13',
    name: 'Bắt lỗi sai & Sửa đúng',
    description: 'Đóng vai bác sĩ khoa học bắt các phát biểu sai phổ biến trong bài kiểm tra KHTN 8.',
    targetCompetency: 'Tư duy phản biện và chẩn đoán sai lầm nhận thức',
    iconName: 'AlertTriangle'
  },
  {
    id: 'G16',
    name: 'Đấu trường Tri thức KHTN 8',
    description: 'Vượt qua 10 chặng đua kiến thức tích hợp Hoá học - Vật lí - Sinh học để giành huy hiệu Nhà Bác Học Nhí.',
    targetCompetency: 'Tổng hợp và vận dụng toàn diện chương trình KHTN 8',
    iconName: 'Trophy'
  }
];

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  hint: string;
  domain: string;
  conceptId?: string;
}

export const FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc_1',
    front: 'Biến đổi hoá học khác biến đổi vật lí ở đặc điểm mấu chốt nào?',
    back: 'Biến đổi hoá học CÓ sự tạo thành chất mới (liên kết giữa các nguyên tử thay đổi). Biến đổi vật lí KHÔNG tạo thành chất mới (chất chỉ biến đổi trạng thái, kích thước).',
    hint: 'Hãy nghĩ tới sự sinh ra hoặc không sinh ra chất mới.',
    domain: 'Hóa học',
    conceptId: 'C_HOA_BIEN_DOI_HOA_HOC'
  },
  {
    id: 'fc_2',
    front: '1 mol chất khí ở điều kiện chuẩn (25 °C, 1 bar) chiếm thể tích bao nhiêu?',
    back: '24,79 lít (chuẩn mới theo CT GDPT 2018). Lưu ý không dùng con số cũ 22,4 lít.',
    hint: 'Nhớ mốc 24,79.',
    domain: 'Hóa học',
    conceptId: 'C_HOA_MOL'
  },
  {
    id: 'fc_3',
    front: 'Định luật bảo toàn khối lượng phát biểu như thế nào?',
    back: 'Trong một phản ứng hoá học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng: m_A + m_B = m_C + m_D.',
    hint: 'Khối lượng trước phản ứng bằng khối lượng sau phản ứng.',
    domain: 'Hóa học',
    conceptId: 'C_HOA_BIEN_DOI_HOA_HOC'
  },
  {
    id: 'fc_4',
    front: 'Áp lực là gì? Công thức tính áp suất trên bề mặt?',
    back: 'Áp lực là lực ép có phương vuông góc với mặt bị ép. Áp suất p = F / S (đơn vị: 1 Pa = 1 N/m²).',
    hint: 'Lực chia cho diện tích bị ép.',
    domain: 'Vật lí',
    conceptId: 'C_LY_AP_SUAT_AP_LUC'
  },
  {
    id: 'fc_5',
    front: 'Công thức tính độ lớn của lực đẩy Archimedes?',
    back: 'F_A = d × V (trong đó d là trọng lượng riêng chất lỏng N/m³, V là thể tích phần chìm của vật trong chất lỏng m³).',
    hint: 'Trọng lượng riêng chất lỏng nhân thể tích chiếm chỗ.',
    domain: 'Vật lí',
    conceptId: 'C_LY_LUC_DAY_ARCHIMEDES'
  },
  {
    id: 'fc_6',
    front: 'Kể tên 3 hình thức truyền nhiệt chính và môi trường diễn ra?',
    back: '1. Dẫn nhiệt: chủ yếu trong chất rắn.\n2. Đối lưu: trong chất lỏng và chất khí.\n3. Bức xạ nhiệt: bằng tia nhiệt, truyền được cả trong chân không.',
    hint: 'Rắn, lưu chất và chân không.',
    domain: 'Vật lí',
    conceptId: 'C_LY_NHIET_TRUYEN_NHIET'
  },
  {
    id: 'fc_7',
    front: 'Nhóm máu nào là nhóm máu chuyên cho và nhóm nào chuyên nhận trong hệ ABO?',
    back: 'Nhóm máu O là nhóm "chuyên cho" (hồng cầu không có kháng nguyên A, B).\nNhóm máu AB là nhóm "chuyên nhận" (huyết tương không có kháng thể anti-A, anti-B).',
    hint: 'Nhớ chữ O (0 kháng nguyên) và AB (không kháng thể).',
    domain: 'Sinh học',
    conceptId: 'C_SINH_MAU_TUAN_HOAN'
  },
  {
    id: 'fc_8',
    front: 'Bộ xương người trưởng thành có khoảng bao nhiêu chiếc và chia làm mấy phần?',
    back: 'Khoảng 206 xương, chia làm 3 phần: Xương đầu (sọ mặt, sọ não), Xương thân (cột sống, lồng ngực), Xương chi (tay và chân).',
    hint: 'Hơn 200 chiếc, gồm đầu, thân và chi.',
    domain: 'Sinh học',
    conceptId: 'C_SINH_HE_VAN_DONG'
  }
];

export interface MatchPairGameItem {
  id: string;
  leftTitle: string;
  rightTitle: string;
  category: string;
}

export const MATCH_PAIRS: MatchPairGameItem[] = [
  { id: 'mp_1', leftTitle: 'Acid (HCl, H2SO4)', rightTitle: 'Làm quỳ tím hoá ĐỎ', category: 'Hoá học' },
  { id: 'mp_2', leftTitle: 'Base kiềm (NaOH, KOH)', rightTitle: 'Làm quỳ tím hoá XANH', category: 'Hoá học' },
  { id: 'mp_3', leftTitle: 'Ampe kế', rightTitle: 'Đo cường độ dòng điện (I), mắc nối tiếp', category: 'Vật lí' },
  { id: 'mp_4', leftTitle: 'Vôn kế', rightTitle: 'Đo hiệu điện thế (U), mắc song song', category: 'Vật lí' },
  { id: 'mp_5', leftTitle: 'Hồng cầu', rightTitle: 'Vận chuyển O2 và CO2 khắp cơ thể', category: 'Sinh học' },
  { id: 'mp_6', leftTitle: 'Bạch cầu', rightTitle: 'Bảo vệ cơ thể bằng thực bào & kháng thể', category: 'Sinh học' },
  { id: 'mp_7', leftTitle: 'Tiểu cầu', rightTitle: 'Tham gia cơ chế đông máu cầm máu', category: 'Sinh học' },
  { id: 'mp_8', leftTitle: 'Đòn bẩy loại 2 (xe rùa, kẹp hạt)', rightTitle: 'Tải ở giữa điểm tựa và lực -> Luôn lợi về lực', category: 'Vật lí' }
];

export interface ClassificationGameItem {
  id: string;
  title: string;
  correctCategory: string;
}

export const CLASSIFICATION_ITEMS: ClassificationGameItem[] = [
  { id: 'cl_1', title: 'Hoà tan đường vào nước', correctCategory: 'Biến đổi vật lí' },
  { id: 'cl_2', title: 'Cô cạn nước biển thu muối ăn', correctCategory: 'Biến đổi vật lí' },
  { id: 'cl_3', title: 'Đốt cháy củi bếp toả nhiệt và tro than', correctCategory: 'Biến đổi hoá học' },
  { id: 'cl_4', title: 'Đinh sắt bị gỉ tạo chất màu nâu đỏ', correctCategory: 'Biến đổi hoá học' },
  { id: 'cl_5', title: 'Lên men cơm rượu từ men giống', correctCategory: 'Biến đổi hoá học' },
  { id: 'cl_6', title: 'Đá viên tan chảy thành nước lỏng', correctCategory: 'Biến đổi vật lí' },
  { id: 'cl_7', title: 'Thắng đường thành nước màu caramen đen', correctCategory: 'Biến đổi hoá học' },
  { id: 'cl_8', title: 'Khí gas hóa lỏng trong bình gas', correctCategory: 'Biến đổi vật lí' }
];

export interface ErrorHuntItem {
  id: string;
  statement: string;
  isCorrect: boolean;
  correction: string;
  category: string;
}

export const ERROR_HUNT_ITEMS: ErrorHuntItem[] = [
  {
    id: 'eh_1',
    statement: 'Dòng điện trong kim loại là dòng chuyển dời có hướng của các hạt mang điện tích dương.',
    isCorrect: false,
    correction: 'Sai! Trong kim loại, dòng điện là dòng chuyển dời có hướng của các ELECTRON TỰ DO (hạt mang điện tích âm, chuyển dời từ cực âm sang cực dương).',
    category: 'Vật lí'
  },
  {
    id: 'eh_2',
    statement: 'Độ lớn lực đẩy Archimedes phụ thuộc vào độ sâu của vật khi đã nhúng chìm hoàn toàn.',
    isCorrect: false,
    correction: 'Sai! Khi vật đã ngập hoàn toàn, thể tích V chiếm chỗ không đổi nên lực đẩy F_A = d.V không phụ thuộc vào độ sâu.',
    category: 'Vật lí'
  },
  {
    id: 'eh_3',
    statement: 'Máu O là nhóm máu chuyên cho vì hồng cầu không mang kháng nguyên A hay B.',
    isCorrect: true,
    correction: 'Đúng! Hồng cầu nhóm O không có kháng nguyên A và B nên khi truyền vào cơ thể người khác không bị kháng thể người nhận kết dính.',
    category: 'Sinh học'
  },
  {
    id: 'eh_4',
    statement: 'Khi pha loãng dung dịch H2SO4 đặc, ta phải đổ nhanh nước cất vào bình đựng acid đặc.',
    isCorrect: false,
    correction: 'Sai và cực kỳ nguy hiểm! H2SO4 đặc toả nhiệt dữ dội. Phải rót TỪ TỪ ACID ĐẶC VÀO NƯỚC và khuấy nhẹ bằng đũa thuỷ tinh, tuyệt đối không làm ngược lại.',
    category: 'Hoá học'
  },
  {
    id: 'eh_5',
    statement: 'Ở người bình thường, huyết áp tâm thu tối đa từ 90 đến dưới 140 mmHg là chỉ số an toàn.',
    isCorrect: true,
    correction: 'Đúng! Theo chuẩn WHO và SGK KNTT tr. 140, huyết áp tối đa an toàn từ 90 đến dưới 140 mmHg, huyết áp tối thiểu từ 60 đến dưới 90 mmHg.',
    category: 'Sinh học'
  }
];
