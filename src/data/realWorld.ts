import { RealWorldItem } from '../types';

export const REAL_WORLD_ITEMS: RealWorldItem[] = [
  {
    id: 'RW_NONG_NGHIEP_VOI_KHU_CHUA',
    title: 'Tại sao bà con nông dân rải vôi bột (CaO) lên ruộng chua và khử trùng ao hồ?',
    domain: 'HOA_HOC',
    category: 'NONG_NGHIEP',
    nature: 'FACT',
    sourceId: 'SRC_KNTT_SGK',
    overview: 'Đất phèn đất chua có nồng độ ion H+ cao (pH < 5,0) làm rễ cây lúa bị nghẹt và kém phát triển.',
    problemContext: 'Đất canh tác lâu năm bị chua do rửa trôi khoáng kiềm hoặc bón phân hoá học dư thừa, khiến năng suất lúa giảm mạnh.',
    scientificMechanism: 'Khi rải vôi bột CaO (vôi sống) gặp nước mưa ẩm sẽ tạo thành dung dịch kiềm vôi tôi Ca(OH)2: CaO + H2O -> Ca(OH)2. Sau đó kiềm Ca(OH)2 xảy ra phản ứng trung hoà với các acid tự do trong đất: H+ + OH- -> H2O, giúp nâng pH đất lên mức thuận lợi 6,0 - 7,0. Đồng thời tính kiềm làm vỡ màng tế bào của mầm bệnh nấm mốc và vi khuẩn.',
    actionableTakeaways: [
      'Bón lượng vôi bột vừa phải dựa trên xét nghiệm độ pH của đất ruộng.',
      'Không bón phân đạm ammonium cùng lúc với vôi vì sinh ra khí amoniac (NH3) bay hơi làm mất chất đạm: NH4+ + OH- -> NH3 ↑ + H2O.'
    ],
    connectedLessonIds: ['L_HOA_09', 'L_HOA_10', 'L_HOA_12'],
    connectedFormulaIds: ['F_HOA_PTHH_CHUNG']
  },
  {
    id: 'RW_MOI_TRUONG_NHA_KINH',
    title: 'Cơ chế Hiệu ứng nhà kính khí quyển và biến đổi khí hậu tại Việt Nam',
    domain: 'VAT_LI',
    category: 'MOI_TRUONG',
    nature: 'FACT',
    sourceId: 'SRC_KNTT_SGK',
    overview: 'Bầu khí quyển Trái Đất hoạt động giống như một lồng kính khổng lồ cho ánh sáng Mặt Trời đi qua nhưng giữ lại nhiệt lượng phát ra từ mặt đất.',
    problemContext: 'Việc đốt nhiên liệu hoá thạch (than đá, dầu mỏ, xăng dầu) trong nhà máy nhiệt điện, giao thông và công nghiệp làm nồng độ khí CO2 tăng vượt ngưỡng 420 ppm.',
    scientificMechanism: 'Mặt Trời (nhiệt độ bề mặt ~6000 °C) phát ra bức xạ sóng ngắn mang năng lượng lớn dễ dàng xuyên qua khí quyển xuống mặt đất. Mặt đất nóng lên (nhiệt độ trung bình ~15 °C) phát xạ ngược lại bức xạ sóng dài (tia hồng ngoại). Các phân tử khí nhà kính như CO2, CH4, hơi nước H2O hấp thụ bức xạ nhiệt này và phản xạ một phần ngược trở lại bề mặt Trái Đất, làm khí quyển nóng lên.',
    actionableTakeaways: [
      'Tiết kiệm điện năng tại gia đình giúp giảm lượng than đốt ở các nhà máy nhiệt điện.',
      'Trồng nhiều cây xanh: quá trình quang hợp hấp thụ khí CO2 và nhả khí O2: 6CO2 + 6H2O -> C6H12O6 + 6O2.',
      'Xây dựng bờ kè kiên cố và trồng rừng ngập mặn chắn sóng bảo vệ dải ven biển Việt Nam.'
    ],
    connectedLessonIds: ['L_LY_26', 'L_HOA_02', 'L_MT_41'],
    connectedFormulaIds: []
  },
  {
    id: 'RW_Y_TE_SO_CUU_DOT_QUY',
    title: 'Dấu hiệu FAST nhận biết sớm đột quỵ não và kỹ thuật sơ cứu tại chỗ',
    domain: 'SINH_HOC',
    category: 'Y_TE',
    nature: 'FACT',
    sourceId: 'SRC_REAL_MOH_VN',
    overview: 'Đột quỵ (tai biến mạch máu não) xảy ra khi mạch máu nuôi não bị tắc nghẽn hoặc vỡ, khiến tế bào não bị thiếu O2 và hoại tử trong vài phút.',
    problemContext: 'Cứ mỗi phút trôi qua trong cơn đột quỵ có gần 2 triệu tế bào não bị chết. Sự chậm trễ hoặc xử trí sai có thể dẫn tới tàn phế vĩnh viễn hoặc tử vong.',
    scientificMechanism: 'Não người chỉ chiếm ~2% khối lượng cơ thể nhưng tiêu thụ tới 20% lượng oxy và đường glucose do hệ tuần hoàn cung cấp. Mảng xơ vữa động mạch hoặc huyết khối làm bít tắc lòng mạch máu não.',
    actionableTakeaways: [
      'Ghi nhớ quy tắc FAST: F (Face - méo miệng), A (Arm - yếu liệt một bên tay chân), S (Speech - nói ngọng, dính chữ), T (Time - gọi ngay cấp cứu 115).',
      'ĐẶT NẠN NHÂN NẰM NGHIÊNG ở tư thế hồi sức, đầu cao hơn chân một chút để tránh sặc đờm dãi vào đường thở.',
      'TUYỆT ĐỐI KHÔNG: chích nặn máu ngón tay, cạo gió, cho uống thuốc hay nước khi chưa có chỉ định của bác sĩ.'
    ],
    connectedLessonIds: ['L_SINH_33'],
    connectedFormulaIds: []
  },
  {
    id: 'RW_KY_THUAT_CHAN_DAP_THUY_DIEN',
    title: 'Vì sao chân đập thuỷ điện luôn được xây choãi rộng và dày gấp nhiều lần đỉnh đập?',
    domain: 'VAT_LI',
    category: 'KY_THUAT',
    nature: 'FACT',
    sourceId: 'SRC_KNTT_SGK',
    overview: 'Các công trình thuỷ điện như Hoà Bình, Sơn La, Trị An đều có thân đập dạng hình thang choãi rộng về phía chân đáy.',
    problemContext: 'Một khối lượng nước hàng tỉ mét khối trong lòng hồ thuỷ điện tạo ra áp lực khổng lồ lên thân đập ngăn nước.',
    scientificMechanism: 'Áp suất chất lỏng tỉ lệ thuận với độ sâu tính từ mặt thoáng: p = d × h (d là trọng lượng riêng của nước ~10 000 N/m³, h là độ sâu). Càng xuống sâu, độ sâu h càng lớn nên áp suất và áp lực của nước tác dụng lên thành đập càng tăng mạnh. Vì vậy chân đập phải xây thật dày để chịu được áp suất cực lớn này mà không bị nứt vỡ.',
    actionableTakeaways: [
      'Ứng dụng cùng quy luật: Thợ lặn xuống biển sâu phải mặc bộ đồ lặn chuyên dụng bằng kim loại chịu áp suất cao để tránh bị ép tức ngực.',
      'Khi đục các lỗ ở thành chai nước ở các độ cao khác nhau, tia nước ở lỗ dưới đáy luôn phun xa và mạnh nhất.'
    ],
    connectedLessonIds: ['L_LY_15', 'L_LY_16'],
    connectedFormulaIds: ['F_LY_AP_SUAT_MAT']
  },
  {
    id: 'RW_DO_SONG_SAY_NANG_CAM_LANH',
    title: 'Cơ chế điều hoà thân nhiệt của Da và cách xử trí khi bị Say nắng (cảm nóng)',
    domain: 'SINH_HOC',
    category: 'DO_SONG',
    nature: 'FACT',
    sourceId: 'SRC_KNTT_SGK',
    overview: 'Thân nhiệt người bình thường duy trì ổn định quanh mức 37 °C nhờ sự phối hợp giữa da và hệ thần kinh trung ương (vùng dưới đồi).',
    problemContext: 'Lao động hoặc đá bóng dưới trời nắng gắt trong thời gian dài khiến cơ thể không kịp toả nhiệt, dẫn đến say nắng, sốt cao, chóng mặt.',
    scientificMechanism: 'Khi trời nóng: Não phát tín hiệu làm giãn mao mạch dưới da (mặt đỏ lên) để tăng toả nhiệt, tuyến mồ hôi tiết mồ hôi; mồ hôi bay hơi lấy đi nhiệt lượng cơ thể. Khi ở ngoài nắng quá lâu, trung tâm điều nhiệt bị rối loạn, mồ hôi mất nhiều làm cơ thể mất nước và khoáng, thân nhiệt vọt lên > 38-39 °C.',
    actionableTakeaways: [
      'Đưa ngay người say nắng vào chỗ râm mát, thoáng khí.',
      'Nới lỏng cúc áo, lau khăn mát (hoặc bọc đá) vào các vị trí mạch máu lớn: nách, bẹn, trán, gáy.',
      'Cho uống từng ngụm nhỏ nước mát có pha chút muối hoặc dung dịch Oresol.'
    ],
    connectedLessonIds: ['L_SINH_30', 'L_SINH_37'],
    connectedFormulaIds: []
  },
  {
    id: 'RW_SINH_THAI_CA_RO_PHI',
    title: 'Giới hạn sinh thái của Cá rô phi và bài toán nhập nội vật nuôi ở các vùng miền Việt Nam',
    domain: 'SINH_HOC',
    category: 'NONG_NGHIEP',
    nature: 'FACT',
    sourceId: 'SRC_KNTT_SGK',
    overview: 'Mỗi loài sinh vật có một biên độ nhiệt độ và điều kiện môi trường nhất định để sinh trưởng và phát triển.',
    problemContext: 'Người dân miền núi phía Bắc muốn chọn giống cá nuôi qua mùa đông có những đợt rét đậm dưới 5 °C.',
    scientificMechanism: 'Cá rô phi ở Việt Nam có giới hạn sinh thái về nhiệt độ từ 5,6 °C đến 42 °C (khoảng thuận lợi là 20 °C – 35 °C, điểm cực thuận 30 °C). Điểm gây chết dưới là 5,6 °C. Trong khi đó, cá chép có giới hạn nhiệt độ rộng hơn từ 2 °C đến 44 °C. Khi nhiệt độ vùng núi phía Bắc hạ xuống dưới 5 °C vào mùa đông, cá rô phi sẽ bị chết cóng, còn cá chép vẫn có thể chống chịu và sống sót.',
    actionableTakeaways: [
      'Tại các tỉnh miền núi phía Bắc mùa đông có sương muối và băng giá, nên ưu tiên nuôi cá chép thay vì cá rô phi.',
      'Trước các đợt rét đậm, cần dâng cao mực nước ao nuôi và che phủ bèo/bạt để giữ ấm tầng đáy cho đàn cá.'
    ],
    connectedLessonIds: ['L_MT_41'],
    connectedFormulaIds: []
  }
];
