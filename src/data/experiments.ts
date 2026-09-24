import { Experiment } from '../types';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'EXP_HOA_FE_S',
    title: 'Biến đổi hoá học: Sắt (Fe) tác dụng với Lưu huỳnh (S)',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_02',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    objective: 'Chứng minh khi đun nóng hỗn hợp sắt và lưu huỳnh thì xảy ra phản ứng hoá học tạo thành chất mới không còn bị nam châm hút.',
    apparatus: [
      'Bột sắt (Fe) mịn màu xám',
      'Bột lưu huỳnh (S) màu vàng tươi (tỉ lệ khối lượng 7 : 4)',
      '2 ống nghiệm chịu nhiệt',
      'Đèn cồn, kiềng sắt, kẹp gỗ',
      'Nam châm vĩnh cửu'
    ],
    safetyNotes: [
      'Đeo kính bảo hộ và găng tay khi làm thí nghiệm với lưu huỳnh nóng chảy.',
      'Không ngửi trực tiếp miệng ống nghiệm đề phòng có khí SO2 sinh ra nếu S cháy lan.'
    ],
    steps: [
      {
        step: 1,
        action: 'Trộn đều bột sắt và lưu huỳnh theo tỉ lệ 7 : 4 rồi chia vào 2 ống nghiệm (1) và (2). Đưa nam châm lại gần ống nghiệm (1).',
        observation: 'Nam châm hút các hạt sắt màu xám qua thành ống nghiệm, lưu huỳnh màu vàng ở lại.',
        scientificExplanation: 'Trước khi đun nóng, đây chỉ là hỗn hợp cơ học; sắt vẫn giữ nguyên từ tính và tính chất vật lí ban đầu.'
      },
      {
        step: 2,
        action: 'Kẹp ống nghiệm (2) hơ đều trên ngọn lửa đèn cồn, sau đó đun nóng mạnh đáy ống nghiệm khoảng 30 giây rồi bỏ ra.',
        observation: 'Hỗn hợp phát sáng nóng đỏ, phản ứng tự toả nhiều nhiệt tiếp tục diễn ra không cần đun tiếp. Chất rắn chuyển thành khối màu xám đen (iron(II) sulfide, FeS).',
        scientificExplanation: 'Xảy ra phản ứng hoá học toả nhiệt mạnh: Fe + S -> FeS. Các nguyên tử Fe và S đã liên kết lại tạo hợp chất mới.'
      },
      {
        step: 3,
        action: 'Chờ ống nghiệm (2) nguội hẳn, đưa thanh nam châm lại gần đáy ống nghiệm (2).',
        observation: 'Chất rắn màu xám đen mới tạo thành (FeS) hoàn toàn không bị nam châm hút.',
        scientificExplanation: 'Chất mới FeS không còn tính chất hút nam châm của sắt ban đầu. Đây là bằng chứng xác nhận biến đổi hoá học.'
      }
    ],
    interactiveState: {
      variableName: 'Hành động tương tác',
      options: [
        {
          label: '1. Đưa nam châm vào hỗn hợp chưa nung',
          value: 'before_heat',
          resultText: 'Nam châm hút sạch bột sắt màu xám ra khỏi hỗn hợp. Bột lưu huỳnh vàng ở lại -> Chưa có chất mới.',
          visualState: 'magnet_attracts_iron'
        },
        {
          label: '2. Đốt nóng đáy ống nghiệm trên đèn cồn',
          value: 'heating',
          resultText: 'Hỗn hợp bừng sáng rực rỡ, toả nhiều nhiệt, hoá than đen xám FeS -> Phản ứng hoá học đang diễn ra mãnh liệt.',
          visualState: 'flame_glow'
        },
        {
          label: '3. Đưa nam châm vào sản phẩm FeS sau khi nung',
          value: 'after_heat',
          resultText: 'Chất rắn FeS xám đen không hề bị nam châm hút -> Khẳng định sắt đã phản ứng hoàn toàn thành chất mới!',
          visualState: 'no_magnetic_attraction'
        }
      ]
    }
  },
  {
    id: 'EXP_LY_ARCHIMEDES',
    title: 'Khảo sát lực đẩy Archimedes bằng bình tràn và lực kế',
    domain: 'VAT_LI',
    lessonId: 'L_LY_17',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    objective: 'Đo độ lớn lực đẩy Archimedes và so sánh với trọng lượng của phần chất lỏng bị vật chiếm chỗ chảy vào bình tràn.',
    apparatus: [
      'Lực kế lò xo GHĐ 2 N, ĐCNN 0,05 N',
      'Vật nặng bằng kim loại / nhựa (thể tích V xác định)',
      'Bình tràn chứa đầy nước tới sát vòi xả',
      'Cốc đong hứng nước tràn',
      'Giá đỡ thí nghiệm'
    ],
    safetyNotes: [
      'Đổ nước vào bình tràn thật cẩn thận để không rớt nước ra ngoài trước khi nhúng vật.',
      'Thao tác nhúng vật nhẹ nhàng, không để chạm vào đáy hoặc thành bình tràn.'
    ],
    steps: [
      {
        step: 1,
        action: 'Móc vật nặng vào lực kế treo ở ngoài không khí, đọc số chỉ P của lực kế.',
        observation: 'Lực kế chỉ giá trị trọng lượng P = 1,8 N.',
        scientificExplanation: 'Ngoài không khí, lực kế cân bằng với trọng lực tác dụng lên vật.'
      },
      {
        step: 2,
        action: 'Từ từ nhúng chìm hoàn toàn vật nặng vào bình tràn chứa đầy nước. Hứng toàn bộ nước tràn ra cốc đong.',
        observation: 'Lực kế giảm số chỉ xuống còn F1 = 1,0 N. Nước từ bình tràn chảy vào cốc đong đúng bằng thể tích vật.',
        scientificExplanation: 'Nước tác dụng lực đẩy Archimedes hướng lên: F_A = P - F1 = 1,8 - 1,0 = 0,8 N.'
      },
      {
        step: 3,
        action: 'Đổ toàn bộ lượng nước tràn ở cốc đong vào một cốc chứa treo cùng vật hoặc đem cân trên cân điện tử.',
        observation: 'Trọng lượng nước tràn đo được đúng bằng P_nuoc_tran = 0,8 N.',
        scientificExplanation: 'Kết luận định luật Archimedes: F_A = P_nuoc_tran = d_nuoc × V_chiem_cho.'
      }
    ],
    interactiveState: {
      variableName: 'Chất lỏng trong bình tràn',
      options: [
        {
          label: 'Nước nguyên chất (d = 10 000 N/m³)',
          value: 'water',
          resultText: 'Lực kế giảm 0,8 N. Lực đẩy Archimedes FA = 0,8 N = Trọng lượng nước tràn.',
          visualState: 'water_buoyancy'
        },
        {
          label: 'Nước muối đậm đặc (d = 11 000 N/m³)',
          value: 'salt_water',
          resultText: 'Chất lỏng có trọng lượng riêng lớn hơn -> Lực đẩy Archimedes tăng lên FA = 0,88 N -> Lực kế chỉ nhẹ hơn nữa!',
          visualState: 'high_buoyancy'
        },
        {
          label: 'Cồn ethanol (d = 7 900 N/m³)',
          value: 'alcohol',
          resultText: 'Cồn nhẹ hơn nước -> Lực đẩy Archimedes giảm xuống FA = 0,63 N -> Lực kế chỉ nặng hơn khi nhúng trong nước.',
          visualState: 'low_buoyancy'
        }
      ]
    }
  },
  {
    id: 'EXP_LY_AP_SUAT_CAT',
    title: 'Khảo sát áp suất trên bề mặt bột mịn / khay cát',
    domain: 'VAT_LI',
    lessonId: 'L_LY_15',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    objective: 'Khẳng định độ lún của mặt bị ép phụ thuộc đồng thời vào áp lực F và diện tích bị ép S.',
    apparatus: [
      '2 khối kim loại hình hộp chữ nhật giống hệt nhau',
      'Khay nhựa trong suốt chứa bột mịn / cát mịn san phẳng',
      'Thước đo độ sâu độ lún (h)'
    ],
    safetyNotes: [
      'Tránh làm vương vãi bột mịn ra sàn phòng thí nghiệm.',
      'Gạt phẳng bề mặt bột trước mỗi lần đặt khối kim loại.'
    ],
    steps: [
      {
        step: 1,
        action: 'Đặt 1 khối kim loại nằm ngang (diện tích tiếp xúc mặt lớn S_lon) lên bột mịn.',
        observation: 'Khối kim loại lún xuống mặt bột một đoạn nhỏ h1 ≈ 3 mm.',
        scientificExplanation: 'Cùng áp lực F1 = P, nhưng diện tích tiếp xúc lớn nên áp suất p1 = F1 / S_lon nhỏ.'
      },
      {
        step: 2,
        action: 'Đặt khối kim loại dựng đứng (mặt nhỏ nhất S_nho) lên bột mịn.',
        observation: 'Khối kim loại lún sâu hơn rõ rệt h2 ≈ 12 mm.',
        scientificExplanation: 'Cùng áp lực F = P, khi diện tích bị ép S giảm 4 lần thì áp suất p2 tăng 4 lần -> độ lún lớn hơn nhiều.'
      },
      {
        step: 3,
        action: 'Chồng thêm khối thứ 2 lên trên khối thứ nhất ở tư thế dựng đứng.',
        observation: 'Độ lún tăng lên gấp đôi h3 ≈ 24 mm.',
        scientificExplanation: 'Diện tích S không đổi nhưng áp lực tăng gấp đôi (F = 2P) -> áp suất p3 tăng gấp đôi.'
      }
    ],
    interactiveState: {
      variableName: 'Tư thế đặt khối kim loại',
      options: [
        {
          label: 'Mặt đáy lớn (S = 60 cm²)',
          value: 'large_face',
          resultText: 'Độ lún rất nông: 3 mm. Áp suất phân tán đều trên diện tích rộng.',
          visualState: 'shallow_depression'
        },
        {
          label: 'Mặt đáy hẹp (S = 15 cm²)',
          value: 'small_face',
          resultText: 'Độ lún sâu: 12 mm. Diện tích giảm 4 lần khiến áp suất tăng gấp 4 lần!',
          visualState: 'deep_depression'
        },
        {
          label: 'Chồng 2 khối lên mặt đáy hẹp (F gấp đôi)',
          value: 'stacked_small_face',
          resultText: 'Độ lún cực sâu: 24 mm. Áp lực tăng gấp đôi khiến khối chìm ngập sâu vào lớp bột cát.',
          visualState: 'max_depression'
        }
      ]
    }
  },
  {
    id: 'EXP_HOA_PH_TEST',
    title: 'Xác định độ pH của dung dịch bằng giấy chỉ thị màu',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_09',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    objective: 'Thực hành xác định giá trị pH và đánh giá tính acid - base của các mẫu chất lỏng thường gặp.',
    apparatus: [
      'Hộp giấy đo pH dải màu 1 - 14 kèm bảng màu chuẩn',
      'Đĩa thuỷ tinh đồng hồ',
      'Ống hút nhỏ giọt',
      'Các mẫu: nước ép chanh, giấm ăn, nước lọc, baking soda, nước vôi trong, nước rửa chén'
    ],
    safetyNotes: [
      'Không dùng tay ướt cầm trực tiếp vào dải giấy pH.',
      'Rửa sạch đầu ống hút nhỏ giọt bằng nước cất trước khi lấy mẫu dung dịch khác.'
    ],
    steps: [
      {
        step: 1,
        action: 'Cắt mẩu giấy pH dài khoảng 1 cm đặt lên đĩa sứ. Dùng ống nhỏ giọt lấy 1 giọt nước chanh chấm vào giấy pH.',
        observation: 'Mẩu giấy pH lập tức chuyển sang màu đỏ tươi. So sánh bảng màu thấy pH ≈ 2,5.',
        scientificExplanation: 'Nước chanh chứa acid citric tạo ion H+ nồng độ cao -> dung dịch có tính acid mạnh.'
      },
      {
        step: 2,
        action: 'Chấm 1 giọt dung dịch baking soda lên mẩu giấy pH thứ hai.',
        observation: 'Giấy pH chuyển sang màu xanh lam nhạt. So sánh bảng màu thấy pH ≈ 8,5.',
        scientificExplanation: 'Baking soda (NaHCO3) tạo môi trường kiềm yếu, ion OH- làm đổi màu chất chỉ thị.'
      },
      {
        step: 3,
        action: 'Chấm 1 giọt nước vôi trong Ca(OH)2 lên mẩu giấy pH thứ ba.',
        observation: 'Giấy pH chuyển sang màu xanh thẫm tím. So sánh bảng màu thấy pH ≈ 11 - 12.',
        scientificExplanation: 'Ca(OH)2 là dung dịch kiềm mạnh, chứa nhiều ion OH-.'
      }
    ],
    interactiveState: {
      variableName: 'Mẫu thử nghiệm',
      options: [
        {
          label: 'Nước ép chanh',
          value: 'lemon',
          resultText: 'Giấy pH đổi sang màu ĐỎ (pH ≈ 2,5) -> Môi trường Acid mạnh.',
          visualState: 'ph_red'
        },
        {
          label: 'Giấm ăn (CH3COOH 5%)',
          value: 'vinegar',
          resultText: 'Giấy pH đổi sang màu CAM ĐỎ (pH ≈ 3,0) -> Môi trường Acid.',
          visualState: 'ph_orange'
        },
        {
          label: 'Nước tinh khiết',
          value: 'pure_water',
          resultText: 'Giấy pH giữ màu VÀNG XANH NHẠT (pH = 7,0) -> Môi trường Trung tính.',
          visualState: 'ph_green'
        },
        {
          label: 'Baking soda (NaHCO3)',
          value: 'baking_soda',
          resultText: 'Giấy pH đổi sang màu XANH DƯƠNG NHẠT (pH ≈ 8,5) -> Môi trường Kiềm (Base) yếu.',
          visualState: 'ph_blue'
        },
        {
          label: 'Nước vôi trong Ca(OH)2',
          value: 'limewater',
          resultText: 'Giấy pH đổi sang màu TÍM THẪM (pH ≈ 11,5) -> Môi trường Kiềm (Base) mạnh.',
          visualState: 'ph_purple'
        }
      ]
    }
  }
];
