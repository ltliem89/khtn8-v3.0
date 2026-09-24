import { ProblemType } from '../types';

export const PROBLEM_TYPES: ProblemType[] = [
  {
    id: 'PT_HOA_TINH_THEO_PTHH',
    title: 'Tính lượng chất theo phương trình hoá học',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_06',
    sourceId: 'SRC_KNTT_SGK',
    description: 'Dạng bài toán cơ bản nhất trong Hoá học 8: từ lượng của một chất đã biết, tính lượng chất khác tham gia hoặc sinh ra trong phản ứng.',
    steps: [
      {
        stepNumber: 1,
        title: 'Đổi dữ kiện đề bài ra số mol (n)',
        instruction: 'Nếu cho khối lượng m (g): n = m / M. Nếu cho thể tích khí V (L ở 25 °C, 1 bar): n = V / 24,79.'
      },
      {
        stepNumber: 2,
        title: 'Viết và cân bằng phương trình hoá học',
        instruction: 'Ghi đúng công thức hoá học của các chất tham gia và sản phẩm, điền hệ số cân bằng tỉ lệ.'
      },
      {
        stepNumber: 3,
        title: 'Lập tỉ lệ tìm số mol chất cần tính',
        instruction: 'Dựa vào hệ số tỉ lệ mol trên PTHH: n_can_tim = n_da_biet * (hệ số chất cần tìm / hệ số chất đã biết).'
      },
      {
        stepNumber: 4,
        title: 'Chuyển đổi số mol sang yêu cầu bài toán',
        instruction: 'Khối lượng: m = n * M (g). Hoặc thể tích khí: V = n * 24,79 (L).'
      }
    ],
    trapsAndTips: [
      'Bẫy quên cân bằng PTHH hoặc cân bằng sai hệ số.',
      'Dùng 22,4 L thay vì 24,79 L (chuẩn CT 2018 quy định 1 bar và 25 °C).',
      'Đề bài cho đơn vị kg hoặc tấn thì cần chú ý đổi về gam hoặc bảo toàn đơn vị tương đương.'
    ],
    sampleExample: {
      problemStatement: 'Cho 6,5 g kim loại kẽm (zinc, Zn) tác dụng hoàn toàn với dung dịch hydrochloric acid (HCl) dư. Tính thể tích khí hydrogen (H2) thu được ở điều kiện chuẩn (25 °C, 1 bar).',
      solutionSteps: [
        'Bước 1: Tính số mol kẽm Zn: n_Zn = m / M = 6,5 / 65 = 0,1 (mol).',
        'Bước 2: Viết phương trình hoá học: Zn + 2HCl -> ZnCl2 + H2 ↑',
        'Bước 3: Theo PTHH: n_H2 = n_Zn = 0,1 (mol).',
        'Bước 4: Thể tích khí H2 ở đkc: V_H2 = n * 24,79 = 0,1 * 24,79 = 2,479 (lít).'
      ],
      finalAnswer: 'V_H2 = 2,479 lít'
    }
  },
  {
    id: 'PT_HOA_CHAT_DU',
    title: 'Bài toán phản ứng có chất dư',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_06',
    sourceId: 'SRC_KNTT_SBT',
    description: 'Khi đề bài cho lượng của cả hai chất tham gia phản ứng, ta phải so sánh tỉ lệ để xác định chất nào phản ứng hết, chất nào còn dư.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tính số mol của cả 2 chất phản ứng',
        instruction: 'Tính n_A và n_B từ dữ kiện đề bài (khối lượng, thể tích khí, nồng độ).'
      },
      {
        stepNumber: 2,
        title: 'So sánh tỉ lệ mol để tìm chất phản ứng hết',
        instruction: 'Giả sử phương trình aA + bB -> sản phẩm. So sánh (n_A / a) và (n_B / b). Tỉ số nào nhỏ hơn thì chất đó phản ứng HẾT. Tỉ số nào lớn hơn thì chất đó DƯ.'
      },
      {
        stepNumber: 3,
        title: 'Tính toán theo chất phản ứng hết',
        instruction: 'Mọi lượng chất sản phẩm tạo thành và lượng chất dư đã phản ứng đều phải tính theo chất hết.'
      },
      {
        stepNumber: 4,
        title: 'Tính lượng chất dư (nếu đề bài hỏi)',
        instruction: 'n_du = n_ban_dau - n_da_phan_ung.'
      }
    ],
    trapsAndTips: [
      'Tuyệt đối không lấy số mol của chất dư để tính sản phẩm!',
      'Khi tính khối lượng chất còn lại sau phản ứng, nhớ cộng cả khối lượng chất dư và khối lượng sản phẩm tạo thành.'
    ],
    sampleExample: {
      problemStatement: 'Đốt cháy 1,24 g phosphorus (P) trong bình chứa 1,92 g khí oxygen (O2) tạo thành diphosphorus pentoxide (P2O5). Xác định chất nào còn dư và khối lượng dư là bao nhiêu?',
      solutionSteps: [
        'Bước 1: n_P = 1,24 / 31 = 0,04 mol; n_O2 = 1,92 / 32 = 0,06 mol.',
        'Bước 2: PTHH: 4P + 5O2 -> 2P2O5. So sánh tỉ lệ: n_P / 4 = 0,04 / 4 = 0,01. n_O2 / 5 = 0,06 / 5 = 0,012. Vì 0,01 < 0,012 nên P phản ứng hết, O2 còn dư.',
        'Bước 3: Lượng O2 đã phản ứng: n_O2(pư) = (0,04 * 5) / 4 = 0,05 mol.',
        'Bước 4: Số mol O2 dư: n_O2(dư) = 0,06 - 0,05 = 0,01 mol. Khối lượng O2 dư = 0,01 * 32 = 0,32 g.'
      ],
      finalAnswer: 'Khí O2 dư 0,32 g'
    }
  },
  {
    id: 'PT_HOA_NONG_DO',
    title: 'Tính toán nồng độ dung dịch (C% và CM)',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_04',
    sourceId: 'SRC_KNTT_SGK',
    description: 'Bài toán tính nồng độ phần trăm, nồng độ mol, pha loãng hoặc cô cạn dung dịch.',
    steps: [
      {
        stepNumber: 1,
        title: 'Xác định các đại lượng',
        instruction: 'Phân biệt rõ: m_ct (chất tan), m_dm (nước), m_dd = m_ct + m_dm. Đổi thể tích V (mL sang L) nếu tính CM.'
      },
      {
        stepNumber: 2,
        title: 'Áp dụng công thức phù hợp',
        instruction: 'C% = (m_ct / m_dd) * 100% hoặc CM = n / V.'
      },
      {
        stepNumber: 3,
        title: 'Bài toán pha loãng thêm nước',
        instruction: 'Khi thêm nước vào dung dịch: khối lượng chất tan m_ct và số mol n KHÔNG ĐỔI. Thể tích và khối lượng dung dịch tăng lên.'
      }
    ],
    trapsAndTips: [
      'Nhầm m_dd với m_nuoc: Ví dụ hoà 20 g muối vào 80 g nước thì m_dd = 20 + 80 = 100 g (chứ không phải 80 g).',
      'Khi pha trộn 2 dung dịch cùng chất tan: m_ct_tong = m_ct1 + m_ct2; m_dd_tong = m_dd1 + m_dd2.'
    ],
    sampleExample: {
      problemStatement: 'Hoà tan 4 g NaOH vào 116 g nước cất. Tính nồng độ phần trăm của dung dịch thu được. Nếu dung dịch có thể tích 120 mL thì nồng độ mol là bao nhiêu?',
      solutionSteps: [
        'Bước 1: Khối lượng dung dịch m_dd = m_ct + m_nuoc = 4 + 116 = 120 (g).',
        'Bước 2: Nồng độ phần trăm C% = (4 / 120) * 100% ≈ 3,33%.',
        'Bước 3: Tính số mol NaOH: n = 4 / 40 = 0,1 mol. Đổi thể tích: V = 120 mL = 0,12 L.',
        'Bước 4: Nồng độ mol CM = n / V = 0,1 / 0,12 ≈ 0,833 M.'
      ],
      finalAnswer: 'C% = 3,33%; CM = 0,833 M'
    }
  },
  {
    id: 'PT_LY_AP_SUAT',
    title: 'Tính áp suất & Biện pháp tăng, giảm áp suất',
    domain: 'VAT_LI',
    lessonId: 'L_LY_15',
    sourceId: 'SRC_KNTT_SGK',
    description: 'Xác định áp lực vuông góc, diện tích bị ép và áp suất của người hoặc đồ vật tác dụng lên sàn nằm ngang.',
    steps: [
      {
        stepNumber: 1,
        title: 'Tính áp lực F (N)',
        instruction: 'Đối với vật đặt trên sàn ngang, áp lực bằng đúng trọng lượng của vật: F = P = 10 * m (m tính bằng kg).'
      },
      {
        stepNumber: 2,
        title: 'Xác định tổng diện tích tiếp xúc S (m²)',
        instruction: 'Chú ý số chân tiếp xúc (ghế 4 chân thì S = 4 * S_1chan; người đứng 2 chân thì S = 2 * S_1banchan). Đổi cm² sang m² bằng cách chia 10 000.'
      },
      {
        stepNumber: 3,
        title: 'Tính áp suất p = F / S (Pa)',
        instruction: 'Lấy áp lực F chia cho diện tích S.'
      }
    ],
    trapsAndTips: [
      'Quên nhân số chân tiếp xúc của bàn/ghế (4 chân).',
      'Đổi đơn vị sai: 1 m² = 10 000 cm² (chứ không phải 100 hay 1000 cm²).',
      'Khi đứng co 1 chân: diện tích giảm đi một nửa => áp suất tăng gấp đôi so với khi đứng 2 chân.'
    ],
    sampleExample: {
      problemStatement: 'Một người có khối lượng 50 kg ngồi trên chiếc ghế 4 chân có khối lượng 5 kg đặt trên sàn nhà nằm ngang. Diện tích tiếp xúc của mỗi chân ghế với mặt sàn là 3 cm². Tính áp suất của người và ghế tác dụng lên sàn.',
      solutionSteps: [
        'Bước 1: Tổng khối lượng người và ghế: m = 50 + 5 = 55 (kg). Áp lực F = P = 10 * 55 = 550 (N).',
        'Bước 2: Diện tích tiếp xúc của cả 4 chân ghế: S = 4 * 3 = 12 (cm²) = 12 * 10^-4 = 0,0012 (m²).',
        'Bước 3: Áp suất tác dụng lên sàn: p = F / S = 550 / 0,0012 ≈ 458 333 (Pa).'
      ],
      finalAnswer: 'p ≈ 4,58.10⁵ Pa'
    }
  },
  {
    id: 'PT_LY_ARCHIMEDES',
    title: 'Bài toán Lực đẩy Archimedes & Vật nổi/chìm',
    domain: 'VAT_LI',
    lessonId: 'L_LY_17',
    sourceId: 'SRC_KNTT_SGK',
    description: 'Xác định độ lớn lực đẩy Archimedes, thể tích phần chìm và điều kiện thăng bằng của vật nổi.',
    steps: [
      {
        stepNumber: 1,
        title: 'Xác định lực đẩy Archimedes',
        instruction: 'F_A = d_lỏng * V_chìm (d_lỏng = 10 * D_lỏng, V_chìm tính bằng m³).'
      },
      {
        stepNumber: 2,
        title: 'So sánh trọng lực P và lực đẩy F_A',
        instruction: 'P = d_vật * V_vật. Nếu d_vật > d_lỏng: chìm. Nếu d_vật < d_lỏng: nổi.'
      },
      {
        stepNumber: 3,
        title: 'Khi vật nổi cân bằng trên mặt nước',
        instruction: 'Lực đẩy F_A cân bằng với trọng lượng P của vật: F_A = P => d_lỏng * V_chìm = d_vật * V_vật => V_chìm / V_vật = d_vật / d_lỏng.'
      }
    ],
    trapsAndTips: [
      'Khi vật ngập hoàn toàn, V_chìm = V_vật. Khi vật nổi lơ lửng một phần trên mặt nước, V_chìm < V_vật.',
      'Sử dụng lực kế: Số chỉ ngoài không khí P1, số chỉ khi nhúng trong nước P2 => Lực đẩy F_A = P1 - P2.'
    ],
    sampleExample: {
      problemStatement: 'Treo một quả nặng vào lực kế ở ngoài không khí, lực kế chỉ 8 N. Nhúng quả nặng chìm hoàn toàn trong nước, lực kế chỉ 5 N. Biết trọng lượng riêng của nước là 10 000 N/m³. Tính lực đẩy Archimedes và thể tích của quả nặng.',
      solutionSteps: [
        'Bước 1: Độ lớn lực đẩy Archimedes: F_A = P_khongkhi - P_nuoc = 8 - 5 = 3 (N).',
        'Bước 2: Vì quả nặng ngập hoàn toàn nên thể tích quả nặng bằng thể tích nước bị chiếm chỗ: V = F_A / d_nuoc = 3 / 10 000 = 0,0003 (m³) = 300 (cm³).'
      ],
      finalAnswer: 'F_A = 3 N; V = 300 cm³'
    }
  },
  {
    id: 'PT_LY_DON_BAY',
    title: 'Bài toán cân bằng đòn bẩy',
    domain: 'VAT_LI',
    lessonId: 'L_LY_19',
    sourceId: 'SRC_KNTT_SGK',
    description: 'Tìm vị trí ngồi trên bập bênh, tính lực nâng cần thiết khi sử dụng đòn bẩy hoặc xà beng.',
    steps: [
      {
        stepNumber: 1,
        title: 'Xác định điểm tựa O và các cánh tay đòn d1, d2',
        instruction: 'd1 là khoảng cách từ O đến giá của lực F1; d2 là khoảng cách từ O đến giá của lực F2.'
      },
      {
        stepNumber: 2,
        title: 'Viết phương trình cân bằng đòn bẩy',
        instruction: 'F1 * d1 = F2 * d2 (hoặc F1 / F2 = d2 / d1).'
      },
      {
        stepNumber: 3,
        title: 'Rút ra đại lượng cần tìm',
        instruction: 'F1 = (F2 * d2) / d1 hoặc d1 = (F2 * d2) / F1.'
      }
    ],
    trapsAndTips: [
      'Đo sai cánh tay đòn: Khoảng cách phải tính từ điểm tựa O đến điểm đặt lực chứ không phải toàn bộ chiều dài thanh đòn.',
      'Đòn bẩy cho lợi bao nhiêu lần về lực thì thiệt bấy nhiêu lần về quãng đường dịch chuyển.'
    ],
    sampleExample: {
      problemStatement: 'Dùng một xà beng dài 1,2 m để bẩy một tảng đá nặng 1200 N. Điểm tựa đặt cách tảng đá 0,2 m. Hỏi người cần tác dụng một lực tối thiểu bằng bao nhiêu vào đầu kia của xà beng để nâng tảng đá?',
      solutionSteps: [
        'Bước 1: Cánh tay đòn của tảng đá: d2 = 0,2 m.',
        'Cánh tay đòn của tay người: d1 = 1,2 - 0,2 = 1,0 m.',
        'Bước 2: Áp dụng điều kiện cân bằng đòn bẩy: F1 * d1 = F2 * d2.',
        'Bước 3: Lực nâng cần thiết: F1 = (1200 * 0,2) / 1,0 = 240 (N).'
      ],
      finalAnswer: 'F1 = 240 N (lợi 5 lần về lực)'
    }
  }
];
