import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // --- HÓA HỌC: BÀI MỞ ĐẦU & BIẾN ĐỔI ---
  {
    id: 'EX_HOA_01',
    lessonId: 'L_HOA_01',
    domain: 'HOA_HOC',
    curriculum: 'CD',
    sourceId: 'SRC_CD_SBT',
    question: 'Khi đun nóng hoá chất lỏng trong cốc thuỷ tinh phải dùng lưới thép lót dưới đáy cốc để:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. cốc không bị đổ.',
      'B. tránh nứt vỡ cốc.',
      'C. hoá chất không sôi mạnh.',
      'D. dẫn nhiệt tốt.'
    ],
    correctAnswer: 1, // B
    hint1: 'Thuỷ tinh chịu nhiệt dãn nở cục bộ nếu ngọn lửa tập trung tại một điểm.',
    hint2: 'Lưới thép (có lớp amiăng) giúp tản nhiệt đều khắp đáy cốc.',
    explanation: 'Khi đun nóng cốc thuỷ tinh, nhiệt độ tại điểm tiếp xúc trực tiếp với ngọn lửa có thể tăng quá nhanh gây dãn nở không đều, dẫn đến nứt vỡ cốc. Lưới thép giúp phân tán đều nhiệt lượng.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'PROCEDURE',
    relatedConceptId: 'C_HOA_BIEN_DOI_HOA_HOC'
  },
  {
    id: 'EX_HOA_02',
    lessonId: 'L_HOA_01',
    domain: 'HOA_HOC',
    curriculum: 'CD',
    sourceId: 'SRC_CD_SBT',
    question: 'Cách làm nào dưới đây khi đun hoá chất lỏng trong ống nghiệm là đúng?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Nghiêng ống nghiệm góc khoảng 30°, hướng miệng ống về phía không có người.',
      'B. Nghiêng ống nghiệm góc khoảng 90°, hướng miệng ống về phía không có người.',
      'C. Nghiêng ống nghiệm góc khoảng 60°, hướng miệng ống về phía người khác.',
      'D. Nghiêng ống nghiệm góc khoảng 60°, hướng miệng ống về phía không có người.'
    ],
    correctAnswer: 3, // D (60 độ, hướng về phía không có người)
    hint1: 'Góc nghiêng tiêu chuẩn của ống nghiệm khi đun là 60° so với phương ngang.',
    hint2: 'Luôn luôn hướng miệng ống nghiệm về phía an toàn (không có người) để tránh chất lỏng sôi trào bắn vào người.',
    explanation: 'Quy tắc an toàn PTN: Giữ ống nghiệm nghiêng góc khoảng 60°, hơ nóng đều dọc thân ống nghiệm rồi mới tập trung đáy ống, và miệng ống nghiệm luôn hướng về nơi không có người.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'PROCEDURE'
  },
  {
    id: 'EX_HOA_03',
    lessonId: 'L_HOA_02',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Quá trình nào sau đây xảy ra sự biến đổi hoá học?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Đốt cháy cồn trong đĩa.',
      'B. Hơ nóng chiếc thìa inox.',
      'C. Hoà tan muối ăn vào nước.',
      'D. Nước hoa trong lọ mở nắp bị bay hơi.'
    ],
    correctAnswer: 0, // A
    hint1: 'Dấu hiệu biến đổi hoá học là có sự tạo thành chất mới.',
    hint2: 'Cồn (ethanol) khi cháy tác dụng với oxygen tạo thành carbon dioxide và hơi nước.',
    explanation: 'Đốt cháy cồn là phản ứng cháy: C2H5OH + 3O2 -> 2CO2 + 3H2O, tạo thành chất mới nên là biến đổi hoá học. Ba quá trình còn lại chỉ là sự thay đổi nhiệt độ, hoà tan hoặc bay hơi (biến đổi vật lí).',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_HOA_BIEN_DOI_HOA_HOC'
  },
  {
    id: 'EX_HOA_04',
    lessonId: 'L_HOA_02',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Trong các phản ứng sau, phản ứng nào là phản ứng toả nhiệt, phản ứng nào là phản ứng thu nhiệt?\n(1) Đốt than đá; (2) Cho nước vào vôi sống (tôi vôi); (3) Nung đá vôi (CaCO3); (4) Hoà tan baking soda vào giấm ăn.',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Toả nhiệt: (1), (2); Thu nhiệt: (3), (4)',
      'B. Toả nhiệt: (3), (4); Thu nhiệt: (1), (2)',
      'C. Toả nhiệt: (1), (3); Thu nhiệt: (2), (4)',
      'D. Cả 4 phản ứng đều toả nhiệt'
    ],
    correctAnswer: 0, // A
    hint1: 'Phản ứng toả nhiệt làm nóng môi trường xung quanh (sờ vào thấy nóng).',
    hint2: 'Nung đá vôi cần liên tục cung cấp nhiệt năng từ ngọn lửa than đá.',
    explanation: 'Đốt than và tôi vôi toả lượng nhiệt rất lớn (phản ứng toả nhiệt). Nung đá vôi và cho baking soda vào giấm cần nhận năng lượng nhiệt (phản ứng thu nhiệt).',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_HOA_BIEN_DOI_HOA_HOC'
  },

  // --- MOL & TỈ KHỐI ---
  {
    id: 'EX_HOA_05',
    lessonId: 'L_HOA_03',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Số phân tử chlorine (Cl2) có trong 0,05 mol khí chlorine là bao nhiêu?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. 3,011 . 10²²',
      'B. 6,022 . 10²²',
      'C. 3,011 . 10²³',
      'D. 1,204 . 10²⁴'
    ],
    correctAnswer: 0, // 0.05 * 6.022*10^23 = 0.3011 * 10^23 = 3.011 * 10^22
    hint1: 'Số phân tử = n × NA = n × 6,022.10²³.',
    hint2: '0,05 × 6,022.10²³ = 3,011.10²² phân tử.',
    explanation: 'Theo định nghĩa mol, 1 mol chứa 6,022.10²³ hạt. Với 0,05 mol khí Cl2: Số phân tử = 0,05 × 6,022.10²³ = 3,011.10²² phân tử.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'CALCULATION',
    relatedFormulaId: 'F_HOA_MOL_KHOI_LUONG',
    relatedConceptId: 'C_HOA_MOL'
  },
  {
    id: 'EX_HOA_06',
    lessonId: 'L_HOA_03',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Tỉ khối của khí carbon dioxide (CO2) đối với không khí là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. 0,66',
      'B. 1,52',
      'C. 1,98',
      'D. 2,24'
    ],
    correctAnswer: 1, // 44 / 29 ≈ 1.517 ≈ 1.52
    hint1: 'Khối lượng mol của CO2: M = 12 + 16×2 = 44 g/mol.',
    hint2: 'Khối lượng mol của không khí lấy xấp xỉ bằng 29 g/mol. Áp dụng d = M_A / 29.',
    explanation: 'd_CO2/kk = M_CO2 / 29 = 44 / 29 ≈ 1,517 (nặng gấp ~1,52 lần không khí). Do nặng hơn không khí nên CO2 thường tích tụ ở đáy giếng sâu hay hang hốc.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'FORMULA',
    relatedFormulaId: 'F_HOA_TI_KHOI',
    relatedConceptId: 'C_HOA_MOL'
  },

  // --- DUNG DỊCH & NỒNG ĐỘ ---
  {
    id: 'EX_HOA_07',
    lessonId: 'L_HOA_04',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Hoà tan 18 gam muối ăn (NaCl) vào cốc chứa 182 gam nước cất. Nồng độ phần trăm (C%) của dung dịch nước muối thu được là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. 9,9%',
      'B. 9,0%',
      'C. 18,0%',
      'D. 10,0%'
    ],
    correctAnswer: 1, // 18 / (18 + 182) * 100% = 18 / 200 * 100% = 9%
    hint1: 'Khối lượng dung dịch = khối lượng chất tan + khối lượng nước.',
    hint2: 'm_dd = 18 + 182 = 200 g. C% = (m_ct / m_dd) × 100%.',
    explanation: 'Khối lượng dung dịch m_dd = m_NaCl + m_H2O = 18 + 182 = 200 g. Nồng độ phần trăm: C% = (18 / 200) × 100% = 9,0%.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'FORMULA',
    relatedFormulaId: 'F_HOA_NONG_DO_PHAN_TRAM',
    relatedConceptId: 'C_HOA_DUNG_DICH_NONG_DO'
  },
  {
    id: 'EX_HOA_08',
    lessonId: 'L_HOA_04',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Rót 300 mL nước vào bình chứa sẵn 200 mL dung dịch sodium chloride (NaCl) 0,5 M và lắc đều. Coi thể tích dung dịch thu được bằng tổng thể tích ban đầu và nước cất. Nồng độ mol của dung dịch mới là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. 0,10 M',
      'B. 0,20 M',
      'C. 0,30 M',
      'D. 0,05 M'
    ],
    correctAnswer: 1, // 0.20 M (n = 0.2*0.5 = 0.1 mol, V_moi = 0.5 L => CM = 0.1/0.5 = 0.2 M)
    hint1: 'Khi thêm nước, số mol NaCl trong dung dịch không thay đổi.',
    hint2: 'Số mol NaCl = 0,2 L × 0,5 M = 0,1 mol. Thể tích mới = 200 + 300 = 500 mL = 0,5 L.',
    explanation: 'Số mol NaCl ban đầu: n = 0,2 × 0,5 = 0,1 mol. Tổng thể tích dung dịch sau khi pha thêm nước: V = 0,2 + 0,3 = 0,5 L. Nồng độ mol mới: CM = n / V = 0,1 / 0,5 = 0,20 M.',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'PROBLEM_STRATEGY',
    relatedFormulaId: 'F_HOA_NONG_DO_MOL',
    relatedConceptId: 'C_HOA_DUNG_DICH_NONG_DO'
  },

  // --- ACID, BASE, PH, OXIDE, MUỐI ---
  {
    id: 'EX_HOA_09',
    lessonId: 'L_HOA_09',
    domain: 'HOA_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Dung dịch X có pH = 3,0; dung dịch Y có pH = 9,0. Nhỏ dung dịch phenolphthalein không màu vào hai dung dịch X và Y thì hiện tượng quan sát được là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Cả hai dung dịch đều chuyển sang màu hồng.',
      'B. Dung dịch X chuyển hồng, dung dịch Y không đổi màu.',
      'C. Dung dịch X không đổi màu, dung dịch Y chuyển sang màu hồng.',
      'D. Cả hai dung dịch đều không đổi màu.'
    ],
    correctAnswer: 2, // C
    hint1: 'pH = 3,0 < 7 là môi trường acid. pH = 9,0 > 7 là môi trường kiềm (base).',
    hint2: 'Phenolphthalein chỉ đổi màu hồng khi gặp dung dịch base (kiềm có pH > 8,3).',
    explanation: 'Dung dịch X có pH = 3,0 < 7 (acid) nên phenolphthalein vẫn không màu. Dung dịch Y có pH = 9,0 > 7 (base kiềm) nên làm phenolphthalein chuyển sang màu hồng.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_HOA_BASE_PH'
  },

  // --- VẬT LÍ: KHỐI LƯỢNG RIÊNG & ÁP SUẤT ---
  {
    id: 'EX_LY_01',
    lessonId: 'L_LY_13',
    domain: 'VAT_LI',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Đo được khối lượng của 200 mL nước cất là 200 g. Khối lượng riêng của nước tính theo đơn vị g/L và kg/m³ lần lượt là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. 1 000 g/L và 1 000 kg/m³',
      'B. 1 g/L và 1 000 kg/m³',
      'C. 1 000 g/L và 1 kg/m³',
      'D. 200 g/L và 200 kg/m³'
    ],
    correctAnswer: 0, // A
    hint1: '200 mL = 0,2 L = 0,0002 m³. Khối lượng m = 200 g = 0,2 kg.',
    hint2: 'D (g/L) = 200 g / 0,2 L = 1000 g/L. D (kg/m³) = 0,2 kg / 0,0002 m³ = 1000 kg/m³.',
    explanation: 'D = m / V = 200 g / 0,2 L = 1 000 g/L. Tương đương 0,2 kg / 0,0002 m³ = 1 000 kg/m³.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'UNIT',
    relatedFormulaId: 'F_LY_KHOI_LUONG_RIENG',
    relatedConceptId: 'C_LY_KHOI_LUONG_RIENG'
  },
  {
    id: 'EX_LY_02',
    lessonId: 'L_LY_15',
    domain: 'VAT_LI',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Một người đứng bằng cả hai chân trên sàn nhà. Nếu người đó nhấc co một chân lên khỏi mặt sàn thì áp lực và áp suất tác dụng lên sàn thay đổi như thế nào?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Áp lực không đổi, áp suất tăng gấp đôi.',
      'B. Áp lực tăng gấp đôi, áp suất không đổi.',
      'C. Cả áp lực và áp suất đều tăng gấp đôi.',
      'D. Cả áp lực và áp suất đều giảm một nửa.'
    ],
    correctAnswer: 0, // A
    hint1: 'Áp lực F = P = 10.m (trọng lượng người không đổi).',
    hint2: 'Diện tích tiếp xúc S bị giảm đi một nửa khi co một chân. Áp dụng p = F / S.',
    explanation: 'Trọng lượng người không đổi nên áp lực F vuông góc với mặt sàn vẫn giữ nguyên. Khi co một chân, diện tích bị ép S giảm 2 lần, do đó áp suất p = F / S tăng lên gấp 2 lần.',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'CONCEPT',
    relatedFormulaId: 'F_LY_AP_SUAT_MAT',
    relatedConceptId: 'C_LY_AP_SUAT_AP_LUC'
  },
  {
    id: 'EX_LY_03',
    lessonId: 'L_LY_17',
    domain: 'VAT_LI',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Hai quả cầu bằng nhôm và sắt có cùng thể tích được nhúng chìm hoàn toàn trong cùng một chậu nước. So sánh lực đẩy Archimedes tác dụng lên hai quả cầu:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Lực đẩy tác dụng lên quả cầu sắt lớn hơn vì sắt nặng hơn.',
      'B. Lực đẩy tác dụng lên quả cầu nhôm lớn hơn vì nhôm nhẹ hơn.',
      'C. Lực đẩy tác dụng lên hai quả cầu bằng nhau.',
      'D. Không thể so sánh được vì chưa biết khối lượng.'
    ],
    correctAnswer: 2, // C
    hint1: 'Công thức tính lực đẩy Archimedes: F_A = d_lỏng × V_chìm.',
    hint2: 'Cả hai quả cầu đều làm bằng kim loại khác nhau nhưng có CÙNG THỂ TÍCH và nhúng trong CÙNG CHẤT LỎNG.',
    explanation: 'Lực đẩy Archimedes F_A = d_nuoc × V chỉ phụ thuộc vào trọng lượng riêng của chất lỏng d và thể tích chiếm chỗ V. Vì cả hai có thể tích bằng nhau và ngập hoàn toàn nên lực đẩy F_A tác dụng lên chúng hoàn toàn bằng nhau.',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'CONCEPT',
    relatedFormulaId: 'F_LY_ARCHIMEDES',
    relatedConceptId: 'C_LY_LUC_DAY_ARCHIMEDES'
  },
  {
    id: 'EX_LY_04',
    lessonId: 'L_LY_19',
    domain: 'VAT_LI',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    question: 'Cánh tay người nâng một vật nặng trên bàn tay (khuỷu tay gập) hoạt động như loại đòn bẩy nào?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Đòn bẩy loại 1 (điểm tựa ở giữa lực và tải).',
      'B. Đòn bẩy loại 2 (tải ở giữa điểm tựa và lực).',
      'C. Đòn bẩy loại 3 (lực bắp tay ở giữa điểm tựa khuỷu tay và tải ở bàn tay).',
      'D. Không phải là đòn bẩy.'
    ],
    correctAnswer: 2, // C
    hint1: 'Khớp khuỷu tay là điểm tựa O.',
    hint2: 'Cơ nhị đầu bắp tay bám vào xương cẳng tay ở phía trong, nằm giữa khớp khuỷu tay và bàn tay cầm vật nặng.',
    explanation: 'Khớp khuỷu tay đóng vai trò điểm tựa O, lực co của cơ bắp tay đặt ở giữa, tải trọng vật nặng nằm ở bàn tay. Đây là đòn bẩy loại 3, tuy thiệt về lực (cơ phải dùng lực kéo lớn hơn trọng lượng vật) nhưng giúp bàn tay chuyển động linh hoạt và nhanh nhẹn.',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'APPLICATION',
    relatedFormulaId: 'F_LY_DON_BAY',
    relatedConceptId: 'C_LY_MOMENT_DON_BAY'
  },
  {
    id: 'EX_LY_05',
    lessonId: 'L_LY_26',
    domain: 'VAT_LI',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Khi đun nước trong ấm điện, năng lượng nhiệt được truyền từ dây đốt ở đáy ấm lên toàn bộ khối nước chủ yếu bằng hình thức nào?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Dẫn nhiệt',
      'B. Đối lưu',
      'C. Bức xạ nhiệt',
      'D. Toả nhiệt'
    ],
    correctAnswer: 1, // B
    hint1: 'Lớp nước dưới đáy nóng lên, dãn nở, khối lượng riêng giảm nên nổi lên trên.',
    hint2: 'Lớp nước lạnh ở trên nặng hơn chìm xuống thế chỗ tạo thành dòng luân chuyển.',
    explanation: 'Sự truyền nhiệt thành các dòng chất lỏng nóng đi lên, lạnh đi xuống gọi là hình thức đối lưu. Đây là cách truyền nhiệt chủ yếu trong chất lỏng và chất khí.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_LY_NHIET_TRUYEN_NHIET'
  },

  // --- SINH HỌC ---
  {
    id: 'EX_SINH_01',
    lessonId: 'L_SINH_33',
    domain: 'SINH_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Khi sơ cứu vết thương bị đứt động mạch ở cẳng tay máu chảy phun thành tia, biện pháp cấp cứu cầm máu đúng nhất là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Buộc dây garô sát trên vết thương về phía tim và đưa ngay tới cơ sở y tế.',
      'B. Chỉ đắp bông gạc sạch lên vết thương rồi quấn lỏng băng gạc.',
      'C. Rửa vết thương dưới vòi nước chảy mạnh để làm sạch.',
      'D. Buộc dây garô ở vị trí phía dưới vết thương (về phía bàn tay).'
    ],
    correctAnswer: 0, // A
    hint1: 'Máu động mạch chảy từ tim ra cơ thể với áp lực rất mạnh thành tia.',
    hint2: 'Phải chặn đường máu đi từ tim đến vết thương bằng cách đặt garô phía trên vết thương gần tim hơn.',
    explanation: 'Máu động mạch có áp lực cao và chảy từ tim ra các chi. Khi đứt động mạch cánh tay, phải buộc dây garô chặt ở vị trí gần tim hơn vết thương để chặn dòng máu, sau đó ghi thời gian buộc và chuyển ngay tới bệnh viện.',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'APPLICATION',
    relatedConceptId: 'C_SINH_MAU_TUAN_HOAN'
  },
  {
    id: 'EX_SINH_02',
    lessonId: 'L_SINH_33',
    domain: 'SINH_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    question: 'Một người có nhóm máu B cần truyền máu khẩn cấp. Trong điều kiện ngân hàng máu chuẩn hệ ABO, người này có thể nhận máu từ người cho có nhóm máu nào an toàn?',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Chỉ nhóm AB',
      'B. Nhóm B hoặc nhóm O',
      'C. Nhóm A hoặc nhóm B',
      'D. Chỉ nhóm A'
    ],
    correctAnswer: 1, // B
    hint1: 'Huyết tương của người nhóm B có chứa kháng thể anti-A.',
    hint2: 'Hồng cầu đưa vào không được chứa kháng nguyên A. Nhóm B có kháng nguyên B, nhóm O không có kháng nguyên.',
    explanation: 'Người có nhóm máu B có kháng thể anti-A trong huyết tương. Người này có thể nhận máu của người cùng nhóm B (không bị ngưng kết) hoặc người nhóm O (hồng cầu O không chứa kháng nguyên A, B nên không bị anti-A kết dính).',
    difficulty: 'MEDIUM',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_SINH_MAU_TUAN_HOAN'
  },
  {
    id: 'EX_SINH_03',
    lessonId: 'L_MT_41',
    domain: 'SINH_HOC',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SBT',
    question: 'Cho chuỗi thức ăn: Cỏ -> Châu chấu -> Ếch đồng -> Rắn -> Đại bàng -> Vi sinh vật. Sinh vật sản xuất và sinh vật tiêu thụ bậc 2 trong chuỗi thức ăn trên lần lượt là:',
    type: 'MULTIPLE_CHOICE',
    options: [
      'A. Cỏ và Châu chấu',
      'B. Cỏ và Ếch đồng',
      'C. Châu chấu và Rắn',
      'D. Cỏ và Rắn'
    ],
    correctAnswer: 1, // Cỏ là SV sản xuất. Châu chấu là SVTT bậc 1. Ếch đồng là SVTT bậc 2.
    hint1: 'Sinh vật sản xuất tự tổng hợp chất hữu cơ (cây xanh: cỏ).',
    hint2: 'Sinh vật tiêu thụ bậc 1 ăn thực vật (châu chấu); sinh vật tiêu thụ bậc 2 ăn sinh vật tiêu thụ bậc 1 (ếch đồng ăn châu chấu).',
    explanation: 'Cỏ quang hợp là sinh vật sản xuất. Châu chấu ăn cỏ là sinh vật tiêu thụ bậc 1. Ếch đồng ăn châu chấu là sinh vật tiêu thụ bậc 2.',
    difficulty: 'EASY',
    errorCategoryIfWrong: 'CONCEPT',
    relatedConceptId: 'C_SINH_QUAN_THE_QUAN_XA_SINH_THAI'
  }
];
