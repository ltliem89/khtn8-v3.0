/**
 * Knowledge Graph, Quests & Boss Registry - Master Blueprint
 * Implements Section 4 (Knowledge Engine), Section 9 (Game World), Section 10 (Quests), Section 11 (Bosses)
 */

import { KnowledgeNode, Quest, BossBattle, ContentPack, TimedChallenge } from '../types/blueprint';

export const CONTENT_PACKS: ContentPack[] = [
  {
    id: 'KNTT',
    name: 'Kết Nối Tri Thức Với Cuộc Sống',
    publisher: 'Nhà Xuất Bản Giáo Dục Việt Nam',
    description: 'Chương trình chuẩn bám sát SGK & SGV Kết Nối Tri Thức (Ban biên tập GDPT 2018).',
    totalChapters: 8,
    totalLessons: 47,
    verified: true
  },
  {
    id: 'CD',
    name: 'Cánh Diều',
    publisher: 'Nhà Xuất Bản Đại Học Sư Phạm',
    description: 'Bộ sách Cánh Diều với hệ thống bài tập thực hành ứng dụng cao.',
    totalChapters: 7,
    totalLessons: 42,
    verified: true
  },
  {
    id: 'SHARED',
    name: 'Khung Năng Lực Chung (GDPT 2018)',
    publisher: 'Bộ Giáo Dục và Đào Tạo',
    description: 'Tổng hợp các yêu cầu cần đạt chung áp dụng cho mọi bộ sách giáo khoa.',
    totalChapters: 8,
    totalLessons: 47,
    verified: true
  }
];

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // --- KHU A: HÓA HỌC (CHẤT & SỰ BIẾN ĐỔI) ---
  {
    id: 'KN_HOA_01',
    subject: 'KHTN',
    grade: 8,
    domain: 'HOA_HOC',
    book: 'KNTT',
    chapterId: 'C_HOA_01',
    chapterTitle: 'Phản ứng hoá học',
    lessonId: 'L_HOA_02',
    lessonTitle: 'Phản ứng hoá học & Năng lượng',
    title: 'Biến đổi vật lí và Biến đổi hoá học',
    description: 'Phân biệt hiện tượng không tạo chất mới (vật lí) và tạo chất mới với liên kết mới (hoá học).',
    type: 'concept',
    prerequisites: [],
    skills: ['Nhận biết hiện tượng có tạo chất mới', 'Giải thích hiện tượng đời sống (gỉ sắt, cháy than)'],
    formulaIds: [],
    realWorldHook: 'Đinh sắt để ngoài không khí ẩm bị gỉ sét màu nâu đỏ (biến đổi hoá học).',
    practiceIds: ['EX_HOA_01'],
    reviewTags: ['bien_doi_chat', 'dau_hieu_phan_ung'],
    masteryThreshold: 0.7
  },
  {
    id: 'KN_HOA_02',
    subject: 'KHTN',
    grade: 8,
    domain: 'HOA_HOC',
    book: 'KNTT',
    chapterId: 'C_HOA_01',
    chapterTitle: 'Phản ứng hoá học',
    lessonId: 'L_HOA_03',
    lessonTitle: 'Mol và tỉ khối chất khí',
    title: 'Mol và Thể tích mol chất khí chuẩn (24,79 L/mol)',
    description: 'Chuyển đổi số mol n = m/M và thể tích khí ở điều kiện chuẩn 25 °C, 1 bar: V = n * 24,79.',
    type: 'formula',
    prerequisites: ['KN_HOA_01'],
    skills: ['Tính số mol khí', 'Chuyển đổi m, M, n, V', 'So sánh tỉ khối khí'],
    formulaIds: ['F_HOA_MOL_KHOI_LUONG', 'F_HOA_MOL_THE_TICH', 'F_HOA_TI_KHOI'],
    unitIds: ['U_MOL', 'U_LIT'],
    realWorldHook: 'Tại sao khí metan (CH4) bay lên nóc hầm lò còn khí CO2 tích tụ dưới đáy hang động?',
    practiceIds: ['EX_HOA_03'],
    reviewTags: ['mol_khi', '24.79', 'ti_khoi'],
    masteryThreshold: 0.75
  },
  {
    id: 'KN_HOA_03',
    subject: 'KHTN',
    grade: 8,
    domain: 'HOA_HOC',
    book: 'KNTT',
    chapterId: 'C_HOA_01',
    chapterTitle: 'Phản ứng hoá học',
    lessonId: 'L_HOA_04',
    lessonTitle: 'Dung dịch và nồng độ',
    title: 'Nồng độ phần trăm C% và Nồng độ mol CM',
    description: 'Công thức tính C% = (m_ct / m_dd) * 100% và CM = n / V_dd (mol/L).',
    type: 'formula',
    prerequisites: ['KN_HOA_02'],
    skills: ['Tính nồng độ phần trăm dung dịch', 'Tính nồng độ mol', 'Tính khối lượng chất tan cần pha'],
    formulaIds: ['F_HOA_C_PERCENT', 'F_HOA_C_MOL'],
    unitIds: ['U_MOL_LIT', 'U_GAM'],
    realWorldHook: 'Pha chế nước muối sinh lí NaCl 0,9% sát khuẩn trong y tế và đời sống gia đình.',
    practiceIds: ['EX_HOA_04'],
    reviewTags: ['nong_do_dung_dich', 'pha_che_hoa_chat'],
    masteryThreshold: 0.8
  },
  {
    id: 'KN_HOA_04',
    subject: 'KHTN',
    grade: 8,
    domain: 'HOA_HOC',
    book: 'KNTT',
    chapterId: 'C_HOA_01',
    chapterTitle: 'Phản ứng hoá học',
    lessonId: 'L_HOA_05',
    lessonTitle: 'Định luật bảo toàn khối lượng và PTHH',
    title: 'Định luật bảo toàn khối lượng & Cân bằng PTHH',
    description: 'Tổng khối lượng các chất tham gia bằng tổng khối lượng sản phẩm tạo thành: m_A + m_B = m_C + m_D.',
    type: 'rule',
    prerequisites: ['KN_HOA_01'],
    skills: ['Cân bằng phương trình hoá học', 'Tính khối lượng một chất khi biết các chất còn lại'],
    formulaIds: ['F_HOA_BAO_TOAN_KHOI_LUONG'],
    realWorldHook: 'Tại sao thanh sắt khi gỉ lại nặng hơn thanh sắt ban đầu? Do sắt đã kết hợp với oxygen trong không khí.',
    practiceIds: ['EX_HOA_05'],
    reviewTags: ['bao_toan_khoi_luong', 'can_bang_pt'],
    masteryThreshold: 0.75
  },

  // --- KHU B: VẬT LÍ (NĂNG LƯỢNG & CHUYỂN ĐỘNG) ---
  {
    id: 'KN_VAT_01',
    subject: 'KHTN',
    grade: 8,
    domain: 'VAT_LI',
    book: 'KNTT',
    chapterId: 'C_VAT_01',
    chapterTitle: 'Khối lượng riêng và Áp suất',
    lessonId: 'L_VAT_01',
    lessonTitle: 'Khối lượng riêng',
    title: 'Khối lượng riêng D = m / V',
    description: 'Đại lượng đo bằng khối lượng trên một đơn vị thể tích chất đó: D = m / V (kg/m³ hoặc g/cm³).',
    type: 'formula',
    prerequisites: [],
    skills: ['Đo khối lượng riêng vật rắn không thấm nước', 'Đổi đơn vị kg/m³ sang g/cm³'],
    formulaIds: ['F_VAT_KHOI_LUONG_RIENG'],
    unitIds: ['U_KG_M3', 'U_G_CM3'],
    realWorldHook: 'Xác định vàng thật hay vàng giả bằng phương pháp cân khối lượng và đo thể tích ngập nước.',
    practiceIds: ['EX_VAT_01'],
    reviewTags: ['khoi_luong_rieng', 'ty_trong'],
    masteryThreshold: 0.7
  },
  {
    id: 'KN_VAT_02',
    subject: 'KHTN',
    grade: 8,
    domain: 'VAT_LI',
    book: 'KNTT',
    chapterId: 'C_VAT_01',
    chapterTitle: 'Khối lượng riêng và Áp suất',
    lessonId: 'L_VAT_02',
    lessonTitle: 'Tác dụng của áp lực & Áp suất',
    title: 'Áp lực và Áp suất chất rắn p = F / S',
    description: 'Áp suất đo bằng độ lớn áp lực trên một đơn vị diện tích bị ép: p = F / S (Pa hoặc N/m²).',
    type: 'formula',
    prerequisites: ['KN_VAT_01'],
    skills: ['Tính áp suất', 'Giải thích nguyên tắc tăng giảm diện tích tiếp xúc trong thực tiễn'],
    formulaIds: ['F_VAT_AP_SUAT_CHAT_RAN'],
    unitIds: ['U_PASCAL', 'U_MET_VUONG'],
    realWorldHook: 'Lưỡi dao được mài sắc để giảm diện tích tiếp xúc S, làm tăng áp suất cắt ngọt thức ăn.',
    practiceIds: ['EX_VAT_02'],
    reviewTags: ['ap_suat', 'ap_luc', 'pascal'],
    masteryThreshold: 0.75
  },
  {
    id: 'KN_VAT_03',
    subject: 'KHTN',
    grade: 8,
    domain: 'VAT_LI',
    book: 'KNTT',
    chapterId: 'C_VAT_01',
    chapterTitle: 'Khối lượng riêng và Áp suất',
    lessonId: 'L_VAT_04',
    lessonTitle: 'Lực đẩy Archimedes',
    title: 'Lực đẩy Archimedes FA = d * V',
    description: 'Vật nhúng trong chất lỏng chịu lực đẩy hướng thẳng đứng lên trên, có độ lớn bằng trọng lượng khối chất lỏng bị chiếm chỗ.',
    type: 'formula',
    prerequisites: ['KN_VAT_01', 'KN_VAT_02'],
    skills: ['Tính lực đẩy Archimedes', 'Biện luận điều kiện vật chìm, nổi, lơ lửng'],
    formulaIds: ['F_VAT_LUC_DAY_ARCHIMEDES'],
    unitIds: ['U_NEWTON'],
    realWorldHook: 'Tàu chở hàng bằng thép nặng hàng vạn tấn vẫn nổi bồng bềnh trên mặt đại dương nhờ khoang rỗng thể tích lớn.',
    practiceIds: ['EX_VAT_04'],
    reviewTags: ['archimedes', 'luc_day', 'dieu_kien_noi'],
    masteryThreshold: 0.8
  },
  {
    id: 'KN_VAT_04',
    subject: 'KHTN',
    grade: 8,
    domain: 'VAT_LI',
    book: 'KNTT',
    chapterId: 'C_VAT_02',
    chapterTitle: 'Tác dụng làm quay & Đòn bẩy',
    lessonId: 'L_VAT_05',
    lessonTitle: 'Tác dụng làm quay & Đòn bẩy',
    title: 'Tác dụng làm quay của lực & Cân bằng đòn bẩy',
    description: 'Quy tắc đòn bẩy: F1 * d1 = F2 * d2 (hay F1 / F2 = d2 / d1). Khoảng cách từ trục quay đến giá của lực là cánh tay đòn.',
    type: 'rule',
    prerequisites: ['KN_VAT_02'],
    skills: ['Xác định điểm tựa, điểm đặt lực', 'Ứng dụng kéo cắt kim loại, kẹp gắp đá, xe cút kít'],
    formulaIds: ['F_VAT_DON_BAY'],
    realWorldHook: 'Archimedes từng tuyên bố: "Hãy cho tôi một điểm tựa, tôi sẽ nhấc bổng cả Trái Đất!".',
    practiceIds: ['EX_VAT_05'],
    reviewTags: ['don_bay', 'moment_luc', 'diem_tua'],
    masteryThreshold: 0.75
  },

  // --- KHU C: SINH HỌC (CƠ THỂ NGƯỜI & HỆ THỐNG SỐNG) ---
  {
    id: 'KN_SINH_01',
    subject: 'KHTN',
    grade: 8,
    domain: 'SINH_HOC',
    book: 'KNTT',
    chapterId: 'C_SINH_01',
    chapterTitle: 'Sinh học cơ thể người',
    lessonId: 'L_SINH_01',
    lessonTitle: 'Khái quát cơ thể người & Hệ vận động',
    title: 'Hệ vận động: Bộ xương và cơ khớp như hệ thống đòn bẩy',
    description: 'Bộ xương nâng đỡ và bảo vệ cơ thể, cơ co dãn tạo lực kéo xương xoay quanh khớp (điểm tựa sinh học).',
    type: 'concept',
    prerequisites: ['KN_VAT_04'],
    skills: ['Giải thích cấu tạo đòn bẩy ở cánh tay người', 'Biện pháp bảo vệ xương và chống cong vẹo cột sống'],
    formulaIds: [],
    realWorldHook: 'Cẳng tay con người hoạt động như một đòn bẩy loại 3, giúp tăng tốc độ chuyển động bàn tay.',
    practiceIds: ['EX_SINH_01'],
    reviewTags: ['he_van_dong', 'don_bay_sinh_hoc', 'khop_xuong'],
    masteryThreshold: 0.7
  },
  {
    id: 'KN_SINH_02',
    subject: 'KHTN',
    grade: 8,
    domain: 'SINH_HOC',
    book: 'KNTT',
    chapterId: 'C_SINH_01',
    chapterTitle: 'Sinh học cơ thể người',
    lessonId: 'L_SINH_02',
    lessonTitle: 'Máu và Hệ tuần hoàn',
    title: 'Hệ tuần hoàn, Huyết áp & Nguyên tắc truyền máu',
    description: 'Máu gồm huyết tương và các tế bào máu. Tim bơm máu vào động mạch tạo áp lực thành mạch (huyết áp). Nguyên tắc an toàn truyền máu không để ngưng kết hồng cầu.',
    type: 'concept',
    prerequisites: ['KN_VAT_02'],
    skills: ['Sơ đồ truyền máu an toàn O, A, B, AB', 'Giải thích huyết áp tâm thu và tâm trương'],
    formulaIds: [],
    realWorldHook: 'Người nhóm máu O là nhóm cho phổ thông, trong khi người nhóm AB là nhóm nhận phổ thông.',
    practiceIds: ['EX_SINH_02'],
    reviewTags: ['tuan_hoan', 'nhom_mau', 'huyet_ap'],
    masteryThreshold: 0.75
  }
];

