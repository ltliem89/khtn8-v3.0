import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // --- HÓA HỌC (CHẤT VÀ SỰ BIẾN ĐỔI) ---
  {
    id: 'L_HOA_01',
    domain: 'HOA_HOC',
    chapterNumber: 0,
    chapterTitle: 'Mở đầu: Dụng cụ và an toàn phòng thí nghiệm',
    lessonNumber: 1,
    title: 'Sử dụng một số hoá chất, thiết bị cơ bản trong PTN',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Nhận biết nhãn hoá chất (tên, CTHH, nồng độ, ký hiệu cảnh báo cháy nổ, ăn mòn, độc hại).',
      'Quy tắc lấy hoá chất rắn (dùng thìa thuỷ tinh/kim loại, panh), hoá chất lỏng (ống hút nhỏ giọt, rót hướng nhãn lên trên).',
      'Thiết bị điện an toàn: ampe kế, vôn kế, biến áp nguồn DC, joulemeter.'
    ],
    keyObjectives: [
      'Nhận biết hoá chất và tuân thủ tuyệt đối an toàn PTN',
      'Sử dụng đúng ống đong, ống nghiệm, kẹp gỗ, đèn cồn',
      'Nắm vững cách dùng máy đo pH, ampe kế, vôn kế'
    ]
  },
  {
    id: 'L_HOA_02',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 2,
    title: 'Phản ứng hoá học & Năng lượng phản ứng',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Biến đổi vật lí: không có sự tạo thành chất mới (nóng chảy, bay hơi, hoà tan).',
      'Biến đổi hoá học: có sự tạo thành chất mới (đốt than, gỉ sắt, nung vôi).',
      'Bản chất: liên kết giữa các nguyên tử thay đổi, số lượng nguyên tử mỗi nguyên tố giữ nguyên.',
      'Phản ứng toả nhiệt giải phóng nhiệt năng ra môi trường (đốt cồn, than); phản ứng thu nhiệt hấp thụ năng lượng (nung đá vôi).'
    ],
    keyObjectives: [
      'Phân biệt biến đổi vật lí và biến đổi hoá học',
      'Nhận biết dấu hiệu phản ứng: kết tủa, khí thoát ra, đổi màu, toả nhiệt/phát sáng',
      'Hiểu bản chất phản ứng ở cấp độ phân tử/nguyên tử'
    ]
  },
  {
    id: 'L_HOA_03',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 3,
    title: 'Mol và tỉ khối của chất khí',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Mol là lượng chất chứa NA (6,022.10^23) nguyên tử hoặc phân tử của chất đó.',
      'Khối lượng mol (M) tính bằng g/mol, có trị số bằng nguyên tử khối/phân tử khối (amu).',
      'Thể tích mol chất khí ở điều kiện chuẩn (25 °C, 1 bar): 1 mol chiếm 24,79 lít.',
      'Tỉ khối: $d_{A/B} = \\frac{M_A}{M_B}$; $d_{A/\\text{kk}} = \\frac{M_A}{29}$. Khí nặng hơn không khí chìm xuống đáy giếng/hang, khí nhẹ hơn bay lên.'
    ],
    keyObjectives: [
      'Chuyển đổi linh hoạt giữa số mol, khối lượng (m = n.M) và thể tích (V = 24,79.n)',
      'Tính tỉ khối để so sánh độ nặng nhẹ của các chất khí trong thực tế'
    ]
  },
  {
    id: 'L_HOA_04',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 4,
    title: 'Dung dịch và nồng độ',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Dung dịch là hỗn hợp đồng nhất của chất tan và dung môi.',
      'Độ tan (S) ở nhiệt độ xác định: số gam chất tan trong 100 g nước để tạo dung dịch bão hoà: $S = \\frac{m_{\\text{ct}}}{m_{\\text{nước}}} \\cdot 100$.',
      'Nồng độ phần trăm: $C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%$.',
      'Nồng độ mol: $C_M = \\frac{n}{V}$ (mol/L hay M).'
    ],
    keyObjectives: [
      'Phân biệt dung dịch chưa bão hoà và dung dịch bão hoà',
      'Tính toán C% và C_M, thành thạo các bước pha chế dung dịch theo nồng độ cho trước'
    ]
  },
  {
    id: 'L_HOA_05',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 5,
    title: 'Định luật bảo toàn khối lượng và phương trình hoá học',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Định luật Lomonosov & Lavoisier: Trong một phản ứng hoá học, tổng khối lượng các chất sản phẩm bằng tổng khối lượng các chất phản ứng.',
      'Cân bằng PTHH bằng cách đặt hệ số thích hợp sao cho số nguyên tử mỗi nguyên tố ở hai vế bằng nhau.',
      'Ý nghĩa: tỉ lệ hệ số trong PTHH chính là tỉ lệ số phân tử cũng như tỉ lệ số mol giữa các chất.'
    ],
    keyObjectives: [
      'Áp dụng biểu thức bảo toàn khối lượng $m_A + m_B = m_C + m_D$',
      'Cân bằng thành thạo các PTHH từ đơn giản đến trung bình'
    ]
  },
  {
    id: 'L_HOA_06',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 6,
    title: 'Tính theo phương trình hoá học & Hiệu suất phản ứng',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Các bước giải: Đổi dữ kiện đề bài ra số mol -> Viết & cân bằng PTHH -> Đặt tỉ lệ mol tìm chất cần tính -> Đổi số mol ra khối lượng/thể tích.',
      'Bài toán chất dư: so sánh tỉ lệ n_cho / hệ số của từng chất tham gia để xác định chất nào hết trước.',
      'Hiệu suất phản ứng: $H = \\frac{m_{\\text{tt}}}{m_{\\text{lt}}} \\cdot 100\\% = \\frac{n_{\\text{tt}}}{n_{\\text{lt}}} \\cdot 100\\%$.'
    ],
    keyObjectives: [
      'Tính lượng chất phản ứng hoặc sản phẩm theo PTHH',
      'Tính hiệu suất phản ứng trong các quy trình công nghiệp và phòng thí nghiệm'
    ]
  },
  {
    id: 'L_HOA_07',
    domain: 'HOA_HOC',
    chapterNumber: 1,
    chapterTitle: 'Chương I: Phản ứng hoá học',
    lessonNumber: 7,
    title: 'Tốc độ phản ứng và chất xúc tác',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Tốc độ phản ứng là đại lượng đặc trưng cho sự nhanh hay chậm của phản ứng hoá học.',
      'Các yếu tố ảnh hưởng: Nồng độ, Nhiệt độ, Diện tích bề mặt tiếp xúc, Chất xúc tác.',
      'Chất xúc tác làm tăng tốc độ phản ứng nhưng không bị biến đổi về lượng và chất sau phản ứng (ví dụ MnO2 phân huỷ H2O2, men tiêu hoá).'
    ],
    keyObjectives: [
      'Giải thích hiện tượng tăng/giảm tốc độ trong đời sống (bảo quản thức ăn tủ lạnh, đập nhỏ than đá)',
      'Phân biệt chất xúc tác và chất ức chế'
    ]
  },
  {
    id: 'L_HOA_08',
    domain: 'HOA_HOC',
    chapterNumber: 2,
    chapterTitle: 'Chương II: Một số hợp chất thông dụng',
    lessonNumber: 8,
    title: 'Acid',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Acid là hợp chất mà phân tử gồm có nguyên tử H liên kết với gốc acid. Khi tan trong nước tạo ra ion H+.',
      'Tính chất: làm quỳ tím hoá đỏ; tác dụng với kim loại đứng trước H tạo muối và giải phóng H2.',
      'Các acid thông dụng: HCl (dịch vị dạ dày, tẩy gỉ), H2SO4 (công nghiệp hoá chất, lưu ý không đổ nước vào acid đặc), CH3COOH (giấm ăn 2-5%).'
    ],
    keyObjectives: [
      'Nhận biết dung dịch acid bằng quỳ tím',
      'Viết PTHH acid tác dụng với kim loại giải phóng khí H2',
      'Nắm vững ứng dụng và quy tắc an toàn với acid sunfuric đặc'
    ]
  },
  {
    id: 'L_HOA_09',
    domain: 'HOA_HOC',
    chapterNumber: 2,
    chapterTitle: 'Chương II: Một số hợp chất thông dụng',
    lessonNumber: 9,
    title: 'Base & Thang pH',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Base gồm nguyên tử kim loại liên kết với 1 hay nhiều nhóm hydroxide (-OH). Tan tạo ion OH-.',
      'Base tan (kiềm: NaOH, KOH, Ba(OH)2, Ca(OH)2) làm quỳ tím hoá xanh, phenolphthalein hoá hồng.',
      'Base tác dụng với acid tạo muối và nước (phản ứng trung hoà).',
      'Thang pH (1 - 14): pH < 7 là acid, pH = 7 là trung tính, pH > 7 là base (kiềm).'
    ],
    keyObjectives: [
      'Phân loại base tan (kiềm) và base không tan',
      'Sử dụng giấy chỉ thị pH và hiểu ý nghĩa pH đất, pH dịch vị dạ dày, pH máu'
    ]
  },
  {
    id: 'L_HOA_10',
    domain: 'HOA_HOC',
    chapterNumber: 2,
    chapterTitle: 'Chương II: Một số hợp chất thông dụng',
    lessonNumber: 10,
    title: 'Oxide',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Oxide là hợp chất của 2 nguyên tố, trong đó có một nguyên tố là oxygen.',
      'Oxide base (thường là kim loại: CaO, Fe2O3, Na2O) tác dụng với acid tạo muối + nước.',
      'Oxide acid (thường là phi kim: CO2, SO2, SO3, P2O5) tác dụng với kiềm tạo muối + nước.',
      'Oxide lưỡng tính (Al2O3, ZnO) tác dụng cả acid và base; Oxide trung tính (CO, NO) không tạo muối.'
    ],
    keyObjectives: [
      'Phân loại 4 nhóm oxide: base, acid, lưỡng tính, trung tính',
      'Viết PTHH tạo oxide và phản ứng đặc trưng với acid/base'
    ]
  },
  {
    id: 'L_HOA_11',
    domain: 'HOA_HOC',
    chapterNumber: 2,
    chapterTitle: 'Chương II: Một số hợp chất thông dụng',
    lessonNumber: 11,
    title: 'Muối & Phản ứng trao đổi',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Muối tạo thành từ sự thay thế ion H+ của acid bằng ion kim loại hoặc ion ammonium (NH4+).',
      'Tính chất hoá học: tác dụng với kim loại mạnh hơn, tác dụng với acid, tác dụng với kiềm, tác dụng với dung dịch muối khác.',
      'Điều kiện phản ứng trao đổi trong dung dịch: sản phẩm phải có chất kết tủa hoặc chất khí hoặc chất điện li rất yếu (nước).'
    ],
    keyObjectives: [
      'Tra cứu bảng tính tan để xác định trạng thái kết tủa/dung dịch',
      'Xác định điều kiện xảy ra phản ứng trao đổi trong dung dịch'
    ]
  },
  {
    id: 'L_HOA_12',
    domain: 'HOA_HOC',
    chapterNumber: 2,
    chapterTitle: 'Chương II: Một số hợp chất thông dụng',
    lessonNumber: 12,
    title: 'Phân bón hoá học',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Phân đạm cung cấp N (thúc đẩy sinh trưởng lá, cành): Urea (NH2)2CO, NH4NO3.',
      'Phân lân cung cấp P (thúc đẩy phát triển rễ, hoa, quả): Superphosphate Ca(H2PO4)2.',
      'Phân kali cung cấp K (tăng quang hợp, vận chuyển dinh dưỡng, chịu rét/hạn): KCl, K2SO4.',
      'Phân NPK (hỗn hợp N-P-K); Quy tắc bón 4 đúng: đúng loại, đúng liều, đúng lúc, đúng cách.'
    ],
    keyObjectives: [
      'Xác định vai trò của các nguyên tố đa lượng N, P, K đối với cây trồng',
      'Tính hàm lượng dinh dưỡng và tác hại của bón phân dư thừa gây ô nhiễm đất, nước'
    ]
  },

  // --- VẬT LÍ (NĂNG LƯỢNG VÀ SỰ BIẾN ĐỔI) ---
  {
    id: 'L_LY_13',
    domain: 'VAT_LI',
    chapterNumber: 3,
    chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
    lessonNumber: 13,
    title: 'Khối lượng riêng & Thực hành xác định khối lượng riêng',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Khối lượng riêng: $D = \\frac{m}{V}$ (khối lượng của một đơn vị thể tích chất đó).',
      'Đơn vị: kg/m3 hoặc g/cm3 (1 g/cm3 = 1000 kg/m3 = 1 g/mL).',
      'Trọng lượng riêng: $d = \\frac{P}{V} = 10 \\cdot D$ (N/m3).',
      'Đo khối lượng riêng vật rắn: cân m bằng cân điện tử, đo V bằng bình chia độ hoặc hình học V = a.b.c.'
    ],
    keyObjectives: [
      'Nắm vững định nghĩa và công thức $D = \\frac{m}{V}$',
      'Thao tác đo m và V cho vật rắn không thấm nước và chất lỏng'
    ]
  },
  {
    id: 'L_LY_15',
    domain: 'VAT_LI',
    chapterNumber: 3,
    chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
    lessonNumber: 15,
    title: 'Áp lực và Áp suất trên một bề mặt',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Áp lực là lực ép có phương vuông góc với mặt bị ép.',
      'Áp suất: $p = \\frac{F}{S}$ (đơn vị Paxcan: $1\\text{ Pa} = 1\\text{ N/m}^2$; $1\\text{ bar} = 10^5\\text{ Pa}$; $1\\text{ atm} = 1{,}013 \\cdot 10^5\\text{ Pa}$).',
      'Nguyên tắc tăng áp suất: tăng F hoặc giảm S (mũi đinh, lưỡi dao).',
      'Nguyên tắc giảm áp suất: giảm F hoặc tăng S (bản xích xe tăng, nhiều bánh xe tải, đệm mút).'
    ],
    keyObjectives: [
      'Phân biệt áp lực và áp suất',
      'Vận dụng công thức $p = \\frac{F}{S}$ để giải thích các hiện tượng thực tế'
    ]
  },
  {
    id: 'L_LY_16',
    domain: 'VAT_LI',
    chapterNumber: 3,
    chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
    lessonNumber: 16,
    title: 'Áp suất chất lỏng & Áp suất khí quyển',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Chất lỏng gây áp suất theo mọi phương lên đáy bình, thành bình và các vật nhúng trong lòng nó.',
      'Áp suất tăng theo độ sâu h. Bình thông nhau chứa cùng chất lỏng đứng yên thì mực mặt thoáng các nhánh ở cùng độ cao.',
      'Nguyên lí Pascal: Áp suất tác dụng lên chất lỏng kín được truyền nguyên vẹn theo mọi hướng (máy nén thuỷ lực $\\frac{F}{f} = \\frac{S}{s}$).',
      'Khí quyển tác dụng áp suất khí quyển lên mọi vật trên Trái Đất (hiện tượng giác hút, bình xịt, vòi tai).'
    ],
    keyObjectives: [
      'Giải thích vì sao chân đập thủy điện luôn xây dày hơn đỉnh',
      'Tính lực nâng của máy nén thuỷ lực theo nguyên lí Pascal',
      'Chứng minh sự tồn tại của áp suất khí quyển qua thí nghiệm úp ngược cốc nước'
    ]
  },
  {
    id: 'L_LY_17',
    domain: 'VAT_LI',
    chapterNumber: 3,
    chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
    lessonNumber: 17,
    title: 'Lực đẩy Archimedes & Điều kiện vật nổi, vật chìm',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Vật nhúng trong chất lỏng chịu lực đẩy hướng thẳng đứng từ dưới lên gọi là lực đẩy Archimedes: $F_A = d \\cdot V$.',
      'd là trọng lượng riêng chất lỏng (N/m3), V là thể tích phần chất lỏng bị vật chiếm chỗ (m3).',
      'Điều kiện nổi - chìm:',
      '+ $F_A < P$ ($d_{\\text{vật}} > d_{\\text{lỏng}}$): vật chìm xuống.',
      '+ $F_A = P$ ($d_{\\text{vật}} = d_{\\text{lỏng}}$): vật lơ lửng.',
      '+ $F_A > P$ ($d_{\\text{vật}} < d_{\\text{lỏng}}$): vật nổi lên đến khi $F_A = P$.'
    ],
    keyObjectives: [
      'Vận dụng công thức $F_A = d \\cdot V$ để tính lực đẩy hoặc thể tích chiếm chỗ',
      'Giải thích vì sao tàu thép nặng vạn tấn vẫn nổi trên biển'
    ]
  },
  {
    id: 'L_LY_18',
    domain: 'VAT_LI',
    chapterNumber: 4,
    chapterTitle: 'Chương IV: Tác dụng làm quay của lực & Đòn bẩy',
    lessonNumber: 18,
    title: 'Tác dụng làm quay của lực & Moment lực',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Lực làm quay vật khi giá của lực không song song và không cắt trục quay.',
      'Tác dụng làm quay được đặc trưng bởi moment lực M. Moment lực càng lớn khi lực F càng lớn hoặc khoảng cách d từ trục quay đến giá của lực càng lớn.',
      'Quy tắc moment: Để vật có trục quay cân bằng, tổng moment lực làm quay theo chiều kim đồng hồ bằng tổng moment lực làm quay ngược chiều kim đồng hồ.'
    ],
    keyObjectives: [
      'Xác định điều kiện để lực làm quay vật quanh trục',
      'Hiểu vì sao nắm tay cầm xa bản lề cửa giúp mở cửa nhẹ nhàng hơn'
    ]
  },
  {
    id: 'L_LY_19',
    domain: 'VAT_LI',
    chapterNumber: 4,
    chapterTitle: 'Chương IV: Tác dụng làm quay của lực & Đòn bẩy',
    lessonNumber: 19,
    title: 'Đòn bẩy và ứng dụng trong đời sống',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Đòn bẩy là thanh cứng quay quanh điểm tựa O.',
      'Loại 1: Điểm tựa O nằm giữa điểm đặt lực F1 và tải F2 (bập bênh, kéo cắt giấy, xà beng, búa nhổ đinh).',
      'Loại 2: Tải nằm giữa điểm tựa O và lực (xe rùa, kẹp hạt, mở nắp chai) -> luôn lợi về lực.',
      'Loại 3: Lực tác dụng nằm giữa điểm tựa và tải (cần câu cá, đũa ăn, nhíp, cánh tay người) -> thiệt về lực nhưng lợi về đường đi/tốc độ.',
      'Cân bằng đòn bẩy: $F_1 \\cdot d_1 = F_2 \\cdot d_2$.'
    ],
    keyObjectives: [
      'Phân loại chính xác 3 loại đòn bẩy trong đời sống và kỹ thuật',
      'Nhận diện các hệ thống đòn bẩy trên cơ thể người (khớp khuỷu tay, bàn chân)'
    ]
  },
  {
    id: 'L_LY_20',
    domain: 'VAT_LI',
    chapterNumber: 5,
    chapterTitle: 'Chương V: Điện',
    lessonNumber: 20,
    title: 'Hiện tượng nhiễm điện do cọ xát & Dòng điện',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Cọ xát làm electron dịch chuyển từ vật này sang vật khác: nhận thêm electron -> nhiễm điện âm (-); mất bớt electron -> nhiễm điện dương (+).',
      'Hai vật nhiễm điện cùng dấu thì đẩy nhau, khác dấu thì hút nhau.',
      'Dòng điện là dòng chuyển dời có hướng của các hạt mang điện. Trong kim loại, dòng điện là dòng chuyển dời có hướng của các electron tự do (từ cực âm sang cực dương).',
      'Chiều dòng điện quy ước: từ cực dương qua dây dẫn và thiết bị điện tới cực âm của nguồn điện.'
    ],
    keyObjectives: [
      'Giải thích hiện tượng nhiễm điện cọ xát (bụi bám cánh quạt, chải tóc)',
      'Phân biệt chiều quy ước của dòng điện và chiều dịch chuyển của electron tự do'
    ]
  },
  {
    id: 'L_LY_22',
    domain: 'VAT_LI',
    chapterNumber: 5,
    chapterTitle: 'Chương V: Điện',
    lessonNumber: 22,
    title: 'Mạch điện, Cường độ dòng điện (I) và Hiệu điện thế (U)',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Mạch điện gồm: nguồn điện, dây nối, công tắc và thiết bị tiêu thụ điện.',
      'Cường độ dòng điện I (Ampe, A hoặc mA) đo bằng Ampe kế mắc nối tiếp trong mạch.',
      'Hiệu điện thế U (Vôn, V, mV, kV) đặc trưng cho khả năng sinh ra dòng điện, đo bằng Vôn kế mắc song song với đoạn mạch cần đo.',
      'Thiết bị bảo vệ: Cầu chì (dây chì nóng chảy khi quá tải), Cầu dao tự động (Aptomat), Rơle.'
    ],
    keyObjectives: [
      'Vẽ và đọc sơ đồ mạch điện với các ký hiệu quy ước chuẩn',
      'Mắc đúng Ampe kế (nối tiếp, cực + về phía cực + nguồn) và Vôn kế (song song)'
    ]
  },
  {
    id: 'L_LY_26',
    domain: 'VAT_LI',
    chapterNumber: 6,
    chapterTitle: 'Chương VI: Nhiệt',
    lessonNumber: 26,
    title: 'Năng lượng nhiệt, Nội năng & Sự truyền nhiệt',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Năng lượng nhiệt là động năng của các phân tử, nguyên tử chuyển động nhiệt hỗn loạn không ngừng.',
      'Nội năng U của vật là tổng động năng và thế năng tương tác của các phân tử cấu tạo nên vật.',
      'Nhiệt độ càng cao thì các phân tử chuyển động càng nhanh -> nội năng tăng.',
      'Ba hình thức truyền nhiệt:',
      '+ Dẫn nhiệt: truyền trực tiếp qua va chạm phân tử (chủ yếu trong chất rắn, kim loại dẫn tốt nhất).',
      '+ Đối lưu: truyền bằng các dòng chất lỏng hoặc chất khí.',
      '+ Bức xạ nhiệt: truyền bằng các tia nhiệt (sóng điện từ), truyền được ngay cả trong chân không.'
    ],
    keyObjectives: [
      'Phân biệt nhiệt năng, nội năng và nhiệt lượng (Q)',
      'Giải thích cơ chế dẫn nhiệt, đối lưu và bức xạ nhiệt trong tự nhiên và công nghệ',
      'Hiểu cấu tạo phích nước nóng (ruột tráng bạc, lớp chân không) và hiệu ứng nhà kính'
    ]
  },
  {
    id: 'L_LY_29',
    domain: 'VAT_LI',
    chapterNumber: 6,
    chapterTitle: 'Chương VI: Nhiệt',
    lessonNumber: 29,
    title: 'Sự nở vì nhiệt của các chất',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Chất rắn, lỏng, khí đều nở ra khi nóng lên, co lại khi lạnh đi.',
      'So sánh độ nở: Chất khí nở nhiều hơn chất lỏng, chất lỏng nở nhiều hơn chất rắn.',
      'Các chất rắn/lỏng khác nhau nở vì nhiệt khác nhau; các chất khí khác nhau nở vì nhiệt giống nhau.',
      'Hiện tượng đặc biệt của nước: từ 0 °C đến 4 °C nước co lại (khối lượng riêng cực đại ở 4 °C), giúp sinh vật thủy sinh sống sót dưới đáy hồ đóng băng mùa đông.',
      'Băng kép dãn nở không đều tạo độ cong -> ứng dụng đóng ngắt điện tự động trong bàn là, rơle.'
    ],
    keyObjectives: [
      'Nêu được tính quy luật và sự khác biệt về sự nở vì nhiệt của 3 thể',
      'Giải thích khe hở đường ray xe lửa, đoạn uốn cong ống dẫn hơi, tháp Eiffel cao thêm vào mùa hè'
    ]
  },

  // --- SINH HỌC CƠ THỂ NGƯỜI ---
  {
    id: 'L_SINH_30',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 30,
    title: 'Khái quát cơ thể người & Hệ vận động',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Cơ thể người chia làm 3 phần: đầu, thân và chi (tay, chân). Khoang ngực ngăn cách khoang bụng bởi cơ hoành.',
      'Hệ vận động gồm bộ xương (khoảng 206 xương ở người trưởng thành) và hệ cơ (khoảng 600 cơ).',
      'Thành phần hoá học của xương: chất hữu cơ (protein, collagen tạo tính dẻo dai) và chất khoáng (calcium, phosphorus tạo độ cứng chắc).',
      'Các bệnh tật: Loãng xương (giảm mật độ khoáng), Cong vẹo cột sống do sai tư thế ngồi học/mang vác nặng lệch bên.'
    ],
    keyObjectives: [
      'Nhận biết cấu tạo tổng quan cơ thể và chức năng nâng đỡ, vận động',
      'Thực hành sơ cứu gãy xương cẳng tay và cẳng chân bằng nẹp cố định'
    ]
  },
  {
    id: 'L_SINH_32',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 32,
    title: 'Dinh dưỡng và tiêu hoá ở người',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Hệ tiêu hoá gồm ống tiêu hoá (miệng, hầu, thực quản, dạ dày, ruột non, ruột già, hậu môn) và tuyến tiêu hoá (tuyến nước bọt, gan, túi mật, tuyến tuỵ).',
      'Tiêu hoá cơ học (nhai, nghiền bóp) và tiêu hoá hoá học (nhờ enzyme phân giải dinh dưỡng).',
      'Ruột non là nơi diễn ra tiêu hoá hoá học triệt để nhất và hấp thụ phần lớn chất dinh dưỡng nhờ cấu trúc nếp gấp, lông ruột và vi nhung mao diện tích 400 - 500 m2.',
      'Bệnh tiêu hoá: Sâu răng (vi khuẩn lên men đường thành acid), Viêm loét dạ dày - tá tràng (vi khuẩn H. pylori, stress, cồn), ngộ độc thực phẩm.'
    ],
    keyObjectives: [
      'Trình bày đường đi và sự chuyển hoá thức ăn qua các cơ quan tiêu hoá',
      'Xây dựng khẩu phần ăn hợp lý, cân đối 4 nhóm dưỡng chất'
    ]
  },
  {
    id: 'L_SINH_33',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 33,
    title: 'Máu và hệ tuần hoàn của cơ thể người',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Máu gồm huyết tương (55%) và tế bào máu (45%: hồng cầu vận chuyển O2/CO2, bạch cầu thực bào và sinh kháng thể bảo vệ, tiểu cầu đông máu).',
      'Hệ nhóm máu ABO: Nhóm A (kháng nguyên A, kháng thể anti-B), B (B, anti-A), AB (A và B, không có kháng thể), O (không có kháng nguyên, có cả anti-A và anti-B).',
      'Hệ tuần hoàn gồm tim 4 ngăn và hệ mạch khép kín (vòng tuần hoàn nhỏ đến phổi trao đổi khí, vòng tuần hoàn lớn đi khắp cơ thể).',
      'Sơ cứu chảy máu: tĩnh mạch/mao mạch đè băng ép; động mạch garô phía trên vết thương về phía tim.'
    ],
    keyObjectives: [
      'Vẽ sơ đồ nguyên tắc truyền máu hệ ABO',
      'Thực hành đo huyết áp điện tử và giải thích chỉ số huyết áp bình thường (90-140 / 60-90 mmHg)'
    ]
  },
  {
    id: 'L_SINH_34',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 34,
    title: 'Hệ hô hấp ở người',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Hệ hô hấp gồm đường dẫn khí (mũi, họng, thanh quản, khí quản, phế quản) và cơ quan trao đổi khí (hai lá phổi chứa các phế nang).',
      'Cơ chế thông khí ở phổi nhờ hoạt động phối hợp của cơ liên sườn và cơ hoành.',
      'Trao đổi khí ở phế nang và tế bào diễn ra theo cơ chế khuếch tán từ nơi có phân áp cao sang nơi có phân áp thấp.',
      'Tác hại của khói thuốc lá chứa nicotin, CO và hắc ín làm liệt lông rung, phá huỷ phế nang và gây ung thư phổi.'
    ],
    keyObjectives: [
      'Mô tả đường đi của khí khi hít vào và thở ra',
      'Thực hành thao tác hà hơi thổi ngạt và ép tim ngoài lồng ngực khi cấp cứu đuối nước'
    ]
  },
  {
    id: 'L_SINH_35',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 35,
    title: 'Hệ bài tiết & Cân bằng môi trường trong',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Hệ bài tiết nước tiểu gồm 2 quả thận, 2 ống dẫn nước tiểu, bóng đái và ống đái. Thận lọc thải đến 90% sản phẩm bài tiết.',
      'Đơn vị chức năng của thận (nephron) gồm cầu thận, nang cầu thận và ống thận.',
      'Môi trường trong cơ thể gồm máu, nước mô và bạch huyết.',
      'Cân bằng môi trường trong (nồng độ glucose, muối NaCl, urea, pH) đảm bảo tế bào hoạt động bình thường.'
    ],
    keyObjectives: [
      'Mô tả cấu tạo đơn vị chức năng của thận',
      'Giải thích nguyên nhân hình thành sỏi thận (uống ít nước, ăn quá mặn) và nguyên lí chạy thận nhân tạo'
    ]
  },
  {
    id: 'L_SINH_37',
    domain: 'SINH_HOC',
    chapterNumber: 7,
    chapterTitle: 'Chương VII: Sinh học cơ thể người',
    lessonNumber: 37,
    title: 'Hệ thần kinh, Giác quan & Hệ nội tiết',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Hệ thần kinh gồm bộ phận trung ương (não bộ, tuỷ sống) và bộ phận ngoại biên (dây thần kinh, hạch thần kinh).',
      'Cơ quan thị giác gồm mắt (màng giác, thể thuỷ tinh, màng lưới), dây thần kinh thị giác và vùng thị giác ở thuỳ chẩm.',
      'Tật khúc xạ: Cận thị (ảnh trước màng lưới, đeo kính phân kì), Viễn thị (ảnh sau màng lưới, đeo kính hội tụ).',
      'Hệ nội tiết tiết hormone trực tiếp vào máu để điều hoà quá trình sinh lí: Tuyến yên (nhạc trưởng), Tuyến giáp (Thyroxine - chuyển hoá năng lượng, thiếu iodine gây bướu cổ), Tuyến tuỵ (Insulin hạ đường huyết, Glucagon tăng đường huyết).'
    ],
    keyObjectives: [
      'Phân biệt tật cận thị, viễn thị và biện pháp phòng tránh tật học đường',
      'Giải thích cơ chế điều hoà đường huyết của hai hormone đối kháng Insulin và Glucagon'
    ]
  },

  // --- SINH VẬT VÀ MÔI TRƯỜNG ---
  {
    id: 'L_MT_41',
    domain: 'SINH_HOC',
    chapterNumber: 8,
    chapterTitle: 'Chương VIII: Sinh vật và môi trường',
    lessonNumber: 41,
    title: 'Môi trường sống, Nhân tố sinh thái & Cân bằng tự nhiên',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    summary: [
      'Môi trường sống gồm 4 loại: môi trường trên cạn, môi trường nước, môi trường trong đất, môi trường sinh vật.',
      'Nhân tố sinh thái: Nhân tố vô sinh (ánh sáng, nhiệt độ, độ ẩm...) và Nhân tố hữu sinh (vi sinh vật, thực vật, động vật, con người).',
      'Giới hạn sinh thái là khoảng giá trị của một nhân tố sinh thái mà trong đó sinh vật có thể tồn tại và phát triển (khoảng thuận lợi, điểm gây chết). Ví dụ cá rô phi ở VN: 5,6 °C đến 42 °C.',
      'Quần thể sinh vật là tập hợp các cá thể cùng loài, cùng sống trong một không gian và thời gian xác định, có khả năng giao phối sinh con.',
      'Quần xã sinh vật là tập hợp nhiều quần thể khác loài gắn bó hữu cơ trong một sinh cảnh.',
      'Chuỗi và lưới thức ăn: Sinh vật sản xuất (cây xanh) -> Sinh vật tiêu thụ (động vật ăn cỏ, ăn thịt) -> Sinh vật phân giải (vi khuẩn, nấm).'
    ],
    keyObjectives: [
      'Phân biệt quần thể sinh vật và quần xã sinh vật qua các ví dụ thực tế',
      'Vẽ sơ đồ chuỗi thức ăn, lưới thức ăn và tháp sinh thái',
      'Phân tích biện pháp bảo vệ cân bằng tự nhiên và giảm thiểu rác thải nhựa, biến đổi khí hậu'
    ]
  }
];
