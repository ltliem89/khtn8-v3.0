import { UnitItem } from '../types';

export const UNITS: UnitItem[] = [
  {
    id: 'U_KHOI_LUONG',
    name: 'Gam & Kilôgam (Khối lượng)',
    symbol: 'g, kg',
    quantity: 'Khối lượng (m)',
    domain: 'CHUNG',
    baseSI: 'kg',
    conversions: [
      { to: 'g -> kg', factor: 0.001, note: '1 kg = 1000 g' },
      { to: 'kg -> g', factor: 1000 },
      { to: 'tấn -> kg', factor: 1000, note: '1 tấn = 1000 kg' }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Quên đổi gam (g) ra kilôgam (kg) khi tính nhiệt lượng Q = m.c.Δt hoặc áp lực F = 10.m.'
  },
  {
    id: 'U_THE_TICH',
    name: 'Lít, Mililít, Mét khối & Xentimét khối',
    symbol: 'L, mL, m³, cm³',
    quantity: 'Thể tích (V)',
    domain: 'CHUNG',
    baseSI: 'm³',
    conversions: [
      { to: '1 mL = 1 cm³', factor: 1 },
      { to: '1 L = 1 dm³ = 1000 mL = 1000 cm³', factor: 1000 },
      { to: '1 m³ = 1000 L = 1 000 000 cm³', factor: 1000000 },
      { to: 'cm³ -> m³', factor: 0.000001, note: 'Chia cho 1 000 000' }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Rất hay nhầm 1 m³ = 1000 cm³ (sai! 1 m = 100 cm => 1 m³ = 100³ = 1 000 000 cm³).'
  },
  {
    id: 'U_KHOI_LUONG_RIENG',
    name: 'Kilôgam trên mét khối & Gam trên xentimét khối',
    symbol: 'kg/m³, g/cm³',
    quantity: 'Khối lượng riêng (D)',
    domain: 'VAT_LI',
    baseSI: 'kg/m³',
    conversions: [
      { to: '1 g/cm³ = 1000 kg/m³', factor: 1000, note: 'Nước có D = 1 g/cm³ = 1000 kg/m³' },
      { to: '1 kg/m³ = 0,001 g/cm³', factor: 0.001 }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Quên nhân 1000 khi đổi từ g/cm³ sang kg/m³, dẫn đến tính lực đẩy Archimedes sai 1000 lần.'
  },
  {
    id: 'U_AP_SUAT',
    name: 'Paxcan (Pa), Bar, Atmôphe (atm) & mmHg',
    symbol: 'Pa, bar, atm, mmHg',
    quantity: 'Áp suất (p)',
    domain: 'VAT_LI',
    baseSI: 'Pa (N/m²)',
    conversions: [
      { to: '1 Pa = 1 N/m²', factor: 1 },
      { to: '1 bar = 10⁵ Pa = 100 000 Pa', factor: 100000 },
      { to: '1 atm = 1,013.10⁵ Pa = 760 mmHg', factor: 101300 },
      { to: '1 mmHg ≈ 133,3 Pa', factor: 133.3 }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Không quy đổi diện tích cm² sang m² trước khi chia F/S (1 m² = 10 000 cm²).'
  },
  {
    id: 'U_DIEN',
    name: 'Ampe (A), Miliampe (mA), Vôn (V), Kilôvôn (kV)',
    symbol: 'A, mA, V, mV, kV',
    quantity: 'Cường độ dòng điện (I) & Hiệu điện thế (U)',
    domain: 'VAT_LI',
    baseSI: 'A, V',
    conversions: [
      { to: '1 A = 1000 mA', factor: 1000 },
      { to: '1 mA = 0,001 A', factor: 0.001 },
      { to: '1 kV = 1000 V', factor: 1000 },
      { to: '1 V = 1000 mV', factor: 1000 }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Đọc sai thang đo trên mặt hiển thị của Ampe kế hoặc Vôn kế (nhìn nhầm thang 100 mA sang thang 3 A).'
  },
  {
    id: 'U_MOL',
    name: 'Mol & Gam trên mol',
    symbol: 'mol, g/mol',
    quantity: 'Lượng chất (n) & Khối lượng mol (M)',
    domain: 'HOA_HOC',
    baseSI: 'mol',
    conversions: [
      { to: '1 mol = 6,022.10²³ hạt (NA)', factor: 6.022e23 },
      { to: '1 mol khí (đkc 25 °C, 1 bar) = 24,79 L', factor: 24.79 }
    ],
    sourceId: 'SRC_KNTT_SGK',
    commonErrors: 'Lấy 22,4 L của chương trình cũ thay vì 24,79 L (chuẩn mới áp suất 1 bar, 25 °C).'
  }
];