export const GAME_QUESTS: Quest[] = [
  // --- MICRO QUESTS (3-5 phút: Phản xạ nhanh 1 trọng tâm) ---
  {
    id: 'Q_MICRO_HOA_01',
    title: 'Tia Chớp Vi Mô: Thể Tích Khí Chuẩn 24,79 L',
    zoneId: 'KHU_A',
    zoneName: 'Khu A: Xưởng Giả Kim & Biến Đổi Hoá Học',
    domain: 'HOA_HOC',
    questType: 'MICRO',
    estimatedMinutes: 4,
    storyContext: 'Một bình phản ứng trong phòng thí nghiệm vừa giải phóng một lượng khí bí ẩn. Hãy xác định ngay thể tích khí!',
    description: 'Nhiệm vụ vi mô kiểm tra phản xạ chuyển đổi số mol khí sang thể tích chuẩn 25 °C, 1 bar.',
    knowledgeTargets: ['KN_HOA_02'],
    prerequisites: [],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Bối cảnh phát hiện khí',
        instruction: 'Nhớ lại con số tiêu chuẩn 24,79 L/mol của chương trình GDPT 2018 (thay cho 22,4 L trước đây).'
      },
      {
        stage: 'PRACTICE',
        title: 'Tính nhanh thể tích khí chuẩn',
        instruction: '0,2 mol khí O2 ở 25 °C, 1 bar có thể tích là bao nhiêu?',
        interactiveQuestion: {
          prompt: 'Thể tích của 0,2 mol khí Oxygen ở 25 °C và 1 bar là:',
          options: ['4,48 lít', '4,958 lít', '2,479 lít', '5,6 lít'],
          correctAnswer: 1,
          explanation: 'V = n * 24,79 = 0,2 * 24,79 = 4,958 lít.',
          knowledgeId: 'KN_HOA_02'
        }
      }
    ],
    completion: {
      masteryRequired: 0.7
    },
    reward: {
      xp: 60,
      badgeTitle: 'Tia Chớp Khí Chuẩn'
    }
  },
  {
    id: 'Q_MICRO_VAT_01',
    title: 'Phản Xạ Cơ Học: Mũi Đinh & Lưỡi Dao Sắc',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    questType: 'MICRO',
    estimatedMinutes: 4,
    storyContext: 'Người thợ rèn đang chế tác thanh kiếm và mũi đinh. Làm sao để đinh đóng ngọt và dao thái bén ngót?',
    description: 'Thử thách phản xạ áp dụng công thức áp suất p = F / S trong kỹ thuật chế tạo.',
    knowledgeTargets: ['KN_VAT_02'],
    prerequisites: [],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Nguyên lý tăng giảm áp suất',
        instruction: 'Muốn tăng áp suất p = F / S, ta có thể tăng F hoặc giảm diện tích tiếp xúc S.'
      },
      {
        stage: 'PRACTICE',
        title: 'Giải thích hiện tượng đóng đinh',
        instruction: 'Mũi đinh được mài nhọn nhằm mục đích gì?',
        interactiveQuestion: {
          prompt: 'Mũi đinh được mài nhọn nhằm mục đích chính nào sau đây?',
          options: [
            'Làm giảm áp lực tác dụng lên tường gỗ',
            'Làm giảm diện tích bị ép để tăng áp suất, giúp đinh dễ cắm sâu vào gỗ',
            'Làm tăng khối lượng riêng của kim loại',
            'Làm giảm độ đàn hồi của vật liệu'
          ],
          correctAnswer: 1,
          explanation: 'Mũi nhọn có diện tích S rất nhỏ, với cùng lực đóng F sẽ tạo ra áp suất p = F/S cực lớn giúp đinh xuyên sâu dễ dàng.',
          knowledgeId: 'KN_VAT_02'
        }
      }
    ],
    completion: {
      masteryRequired: 0.7
    },
    reward: {
      xp: 60,
      badgeTitle: 'Chiến Binh Mũi Đinh'
    }
  },
  {
    id: 'Q_MICRO_SINH_01',
    title: 'Phản Ứng Cấp Cứu: Truyền Máu An Toàn',
    zoneId: 'KHU_C',
    zoneName: 'Khu C: Vườn Sinh Thái & Cỗ Máy Sinh Học',
    domain: 'SINH_HOC',
    questType: 'MICRO',
    estimatedMinutes: 4,
    storyContext: 'Xe cấp cứu đưa một nạn nhân mất nhiều máu vào viện. Nhóm máu O cấp cứu có đặc tính gì?',
    description: 'Nắm vững nguyên tắc kháng nguyên - kháng thể và sơ đồ truyền máu O, A, B, AB.',
    knowledgeTargets: ['KN_SINH_02'],
    prerequisites: [],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Nguyên tắc an toàn truyền máu',
        instruction: 'Hồng cầu người cho không được bị ngưng kết bởi kháng thể trong huyết tương người nhận.'
      },
      {
        stage: 'PRACTICE',
        title: 'Nhận biết nhóm máu chuyên cho',
        instruction: 'Vì sao nhóm máu O có thể truyền cho tất cả các nhóm máu khác?',
        interactiveQuestion: {
          prompt: 'Trong cấp cứu khẩn cấp, người mang nhóm máu O có thể truyền cho các nhóm máu khác vì:',
          options: [
            'Hồng cầu nhóm máu O không có kháng nguyên A và B',
            'Huyết tương nhóm máu O không có kháng thể alpha và beta',
            'Máu nhóm O có nồng độ chất dinh dưỡng cao nhất',
            'Máu nhóm O có bạch cầu tiêu diệt vi khuẩn nhanh nhất'
          ],
          correctAnswer: 0,
          explanation: 'Hồng cầu nhóm O không mang kháng nguyên A hay B trên bề mặt, do đó không bị kháng thể của người nhận ngưng kết.',
          knowledgeId: 'KN_SINH_02'
        }
      }
    ],
    completion: {
      masteryRequired: 0.7
    },
    reward: {
      xp: 60,
      badgeTitle: 'Bác Sĩ Cấp Cứu O-Hero'
    }
  },

  // --- STANDARD QUESTS (10-15 phút: Vòng lặp 4 chặng đầy đủ) ---
  {
    id: 'Q_HOA_01',
    title: 'Chinh Phục Thế Giới Vi Mô & Thể Tích Khí',
    zoneId: 'KHU_A',
    zoneName: 'Khu A: Xưởng Giả Kim & Biến Đổi Hoá Học',
    domain: 'HOA_HOC',
    questType: 'STANDARD',
    estimatedMinutes: 12,
    storyContext: 'Các nhà giả kim xưa từng bế tắc khi cân đo các chất khí vô hình. Hãy làm chủ công thức của thời đại mới!',
    description: 'Giải mã con số huyền thoại 24,79 L/mol và mối liên hệ giữa số hạt nguyên tử với khối lượng chất.',
    knowledgeTargets: ['KN_HOA_01', 'KN_HOA_02'],
    prerequisites: [],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Khám phá bí mật khí Oxi và CO2',
        instruction: 'Tìm hiểu tại sao 1 mol khí bất kỳ ở 25 °C, 1 bar luôn chiếm đúng 24,79 lít thể tích.'
      },
      {
        stage: 'LEARN',
        title: 'Làm chủ công thức chuyển đổi',
        instruction: 'Nắm vững n = m/M và V = 24,79 * n.',
        formulaId: 'F_HOA_MOL_THE_TICH'
      },
      {
        stage: 'PRACTICE',
        title: 'Luyện tính toán chuyển đổi',
        instruction: 'Tính số mol của 49,58 lít khí Hydrogen ở điều kiện chuẩn.',
        questionId: 'EX_HOA_03',
        interactiveQuestion: {
          prompt: 'Số mol của 49,58 lít khí Hydrogen ở 25 °C, 1 bar là:',
          options: ['1,0 mol', '2,0 mol', '2,2 mol', '0,5 mol'],
          correctAnswer: 1,
          explanation: 'n = V / 24,79 = 49,58 / 24,79 = 2,0 mol.',
          knowledgeId: 'KN_HOA_02'
        }
      },
      {
        stage: 'APPLY',
        title: 'Thử thách tình huống hầm lò than đá',
        instruction: 'Sử dụng tỉ khối để giải thích hiện tượng khí độc tích tụ trong thực tiễn hầm than mỏ Cẩm Phả.'
      }
    ],
    completion: {
      masteryRequired: 0.7
    },
    reward: {
      xp: 120,
      badgeTitle: 'Nhà Thám Hiểm Vi Mô'
    }
  },
  {
    id: 'Q_HOA_02',
    title: 'Bí Thuật Pha Chế Dung Dịch Chuẩn Y Tế',
    zoneId: 'KHU_A',
    zoneName: 'Khu A: Xưởng Giả Kim & Biến Đổi Hoá Học',
    domain: 'HOA_HOC',
    questType: 'STANDARD',
    estimatedMinutes: 14,
    storyContext: 'Phòng y tế trường học cần 500g dung dịch sát khuẩn NaCl 0,9% và dung dịch CuSO4 diệt nấm thực vật.',
    description: 'Thực hành tính toán C% và CM để pha chế dung dịch nước muối sinh lí NaCl 0,9% và dung dịch CuSO4.',
    knowledgeTargets: ['KN_HOA_03', 'KN_HOA_04'],
    prerequisites: ['Q_HOA_01'],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Khám phá độ tan và nước biển',
        instruction: 'Hiểu bản chất của chất tan, dung môi và nồng độ bão hoà.'
      },
      {
        stage: 'LEARN',
        title: 'Hai đại lượng nồng độ cốt lõi',
        instruction: 'Khắc sâu C% = (m_ct / m_dd) * 100% và CM = n / V.',
        formulaId: 'F_HOA_C_PERCENT'
      },
      {
        stage: 'PRACTICE',
        title: 'Bài tập pha chế muối ăn y tế',
        instruction: 'Cần bao nhiêu gam muối NaCl để pha 500g nước muối sinh lí 0,9%?',
        questionId: 'EX_HOA_04',
        interactiveQuestion: {
          prompt: 'Khối lượng muối NaCl cần lấy để pha 500 g nước muối sinh lý 0,9% là:',
          options: ['4,5 g', '45 g', '0,45 g', '9,0 g'],
          correctAnswer: 0,
          explanation: 'm_ct = (C% * m_dd) / 100% = (0,9 * 500) / 100 = 4,5 g NaCl.',
          knowledgeId: 'KN_HOA_03'
        }
      },
      {
        stage: 'APPLY',
        title: 'Kiểm chứng bảo toàn khối lượng',
        instruction: 'Chứng minh khối lượng bình kín không đổi sau phản ứng kết tủa BaSO4.'
      }
    ],
    completion: {
      masteryRequired: 0.75
    },
    reward: {
      xp: 150,
      badgeTitle: 'Kỹ Sư Pha Chế Dung Dịch'
    }
  },
  {
    id: 'Q_VAT_01',
    title: 'Đế Chế Áp Lực & Tác Động Cơ Học',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    questType: 'STANDARD',
    estimatedMinutes: 12,
    storyContext: 'Các kỹ sư xây dựng móng cầu đường vượt sông đang phải giải bài toán chống sụt lún công trình.',
    description: 'Tìm hiểu tại sao mũi kim lại nhọn, bản xích xe tăng lại rộng và công thức p = F / S.',
    knowledgeTargets: ['KN_VAT_01', 'KN_VAT_02'],
    prerequisites: [],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Quan sát dấu chân trên bùn lầy',
        instruction: 'Cùng một người, tại sao đứng một chân lại lún sâu hơn đứng hai chân?'
      },
      {
        stage: 'LEARN',
        title: 'Phương trình áp suất chất rắn',
        instruction: 'Nắm chắc p = F / S, đơn vị Pascal (1 Pa = 1 N/m²).',
        formulaId: 'F_VAT_AP_SUAT_CHAT_RAN'
      },
      {
        stage: 'PRACTICE',
        title: 'Tính toán áp lực xe ben',
        instruction: 'Tính áp suất của khối kim loại đặt trên mặt sàn nằm ngang.',
        questionId: 'EX_VAT_02',
        interactiveQuestion: {
          prompt: 'Một vật có trọng lượng 120 N đặt lên mặt sàn, diện tích tiếp xúc 0,02 m². Áp suất tác dụng lên mặt sàn là:',
          options: ['6 000 Pa', '2 400 Pa', '600 Pa', '12 000 Pa'],
          correctAnswer: 0,
          explanation: 'p = F / S = 120 / 0,02 = 6 000 Pa.',
          knowledgeId: 'KN_VAT_02'
        }
      },
      {
        stage: 'APPLY',
        title: 'Thiết kế móng nhà kiên cố',
        instruction: 'Ứng dụng tăng diện tích đáy móng để chống sụt lún công trình xây dựng.'
      }
    ],
    completion: {
      masteryRequired: 0.7
    },
    reward: {
      xp: 130,
      badgeTitle: 'Bậc Thầy Áp Lực'
    }
  },
  {
    id: 'Q_VAT_02',
    title: 'Chinh Phục Đại Dương Cùng Archimedes',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    questType: 'STANDARD',
    estimatedMinutes: 15,
    storyContext: 'Chiếc tàu ngầm mini của viện hải dương học đang chuẩn bị lặn xuống rãnh biển sâu khảo sát san hô.',
    description: 'Làm chủ lực đẩy Archimedes FA = d * V và đòn bẩy vạn năng F1.d1 = F2.d2.',
    knowledgeTargets: ['KN_VAT_03', 'KN_VAT_04'],
    prerequisites: ['Q_VAT_01'],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Truyền thuyết vương miện của nhà vua Hiero',
        instruction: 'Khám phá phát hiện vĩ đại trong bồn tắm của nhà bác học Hy Lạp Archimedes.'
      },
      {
        stage: 'LEARN',
        title: 'Định luật lực đẩy chất lỏng',
        instruction: 'FA = d * V và điều kiện nổi của tàu thuyền vỏ thép.',
        formulaId: 'F_VAT_LUC_DAY_ARCHIMEDES'
      },
      {
        stage: 'PRACTICE',
        title: 'Tính lực đẩy tác dụng lên sỏi chìm',
        instruction: 'Tính lực đẩy Archimedes lên thỏi nhôm thể tích 500 cm³ chìm trong nước.',
        questionId: 'EX_VAT_04',
        interactiveQuestion: {
          prompt: 'Thỏi nhôm thể tích 500 cm³ (0,0005 m³) nhúng chìm hoàn toàn trong nước (d = 10 000 N/m³). Lực đẩy Archimedes tác dụng lên thỏi nhôm là:',
          options: ['5 N', '50 N', '0,5 N', '5 000 N'],
          correctAnswer: 0,
          explanation: 'FA = d * V = 10 000 * 0,0005 = 5 N.',
          knowledgeId: 'KN_VAT_03'
        }
      },
      {
        stage: 'APPLY',
        title: 'Vận dụng đòn bẩy nhấc bổng tảng đá',
        instruction: 'Tính lực cần tác dụng khi sử dụng đòn bẩy nâng vật nặng 1200 N.'
      }
    ],
    completion: {
      masteryRequired: 0.75
    },
    reward: {
      xp: 160,
      badgeTitle: 'Hậu Duệ Archimedes'
    }
  },
  {
    id: 'Q_SINH_01',
    title: 'Giải Mã Cỗ Máy Cơ Thể Người & Hệ Tuần Hoàn',
    zoneId: 'KHU_C',
    zoneName: 'Khu C: Vườn Sinh Thái & Cỗ Máy Sinh Học',
    domain: 'SINH_HOC',
    questType: 'STANDARD',
    estimatedMinutes: 14,
    storyContext: 'Các bác sĩ tim mạch cần phân tích mối tương quan giữa sức bơm của cơ tim và huyết áp trong động mạch.',
    description: 'Kết nối đòn bẩy cơ xương với dòng chảy tuần hoàn máu và huyết áp trong tim mạch.',
    knowledgeTargets: ['KN_SINH_01', 'KN_SINH_02'],
    prerequisites: ['Q_VAT_02'],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Khám phá đòn bẩy trong cơ thể',
        instruction: 'Tìm hiểu tại sao khớp khuỷu tay hoạt động như một đòn bẩy cơ học.'
      },
      {
        stage: 'LEARN',
        title: 'Trái tim và áp lực mạch máu',
        instruction: 'Nắm vững chỉ số huyết áp tâm thu/tâm trương và sơ đồ nhóm máu an toàn.'
      },
      {
        stage: 'PRACTICE',
        title: 'Xác định nhóm máu cấp cứu',
        instruction: 'Bệnh nhân nhóm máu B cần truyền máu khẩn cấp, có thể nhận nhóm máu nào?',
        questionId: 'EX_SINH_02',
        interactiveQuestion: {
          prompt: 'Bệnh nhân có nhóm máu B cần truyền máu gấp trong cấp cứu. Nhóm máu nào có thể truyền an toàn (với lượng nhỏ)?',
          options: ['Nhóm B và nhóm O', 'Chỉ duy nhất nhóm A', 'Nhóm AB và nhóm A', 'Bất kỳ nhóm máu nào'],
          correctAnswer: 0,
          explanation: 'Nhóm B có thể nhận máu cùng nhóm B hoặc nhóm chuyên cho O (do hồng cầu O không có kháng nguyên A, B).',
          knowledgeId: 'KN_SINH_02'
        }
      },
      {
        stage: 'APPLY',
        title: 'Quy tắc vàng sơ cứu chảy máu tĩnh mạch',
        instruction: 'Thao tác băng ép và nâng cao chi khi gặp vết thương chảy máu.'
      }
    ],
    completion: {
      masteryRequired: 0.75
    },
    reward: {
      xp: 150,
      badgeTitle: 'Chiến Binh Sinh Mệnh'
    }
  },

  // --- EPIC QUESTS / STEM MISSIONS (20-30 phút: Thách thức liên môn kỹ thuật thực tế) ---
  {
    id: 'Q_EPIC_STEM_01',
    title: 'Sứ Mạng Kỹ Thuật: Máy Nâng Thủy Lực Siêu Trọng',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    questType: 'EPIC',
    estimatedMinutes: 22,
    storyContext: 'Tại xưởng đóng tàu Hải Phòng, cần chế tạo máy nâng thủy lực theo nguyên lý Pascal để nâng khối động cơ tàu thủy 15 tấn.',
    description: 'Vận dụng nguyên lý Pascal F/f = S/s và bảo toàn áp suất chất lỏng để thiết kế tỷ lệ pít-tông tối ưu.',
    knowledgeTargets: ['KN_VAT_02', 'KN_VAT_03', 'KN_VAT_04'],
    prerequisites: ['Q_VAT_02'],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Nghiên cứu nguyên lý truyền áp suất Pascal',
        instruction: 'Áp suất tác dụng lên chất lỏng kín được truyền nguyên vẹn theo mọi hướng.'
      },
      {
        stage: 'LEARN',
        title: 'Phương trình cân bằng lực pít-tông',
        instruction: 'Thiết lập công thức F / f = S / s. Pít-tông lớn gấp 100 lần pít-tông nhỏ thì lực nâng được khuếch đại gấp 100 lần.'
      },
      {
        stage: 'PRACTICE',
        title: 'Tính toán lực kích tay',
        instruction: 'Tính lực kích f cần thiết trên pít-tông nhỏ để nâng xe ô tô 2 tấn trên pít-tông lớn.',
        interactiveQuestion: {
          prompt: 'Một máy nén thủy lực có pít-tông lớn diện tích gấp 50 lần pít-tông nhỏ. Để nâng ô tô có trọng lượng 15 000 N, cần tác dụng lên pít-tông nhỏ một lực tối thiểu là:',
          options: ['300 N', '150 N', '750 N', '3 000 N'],
          correctAnswer: 0,
          explanation: 'Theo nguyên lý Pascal: F / f = S / s => f = F * (s / S) = 15 000 / 50 = 300 N. Một người bình thường hoàn toàn có thể dùng tay kích nâng được chiếc xe!',
          knowledgeId: 'KN_VAT_02'
        }
      },
      {
        stage: 'APPLY',
        title: 'Hồ sơ thử nghiệm kỹ thuật',
        instruction: 'Đánh giá độ an toàn van xả áp và chọn dầu truyền động chống nén ép.'
      }
    ],
    completion: {
      masteryRequired: 0.8
    },
    reward: {
      xp: 220,
      badgeTitle: 'Kỹ Sư Thủy Lực Pascal'
    }
  },
  {
    id: 'Q_FINAL_01',
    title: 'Đại Thử Thách Liên Môn STEM 8 Hoàng Gia',
    zoneId: 'FINAL_AREA',
    zoneName: 'Đấu Trường KHTN Hoàng Gia (Final Arena)',
    domain: 'CHUNG',
    questType: 'EPIC',
    estimatedMinutes: 28,
    storyContext: 'Đội cứu hộ biển đảo miền Trung trong bão lũ cần triển khai hệ thống phao tự phồng sinh khí và lọc nước nhiễm mặn.',
    description: 'Tổng hợp sức mạnh Hóa - Lí - Sinh để giải quyết vấn đề thiết kế thiết bị cứu sinh và lọc nước nhiễm mặn.',
    knowledgeTargets: ['KN_HOA_02', 'KN_HOA_03', 'KN_VAT_03', 'KN_SINH_02'],
    prerequisites: ['Q_HOA_02', 'Q_VAT_02', 'Q_SINH_01'],
    stages: [
      {
        stage: 'DISCOVER',
        title: 'Vấn đề thực tiễn: Cứu hộ biển bão lũ',
        instruction: 'Thiết kế phao tự phồng sinh khí CO2 từ phản ứng hóa học acid - carbonate.'
      },
      {
        stage: 'LEARN',
        title: 'Liên kết đa ngành',
        instruction: 'Tính thể tích khí sinh ra theo 24,79 L/mol, lực đẩy Archimedes FA và nồng độ chất hòa tan.'
      },
      {
        stage: 'PRACTICE',
        title: 'Tính thể tích phao cần thiết',
        instruction: 'Tính thể tích phao để giữ người 60 kg nổi an toàn trên mặt biển.',
        interactiveQuestion: {
          prompt: 'Để giữ một người nặng 60 kg nổi an toàn trên biển (nước biển d = 10 300 N/m³), thể tích phao tối thiểu chìm trong nước phải là bao nhiêu (g = 10 m/s²)?',
          options: ['Khoảng 0,058 m³ (58 lít)', 'Khoảng 0,12 m³', 'Khoảng 0,02 m³', 'Khoảng 0,25 m³'],
          correctAnswer: 0,
          explanation: 'FA >= P => d * V >= m * g => V >= (60 * 10) / 10 300 ≈ 0,058 m³ = 58 lít.',
          knowledgeId: 'KN_VAT_03'
        }
      },
      {
        stage: 'APPLY',
        title: 'Hoàn thiện hồ sơ kỹ thuật STEM',
        instruction: 'Vận dụng toàn diện kiến thức để hoàn thành thử thách tối thượng.'
      }
    ],
    completion: {
      masteryRequired: 0.85
    },
    reward: {
      xp: 300,
      badgeTitle: 'Học Giả Toàn Năng KHTN 8'
    }
  }
];

