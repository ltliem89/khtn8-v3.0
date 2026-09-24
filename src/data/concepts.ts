import { Concept } from '../types';

export const CONCEPTS: Concept[] = [
  // --- HÓA HỌC ---
  {
    id: 'C_HOA_BIEN_DOI_HOA_HOC',
    lessonId: 'L_HOA_02',
    domain: 'HOA_HOC',
    term: 'Biến đổi hoá học',
    definition: 'Hiện tượng chất này biến đổi thành chất khác có tính chất hoàn toàn mới, trong đó liên kết giữa các nguyên tử thay đổi nhưng số nguyên tử mỗi nguyên tố được bảo toàn.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['chất mới', 'liên kết nguyên tử', 'phản ứng hoá học', 'kết tủa', 'sinh khí'],
    commonMisconceptions: [
      'Nhầm quá trình hoà tan muối ăn hoặc nung nóng chảy sáp nến là biến đổi hoá học (đây chỉ là biến đổi vật lí, chất vẫn giữ nguyên).',
      'Nghĩ rằng biến đổi hoá học làm mất đi nguyên tử (thực chất chỉ sắp xếp lại liên kết).'
    ],
    realWorldHook: 'Đốt than tổ ong sinh ra khí CO2 và tro xỉ; que diêm cọ xát bùng cháy; đinh sắt để ngoài không khí ẩm bị gỉ nâu đỏ.',
    relatedFormulaIds: ['F_HOA_BAO_TOAN_KHOI_LUONG']
  },
  {
    id: 'C_HOA_MOL',
    lessonId: 'L_HOA_03',
    domain: 'HOA_HOC',
    term: 'Mol & Số Avogadro',
    definition: 'Mol là lượng chất có chứa NA (khoảng 6,022.10^23) nguyên tử hoặc phân tử của chất đó. Khối lượng mol (M) là khối lượng tính bằng gam của 1 mol chất.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['mol', 'Avogadro', 'khối lượng mol', 'thể tích mol khí'],
    commonMisconceptions: [
      'Nhầm 1 mol nguyên tử hydrogen (1 g) với 1 mol phân tử hydrogen H2 (2 g).',
      'Áp dụng thể tích mol 24,79 L cho chất lỏng hoặc chất rắn (chỉ áp dụng cho chất khí ở điều kiện chuẩn 25 °C, 1 bar).'
    ],
    realWorldHook: 'Dùng mol giống như "tá" (12 chiếc) hay "chục" (10 chiếc), nhưng dành cho các hạt vô cùng nhỏ trong thế giới vi mô.',
    relatedFormulaIds: ['F_HOA_MOL_KHOI_LUONG', 'F_HOA_MOL_THE_TICH', 'F_HOA_TI_KHOI']
  },
  {
    id: 'C_HOA_DUNG_DICH_NONG_DO',
    lessonId: 'L_HOA_04',
    domain: 'HOA_HOC',
    term: 'Nồng độ dung dịch (C% & CM)',
    definition: 'Dung dịch là hỗn hợp đồng nhất giữa chất tan và dung môi. Nồng độ phần trăm (C%) chỉ số gam chất tan trong 100 gam dung dịch; nồng độ mol (CM) chỉ số mol chất tan trong 1 lít dung dịch.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['dung dịch', 'chất tan', 'dung môi', 'nồng độ phần trăm', 'nồng độ mol', 'độ tan'],
    commonMisconceptions: [
      'Nhầm khối lượng dung dịch m_dd với khối lượng nước (m_dd = m_ct + m_nuoc).',
      'Quên đổi đơn vị thể tích V từ mililít (mL) sang lít (L) khi tính CM.',
      'Cho rằng dung dịch bão hoà là không thể hoà tan thêm bất kì chất nào khác (nó chỉ không tan thêm chất đó ở nhiệt độ đó).'
    ],
    realWorldHook: 'Nước muối sinh lí 0,9% dùng để súc họng, rửa vết thương; nồng độ cồn y tế 70 độ diệt khuẩn hiệu quả nhất.',
    relatedFormulaIds: ['F_HOA_NONG_DO_PHAN_TRAM', 'F_HOA_NONG_DO_MOL', 'F_HOA_DO_TAN']
  },
  {
    id: 'C_HOA_ACID',
    lessonId: 'L_HOA_08',
    domain: 'HOA_HOC',
    term: 'Acid & Tính chất của Acid',
    definition: 'Acid là những hợp chất mà phân tử gồm có nguyên tử hydrogen liên kết với gốc acid. Khi tan trong nước, acid tạo ra cation H+. Acid làm quỳ tím chuyển đỏ và tác dụng với kim loại giải phóng khí H2.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['acid', 'ion H+', 'quỳ tím hoá đỏ', 'tác dụng kim loại', 'H2SO4', 'HCl'],
    commonMisconceptions: [
      'Nghĩ rằng mọi kim loại đều tác dụng với acid loãng tạo khí H2 (đồng Cu, bạc Ag, vàng Au không tác dụng).',
      'Đổ nước vào acid đặc khi pha loãng (tuyệt đối nguy hiểm, phải rót từ từ acid vào nước).'
    ],
    realWorldHook: 'Acid clohydric HCl trong dịch vị dạ dày giúp tiêu hoá thức ăn; acid acetic CH3COOH tạo vị chua đặc trưng của giấm ăn.',
    relatedFormulaIds: ['F_HOA_PTHH_CHUNG']
  },
  {
    id: 'C_HOA_BASE_PH',
    lessonId: 'L_HOA_09',
    domain: 'HOA_HOC',
    term: 'Base & Thang pH',
    definition: 'Base là hợp chất mà phân tử gồm nguyên tử kim loại liên kết với một hay nhiều nhóm hydroxide (-OH). Base tan tạo anion OH-, làm quỳ tím hoá xanh, phenolphthalein hoá hồng. Thang pH đánh giá độ acid/base từ 1 đến 14.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['base', 'kiềm', 'ion OH-', 'thang pH', 'trung hoà'],
    commonMisconceptions: [
      'Nghĩ tất cả các base đều tan trong nước (chỉ có KOH, NaOH, Ba(OH)2, Ca(OH)2 tan tốt, còn Cu(OH)2, Fe(OH)3 không tan).',
      'Hiểu nhầm giá trị pH: pH càng nhỏ thì tính acid càng mạnh; pH càng lớn thì tính base càng mạnh.'
    ],
    realWorldHook: 'Vôi tôi Ca(OH)2 được nông dân bón vào ruộng để khử chua đất (nâng pH đất); bôi nước vôi hoặc xà phòng lên vết ong đốt có tính acid để giảm đau rát.',
    relatedFormulaIds: ['F_HOA_PTHH_CHUNG']
  },
  {
    id: 'C_HOA_OXIDE_MUOI',
    lessonId: 'L_HOA_10',
    domain: 'HOA_HOC',
    term: 'Oxide & Muối',
    definition: 'Oxide là hợp chất gồm 2 nguyên tố (có oxygen). Muối là hợp chất sinh ra khi ion H+ của acid được thay thế bởi ion kim loại hoặc ion NH4+.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['oxide acid', 'oxide base', 'muối', 'phản ứng trao đổi', 'chất kết tủa'],
    commonMisconceptions: [
      'Cho rằng mọi phản ứng giữa hai dung dịch muối đều xảy ra (phải có điều kiện tạo kết tủa hoặc khí hoặc chất bay hơi/nước).',
      'Nhầm lẫn CaO (vôi sống - oxide base) và Ca(OH)2 (vôi tôi - base) và CaCO3 (đá vôi - muối).'
    ],
    realWorldHook: 'Vôi sống CaO được nung từ đá vôi CaCO3 trong lò công nghiệp; muối ăn NaCl khai thác từ nước biển bằng cách phơi bay hơi nước.',
    relatedFormulaIds: ['F_HOA_PTHH_CHUNG']
  },

  // --- VẬT LÍ ---
  {
    id: 'C_LY_KHOI_LUONG_RIENG',
    lessonId: 'L_LY_13',
    domain: 'VAT_LI',
    term: 'Khối lượng riêng & Trọng lượng riêng',
    definition: 'Khối lượng riêng (D) là khối lượng của một đơn vị thể tích chất đó (D = m / V). Trọng lượng riêng (d) là trọng lượng của một đơn vị thể tích (d = P / V = 10.D).',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['khối lượng riêng', 'thể tích', 'trọng lượng riêng', 'kg/m3', 'g/cm3'],
    commonMisconceptions: [
      'Nói "sắt nặng hơn nhôm" mà không chỉ rõ là so sánh khối lượng riêng (cùng một thể tích).',
      'Quên đổi đơn vị thể tích từ cm3 hoặc lít sang m3 khi tính D theo đơn vị chuẩn kg/m3.'
    ],
    realWorldHook: 'Dầu ăn nhẹ hơn nước (D_dau ~ 800 kg/m3 < D_nuoc 1000 kg/m3) nên nổi trên mặt nước; tảng băng nổi do D_da ~ 920 kg/m3 < D_nuoc.',
    relatedFormulaIds: ['F_LY_KHOI_LUONG_RIENG', 'F_LY_TRONG_LUONG_RIENG']
  },
  {
    id: 'C_LY_AP_SUAT_AP_LUC',
    lessonId: 'L_LY_15',
    domain: 'VAT_LI',
    term: 'Áp lực & Áp suất trên bề mặt',
    definition: 'Áp lực là lực ép có phương vuông góc với mặt bị ép. Áp suất là độ lớn của áp lực trên một đơn vị diện tích bị ép: p = F / S (đơn vị Pascal: 1 Pa = 1 N/m2).',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['áp lực', 'diện tích bị ép', 'áp suất', 'Pascal', 'tăng giảm áp suất'],
    commonMisconceptions: [
      'Đồng nhất áp lực với trọng lực (áp lực chỉ bằng trọng lực khi vật nằm trên mặt sàn nằm ngang).',
      'Nghĩ rằng áp lực lớn thì áp suất chắc chắn lớn (nếu diện tích S cực lớn như bản xích xe tăng thì áp suất lại nhỏ).',
      'Quên đổi diện tích cm2 sang m2 (1 m2 = 10 000 cm2).'
    ],
    realWorldHook: 'Đầu đinh, lưỡi kéo mài nhọn để giảm diện tích S giúp tăng áp suất xuyên qua gỗ; người đi trên bùn lầy đặt ván gỗ to để tăng S tránh bị lún.',
    relatedFormulaIds: ['F_LY_AP_SUAT_MAT']
  },
  {
    id: 'C_LY_AP_SUAT_CHAT_LONG_KHI_QUYEN',
    lessonId: 'L_LY_16',
    domain: 'VAT_LI',
    term: 'Áp suất chất lỏng & Khí quyển (Pascal)',
    definition: 'Chất lỏng gây áp suất theo mọi phương lên đáy, thành bình và vật nhúng trong nó. Áp suất tăng theo độ sâu h. Nguyên lí Pascal: Áp suất tác dụng vào chất lỏng kín được truyền nguyên vẹn theo mọi hướng.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['áp suất chất lỏng', 'độ sâu', 'nguyên lí Pascal', 'áp suất khí quyển', 'máy thuỷ lực'],
    commonMisconceptions: [
      'Nghĩ rằng chất lỏng chỉ tác dụng áp lực xuống đáy bình như chất rắn (nó tác dụng lên cả thành bình và mọi phương).',
      'Cho rằng cơ thể người không chịu áp suất khí quyển (thực tế cơ thể chịu áp lực tương đương ~20 000 N nhưng áp suất bên trong cân bằng với bên ngoài).'
    ],
    realWorldHook: 'Chân đập thuỷ điện phải xây choãi to và dày ở đáy; giác hút dán kính dính chặt nhờ chênh lệch áp suất khí quyển; nuốt nước bọt làm cân bằng áp suất màng nhĩ khi đi máy bay.',
    relatedFormulaIds: ['F_LY_MOC_THUY_LUC']
  },
  {
    id: 'C_LY_LUC_DAY_ARCHIMEDES',
    lessonId: 'L_LY_17',
    domain: 'VAT_LI',
    term: 'Lực đẩy Archimedes & Điều kiện nổi chìm',
    definition: 'Mọi vật nhúng vào chất lỏng đều chịu một lực đẩy hướng thẳng đứng từ dưới lên bằng trọng lượng phần chất lỏng bị vật chiếm chỗ: F_A = d.V.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['Archimedes', 'lực đẩy chất lỏng', 'thể tích chiếm chỗ', 'vật nổi', 'vật chìm'],
    commonMisconceptions: [
      'Lấy V là toàn bộ thể tích của vật khi vật chỉ nổi một phần (phải lấy V là thể tích phần ngập chìm trong chất lỏng).',
      'Cho rằng khi vật chìm càng sâu dưới nước thì lực đẩy Archimedes càng tăng (khi đã ngập hoàn toàn, V không đổi nên F_A không đổi theo độ sâu).'
    ],
    realWorldHook: 'Tàu bè làm bằng thép vẫn nổi vì rỗng bên trong, chiếm thể tích nước rất lớn tạo lực F_A đủ nâng cả con tàu.',
    relatedFormulaIds: ['F_LY_ARCHIMEDES']
  },
  {
    id: 'C_LY_MOMENT_DON_BAY',
    lessonId: 'L_LY_18',
    domain: 'VAT_LI',
    term: 'Moment lực & Đòn bẩy 3 loại',
    definition: 'Moment lực đặc trưng cho tác dụng làm quay của lực (M = F.d). Đòn bẩy gồm 3 loại tuỳ theo vị trí tương đối giữa điểm tựa O, lực tác dụng F và tải trọng.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['moment lực', 'trục quay', 'cánh tay đòn', 'đòn bẩy loại 1', 'đòn bẩy loại 2', 'đòn bẩy loại 3'],
    commonMisconceptions: [
      'Đo khoảng cách d từ trục quay đến điểm đặt của lực thay vì khoảng cách vuông góc từ trục quay đến giá của lực.',
      'Nghĩ rằng đòn bẩy nào cũng cho lợi về lực (Đòn bẩy loại 3 như nhíp, cần câu cá thiệt về lực nhưng lợi về chuyển động/tốc độ).'
    ],
    realWorldHook: 'Cờ-lê cán dài mở ốc chặt dễ dàng; khớp cùi chỏ cánh tay người hoạt động như một đòn bẩy loại 3 khéo léo.',
    relatedFormulaIds: ['F_LY_MOMENT', 'F_LY_DON_BAY']
  },
  {
    id: 'C_LY_NHIET_TRUYEN_NHIET',
    lessonId: 'L_LY_26',
    domain: 'VAT_LI',
    term: 'Nội năng & 3 hình thức truyền nhiệt',
    definition: 'Nội năng là tổng động năng và thế năng của các phân tử. Truyền nhiệt xảy ra qua 3 hình thức: Dẫn nhiệt (chất rắn), Đối lưu (chất lỏng, khí), Bức xạ nhiệt (tia nhiệt, truyền qua chân không).',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['nội năng', 'nhiệt lượng', 'dẫn nhiệt', 'đối lưu', 'bức xạ nhiệt', 'hiệu ứng nhà kính'],
    commonMisconceptions: [
      'Nghĩ vật lạnh thì không có nhiệt năng hay nội năng (mọi vật đều có nhiệt năng vì các phân tử luôn chuyển động).',
      'Nhầm lẫn bức xạ nhiệt cần môi trường vật chất (bức xạ nhiệt Mặt Trời truyền qua khoảng chân không vũ trụ đến Trái Đất).'
    ],
    realWorldHook: 'Ruột phích nước nóng có lớp chân không ngăn dẫn nhiệt và đối lưu, thành tráng bạc ngăn bức xạ nhiệt; lò sưởi ấm phòng bằng đối lưu không khí.',
    relatedFormulaIds: ['F_LY_NHIET_LUONG']
  },

  // --- SINH HỌC ---
  {
    id: 'C_SINH_HE_VAN_DONG',
    lessonId: 'L_SINH_30',
    domain: 'SINH_HOC',
    term: 'Bộ xương, Khớp & Cơ vân',
    definition: 'Hệ vận động gồm bộ xương (~206 xương) tạo khung nâng đỡ, bảo vệ và hệ cơ (~600 cơ) co giãn tạo chuyển động. Khớp xương gồm khớp động, khớp bán động và khớp bất động.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['xương', 'cơ vân', 'khớp động', 'dây chằng', 'loãng xương', 'cong vẹo cột sống'],
    commonMisconceptions: [
      'Nghĩ rằng xương là mô chết không thay đổi (xương liên tục có quá trình huỷ cốt bào và tạo cốt bào đổi mới mô xương).',
      'Khi sơ cứu người gãy cột sống lại bế xốc hoặc gập người (phải đặt nạn nhân nằm yên trên ván cứng thẳng).'
    ],
    realWorldHook: 'Ngồi học sai tư thế gây tật cong vẹo cột sống; người già thiếu calcium và vitamin D dễ bị loãng xương, xương giòn dễ gãy.',
    relatedFormulaIds: []
  },
  {
    id: 'C_SINH_MAU_TUAN_HOAN',
    lessonId: 'L_SINH_33',
    domain: 'SINH_HOC',
    term: 'Máu, Hệ tuần hoàn & Nhóm máu ABO',
    definition: 'Máu gồm huyết tương (55%) và tế bào máu (hồng cầu, bạch cầu, tiểu cầu). Tim co bóp đẩy máu qua 2 vòng tuần hoàn kín. Truyền máu tuân theo nguyên tắc: không để kháng thể người nhận kết dính kháng nguyên hồng cầu người cho.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['huyết tương', 'hồng cầu', 'bạch cầu', 'tiểu cầu', 'nhóm máu ABO', 'vòng tuần hoàn lớn', 'vòng tuần hoàn nhỏ'],
    commonMisconceptions: [
      'Nghĩ máu trong động mạch luôn là máu đỏ tươi giàu O2 (Động mạch phổi mang máu đỏ thẫm nghèo O2 từ tim lên phổi).',
      'Cho rằng nhóm máu O có thể nhận máu của bất kì nhóm máu nào (nhóm O chỉ có thể nhận của nhóm O).'
    ],
    realWorldHook: 'Quy tắc vàng cấp cứu đột quỵ não FAST; buộc garô đúng cách khi đứt động mạch cánh tay để tránh mất máu tử vong.',
    relatedFormulaIds: []
  },
  {
    id: 'C_SINH_HE_HO_HAP_TIEU_HOA_BAI_TIET',
    lessonId: 'L_SINH_32',
    domain: 'SINH_HOC',
    term: 'Hệ Tiêu hoá, Hô hấp & Bài tiết',
    definition: 'Các hệ cơ quan trao đổi chất: Hệ tiêu hoá biến đổi thức ăn thành dưỡng chất đơn giản; Hệ hô hấp trao đổi khí O2 và CO2 qua phế nang; Hệ bài tiết lọc máu tại cầu thận để đào thải chất cặn bã qua nước tiểu.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['tiêu hoá', 'ruột non', 'phế nang', 'trao đổi khí', 'thận', 'nephron', 'nội môi'],
    commonMisconceptions: [
      'Nghĩ rằng dạ dày hấp thụ phần lớn chất dinh dưỡng (thực chất ruột non mới là nơi hấp thụ chủ yếu nhờ diện tích bề mặt khổng lồ).',
      'Nhầm phân là sản phẩm của hệ bài tiết (phân là bã thải của hệ tiêu hoá; nước tiểu mới là sản phẩm của hệ bài tiết).'
    ],
    realWorldHook: 'Ăn chậm nhai kĩ giúp giảm gánh nặng cho dạ dày; uống đủ nước phòng ngừa lắng cặn sỏi thận; không đun than củi trong phòng kín vì ngộ độc khí CO kết hợp chặt với hemoglobin.',
    relatedFormulaIds: []
  },
  {
    id: 'C_SINH_QUAN_THE_QUAN_XA_SINH_THAI',
    lessonId: 'L_MT_41',
    domain: 'SINH_HOC',
    term: 'Quần thể, Quần xã & Cân bằng sinh thái',
    definition: 'Quần thể là nhóm cá thể cùng loài, cùng không gian và thời gian. Quần xã gồm nhiều quần thể khác loài tương tác qua chuỗi/lưới thức ăn. Cân bằng tự nhiên là trạng thái ổn định động qua cơ chế khống chế sinh học.',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    keywords: ['quần thể', 'quần xã', 'chuỗi thức ăn', 'lưới thức ăn', 'tháp sinh thái', 'khống chế sinh học'],
    commonMisconceptions: [
      'Nhầm "đàn cá trong một ao nuôi đủ loại cá" là một quần thể (đó là tập hợp nhiều loài nên thuộc quần xã).',
      'Nghĩ cân bằng tự nhiên là số lượng cá thể giữ nguyên không đổi (thực tế là dao động quanh mức cân bằng).',
      'Năng lượng trong hệ sinh thái tuần hoàn khép kín (vật chất tuần hoàn khép kín, nhưng năng lượng truyền một chiều và mất dần dưới dạng nhiệt).'
    ],
    realWorldHook: 'Thả ếch đồng trị sâu hại mùa màng là ứng dụng khống chế sinh học; cá rô phi có giới hạn nhiệt 5,6 - 42 °C nên dễ chết rét ở miền Bắc vào mùa đông khắc nghiệt.',
    relatedFormulaIds: []
  }
];
