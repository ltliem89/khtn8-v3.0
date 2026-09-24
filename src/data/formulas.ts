import { Formula } from '../types';
import { CalculationEngine, UnitEngine } from '../utils/mathEngine';

export const FORMULAS: Formula[] = [
  {
    id: 'F_HOA_MOL_KHOI_LUONG',
    name: 'Tính số mol theo khối lượng',
    formulaLatex: 'n = \\frac{m}{M}',
    description: 'Chuyển đổi giữa số mol (n), khối lượng chất (m) và khối lượng mol (M).',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_03',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'n', name: 'Số mol', unit: 'mol', description: 'Lượng chất tính bằng mol' },
      { symbol: 'm', name: 'Khối lượng chất', unit: 'g', description: 'Khối lượng chất tan hoặc chất phản ứng' },
      { symbol: 'M', name: 'Khối lượng mol', unit: 'g/mol', description: 'Khối lượng của 1 mol nguyên tử/phân tử' }
    ],
    conditions: ['Khối lượng m phải tính bằng gam (g)', 'M tính bằng g/mol'],
    derivedForms: ['m = n \\cdot M', 'M = \\frac{m}{n}'],
    calculatorConfig: {
      inputs: [
        { id: 'm', label: 'Khối lượng (m)', unit: 'g', defaultValue: 5.6, min: 0.001 },
        { id: 'M', label: 'Khối lượng mol (M)', unit: 'g/mol', defaultValue: 56, min: 1 }
      ],
      output: { label: 'Số mol (n)', unit: 'mol' },
      calculate: (inputs) => {
        return CalculationEngine.moleFromMass(inputs.m, inputs.M);
      }
    }
  },
  {
    id: 'F_HOA_MOL_THE_TICH',
    name: 'Thể tích khí ở điều kiện chuẩn (25 °C, 1 bar)',
    formulaLatex: 'V = n \\cdot 24{,}79',
    description: 'Tính thể tích của chất khí ở điều kiện chuẩn theo CT GDPT 2018 (nhiệt độ 25 °C và áp suất 1 bar).',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_03',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'V', name: 'Thể tích khí', unit: 'L', description: 'Thể tích khí đo ở 25 °C, 1 bar' },
      { symbol: 'n', name: 'Số mol khí', unit: 'mol', description: 'Lượng chất khí' }
    ],
    conditions: ['Chỉ áp dụng cho chất khí ở 25 °C, 1 bar', 'Không áp dụng hằng số cũ 22,4 L (0 °C, 1 atm)'],
    derivedForms: ['n = \\frac{V}{24{,}79}'],
    calculatorConfig: {
      inputs: [
        { id: 'n', label: 'Số mol khí (n)', unit: 'mol', defaultValue: 0.2, min: 0.001 }
      ],
      output: { label: 'Thể tích khí (V)', unit: 'Lít' },
      calculate: (inputs) => {
        return CalculationEngine.gasVolumeStandard(inputs.n);
      }
    }
  },
  {
    id: 'F_HOA_TI_KHOI',
    name: 'Tỉ khối của chất khí',
    formulaLatex: 'd_{A/B} = \\frac{M_A}{M_B} \\quad ; \\quad d_{A/\\text{kk}} = \\frac{M_A}{29}',
    description: 'Xác định khí A nặng hay nhẹ hơn khí B (hoặc không khí) bao nhiêu lần.',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_03',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'd_{A/B}', name: 'Tỉ khối của khí A đối với khí B', unit: 'không đơn vị' },
      { symbol: 'M_A', name: 'Khối lượng mol khí A', unit: 'g/mol' },
      { symbol: 'M_B', name: 'Khối lượng mol khí B', unit: 'g/mol' },
      { symbol: '29', name: 'Khối lượng mol trung bình không khí', unit: 'g/mol' }
    ],
    conditions: ['d > 1: Khí A nặng hơn B / không khí (chìm xuống dưới)', 'd < 1: Khí A nhẹ hơn B / không khí (bay lên trên)'],
    derivedForms: ['M_A = d_{A/B} \\cdot M_B', 'M_A = d_{A/\\text{kk}} \\cdot 29'],
    calculatorConfig: {
      inputs: [
        { id: 'MA', label: 'Khối lượng mol khí A (MA)', unit: 'g/mol', defaultValue: 44 },
        { id: 'MB', label: 'Khối lượng mol so sánh (MB, chọn 29 nếu là KK)', unit: 'g/mol', defaultValue: 29 }
      ],
      output: { label: 'Tỉ khối d', unit: 'lần' },
      calculate: (inputs) => {
        return CalculationEngine.relativeDensity(inputs.MA, inputs.MB);
      }
    }
  },
  {
    id: 'F_HOA_NONG_DO_PHAN_TRAM',
    name: 'Nồng độ phần trăm của dung dịch',
    formulaLatex: 'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\cdot 100\\%',
    description: 'Biểu thị số gam chất tan có trong 100 gam dung dịch.',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_04',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'C\\%', name: 'Nồng độ phần trăm', unit: '%' },
      { symbol: 'm_{\\text{ct}}', name: 'Khối lượng chất tan', unit: 'g' },
      { symbol: 'm_{\\text{dd}}', name: 'Khối lượng dung dịch (m_ct + m_dm)', unit: 'g' }
    ],
    conditions: ['$m_{\\text{dd}} = m_{\\text{ct}} + m_{\\text{dm}}$ (nước)', 'Đơn vị khối lượng phải đồng nhất (cùng g)'],
    derivedForms: [
      'm_{\\text{ct}} = \\frac{m_{\\text{dd}} \\cdot C\\%}{100\\%}',
      'm_{\\text{dd}} = \\frac{m_{\\text{ct}} \\cdot 100\\%}{C\\%}'
    ],
    calculatorConfig: {
      inputs: [
        { id: 'm_ct', label: 'Khối lượng chất tan (m_ct)', unit: 'g', defaultValue: 20, min: 0.1 },
        { id: 'm_dd', label: 'Khối lượng dung dịch (m_dd)', unit: 'g', defaultValue: 200, min: 0.1 }
      ],
      output: { label: 'Nồng độ C%', unit: '%' },
      calculate: (inputs) => {
        return CalculationEngine.percentageConcentration(inputs.m_ct, inputs.m_dd);
      }
    }
  },
  {
    id: 'F_HOA_NONG_DO_MOL',
    name: 'Nồng độ mol của dung dịch',
    formulaLatex: 'C_M = \\frac{n}{V}',
    description: 'Biểu thị số mol chất tan có trong 1 lít dung dịch.',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_04',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'C_M', name: 'Nồng độ mol', unit: 'M (mol/L)' },
      { symbol: 'n', name: 'Số mol chất tan', unit: 'mol' },
      { symbol: 'V', name: 'Thể tích dung dịch', unit: 'L' }
    ],
    conditions: ['V bắt buộc phải đổi ra Lít (1 L = 1000 mL)'],
    derivedForms: ['n = C_M \\cdot V', 'V = \\frac{n}{C_M}'],
    calculatorConfig: {
      inputs: [
        { id: 'n', label: 'Số mol chất tan (n)', unit: 'mol', defaultValue: 0.05, min: 0.001 },
        { id: 'V_ml', label: 'Thể tích dung dịch (V)', unit: 'mL', defaultValue: 250, min: 1 }
      ],
      output: { label: 'Nồng độ mol C_M', unit: 'M (mol/L)' },
      calculate: (inputs) => {
        const vL = UnitEngine.mLToL(inputs.V_ml);
        return CalculationEngine.molarConcentration(inputs.n, vL);
      }
    }
  },
  {
    id: 'F_HOA_DO_TAN',
    name: 'Độ tan của một chất trong nước',
    formulaLatex: 'S = \\frac{m_{\\text{ct}}}{m_{\\text{nước}}} \\cdot 100',
    description: 'Số gam chất tan tối đa trong 100 gam nước ở nhiệt độ xác định để tạo dung dịch bão hoà.',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_04',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'S', name: 'Độ tan', unit: 'g / 100 g nước' },
      { symbol: 'm_{\\text{ct}}', name: 'Khối lượng chất tan tối đa', unit: 'g' },
      { symbol: 'm_{\\text{nước}}', name: 'Khối lượng nước', unit: 'g' }
    ],
    conditions: ['Đo ở nhiệt độ và áp suất xác định', 'Mối liên hệ với C% bão hoà: $C\\%_{(\\text{bh})} = \\frac{S}{S + 100} \\cdot 100\\%$'],
    derivedForms: ['C\\%_{(\\text{bh})} = \\frac{S}{S + 100} \\cdot 100\\%'],
    calculatorConfig: {
      inputs: [
        { id: 'm_ct', label: 'Khối lượng chất tan tối đa', unit: 'g', defaultValue: 36, min: 0.1 },
        { id: 'm_nuoc', label: 'Khối lượng nước', unit: 'g', defaultValue: 100, min: 1 }
      ],
      output: { label: 'Độ tan S', unit: 'g/100g nước' },
      calculate: (inputs) => {
        return CalculationEngine.solubility(inputs.m_ct, inputs.m_nuoc);
      }
    }
  },
  {
    id: 'F_HOA_HIEU_SUAT',
    name: 'Hiệu suất phản ứng hoá học',
    formulaLatex: 'H = \\frac{m_{\\text{tt}}}{m_{\\text{lt}}} \\cdot 100\\% = \\frac{n_{\\text{tt}}}{n_{\\text{lt}}} \\cdot 100\\%',
    description: 'Đánh giá mức độ chuyển hoá thực tế so với lượng tối đa theo phương trình lí thuyết.',
    domain: 'HOA_HOC',
    lessonId: 'L_HOA_06',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'H', name: 'Hiệu suất phản ứng', unit: '%' },
      { symbol: 'm_{\\text{tt}}', name: 'Khối lượng sản phẩm thực tế thu được', unit: 'g' },
      { symbol: 'm_{\\text{lt}}', name: 'Khối lượng sản phẩm theo lí thuyết PTHH', unit: 'g' }
    ],
    conditions: ['$m_{\\text{tt}}$ luôn nhỏ hơn hoặc bằng $m_{\\text{lt}}$ ($H \\le 100\\%)'],
    derivedForms: [
      'm_{\\text{tt}} = \\frac{m_{\\text{lt}} \\cdot H}{100\\%}',
      'm_{\\text{lt}} = \\frac{m_{\\text{tt}} \\cdot 100\\%}{H}'
    ],
    calculatorConfig: {
      inputs: [
        { id: 'm_tt', label: 'Khối lượng thực tế thu được (m_tt)', unit: 'g', defaultValue: 4.2, min: 0.01 },
        { id: 'm_lt', label: 'Khối lượng lí thuyết (m_lt)', unit: 'g', defaultValue: 5.6, min: 0.01 }
      ],
      output: { label: 'Hiệu suất H', unit: '%' },
      calculate: (inputs) => {
        return CalculationEngine.reactionYield(inputs.m_tt, inputs.m_lt);
      }
    }
  },

  // --- VẬT LÍ ---
  {
    id: 'F_LY_KHOI_LUONG_RIENG',
    name: 'Khối lượng riêng của chất',
    formulaLatex: 'D = \\frac{m}{V}',
    description: 'Đại lượng đặc trưng cho sự phân bố khối lượng theo thể tích của một chất.',
    domain: 'VAT_LI',
    lessonId: 'L_LY_13',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'D', name: 'Khối lượng riêng', unit: 'kg/m³ hoặc g/cm³' },
      { symbol: 'm', name: 'Khối lượng', unit: 'kg hoặc g' },
      { symbol: 'V', name: 'Thể tích', unit: 'm³ hoặc cm³' }
    ],
    conditions: ['Đơn vị chuẩn: 1 g/cm³ = 1000 kg/m³ = 1 g/mL'],
    derivedForms: ['m = D \\cdot V', 'V = \\frac{m}{D}'],
    calculatorConfig: {
      inputs: [
        { id: 'm', label: 'Khối lượng (m)', unit: 'g', defaultValue: 156, min: 0.1 },
        { id: 'V', label: 'Thể tích (V)', unit: 'cm³', defaultValue: 20, min: 0.1 }
      ],
      output: { label: 'Khối lượng riêng (D)', unit: 'g/cm³ (x1000 ra kg/m³)' },
      calculate: (inputs) => {
        return CalculationEngine.density(inputs.m, inputs.V);
      }
    }
  },
  {
    id: 'F_LY_AP_SUAT_MAT',
    name: 'Áp suất trên một bề mặt',
    formulaLatex: 'p = \\frac{F}{S}',
    description: 'Độ lớn của áp lực (F) tác dụng đều trên một đơn vị diện tích bị ép (S).',
    domain: 'VAT_LI',
    lessonId: 'L_LY_15',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'p', name: 'Áp suất', unit: 'Pa (N/m²)' },
      { symbol: 'F', name: 'Áp lực (vuông góc bề mặt)', unit: 'N' },
      { symbol: 'S', name: 'Diện tích bị ép', unit: 'm²' }
    ],
    conditions: ['F vuông góc với mặt bị ép', 'S phải chuyển về đơn vị mét vuông (m²)'],
    derivedForms: ['F = p \\cdot S', 'S = \\frac{F}{p}'],
    calculatorConfig: {
      inputs: [
        { id: 'F', label: 'Áp lực (F = P = 10.m)', unit: 'N', defaultValue: 650, min: 1 },
        { id: 'S_cm2', label: 'Diện tích tiếp xúc (S)', unit: 'cm²', defaultValue: 200, min: 0.1 }
      ],
      output: { label: 'Áp suất (p)', unit: 'Pa (N/m²)' },
      calculate: (inputs) => {
        const sM2 = UnitEngine.cm2ToM2(inputs.S_cm2);
        return CalculationEngine.pressure(inputs.F, sM2);
      }
    }
  },
  {
    id: 'F_LY_ARCHIMEDES',
    name: 'Độ lớn lực đẩy Archimedes',
    formulaLatex: 'F_A = d \\cdot V = 10 \\cdot D \\cdot V',
    description: 'Lực đẩy của chất lỏng tác dụng lên vật nhúng trong lòng nó hướng thẳng đứng từ dưới lên.',
    domain: 'VAT_LI',
    lessonId: 'L_LY_17',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'F_A', name: 'Lực đẩy Archimedes', unit: 'N' },
      { symbol: 'd', name: 'Trọng lượng riêng chất lỏng (d = 10.D)', unit: 'N/m³' },
      { symbol: 'V', name: 'Thể tích phần chất lỏng bị vật chiếm chỗ', unit: 'm³' }
    ],
    conditions: ['Nước nguyên chất d ~ 10 000 N/m³', 'V là thể tích phần chìm của vật'],
    derivedForms: ['V = \\frac{F_A}{d}', 'd = \\frac{F_A}{V}'],
    calculatorConfig: {
      inputs: [
        { id: 'd', label: 'Trọng lượng riêng chất lỏng (d)', unit: 'N/m³', defaultValue: 10000, min: 100 },
        { id: 'V_lit', label: 'Thể tích ngập chìm (V)', unit: 'Lít (1 L = 0.001 m³)', defaultValue: 1.5, min: 0.01 }
      ],
      output: { label: 'Lực đẩy Archimedes (FA)', unit: 'N' },
      calculate: (inputs) => {
        const vM3 = UnitEngine.LToM3(inputs.V_lit);
        return CalculationEngine.archimedesForce(inputs.d, vM3);
      }
    }
  },
  {
    id: 'F_LY_DON_BAY',
    name: 'Điều kiện cân bằng của đòn bẩy',
    formulaLatex: 'F_1 \\cdot d_1 = F_2 \\cdot d_2 \\iff \\frac{F_1}{F_2} = \\frac{d_2}{d_1}',
    description: 'Mối liên hệ tỉ lệ nghịch giữa lực tác dụng và cánh tay đòn khi đòn bẩy nằm cân bằng.',
    domain: 'VAT_LI',
    lessonId: 'L_LY_19',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'F_1', name: 'Lực nâng / Lực tác dụng', unit: 'N' },
      { symbol: 'd_1', name: 'Cánh tay đòn của lực F1', unit: 'm hoặc cm' },
      { symbol: 'F_2', name: 'Trọng lượng tải cần nâng', unit: 'N' },
      { symbol: 'd_2', name: 'Cánh tay đòn của tải F2', unit: 'cùng đơn vị với d1' }
    ],
    conditions: ['d1, d2 là khoảng cách vuông góc từ trục quay O tới giá của lực'],
    derivedForms: ['F_1 = \\frac{F_2 \\cdot d_2}{d_1}', 'd_1 = \\frac{F_2 \\cdot d_2}{F_1}'],
    calculatorConfig: {
      inputs: [
        { id: 'F2', label: 'Trọng lượng vật cần nâng (F2)', unit: 'N', defaultValue: 1000, min: 1 },
        { id: 'd2', label: 'Cánh tay đòn vật nặng (d2)', unit: 'cm', defaultValue: 20, min: 1 },
        { id: 'd1', label: 'Cánh tay đòn tay ấn (d1)', unit: 'cm', defaultValue: 80, min: 1 }
      ],
      output: { label: 'Lực nâng cần thiết (F1)', unit: 'N (lợi về lực)' },
      calculate: (inputs) => {
        return CalculationEngine.leverForce(inputs.F2, inputs.d2, inputs.d1);
      }
    }
  },
  {
    id: 'F_LY_NHIET_LUONG',
    name: 'Nhiệt lượng thu vào / toả ra',
    formulaLatex: 'Q = m \\cdot c \\cdot \\Delta t = m \\cdot c \\cdot (t_2 - t_1)',
    description: 'Tính lượng nhiệt năng mà vật nhận thêm hoặc mất đi trong quá trình truyền nhiệt.',
    domain: 'VAT_LI',
    lessonId: 'L_LY_26',
    curriculum: 'KNTT',
    sourceId: 'SRC_KNTT_SGK',
    variables: [
      { symbol: 'Q', name: 'Nhiệt lượng', unit: 'J (hoặc kJ)' },
      { symbol: 'm', name: 'Khối lượng vật', unit: 'kg' },
      { symbol: 'c', name: 'Nhiệt dung riêng của chất (nước: 4 200 J/kg.K)', unit: 'J/kg.K' },
      { symbol: '\\Delta t', name: 'Độ biến thiên nhiệt độ (t2 - t1)', unit: '°C' }
    ],
    conditions: ['m tính bằng kg', 'c tính bằng J/kg.K', '1 kJ = 1000 J'],
    derivedForms: ['\\Delta t = \\frac{Q}{m \\cdot c}', 'm = \\frac{Q}{c \\cdot \\Delta t}'],
    calculatorConfig: {
      inputs: [
        { id: 'm', label: 'Khối lượng nước (m)', unit: 'kg', defaultValue: 1.5, min: 0.1 },
        { id: 'c', label: 'Nhiệt dung riêng (c)', unit: 'J/kg.K', defaultValue: 4200, min: 100 },
        { id: 'deltaT', label: 'Độ tăng nhiệt độ (Δt)', unit: '°C', defaultValue: 20, min: 0.1 }
      ],
      output: { label: 'Nhiệt lượng cần cung cấp (Q)', unit: 'Joule (J)' },
      calculate: (inputs) => {
        return CalculationEngine.heatQuantity(inputs.m, inputs.c, inputs.deltaT);
      }
    }
  }
];