export const BOSS_BATTLES: BossBattle[] = [
  {
    id: 'BOSS_KHU_A',
    name: 'Chúa Tể Phản Ứng Lomonosov',
    title: 'Hộ Vệ Tối Cao Của Bảo Toàn Khối Lượng',
    zoneId: 'KHU_A',
    zoneName: 'Khu A: Xưởng Giả Kim & Biến Đổi Hoá Học',
    domain: 'HOA_HOC',
    description: 'Chúa tể kiểm soát mọi phản ứng hóa học và tỷ lệ số mol chất khí. Vượt qua 5 tầng chiến thuật chuẩn blueprint để đánh bại hắn!',
    requiredMasteryScore: 60,
    requiredQuestIds: ['Q_HOA_01'],
    totalHp: 500,
    avatarIcon: 'Flame',
    accentColor: 'from-amber-600 to-rose-700',
    rewardXP: 250,
    rewardBadge: 'Kẻ Hạ Gục Chúa Tể Phản Ứng',
    rounds: [
      {
        roundNumber: 1,
        title: 'Vòng 1: Nhận Biết Hiện Tượng',
        stageType: 'KNOWLEDGE_CHECK',
        difficulty: 'L1',
        difficultyLabel: 'Nhận biết',
        question: 'Dấu hiệu nào sau đây chứng tỏ đã xảy ra phản ứng hoá học?',
        options: [
          'Nước lỏng bay hơi thành hơi nước',
          'Sắt bị nam châm hút',
          'Có chất mới tạo thành kèm theo sự toả nhiệt hoặc đổi màu',
          'Muối ăn hoà tan hoàn toàn vào nước lỏng'
        ],
        correctAnswer: 2,
        explanation: 'Biến đổi hoá học luôn có sự tạo thành chất mới với liên kết mới.',
        knowledgeId: 'KN_HOA_01',
        damage: 100
      },
      {
        roundNumber: 2,
        title: 'Vòng 2: Thông Hiểu Khí Chuẩn 24,79 L',
        stageType: 'FORMULA_CHECK',
        difficulty: 'L2',
        difficultyLabel: 'Thông hiểu',
        question: 'Ở 25 °C và 1 bar (điều kiện chuẩn GDPT 2018), 0,5 mol khí oxygen (O2) chiếm thể tích bằng bao nhiêu?',
        options: [
          '11,2 lít (chuẩn cũ 0 °C, 1 atm)',
          '12,395 lít',
          '22,4 lít',
          '24,79 lít'
        ],
        correctAnswer: 1,
        explanation: 'Thể tích khí chuẩn: V = n * 24,79 = 0,5 * 24,79 = 12,395 lít.',
        knowledgeId: 'KN_HOA_02',
        formulaId: 'F_HOA_MOL_THE_TICH',
        damage: 100
      },
      {
        roundNumber: 3,
        title: 'Vòng 3: Vận Dụng Bảo Toàn Khối Lượng',
        stageType: 'APPLICATION',
        difficulty: 'L3',
        difficultyLabel: 'Vận dụng trực tiếp',
        question: 'Nung 100g đá vôi (CaCO3) thu được 56g vôi sống (CaO) và khí CO2. Khối lượng khí CO2 thoát ra là:',
        options: ['44 g', '56 g', '156 g', '28 g'],
        correctAnswer: 0,
        explanation: 'Theo định luật bảo toàn khối lượng: m_CO2 = m_CaCO3 - m_CaO = 100 - 56 = 44 g.',
        knowledgeId: 'KN_HOA_04',
        formulaId: 'F_HOA_BAO_TOAN_KHOI_LUONG',
        damage: 100
      },
      {
        roundNumber: 4,
        title: 'Vòng 4: Vận Dụng Pha Nồng Độ Dung Dịch',
        stageType: 'TRAP_RESISTANCE',
        difficulty: 'L4',
        difficultyLabel: 'Vận dụng',
        question: 'Hòa tan 20 g NaOH vào 180 g nước. Nồng độ phần trăm (C%) của dung dịch thu được là:',
        options: ['10%', '11,1%', '9%', '20%'],
        correctAnswer: 0,
        explanation: 'Khối lượng dung dịch = m_ct + m_dm = 20 + 180 = 200 g. C% = (20 / 200) * 100% = 10%. Bẫy thường gặp là chia cho 180 g nước thay vì 200 g dung dịch!',
        knowledgeId: 'KN_HOA_03',
        formulaId: 'F_HOA_C_PERCENT',
        damage: 100
      },
      {
        roundNumber: 5,
        title: 'Vòng 5: Đòn Quyết Định Tình Huống Hang Động',
        stageType: 'ULTIMATE_CHALLENGE',
        difficulty: 'L5',
        difficultyLabel: 'Phân tích / Tổng hợp',
        question: 'Tại sao khi đi vào các hang động sâu hoặc đáy giếng hoang, người ta thường thắp ngọn nến hoặc cầm bó đuốc rọi trước?',
        options: [
          'Để xua đuổi dơi và thú hoang',
          'Để kiểm tra nồng độ khí CO2 nặng hơn không khí chìm dưới đáy làm nến tắt vì thiếu oxygen',
          'Để làm nóng không khí trong hang giúp dễ thở hơn',
          'Để khử các vi khuẩn có hại bám trên vách đá'
        ],
        correctAnswer: 1,
        explanation: 'Tỉ khối d(CO2/kk) = 44 / 29 ≈ 1,52 > 1 nên CO2 tích tụ ở đáy giếng/hang. Nếu nến tắt tức là nồng độ oxygen quá thấp, gây nguy hiểm ngạt thở.',
        knowledgeId: 'KN_HOA_02',
        damage: 100
      }
    ]
  },
  {
    id: 'BOSS_KHU_B',
    name: 'Đại Thần Cơ Học Archimedes',
    title: 'Bậc Thầy Của Áp Suất & Lực Đẩy Thủy Tĩnh',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    description: 'Vị đại thần canh giữ bí mật nâng bổng đại dương và điểm tựa Trái Đất!',
    requiredMasteryScore: 65,
    requiredQuestIds: ['Q_VAT_01', 'Q_VAT_02'],
    totalHp: 500,
    avatarIcon: 'Zap',
    accentColor: 'from-sky-600 to-indigo-700',
    rewardXP: 300,
    rewardBadge: 'Kẻ Chinh Phục Đại Thần Archimedes',
    rounds: [
      {
        roundNumber: 1,
        title: 'Vòng 1: Đơn Vị Áp Suất',
        stageType: 'KNOWLEDGE_CHECK',
        difficulty: 'L1',
        difficultyLabel: 'Nhận biết',
        question: 'Đơn vị đo áp suất trong hệ đo lường quốc tế (SI) là gì?',
        options: ['Newton (N)', 'Joule (J)', 'Pascal (Pa hay N/m²)', 'Kilôgam trên mét khối (kg/m³)'],
        correctAnswer: 2,
        explanation: 'Áp suất đo bằng Pascal (1 Pa = 1 N/m²).',
        knowledgeId: 'KN_VAT_02',
        damage: 100
      },
      {
        roundNumber: 2,
        title: 'Vòng 2: Chiều Của Lực Đẩy Ác-si-mét',
        stageType: 'FORMULA_CHECK',
        difficulty: 'L2',
        difficultyLabel: 'Thông hiểu',
        question: 'Lực đẩy Archimedes tác dụng lên một vật nhúng chìm trong chất lỏng có phương và chiều như thế nào?',
        options: [
          'Phương thẳng đứng, chiều từ trên xuống dưới',
          'Phương thẳng đứng, chiều từ dưới lên trên',
          'Phương nằm ngang, chiều cùng chiều dòng chảy',
          'Theo hướng ngẫu nhiên phụ thuộc hình dạng vật'
        ],
        correctAnswer: 1,
        explanation: 'Lực đẩy Archimedes luôn có phương thẳng đứng, chiều từ dưới lên trên.',
        knowledgeId: 'KN_VAT_03',
        damage: 100
      },
      {
        roundNumber: 3,
        title: 'Vòng 3: Tính Toán Áp Suất Bàn Chân',
        stageType: 'APPLICATION',
        difficulty: 'L3',
        difficultyLabel: 'Vận dụng trực tiếp',
        question: 'Một học sinh nặng 50 kg đứng bằng hai chân trên sàn. Diện tích tiếp xúc mỗi bàn chân là 0,015 m². Lấy g = 10 m/s², áp suất tác dụng lên sàn là:',
        options: ['16 667 Pa', '33 333 Pa', '500 Pa', '15 000 Pa'],
        correctAnswer: 0,
        explanation: 'Trọng lượng F = m*g = 50*10 = 500 N. Diện tích 2 chân S = 2 * 0,015 = 0,03 m². Áp suất p = 500 / 0,03 ≈ 16 667 Pa.',
        knowledgeId: 'KN_VAT_02',
        formulaId: 'F_VAT_AP_SUAT_CHAT_RAN',
        damage: 100
      },
      {
        roundNumber: 4,
        title: 'Vòng 4: Tính Độ Lớn Lực Đẩy Nước Biển',
        stageType: 'TRAP_RESISTANCE',
        difficulty: 'L4',
        difficultyLabel: 'Vận dụng',
        question: 'Một phao cứu sinh có thể tích 0,04 m³ chìm hoàn toàn trong nước biển (trọng lượng riêng d = 10 300 N/m³). Lực đẩy Archimedes tác dụng lên phao là:',
        options: ['412 N', '257,5 N', '1 030 N', '41,2 N'],
        correctAnswer: 0,
        explanation: 'FA = d * V = 10 300 * 0,04 = 412 N.',
        knowledgeId: 'KN_VAT_03',
        formulaId: 'F_VAT_LUC_DAY_ARCHIMEDES',
        damage: 100
      },
      {
        roundNumber: 5,
        title: 'Vòng 5: Cân Bằng Đòn Bẩy Archimedes',
        stageType: 'ULTIMATE_CHALLENGE',
        difficulty: 'L5',
        difficultyLabel: 'Phân tích / Tổng hợp',
        question: 'Một đòn bẩy có điểm tựa O. Vật A có trọng lượng 600 N đặt tại điểm O1 cách O 20 cm. Muốn nâng vật A, người ta tác dụng lực F2 vào điểm O2 cách O 60 cm. Độ lớn tối thiểu của lực F2 là:',
        options: ['200 N', '300 N', '1 800 N', '100 N'],
        correctAnswer: 0,
        explanation: 'Theo quy tắc đòn bẩy: F1 * d1 = F2 * d2 => F2 = (F1 * d1) / d2 = (600 * 20) / 60 = 200 N.',
        knowledgeId: 'KN_VAT_04',
        formulaId: 'F_VAT_DON_BAY',
        damage: 100
      }
    ]
  },
  {
    id: 'BOSS_KHU_C',
    name: 'Nữ Thần Sinh Mệnh Gaia',
    title: 'Chúa Tể Cỗ Máy Cơ Thể & Tuần Hoàn Sinh Mệnh',
    zoneId: 'KHU_C',
    zoneName: 'Khu C: Vườn Sinh Thái & Cỗ Máy Sinh Học',
    domain: 'SINH_HOC',
    description: 'Nữ thần nắm giữ sự sống, kiểm soát mạng lưới mạch máu kỳ diệu và cơ chế phối hợp đòn bẩy của cơ bắp.',
    requiredMasteryScore: 65,
    requiredQuestIds: ['Q_SINH_01'],
    totalHp: 500,
    avatarIcon: 'Heart',
    accentColor: 'from-emerald-600 to-teal-700',
    rewardXP: 300,
    rewardBadge: 'Kẻ Chinh Phục Cỗ Máy Sinh Học',
    rounds: [
      {
        roundNumber: 1,
        title: 'Vòng 1: Cấu Trúc Khung Xương Đòn Bẩy',
        stageType: 'KNOWLEDGE_CHECK',
        difficulty: 'L1',
        difficultyLabel: 'Nhận biết',
        question: 'Cơ quan nào trong cơ thể người đóng vai trò là điểm tựa trong các cử động đòn bẩy?',
        options: [
          'Các khớp xương',
          'Bụng cơ bắp',
          'Dây chằng và gân',
          'Tủy xương'
        ],
        correctAnswer: 0,
        explanation: 'Trong hệ vận động, xương đóng vai trò là đòn bẩy, các khớp xương là điểm tựa (O), và sự co cơ tạo lực tác dụng.',
        knowledgeId: 'KN_SINH_01',
        damage: 100
      },
      {
        roundNumber: 2,
        title: 'Vòng 2: Huyết Áp & Áp Lực Mạch',
        stageType: 'FORMULA_CHECK',
        difficulty: 'L2',
        difficultyLabel: 'Thông hiểu',
        question: 'Chỉ số huyết áp 120/80 mmHg ở người trưởng thành khỏe mạnh biểu thị điều gì?',
        options: [
          'Huyết áp tâm thu 120 mmHg (khi tim co) và huyết áp tâm trương 80 mmHg (khi tim giãn)',
          'Huyết áp tâm trương 120 mmHg và huyết áp tâm thu 80 mmHg',
          'Tốc độ dòng máu chảy 120 cm/s và 80 cm/s',
          'Số nhịp tim đập 120 lần/phút khi chạy và 80 lần/phút khi nghỉ'
        ],
        correctAnswer: 0,
        explanation: '120 mmHg là huyết áp tối đa (tâm thu) khi tim co bóp tống máu; 80 mmHg là huyết áp tối thiểu (tâm trương) khi tim giãn nghỉ.',
        knowledgeId: 'KN_SINH_02',
        damage: 100
      },
      {
        roundNumber: 3,
        title: 'Vòng 3: Kháng Nguyên & Nhóm Máu',
        stageType: 'APPLICATION',
        difficulty: 'L3',
        difficultyLabel: 'Vận dụng trực tiếp',
        question: 'Một người bị tai nạn có nhóm máu AB cần truyền máu gấp. Nhóm máu nào có thể truyền cho người này?',
        options: [
          'Chỉ nhận được duy nhất nhóm O',
          'Có thể nhận máu từ cả 4 nhóm A, B, AB, O (với lượng nhỏ nguyên tắc hồng cầu)',
          'Không thể nhận bất kỳ nhóm máu nào khác',
          'Chỉ nhận được nhóm máu A'
        ],
        correctAnswer: 1,
        explanation: 'Người nhóm máu AB huyết tương không có kháng thể alpha và beta, nên là người chuyên nhận, có thể nhận máu từ cả A, B, AB và O.',
        knowledgeId: 'KN_SINH_02',
        damage: 100
      },
      {
        roundNumber: 4,
        title: 'Vòng 4: Bẫy Sơ Cứu Xuất Huyết',
        stageType: 'TRAP_RESISTANCE',
        difficulty: 'L4',
        difficultyLabel: 'Vận dụng',
        question: 'Khi gặp nạn nhân bị đứt động mạch ở cổ tay máu phun thành tia đỏ tươi, thao tác sơ cứu khẩn cấp chính xác nhất là gì?',
        options: [
          'Chườm đá lạnh và xoa dầu gió',
          'Ấn chặt ngón tay vào động mạch cánh tay phía trên vết thương và băng ép garo kịp thời',
          'Băng lỏng gạc sạch để vết thương tự đông',
          'Cho nạn nhân uống nước đường và hạ thấp tay'
        ],
        correctAnswer: 1,
        explanation: 'Máu động mạch áp lực cao phun thành tia, cần ấn chặn ngay động mạch phía gần tim (phía trên vết thương) và garo đúng kỹ thuật để tránh mất máu tử vong.',
        knowledgeId: 'KN_SINH_02',
        damage: 100
      },
      {
        roundNumber: 5,
        title: 'Vòng 5: Đòn Quyết Định Cân Bằng Sinh Học',
        stageType: 'ULTIMATE_CHALLENGE',
        difficulty: 'L5',
        difficultyLabel: 'Phân tích / Tổng hợp',
        question: 'Tại sao người đứng lâu ở một tư thế thường bị phù chân và dễ hạ huyết áp tư thế?',
        options: [
          'Vì cơ tim ngừng đập tạm thời khi đứng yên',
          'Vì thiếu lực co bóp của cơ bắp chân ép vào tĩnh mạch đẩy máu ngược về tim chống lại trọng lực',
          'Vì máu bị dồn hết lên đầu làm vỡ mao mạch não',
          'Do hồng cầu bị vỡ khi đứng'
        ],
        correctAnswer: 1,
        explanation: 'Tĩnh mạch chân có các van một chiều và cần cơ bắp chân co bóp (bơm cơ) để ép máu đẩy ngược lên tim thắng trọng lực. Đứng bất động làm máu ứ đọng tĩnh mạch chi dưới gây phù và tụt huyết áp.',
        knowledgeId: 'KN_SINH_02',
        damage: 100
      }
    ]
  },
  {
    id: 'BOSS_FINAL',
    name: 'Đại Trùm Tri Thức Hoàng Gia KHTN 8',
    title: 'Thực Thể Hợp Nhất Khoa Học Toàn Diện',
    zoneId: 'FINAL_AREA',
    zoneName: 'Đấu Trường KHTN Hoàng Gia (Final Arena)',
    domain: 'CHUNG',
    description: 'Trận đại chiến cuối cùng kết hợp tư duy Hóa học, Vật lí, Sinh học và Tình huống STEM thực tế!',
    requiredMasteryScore: 75,
    requiredQuestIds: ['Q_FINAL_01'],
    totalHp: 600,
    avatarIcon: 'Award',
    accentColor: 'from-amber-500 via-rose-600 to-purple-800',
    rewardXP: 500,
    rewardBadge: 'Đại Kiện Tướng KHTN 8 Toàn Diện',
    rounds: [
      {
        roundNumber: 1,
        title: 'Vòng 1: Kiểm Tra Hệ Thống Sinh Học',
        stageType: 'KNOWLEDGE_CHECK',
        difficulty: 'L2',
        difficultyLabel: 'Thông hiểu',
        question: 'Cẳng tay của con người khi nâng vật nặng hoạt động theo nguyên lý đòn bẩy nào?',
        options: [
          'Đòn bẩy loại 1 (điểm tựa ở giữa lực tác dụng và vật)',
          'Đòn bẩy loại 2 (vật ở giữa điểm tựa và lực)',
          'Đòn bẩy loại 3 (điểm đặt lực của cơ nhị đầu nằm giữa khớp khuỷu tay và bàn tay)',
          'Không hoạt động theo nguyên lý đòn bẩy'
        ],
        correctAnswer: 2,
        explanation: 'Khớp khuỷu tay là điểm tựa O, cơ nhị đầu bám giữa là điểm đặt lực F, bàn tay cầm vật là vật F_vat. Đây là đòn bẩy loại 3 cho lợi về đường đi và tốc độ.',
        knowledgeId: 'KN_SINH_01',
        damage: 120
      },
      {
        roundNumber: 2,
        title: 'Vòng 2: Mạch Tuần Hoàn & Huyết Áp Thủy Tĩnh',
        stageType: 'FORMULA_CHECK',
        difficulty: 'L3',
        difficultyLabel: 'Vận dụng trực tiếp',
        question: 'Tại sao khi đo huyết áp của người bình thường, bác sĩ luôn quấn băng đo ở cánh tay ngang vị trí của tim?',
        options: [
          'Vì cánh tay có nhiều mạch máu nhất cơ thể',
          'Để loại trừ ảnh hưởng của áp suất thủy tĩnh chênh lệch độ cao cột máu so với tim',
          'Vì chỉ ở cánh tay mới sờ thấy nhịp tim đập',
          'Do quy ước thuận tiện thao tác của người đo'
        ],
        correctAnswer: 1,
        explanation: 'Theo nguyên lý bình thông nhau và áp suất chất lỏng p = d * h, nếu đặt cao hơn tim áp suất sẽ đo thấp hơn thực tế, đặt thấp hơn tim áp suất sẽ đo cao hơn thực tế.',
        knowledgeId: 'KN_SINH_02',
        damage: 120
      },
      {
        roundNumber: 3,
        title: 'Vòng 3: Khí Hóa Học Trong Cơ Thể Sống',
        stageType: 'APPLICATION',
        difficulty: 'L4',
        difficultyLabel: 'Vận dụng',
        question: 'Khí CO sinh ra khi đốt than tổ ong trong phòng kín cực kỳ nguy hiểm vì lý do khoa học nào?',
        options: [
          'CO ăn mòn niêm mạc khí quản làm rách phế nang',
          'CO kết hợp chặt chẽ với hemoglobin trong hồng cầu bền gấp 250 lần so với O2, làm cơ thể chết ngạt tế bào',
          'CO làm đông máu ngay trong tâm nhĩ',
          'CO phản ứng với acid dạ dày tạo bọt khí gây vỡ mạch máu'
        ],
        correctAnswer: 1,
        explanation: 'Phân tử CO cạnh tranh gắn kết chặt với Hemoglobin (HbCO), ngăn cản máu vận chuyển Oxygen tới các mô và não bộ gây hôn mê tử vong nhanh chóng.',
        knowledgeId: 'KN_SINH_02',
        damage: 120
      },
      {
        roundNumber: 4,
        title: 'Vòng 4: Tính Toán Liên Môn Sinh - Lí',
        stageType: 'TRAP_RESISTANCE',
        difficulty: 'L5',
        difficultyLabel: 'Phân tích / Tổng hợp',
        question: 'Một người thợ lặn ở độ sâu 15 m dưới biển (khối lượng riêng nước biển D = 1 030 kg/m³, g = 10 m/s², áp suất khí quyển p0 = 10^5 Pa). Áp suất tổng cộng tác dụng lên thợ lặn là:',
        options: [
          '154 500 Pa',
          '254 500 Pa (gấp 2,5 lần áp suất khí quyển mặt đất)',
          '100 000 Pa',
          '354 500 Pa'
        ],
        correctAnswer: 1,
        explanation: 'Áp suất cột nước p_nuoc = D * g * h = 1030 * 10 * 15 = 154 500 Pa. Áp suất tổng cộng p = p0 + p_nuoc = 100 000 + 154 500 = 254 500 Pa.',
        knowledgeId: 'KN_VAT_02',
        formulaId: 'F_VAT_AP_SUAT_CHAT_RAN',
        damage: 120
      },
      {
        roundNumber: 5,
        title: 'Vòng 5: Đỉnh Cao STEM Tình Huống Cứu Hộ Lũ Lụt',
        stageType: 'ULTIMATE_CHALLENGE',
        difficulty: 'L6',
        difficultyLabel: 'Tình huống / STEM',
        question: 'Trong bão lũ, đoàn cứu hộ cần làm bè bằng các thùng phuy rỗng kín (mỗi thùng có thể tích V = 0,2 m³, khối lượng vỏ thùng 15 kg). Để chở an toàn 8 người (mỗi người trung bình 50 kg) nổi trên sông (d_nuoc = 10 000 N/m³), số lượng thùng phuy tối thiểu cần dùng (với hệ số an toàn 1,2) là:',
        options: [
          '3 thùng',
          '4 thùng',
          '6 thùng',
          '2 thùng'
        ],
        correctAnswer: 1,
        explanation: 'Tổng tải trọng P = (8 * 50) * 10 = 4 000 N. Mỗi thùng phuy chịu sức nổi tối đa FA = 10 000 * 0,2 = 2 000 N, trừ trọng lượng vỏ thùng 150 N còn tải hữu ích 1 850 N. Với hệ số an toàn 1,2, tải trọng tính toán = 4 000 * 1,2 = 4 800 N. Số thùng tối thiểu = 4 800 / 1 850 ≈ 2,6 => Cần ít nhất 3 đến 4 thùng để bè vững vàng trên dòng nước chảy xiết.',
        knowledgeId: 'KN_VAT_03',
        formulaId: 'F_VAT_LUC_DAY_ARCHIMEDES',
        damage: 120
      }
    ]
  }
];

