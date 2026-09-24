export interface ProblemAtom {
  problemId: string;
  title: string;
  centralQuestion: string;
  context: string;
  disciplines: ('Vật lí' | 'Hóa học' | 'Sinh học' | 'Môi trường' | 'Kỹ thuật')[];
  observedPhenomena: string[];
  measurements: { label: string; value: string; unit: string; tool: string }[];
  subproblems: {
    id: string;
    question: string;
    discipline: string;
    resolved: boolean;
  }[];
  requiredKnowledgeAtoms: {
    atomId: string;
    name: string;
    discipline: string;
    role: 'MEASURES' | 'EXPLAINS' | 'CALCULATES' | 'CONSTRAINS' | 'EVIDENCE_FOR' | 'TRANSFERS_TO';
    formulaLatex?: string;
    summary: string;
  }[];
  reasoningLayers: {
    layer: 'A_RECOGNIZE' | 'B_EXPLAIN' | 'C_DECIDE' | 'D_DESIGN_VALIDATE';
    title: string;
    prompt: string;
    evidenceItems: string[];
    correctPath: string;
    misconception: string;
  }[];
  transferTask: {
    scenario: string;
    challenge: string;
    expectedApplication: string;
  };
}

export const INTERDISCIPLINARY_PROBLEMS: ProblemAtom[] = [
  {
    problemId: 'P_BUOYANCY_OCEAN',
    title: 'Vấn đề 1: Vì sao tàu thép khổng lồ nổi được nhưng viên bi sắt nhỏ lại chìm?',
    centralQuestion: 'Tại sao cùng làm từ sắt thép (khối lượng riêng rất lớn), nhưng tàu chở hàng vạn tấn lại nổi vững vàng trên biển, còn một viên bi thép nhỏ lại chìm ngay?',
    context: 'Một chiếc tàu chở hàng bằng thép có khối lượng vỏ tàu 5.000 tấn di chuyển từ sông nước ngọt ra biển nước mặn. Học sinh quan sát thấy ngấn nước mớn nước của tàu bị thay đổi và tàu nổi cao hơn khi ra biển.',
    disciplines: ['Vật lí', 'Hóa học', 'Kỹ thuật'],
    observedPhenomena: [
      'Viên bi sắt đặc thả vào nước chìm xuống đáy ngay lập tức.',
      'Vỏ tàu làm bằng sắt đặc nhưng bên trong có nhiều khoang rỗng chứa không khí.',
      'Khi tàu chở hàng từ sông nước ngọt ra biển nước mặn, tàu nổi cao hơn một chút (mớn nước giảm).'
    ],
    measurements: [
      { label: 'Khối lượng riêng của sắt', value: '7 800', unit: 'kg/m³', tool: 'Bảng tra cứu KHTN 8' },
      { label: 'Khối lượng riêng nước ngọt', value: '1 000', unit: 'kg/m³', tool: 'Đo m và V' },
      { label: 'Khối lượng riêng nước biển (3,5% muối)', value: '1 030', unit: 'kg/m³', tool: 'Tỉ trọng kế' },
      { label: 'Trọng lượng tàu và hàng', value: '100 000 000', unit: 'N', tool: 'Trạm cân cảng' }
    ],
    subproblems: [
      { id: 'sp1', question: 'Viên bi sắt đặc có khối lượng riêng lớn hơn nước thì lực nào thắng?', discipline: 'Vật lí', resolved: false },
      { id: 'sp2', question: 'Khoang rỗng không khí làm thay đổi khối lượng riêng trung bình của toàn con tàu như thế nào?', discipline: 'Kỹ thuật', resolved: false },
      { id: 'sp3', question: 'Nồng độ muối trong nước biển ảnh hưởng ra sao đến trọng lượng riêng chất lỏng và lực đẩy Archimedes?', discipline: 'Hóa học', resolved: false }
    ],
    requiredKnowledgeAtoms: [
      {
        atomId: 'ATOM_DENSITY',
        name: 'Khối lượng riêng',
        discipline: 'Vật lí',
        role: 'CALCULATES',
        formulaLatex: 'D = \\frac{m}{V}',
        summary: 'Khối lượng riêng trung bình của vật tính bằng tổng khối lượng chia cho toàn bộ thể tích (kể cả phần rỗng).'
      },
      {
        atomId: 'ATOM_ARCHIMEDES',
        name: 'Lực đẩy Archimedes',
        discipline: 'Vật lí',
        role: 'EXPLAINS',
        formulaLatex: 'F_A = d \\cdot V = 10 \\cdot D_{\\text{lỏng}} \\cdot V_{\\text{chìm}}',
        summary: 'Lực đẩy tác dụng lên vật hướng thẳng đứng lên trên, độ lớn bằng trọng lượng phần chất lỏng bị chiếm chỗ.'
      },
      {
        atomId: 'ATOM_CONCENTRATION_SALT',
        name: 'Dung dịch muối và nồng độ',
        discipline: 'Hóa học',
        role: 'MEASURES',
        formulaLatex: 'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%',
        summary: 'Nước biển là dung dịch chứa NaCl hoà tan, làm tăng mật độ hạt và tăng khối lượng riêng của chất lỏng lên 1030 kg/m³.'
      }
    ],
    reasoningLayers: [
      {
        layer: 'A_RECOGNIZE',
        title: 'Tầng A — Nhận diện & Thu thập bằng chứng',
        prompt: 'Quan sát hai vật: viên bi sắt đặc (thể tích V nhỏ) và con tàu thép (thể tích bao ngoài V rất lớn nhờ khoang rỗng). Biến số quyết định vật chìm hay nổi trong chất lỏng là gì?',
        evidenceItems: [
          'Viên bi sắt đặc: D_sắt = 7800 kg/m³ > D_nước = 1000 kg/m³ -> Trọng lực P > Lực đẩy FA max -> Chìm.',
          'Con tàu: Thể tích bao bọc V cực lớn chứa không khí -> D_trung bình = m_tổng / V_tổng < 1000 kg/m³ -> Nổi.',
          'Nước biển có nồng độ muối hoà tan cao hơn nước ngọt -> D_biển = 1030 kg/m³ lớn hơn D_ngọt = 1000 kg/m³.'
        ],
        correctPath: 'So sánh khối lượng riêng trung bình của toàn khối vật thể (bao gồm cả khoang rỗng) với khối lượng riêng của chất lỏng.',
        misconception: 'Nghĩ rằng vật nặng thì luôn chìm, vật nhẹ thì luôn nổi (bỏ quên yếu tố thể tích và khối lượng riêng).'
      },
      {
        layer: 'B_EXPLAIN',
        title: 'Tầng B — Giải thích bản chất liên môn',
        prompt: 'Tại sao khi tàu đi từ sông nước ngọt ra biển nước mặn, phần thân tàu chìm trong nước (mớn nước) lại giảm bớt?',
        evidenceItems: [
          'Trọng lượng tàu P không đổi khi chuyển vùng nước.',
          'Điều kiện nổi cân bằng: F_A = P <=> d_lỏng * V_chìm = P.',
          'Vì nước biển có muối hoà tan (Hóa học) nên d_biển > d_sông -> V_chìm ở biển phải nhỏ hơn V_chìm ở sông (Vật lí).'
        ],
        correctPath: 'Do d_biển > d_sông, để tạo ra cùng độ lớn lực đẩy FA cân bằng với trọng lượng P, thể tích phần chìm V_chìm của tàu ở biển sẽ nhỏ hơn, khiến tàu nổi cao hơn.',
        misconception: 'Nghĩ rằng muối bám vào đáy tàu làm tàu nặng thêm nên tàu bị kéo xuống.'
      },
      {
        layer: 'C_DECIDE',
        title: 'Tầng C — Ra quyết định kỹ thuật / khoa học',
        prompt: 'Kỹ sư cần tính toán tải trọng hàng hoá tối đa khi tàu chở hàng xếp hàng ở cảng sông trước khi ra biển khơi. Họ cần căn cứ vào đường kẻ mớn nước Plimsoll nào?',
        evidenceItems: [
          'Vạch nước ngọt (Fresh Water - F) cho phép tàu chìm sâu hơn khi còn ở cảng sông.',
          'Khi ra biển (Summer Salt Water - S), độ mặn nâng tàu lên đúng vạch an toàn hàng hải quốc tế.'
        ],
        correctPath: 'Xếp hàng sao cho khi ở sông tàu chìm đến vạch Fresh Water, khi ra biển nước mặn lực đẩy lớn hơn sẽ nâng tàu về đúng vạch an toàn chuẩn.',
        misconception: 'Chất đầy hàng ở cảng sông đến kịch vạch biển, khiến tàu có nguy cơ bị đắm khi gặp sóng gió cửa sông.'
      },
      {
        layer: 'D_DESIGN_VALIDATE',
        title: 'Tầng D — Thiết kế giải pháp & Kiểm chứng thực nghiệm',
        prompt: 'Đề xuất phương án thí nghiệm kiểm chứng tại phòng thực hành để chứng minh sự thay đổi lực đẩy Archimedes trong dung dịch muối.',
        evidenceItems: [
          'Dùng lực kế treo một quả nặng nhúng vào cốc nước tinh khiết: ghi số chỉ P1.',
          'Hòa thêm 50g muối ăn (NaCl) vào cốc, khuấy tan đều: ghi số chỉ P2.',
          'So sánh: P2 < P1 chứng tỏ lực đẩy FA2 = P - P2 lớn hơn FA1.'
        ],
        correctPath: 'Dùng lực kế đo trọng lượng biểu kiến của vật nhúng trong nước cất so với nhúng trong nước muối nồng độ cao để thấy FA tăng theo khối lượng riêng chất lỏng.',
        misconception: 'Chỉ thả mắt nhìn mà không dùng lực kế để lượng hoá độ chênh lệch số đo.'
      }
    ],
    transferTask: {
      scenario: 'Cá trong tự nhiên điều chỉnh độ sâu nổi/chìm nhờ bóng cá (chứa khí).',
      challenge: 'Vận dụng nguyên lý khối lượng riêng và lực đẩy Archimedes, giải thích cách cá nổi lên hoặc lặn sâu mà không cần quẫy vây liên tục.',
      expectedApplication: 'Khi muốn nổi lên, cá tiết khí làm phồng bóng cá -> tăng thể tích V của cơ thể -> giảm khối lượng riêng trung bình D cơ thể < D nước -> FA > P đẩy cá lên. Khi muốn lặn, cá co bóp giảm thể tích bóng cá -> D tăng -> cá chìm xuống.'
    }
  },
  {
    problemId: 'P_ELECTRIC_TROUBLESHOOT',
    title: 'Vấn đề 2: Chẩn đoán và xử lý sự cố mạch điện trong gia đình và phòng học',
    centralQuestion: 'Một bóng đèn trong phòng thí nghiệm không sáng dù đã đóng công tắc. Làm thế nào để dùng tư duy khoa học tìm ra chính xác điểm bị đứt mạch mà không phải thay toàn bộ thiết bị?',
    context: 'Trong giờ thực hành, nhóm học sinh lắp mạch gồm nguồn điện 6V, công tắc, ampe kế và bóng đèn. Khi đóng khoá K, đèn không sáng và kim ampe kế chỉ số 0. Một bạn vội vàng kết luận bóng đèn đã cháy và đòi vứt đi.',
    disciplines: ['Vật lí', 'Hóa học', 'Kỹ thuật'],
    observedPhenomena: [
      'Đóng công tắc K nhưng đèn không phát sáng.',
      'Ampe kế mắc nối tiếp trong mạch chỉ I = 0 A.',
      'Các đầu dây nối có dấu hiệu bị oxy hóa (gỉ màu xám xỉn ở chốt kim loại).'
    ],
    measurements: [
      { label: 'Hiệu điện thế nguồn (Pin/Ắc quy)', value: '6,2', unit: 'V', tool: 'Vôn kế đo 2 cực nguồn' },
      { label: 'Dòng điện trong mạch', value: '0,0', unit: 'A', tool: 'Ampe kế' },
      { label: 'Hiệu điện thế giữa hai đầu bóng đèn', value: '0,0', unit: 'V', tool: 'Vôn kế' },
      { label: 'Hiệu điện thế giữa hai cực công tắc K', value: '6,2', unit: 'V', tool: 'Vôn kế' }
    ],
    subproblems: [
      { id: 'sp1', question: 'Vì sao kim ampe kế chỉ 0 A? Điều kiện để có dòng điện chạy trong mạch là gì?', discipline: 'Vật lí', resolved: false },
      { id: 'sp2', question: 'Lớp gỉ xám xỉn trên đầu nối kim loại là chất gì? Lớp oxit này dẫn điện hay cách điện?', discipline: 'Hóa học', resolved: false },
      { id: 'sp3', question: 'Vôn kế chỉ 6,2V ở hai cực công tắc K chứng tỏ điều gì về tình trạng tiếp xúc của công tắc?', discipline: 'Kỹ thuật', resolved: false }
    ],
    requiredKnowledgeAtoms: [
      {
        atomId: 'ATOM_CIRCUIT_CONDITIONS',
        name: 'Mạch điện kín & Dòng điện',
        discipline: 'Vật lí',
        role: 'EXPLAINS',
        summary: 'Dòng điện là dòng các điện tích dịch chuyển có hướng. Dòng điện chỉ tồn tại trong một mạch kín liên tục từ cực dương qua tải về cực âm.'
      },
      {
        atomId: 'ATOM_CORROSION_OXIDE',
        name: 'Sự ăn mòn kim loại & Lớp Oxide',
        discipline: 'Hóa học',
        role: 'EVIDENCE_FOR',
        formulaLatex: '2\\text{Cu} + \\text{O}_2 \\rightarrow 2\\text{CuO}',
        summary: 'Kim loại tiếp xúc với không khí ẩm tạo thành lớp oxide kim loại (CuO, Fe2O3) là chất cách điện hoặc dẫn điện rất kém, gây cản trở tiếp xúc.'
      },
      {
        atomId: 'ATOM_VOLTMETER_DIAGNOSIS',
        name: 'Chẩn đoán bằng hiệu điện thế',
        discipline: 'Vật lí',
        role: 'MEASURES',
        formulaLatex: 'U_{\\text{đứt}} = U_{\\text{nguồn}}',
        summary: 'Khi mạch bị hở tại một điểm, hiệu điện thế đo tại hai đầu điểm hở đó sẽ xấp xỉ bằng toàn bộ hiệu điện thế nguồn.'
      }
    ],
    reasoningLayers: [
      {
        layer: 'A_RECOGNIZE',
        title: 'Tầng A — Nhận diện triệu chứng & Số liệu',
        prompt: 'Nhìn vào số đo: Vôn kế mắc vào 2 cực nguồn đo được 6,2V (nguồn tốt), nhưng Ampe kế trong mạch chỉ 0A. Điều này khẳng định kết luận gì về trạng thái của mạch?',
        evidenceItems: [
          'Nguồn điện vẫn duy trì hiệu điện thế 6,2V -> Nguồn không bị kiệt pin.',
          'Dòng điện I = 0 A -> Mạch đang bị hở (đứt mạch) ở ít nhất một vị trí.',
          'Chưa thể khẳng định bóng đèn cháy vì dòng điện chưa hề chạy qua đèn.'
        ],
        correctPath: 'Mạch đang ở trạng thái hở mạch; cần dò từng đoạn tiếp xúc thay vì phỏng đoán vội vàng.',
        misconception: 'Cứ đèn không sáng là cho rằng bóng đèn bị cháy dây tóc.'
      },
      {
        layer: 'B_EXPLAIN',
        title: 'Tầng B — Cơ chế hóa học & vật lí',
        prompt: 'Tại sao vôn kế đo được 6,2V giữa hai tiếp điểm công tắc K, và lớp gỉ xỉn màu ở chốt đóng vai trò gì?',
        evidenceItems: [
          'Vôn kế có điện trở rất lớn; khi công tắc bị hở do tiếp xúc kém, toàn bộ hiệu điện thế nguồn tập trung tại điểm hở.',
          'Đầu chốt đồng bị oxi hóa tạo thành màng CuO cách điện (Hóa học), ngăn các electron tự do dịch chuyển qua công tắc (Vật lí).'
        ],
        correctPath: 'Lớp oxit kim loại cách điện tại điểm tiếp xúc của công tắc làm mạch bị ngắt quãng, biến công tắc thành điểm hở mạch mang hiệu điện thế nguồn.',
        misconception: 'Nghĩ rằng điểm nào đứt thì ở đó hiệu điện thế phải bằng 0V.'
      },
      {
        layer: 'C_DECIDE',
        title: 'Tầng C — Quyết định xử lý',
        prompt: 'Học sinh nên thực hiện thao tác kỹ thuật nào trước khi quyết định thay thế linh kiện?',
        evidenceItems: [
          'Dùng giấy nhám chà sạch lớp oxit cách điện trên các cực tiếp xúc.',
          'Siết chặt lại các ốc vít nối dây.',
          'Kiểm tra lại bằng vôn kế xem hiệu điện thế rơi trên công tắc đã giảm về 0V (tiếp xúc hoàn hảo) hay chưa.'
        ],
        correctPath: 'Dùng giấy ráp chà sạch lớp màng oxit cách điện trên tiếp điểm và siết chặt chốt nối; kiểm tra lại mạch hoạt động bình thường.',
        misconception: 'Vội vàng thay bóng đèn mới đắt tiền trong khi lỗi do tiếp điểm bám gỉ.'
      },
      {
        layer: 'D_DESIGN_VALIDATE',
        title: 'Tầng D — Kiểm chứng & Đảm bảo an toàn',
        prompt: 'Sau khi làm sạch tiếp điểm và đóng mạch, bóng đèn sáng bình thường. Ampe kế chỉ 0,35A. Hãy lập phương án bảo vệ mạch tránh quá tải chập cháy.',
        evidenceItems: [
          'Mắc thêm một cầu chì hoặc aptomat cỡ 0,5A vào dây nóng.',
          'Dùng băng dính cách điện quấn kín các mối nối hở tránh chạm chập gây đoản mạch.'
        ],
        correctPath: 'Lắp cầu chì bảo vệ nối tiếp trong mạch và bọc cách điện toàn bộ mối nối hở.',
        misconception: 'Đấu tắt bỏ qua công tắc hoặc dây bảo vệ.'
      }
    ],
    transferTask: {
      scenario: 'Các cọc bình ắc quy xe máy sau một thời gian hay xuất hiện lớp muối màu trắng xanh xùi ra khiến xe không đề được máy.',
      challenge: 'Vận dụng kiến thức ăn mòn điện hóa và tiếp xúc điện để giải thích hiện tượng và cách xử lý tại nhà.',
      expectedApplication: 'Hơi acid H2SO4 từ ắc quy phản ứng với cọc chì/đồng tạo lớp muối PbSO4/CuSO4 cách điện làm ngắt mạch khởi động. Cách xử lý: Dùng nước nóng hòa chút baking soda rửa sạch muối, chà giấy ráp làm bóng kim loại rồi bôi mỡ bò chống oxi hóa.'
    }
  },
  {
    problemId: 'P_HEAT_WATER_CONTAINER',
    title: 'Vấn đề 3: Bí quyết giữ nhiệt của phích nước và điều hòa thân nhiệt',
    centralQuestion: 'Tại sao ruột phích nước lại được tráng bạc sáng bóng, có lớp chân không ở giữa, và nguyên lý này tương đồng như thế nào với cơ chế thoát mồ hôi làm mát của cơ thể người?',
    context: 'Trong mùa hè nắng nóng 38 °C, học sinh mang nước đá đi học bằng bình giữ nhiệt chân không, sau 8 tiếng nước vẫn mát lạnh. Trong khi đó, cơ thể học sinh khi vận động thể thao lại toát mồ hôi và cảm thấy mát hơn khi có gió quạt.',
    disciplines: ['Vật lí', 'Hóa học', 'Sinh học'],
    observedPhenomena: [
      'Bình giữ nhiệt cấu tạo gồm 2 lớp vỏ inox, ở giữa là chân không, bề mặt bên trong sáng bóng như gương.',
      'Nước sôi đựng trong bình giữ nhiệt 1 ngày vẫn nóng, nước đá đựng cả ngày không tan hết.',
      'Cơ thể người khi tập thể dục toát mồ hôi; đứng trước quạt thấy da mát rượi.'
    ],
    measurements: [
      { label: 'Nhiệt độ ngoài trời', value: '38,0', unit: '°C', tool: 'Nhiệt kế thủy ngân' },
      { label: 'Thân nhiệt người bình thường', value: '37,0', unit: '°C', tool: 'Nhiệt kế điện tử' },
      { label: 'Nhiệt dung riêng của nước c', value: '4 200', unit: 'J/kg.K', tool: 'Bảng tra cứu' },
      { label: 'Nhiệt lượng bay hơi của nước L', value: '2 260 000', unit: 'J/kg', tool: 'SGV Vật lí' }
    ],
    subproblems: [
      { id: 'sp1', question: 'Có những con đường truyền nhiệt nào (dẫn nhiệt, đối lưu, bức xạ)? Lớp chân không ngăn được con đường nào?', discipline: 'Vật lí', resolved: false },
      { id: 'sp2', question: 'Bề mặt tráng gương sáng bóng ngăn cản hình thức truyền nhiệt nào?', discipline: 'Vật lí', resolved: false },
      { id: 'sp3', question: 'Tại sao sự bay hơi mồ hôi (chuyển thể lỏng sang hơi) lại lấy đi một lượng nhiệt lớn từ cơ thể?', discipline: 'Hóa học & Sinh học', resolved: false }
    ],
    requiredKnowledgeAtoms: [
      {
        atomId: 'ATOM_HEAT_TRANSFER_MODES',
        name: 'Ba hình thức truyền nhiệt',
        discipline: 'Vật lí',
        role: 'EXPLAINS',
        formulaLatex: 'Q = m \\cdot c \\cdot \\Delta t',
        summary: 'Dẫn nhiệt (cần chất rắn), đối lưu (cần chất lỏng/khí), bức xạ nhiệt (truyền được qua chân không dưới dạng tia nhiệt).'
      },
      {
        atomId: 'ATOM_HEAT_EVAPORATION',
        name: 'Sự bay hơi & Nhiệt hóa hơi',
        discipline: 'Hóa học',
        role: 'CALCULATES',
        formulaLatex: 'Q_{\\text{bay hơi}} = m \\cdot L',
        summary: 'Các phân tử nước trên bề mặt da nhận nhiệt năng từ cơ thể để bẻ gãy liên kết hydro chuyển sang thể hơi, lấy đi 2,26.10^6 J nhiệt năng cho mỗi kg nước.'
      },
      {
        atomId: 'ATOM_THERMOREGULATION',
        name: 'Da và điều hòa thân nhiệt',
        discipline: 'Sinh học',
        role: 'EVIDENCE_FOR',
        summary: 'Khi thân nhiệt tăng, trung khu điều nhiệt kích thích tuyến mồ hôi tiết nhiều nước lên bề mặt da và làm giãn mao mạch dưới da để giải phóng nhiệt lượng.'
      }
    ],
    reasoningLayers: [
      {
        layer: 'A_RECOGNIZE',
        title: 'Tầng A — Nhận diện rào cản truyền nhiệt',
        prompt: 'Phân tích các rào cản truyền nhiệt trong bình giữ nhiệt: Lớp chân không và lớp tráng bạc xử lý những dạng truyền nhiệt nào?',
        evidenceItems: [
          'Chân không không có phân tử vật chất -> Triệt tiêu hoàn toàn dẫn nhiệt và đối lưu.',
          'Lớp tráng bạc sáng bóng -> Phản xạ lại các tia bức xạ nhiệt hồng ngoại, ngăn cản bức xạ nhiệt thoát ra ngoài hoặc xâm nhập vào trong.'
        ],
        correctPath: 'Chân không ngăn dẫn nhiệt & đối lưu; bề mặt phản xạ kim loại ngăn bức xạ nhiệt.',
        misconception: 'Nghĩ rằng bình giữ nhiệt tự nó sinh ra nhiệt độ nóng hoặc lạnh.'
      },
      {
        layer: 'B_EXPLAIN',
        title: 'Tầng B — Liên kết Sinh - Hóa - Lí trong cơ thể',
        prompt: 'Tại sao khi trời nóng 38 °C (nhiệt độ môi trường cao hơn thân nhiệt 37 °C), cơ thể chỉ còn duy nhất cơ chế bay hơi mồ hôi để tỏa nhiệt?',
        evidenceItems: [
          'Khi T_môi trường > T_cơ thể, nhiệt chỉ có xu hướng truyền từ môi trường VÀO cơ thể qua dẫn nhiệt và bức xạ.',
          'Cơ thể không thể truyền nhiệt trực tiếp ra ngoài bằng dẫn nhiệt được nữa.',
          'Nước trong mồ hôi có nhiệt hóa hơi rất lớn (L = 2,26.10^6 J/kg). Mỗi gram mồ hôi bay hơi lấy đi hơn 2 260 J nhiệt từ mạch máu dưới da.'
        ],
        correctPath: 'Khi môi trường nóng hơn cơ thể, sự bay hơi thu nhiệt của nước mồ hôi là con đường giải nhiệt sống còn của sinh vật hằng nhiệt.',
        misconception: 'Tưởng quạt sinh ra hơi lạnh làm mát cơ thể, thực chất gió quạt làm tăng tốc độ bay hơi mồ hôi.'
      },
      {
        layer: 'C_DECIDE',
        title: 'Tầng C — Ứng dụng & Ra quyết định chăm sóc sức khỏe',
        prompt: 'Khi tập thể thao trời nắng nóng, tại sao việc mặc áo bó sát chất liệu không thấm hút mồ hôi là cực kỳ nguy hiểm?',
        evidenceItems: [
          'Độ ẩm dưới lớp vải tăng cao 100%, mồ hôi đọng thành giọt rơi xuống chứ không bay hơi được.',
          'Mồ hôi không bay hơi thì không lấy đi nhiệt lượng -> Thân nhiệt tăng vọt -> Gây sốc nhiệt (Heat stroke).'
        ],
        correctPath: 'Cần mặc áo mỏng, thoáng khí, hút ẩm tốt để mồ hôi dễ dàng bay hơi làm mát cơ thể, đồng thời uống bổ sung nước và muối khoáng điện giải.',
        misconception: 'Mặc áo dày nilon để toát nhiều mồ hôi cho "giảm cân nhanh", dẫn đến nguy cơ trụy tim mạch do mất nước và sốc nhiệt.'
      },
      {
        layer: 'D_DESIGN_VALIDATE',
        title: 'Tầng D — Thiết kế thí nghiệm làm mát tự nhiên',
        prompt: 'Thiết kế mô hình "Tủ lạnh sa mạc Zeer pot" (2 chậu đất nung lồng vào nhau, ở giữa là cát ướt) để bảo quản rau củ không cần dùng điện.',
        evidenceItems: [
          'Nước từ cát ẩm thấm qua thành đất nung ra ngoài và liên tục bay hơi dưới ánh nắng sa mạc khô ráo.',
          'Quá trình bay hơi thu nhiệt từ chậu bên trong, hạ nhiệt độ lòng chậu xuống thấp hơn ngoài trời 6-10 °C.'
        ],
        correctPath: 'Dùng hai chậu gốm đất nung lồng nhau kẹp cát ướt; kiểm chứng bằng cách đo nhiệt kế bên trong thấp hơn nhiệt độ môi trường xung quanh.',
        misconception: 'Bọc kín nilon chậu gốm khiến nước không bay hơi được, làm nhiệt độ bên trong nóng lên như nhà kính.'
      }
    ],
    transferTask: {
      scenario: 'Người bị sốt cao 39 °C, dân gian hay có thói quen đắp chăn kín mít.',
      challenge: 'Dựa vào kiến thức truyền nhiệt và thoát nhiệt qua da, hãy giải thích vì sao đắp chăn kín khi sốt là sai lầm nguy hiểm và chỉ ra cách chườm đúng.',
      expectedApplication: 'Đắp chăn cản trở đối lưu và bay hơi mồ hôi khiến nhiệt tích tụ làm sốt cao hơn dẫn đến co giật. Cách đúng: Lau người bằng khăn ấm (khoảng 32-35 °C) để giãn mạch máu và nước trên da bay hơi nhẹ nhàng mang nhiệt ra ngoài.'
    }
  },
  {
    problemId: 'P_ECOSYSTEM_POLLUTION',
    title: 'Vấn đề 4: Tác động của dư thừa phân bón hóa học tới nguồn nước và hệ sinh thái',
    centralQuestion: 'Tại sao việc bón quá nhiều phân đạm, lân cho đồng ruộng lại dẫn đến hiện tượng ao hồ quanh vùng bị bùng phát tảo xanh rồi cá chết hàng loạt?',
    context: 'Một vùng trồng trọt thâm canh ven hồ sau nhiều vụ sử dụng phân bón hóa học N-P-K với liều lượng cao, người dân thấy mặt hồ nổi váng xanh dày đặc, bốc mùi tanh hôi và tôm cá trong hồ nổi đầu chết trắng vào sáng sớm.',
    disciplines: ['Hóa học', 'Sinh học', 'Môi trường'],
    observedPhenomena: [
      'Nước hồ chuyển sang màu xanh lục sẫm, độ trong suốt giảm mạnh.',
      'Tảo lục và vi khuẩn lam sinh sôi bùng nổ bao phủ toàn bộ mặt nước.',
      'Cá tôm chết hàng loạt, đặc biệt vào rạng sáng khi mặt trời chưa mọc.'
    ],
    measurements: [
      { label: 'Hàm lượng ion Nitrate NO3-', value: '45,0', unit: 'mg/L (Vượt ngưỡng 4 lần)', tool: 'Que thử trắc nghiệm hóa học' },
      { label: 'Hàm lượng Phosphate PO4 3-', value: '2,5', unit: 'mg/L (Rất cao)', tool: 'Quang phổ hấp thụ' },
      { label: 'Hàm lượng oxy hòa tan (DO) lúc trưa', value: '9,5', unit: 'mg/L (Tảo quang hợp mạnh)', tool: 'Bút đo DO' },
      { label: 'Hàm lượng oxy hòa tan (DO) lúc 4h sáng', value: '0,8', unit: 'mg/L (Thiếu oxy trầm trọng)', tool: 'Bút đo DO' }
    ],
    subproblems: [
      { id: 'sp1', question: 'Các chất dinh dưỡng trong phân bón (Nitơ, Photpho) rửa trôi vào hồ đóng vai trò gì với sự phát triển của vi sinh vật?', discipline: 'Hóa học & Sinh học', resolved: false },
      { id: 'sp2', question: 'Vì sao lượng oxy hòa tan lại giảm mạnh đến mức gây ngạt cho cá vào thời điểm rạng sáng?', discipline: 'Sinh học', resolved: false },
      { id: 'sp3', question: 'Khi tảo tàn và chết đi, vi khuẩn phân giải tiêu thụ oxy và giải phóng chất độc gì?', discipline: 'Hóa học & Môi trường', resolved: false }
    ],
    requiredKnowledgeAtoms: [
      {
        atomId: 'ATOM_FERTILIZER_NPK',
        name: 'Phân bón hóa học & Tính tan',
        discipline: 'Hóa học',
        role: 'MEASURES',
        formulaLatex: '\\text{KNTT: Phân đạm (N)}, \\text{lân (P)}, \\text{kali (K)}',
        summary: 'Muối nitrate (NO3-) và phosphate tan tốt trong nước, dễ bị nước mưa rửa trôi từ ruộng lúa xuống sông hồ gây hiện tượng phú dưỡng (eutrophication).'
      },
      {
        atomId: 'ATOM_PHOTOSYNTHESIS_RESPIRATION',
        name: 'Quang hợp và Hô hấp của thủy sinh',
        discipline: 'Sinh học',
        role: 'EXPLAINS',
        formulaLatex: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\rightleftharpoons \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
        summary: 'Ban ngày có ánh sáng, tảo quang hợp thải ra O2. Ban đêm không có ánh sáng, toàn bộ sinh vật và lượng tảo khổng lồ cùng hô hấp tiêu thụ sạch O2 hòa tan.'
      },
      {
        atomId: 'ATOM_ECOLOGICAL_BALANCE',
        name: 'Cân bằng tự nhiên trong hệ sinh thái',
        discipline: 'Sinh học & Môi trường',
        role: 'CONSTRAINS',
        summary: 'Khi một mắt xích (tảo) bùng phát bất thường làm suy sụp nồng độ dưỡng khí, chuỗi thức ăn bị đứt gãy và làm sụp đổ toàn bộ cân bằng sinh thái của thủy vực.'
      }
    ],
    reasoningLayers: [
      {
        layer: 'A_RECOGNIZE',
        title: 'Tầng A — Nhận diện chuỗi mắt xích nguyên nhân',
        prompt: 'Phân tích dữ liệu: Ban ngày DO = 9,5 mg/L, nhưng rạng sáng DO sụt giảm còn 0,8 mg/L. Hiện tượng gì đã diễn ra trong lòng hồ ban đêm?',
        evidenceItems: [
          'Hàm lượng N và P dư thừa kích thích tảo phát triển cực nhanh thành váng dày (hiện tượng phú dưỡng).',
          'Ban đêm tảo không quang hợp mà chỉ hô hấp; mật độ tảo quá lớn đã hút kiệt gần như toàn bộ oxy hòa tan trong nước.',
          'Khi oxy hòa tan < 2 mg/L, cá và các loài thủy sản bắt đầu ngạt thở và chết ngạt hàng loạt.'
        ],
        correctPath: 'Hiện tượng phú dưỡng do dư phân bón làm tảo bùng phát; ban đêm tảo và sinh vật phân giải tiêu thụ hết oxy khiến cá chết ngạt.',
        misconception: 'Cho rằng cá chết vì ngộ độc trực tiếp phân bón chứ không nhận ra cơ chế thiếu oxy hòa tan do chuỗi sinh học.'
      },
      {
        layer: 'B_EXPLAIN',
        title: 'Tầng B — Cơ chế phân giải chất hữu cơ',
        prompt: 'Giai đoạn thứ hai sau khi tảo nở hoa là gì khiến nước hồ bốc mùi hôi thối nồng nặc?',
        evidenceItems: [
          'Tảo chết đi chìm xuống đáy hồ tạo thành lượng sinh khối hữu cơ khổng lồ.',
          'Vi khuẩn kị khí phân hủy xác tảo trong điều kiện không có oxy, sinh ra các khí độc và có mùi hôi như H2S (mùi trứng thối), NH3, CH4.'
        ],
        correctPath: 'Xác tảo chết bị vi khuẩn yếm khí phân giải sinh ra các khí độc H2S, NH3 làm ô nhiễm nặng nề và hủy diệt hệ sinh vật đáy.',
        misconception: 'Nghĩ rằng mùi hôi do phân bón bốc hơi lên.'
      },
      {
        layer: 'C_DECIDE',
        title: 'Tầng C — Biện pháp can thiệp cấp bách & lâu dài',
        prompt: 'Chính quyền địa phương và nông dân cần đưa ra quyết định gì để cứu vãn hệ sinh thái hồ?',
        evidenceItems: [
          'Cấp bách: Vận hành máy sục khí tạo oxy nhân tạo, vớt xác tảo và cá chết lên bờ xử lý.',
          'Lâu dài: Áp dụng quy tắc bón phân "4 đúng" (Đúng loại, đúng liều lượng, đúng thời điểm, đúng phương pháp) và xây dựng dải đệm thực vật ven hồ.'
        ],
        correctPath: 'Cấp bách sục khí bù oxy; lâu dài chuyển sang bón phân cân đối, bón phân hữu cơ và tạo mương sinh học giữ lại phân bón rửa trôi.',
        misconception: 'Đổ hóa chất diệt tảo bừa bãi khiến tảo chết đồng loạt làm ô nhiễm càng thêm thảm khốc.'
      },
      {
        layer: 'D_DESIGN_VALIDATE',
        title: 'Tầng D — Kiểm chứng và giám sát môi trường',
        prompt: 'Đề xuất chỉ số theo dõi để đánh giá mức độ phục hồi của hệ sinh thái hồ sau 3 tháng can thiệp.',
        evidenceItems: [
          'Hàm lượng oxy hòa tan DO duy trì ổn định > 5 mg/L ở mọi thời điểm trong ngày.',
          'Chỉ số nồng độ Nitrate NO3- giảm về < 10 mg/L; Phosphate < 0,1 mg/L.',
          'Độ trong suốt của nước tăng, hệ vi sinh vật và thủy sinh bản địa phục hồi cân bằng.'
        ],
        correctPath: 'Đo định kỳ nồng độ Nitrate, Phosphate và hàm lượng oxy hòa tan (DO) lúc sáng sớm để kiểm chứng chất lượng nước đạt chuẩn.',
        misconception: 'Chỉ đánh giá nước trong hay đục bằng mắt mà không đo nồng độ ion và dưỡng khí.'
      }
    ],
    transferTask: {
      scenario: 'Một khu nuôi tôm công nghiệp ở Đồng bằng sông Cửu Long thường xuyên phải bật quạt nước cánh quạt quay tít mù suốt đêm.',
      challenge: 'Vận dụng kiến thức về quang hợp, hô hấp và oxy hòa tan để giải thích vì sao quạt nước bắt buộc phải chạy mạnh nhất vào ban đêm và rạng sáng.',
      expectedApplication: 'Ban đêm tảo trong ao tôm và lượng lớn tôm tập trung cùng hô hấp làm cạn kiệt oxy hòa tan. Quạt nước làm xáo động bề mặt, tăng diện tích tiếp xúc giữa nước và không khí giúp oxy khí quyển khuếch tán nhanh vào nước cứu tôm khỏi ngạt thở.'
    }
  }
];