export const TIMED_CHALLENGES: TimedChallenge[] = [
  {
    id: 'CHALLENGE_HOA',
    title: 'Thử Thách Tốc Độ: Bão Lửa Hóa Học 60 Giây',
    zoneId: 'KHU_A',
    zoneName: 'Khu A: Xưởng Giả Kim & Biến Đổi Hoá Học',
    domain: 'HOA_HOC',
    description: 'Thử thách phản xạ chuyển đổi mol, thể tích khí chuẩn 24,79 L và nồng độ phần trăm dung dịch.',
    timeLimitSeconds: 60,
    knowledgeTargets: ['KN_HOA_01', 'KN_HOA_02', 'KN_HOA_03', 'KN_HOA_04'],
    requiredMastery: 70,
    rewardXP: 180,
    questions: [
      {
        id: 'CH_H_1',
        question: 'Biến đổi nào sau đây là biến đổi hóa học?',
        options: [
          'Cồn để trong lọ hở miệng bị bay hơi',
          'Dây tóc bóng đèn phát sáng khi có dòng điện',
          'Thanh sắt bị gỉ tạo lớp gỉ màu nâu đỏ ngoài không khí',
          'Hòa tan đường vào cốc nước'
        ],
        correctAnswer: 2,
        explanation: 'Sắt gỉ là phản ứng oxy hóa kim loại tạo hợp chất mới Fe2O3.nH2O.',
        knowledgeId: 'KN_HOA_01',
        trapWarning: 'Cẩn thận nhầm lẫn hiện tượng phát sáng của dây tóc vonfram với phản ứng cháy!'
      },
      {
        id: 'CH_H_2',
        question: '0,4 mol khí CO2 ở 25 °C, 1 bar có thể tích chuẩn là bao nhiêu?',
        options: ['8,96 lít', '9,916 lít', '24,79 lít', '12,395 lít'],
        correctAnswer: 1,
        explanation: 'V = 0,4 * 24,79 = 9,916 lít.',
        knowledgeId: 'KN_HOA_02',
        formulaId: 'F_HOA_MOL_THE_TICH',
        trapWarning: 'Không dùng số 22,4 lít của chuẩn cũ 0 °C, 1 atm!'
      },
      {
        id: 'CH_H_3',
        question: 'Hòa tan 15 g đường vào 135 g nước. Nồng độ C% của dung dịch là:',
        options: ['10%', '11,1%', '15%', '9%'],
        correctAnswer: 0,
        explanation: 'm_dd = 15 + 135 = 150 g. C% = (15 / 150) * 100% = 10%.',
        knowledgeId: 'KN_HOA_03',
        formulaId: 'F_HOA_C_PERCENT',
        trapWarning: 'm_dd = m_ct + m_dm = 15 + 135 = 150 g, đừng chia nhầm cho 135 g nước!'
      },
      {
        id: 'CH_H_4',
        question: 'Khối lượng mol của khí Nitrogen (N2) là bao nhiêu?',
        options: ['14 g/mol', '28 g/mol', '7 g/mol', '24,79 g/mol'],
        correctAnswer: 1,
        explanation: 'Phân tử Nitrogen gồm 2 nguyên tử N, M = 14 * 2 = 28 g/mol.',
        knowledgeId: 'KN_HOA_02',
        trapWarning: 'Đừng quên chỉ số chân 2 trong phân tử đơn chất N2!'
      }
    ]
  },
  {
    id: 'CHALLENGE_VAT',
    title: 'Thử Thách Tốc Độ: Áp Suất & Đòn Bẩy Thủy Tĩnh 60 Giây',
    zoneId: 'KHU_B',
    zoneName: 'Khu B: Thung Lũng Cơ Học & Áp Suất Vật Lí',
    domain: 'VAT_LI',
    description: 'Chống bẫy câu hỏi áp lực tiếp xúc, nguyên lý bình thông nhau và lực đẩy Archimedes.',
    timeLimitSeconds: 60,
    knowledgeTargets: ['KN_VAT_01', 'KN_VAT_02', 'KN_VAT_03', 'KN_VAT_04'],
    requiredMastery: 70,
    rewardXP: 180,
    questions: [
      {
        id: 'CH_V_1',
        question: 'Để tăng áp suất của một vật lên mặt tiếp xúc mà không thay đổi khối lượng vật, ta nên làm gì?',
        options: [
          'Tăng diện tích mặt tiếp xúc',
          'Giảm diện tích mặt tiếp xúc',
          'Nhúng vật vào chậu nước',
          'Bôi trơn dầu mỡ lên bề mặt tiếp xúc'
        ],
        correctAnswer: 1,
        explanation: 'p = F / S, khi F không đổi, giảm diện tích S sẽ làm tăng áp suất p.',
        knowledgeId: 'KN_VAT_02',
        trapWarning: 'Tăng diện tích là nguyên lý của xe tăng làm giảm áp suất để không bị lún!'
      },
      {
        id: 'CH_V_2',
        question: 'Một quả cầu sắt chìm trong nước ở độ sâu 1m và độ sâu 3m. Lực đẩy Archimedes ở 2 vị trí đó như thế nào?',
        options: [
          'Ở độ sâu 3m lớn hơn vì áp suất lớn hơn',
          'Ở độ sâu 1m lớn hơn vì gần mặt nước hơn',
          'Bằng nhau vì FA = d * V không phụ thuộc độ sâu khi vật đã chìm hoàn toàn',
          'Bằng 0 vì quả cầu sắt bị chìm đáy'
        ],
        correctAnswer: 2,
        explanation: 'FA = d * V phụ thuộc trọng lượng riêng của chất lỏng và thể tích chiếm chỗ, không phụ thuộc độ sâu.',
        knowledgeId: 'KN_VAT_03',
        trapWarning: 'Áp suất tăng theo độ sâu, nhưng lực đẩy Archimedes thì KHÔNG đổi khi vật đã ngập hoàn toàn!'
      },
      {
        id: 'CH_V_3',
        question: 'Trong bình thông nhau chứa cùng một chất lỏng đứng yên, mực chất lỏng ở các nhánh có đặc điểm gì?',
        options: [
          'Nhánh to hơn mực nước cao hơn',
          'Ở cùng một độ cao',
          'Nhánh nhỏ hơn mực nước cao hơn',
          'Mực nước phụ thuộc vào hình dạng nghiêng của nhánh'
        ],
        correctAnswer: 1,
        explanation: 'Theo nguyên lý bình thông nhau, mực mặt thoáng ở các nhánh luôn ở cùng một độ cao.',
        knowledgeId: 'KN_VAT_02',
        trapWarning: 'Kích cỡ to nhỏ của nhánh không làm thay đổi chiều cao mặt thoáng!'
      },
      {
        id: 'CH_V_4',
        question: 'Cái bập bênh ở công viên hoạt động theo loại đòn bẩy nào?',
        options: [
          'Đòn bẩy loại 1 (điểm tựa nằm giữa hai lực)',
          'Đòn bẩy loại 2 (vật nằm giữa)',
          'Đòn bẩy loại 3 (lực nằm giữa)',
          'Không phải đòn bẩy'
        ],
        correctAnswer: 0,
        explanation: 'Trục quay ở giữa, hai đầu là lực tác dụng của 2 người chơi -> Đòn bẩy loại 1.',
        knowledgeId: 'KN_VAT_04',
        trapWarning: 'Phân biệt với xe rùa (loại 2) và nhíp gắp (loại 3)!'
      }
    ]
  },
  {
    id: 'CHALLENGE_SINH',
    title: 'Thử Thách Tốc Độ: Cấp Cứu Máu & Hệ Tuần Hoàn 60 Giây',
    zoneId: 'KHU_C',
    zoneName: 'Khu C: Vườn Sinh Thái & Cỗ Máy Sinh Học',
    domain: 'SINH_HOC',
    description: 'Xử lý các tình huống nhóm máu, sơ cứu cầm máu và cơ chế vận động cơ thể.',
    timeLimitSeconds: 60,
    knowledgeTargets: ['KN_SINH_01', 'KN_SINH_02'],
    requiredMastery: 70,
    rewardXP: 180,
    questions: [
      {
        id: 'CH_S_1',
        question: 'Người có nhóm máu A có thể hiến máu an toàn cho người mang nhóm máu nào?',
        options: ['Nhóm A và nhóm AB', 'Nhóm B và nhóm O', 'Chỉ duy nhất nhóm O', 'Bất kỳ ai'],
        correctAnswer: 0,
        explanation: 'Người nhóm máu A có thể cho người cùng nhóm A và người nhận chuyên dụng AB.',
        knowledgeId: 'KN_SINH_02',
        trapWarning: 'Đừng nhầm lẫn giữa người cho (A -> A, AB) và người nhận!'
      },
      {
        id: 'CH_S_2',
        question: 'Vận tốc máu chảy trong mao mạch là chậm nhất nhằm mục đích gì?',
        options: [
          'Để tim không bị mệt mỏi',
          'Để có đủ thời gian thực hiện quá trình trao đổi khí và trao đổi chất với tế bào mô',
          'Vì đường kính mao mạch quá lớn',
          'Để ngăn cản bạch cầu bám vào thành mạch'
        ],
        correctAnswer: 1,
        explanation: 'Tổng tiết diện mao mạch cực lớn làm vận tốc máu chậm (khoảng 0,5 mm/s), tạo điều kiện khuếch tán O2, CO2 và chất dinh dưỡng với tế bào.',
        knowledgeId: 'KN_SINH_02',
        trapWarning: 'Vận tốc chậm nhất ở mao mạch dù đường kính từng mạch rất nhỏ (vì tổng tiết diện tất cả mao mạch là lớn nhất)!'
      },
      {
        id: 'CH_S_3',
        question: 'Khi nâng tạ bằng cẳng tay, loại cơ nào co để kéo xương cẳng tay lên?',
        options: ['Cơ nhị đầu (cơ bắp trước)', 'Cơ tam đầu (cơ bắp sau)', 'Cơ ngực lớn', 'Cơ thang'],
        correctAnswer: 0,
        explanation: 'Cơ nhị đầu ở mặt trước cánh tay co lại, kéo xương cẳng tay gập về phía cánh tay.',
        knowledgeId: 'KN_SINH_01',
        trapWarning: 'Khi duỗi tay thì cơ tam đầu mới co, cơ nhị đầu giãn!'
      },
      {
        id: 'CH_S_4',
        question: 'Thời gian mỗi chu kỳ co giãn tim ở người bình thường là bao nhiêu giây?',
        options: ['0,8 giây', '1,2 giây', '0,4 giây', '2,0 giây'],
        correctAnswer: 0,
        explanation: 'Một chu kỳ tim gồm: pha co tâm nhĩ (0,1s) + pha co tâm thất (0,3s) + pha giãn chung (0,4s) = 0,8 giây (tương đương khoảng 75 nhịp/phút).',
        knowledgeId: 'KN_SINH_02',
        trapWarning: 'Ghi nhớ công thức phân bổ 0,1s - 0,3s - 0,4s = 0,8s!'
      }
    ]
  }
];

