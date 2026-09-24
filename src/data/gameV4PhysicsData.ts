import {
  GameScene,
  GameQuestV4,
  ToolItem
} from '../types/blueprint';

/**
 * MASTER GAME SPEC v4.0 - GAME PLAY DIVERSITY PACK: VẬT LÍ THEO TỪNG BÀI
 * Nguồn kiến thức: "GIÁO ÁN NLS - KHTN 8 - VẬT LÍ" (Bài 13 → Bài 29 của dự án).
 * Mỗi bài có 1 cảnh (scene) + 1 nhiệm vụ (quest) 3 giai đoạn, số liệu thực lấy trực tiếp từ giáo án.
 */

// =========================================================================
// DỤNG CỤ VẬT LÍ (toolIds dùng chung cho các cảnh)
// =========================================================================

export const VAT_TOOLS_ALL: ToolItem[] = [
  {
    toolId: 'T_SCALE',
    type: 'scale',
    name: 'Cân Kỹ Thuật',
    icon: '⚖️',
    description: 'Đo khối lượng chính xác, dùng cùng bảng khối lượng riêng để xác định chất.',
    allowedActions: ['measure', 'record', 'calculate'],
    knowledgeIds: ['K_VAT_B13'],
    active: true
  },
  {
    toolId: 'T_RULER',
    type: 'ruler',
    name: 'Thước Mét & Thước Kẹp',
    icon: '📏',
    description: 'Đo kích thước hình hộp, độ dài cánh tay đòn và độ giãn nở.',
    allowedActions: ['measure', 'inspect', 'observe'],
    knowledgeIds: ['K_VAT_B14', 'K_VAT_B18'],
    active: false
  },
  {
    toolId: 'T_GRAD',
    type: 'graduated_cylinder',
    name: 'Bình Chia Độ',
    icon: '🥛',
    description: 'Đo thể tích vật rắn không thấm nước theo nguyên tắc V = V2 - V1.',
    allowedActions: ['experiment', 'measure', 'observe'],
    knowledgeIds: ['K_VAT_B13', 'K_VAT_B14'],
    active: false
  },
  {
    toolId: 'T_SPRING',
    type: 'spring_scale',
    name: 'Lực Kế Lò Xo',
    icon: '🌀',
    description: 'Đo lực (đơn vị N): trọng lượng P, lực kéo, lực đẩy Archimedes.',
    allowedActions: ['measure', 'observe'],
    knowledgeIds: ['K_VAT_B17', 'K_VAT_B18', 'K_VAT_B19'],
    active: false
  },
  {
    toolId: 'T_BARO',
    type: 'pressure_gauge',
    name: 'Áp Kế Kỹ Thuật',
    icon: '🌡️',
    description: 'Đo áp suất chất lỏng và áp suất khí quyển (Pa / bar).',
    allowedActions: ['measure', 'inspect', 'observe'],
    knowledgeIds: ['K_VAT_B16'],
    active: false
  },
  {
    toolId: 'T_THERMO',
    type: 'thermometer',
    name: 'Nhiệt Kế Rượu',
    icon: '🌡️',
    description: 'Đo nhiệt độ (°C) trong thí nghiệm nội năng, truyền nhiệt và nở vì nhiệt.',
    allowedActions: ['measure', 'observe', 'record'],
    knowledgeIds: ['K_VAT_B26', 'K_VAT_B27', 'K_VAT_B28', 'K_VAT_B29'],
    active: false
  },
  {
    toolId: 'T_AMMETER',
    type: 'ammeter',
    name: 'Ampe Kế (GHĐ 0,5A)',
    icon: '🔌',
    description: 'Mắc nối tiếp trong mạch để đo cường độ dòng điện (A), ĐCNN 0,01 A.',
    allowedActions: ['measure', 'decide', 'inspect'],
    knowledgeIds: ['K_VAT_B24', 'K_VAT_B25'],
    active: false
  },
  {
    toolId: 'T_VOLTMETER',
    type: 'voltmeter',
    name: 'Vôn Kế (GHĐ 6V)',
    icon: '🔋',
    description: 'Mắc song song với đoạn mạch cần đo để đo hiệu điện thế (V), ĐCNN 0,1 V.',
    allowedActions: ['measure', 'decide', 'inspect'],
    knowledgeIds: ['K_VAT_B24', 'K_VAT_B25'],
    active: false
  },
  {
    toolId: 'T_JOULER',
    type: 'joulemeter',
    name: 'Joulemeter',
    icon: '⚡',
    description: 'Hiển thị chính xác năng lượng (J) cung cấp cho nước trong bình trong thí nghiệm nhiệt lượng.',
    allowedActions: ['measure', 'record', 'calculate'],
    knowledgeIds: ['K_VAT_B27'],
    active: false
  },
  {
    toolId: 'T_CALC',
    type: 'calculator',
    name: 'Máy Tính KHTN',
    icon: '🧮',
    description: 'Hỗ trợ tính D = m/V, p = F/S, FA = d.V, M = F.d, Q = m.c.Δt.',
    allowedActions: ['calculate', 'record'],
    knowledgeIds: ['K_VAT_B13', 'K_VAT_B15', 'K_VAT_B18', 'K_VAT_B26'],
    active: false
  },
  {
    toolId: 'T_NB',
    type: 'notebook',
    name: 'Sổ Tay Hiện Trường Vật Lí',
    icon: '📖',
    description: 'Lưu dữ kiện đo đạc, bảng số liệu và kết luận thí nghiệm.',
    allowedActions: ['record', 'inspect'],
    knowledgeIds: ['K_VAT_B13'],
    active: false
  }
];

// =========================================================================
// HELPERS
// =========================================================================

const toolsOf = (...ids: string[]): ToolItem[] =>
  VAT_TOOLS_ALL.filter((t) => ids.includes(t.toolId));

// =========================================================================
// BÀI 13 - KHỐI LƯỢNG RIÊNG (Chương III)
// =========================================================================

export const SCENE_VAT_B13: GameScene = {
  sceneId: 'SC_VAT_B13',
  title: 'Kho Vật Liệu - Khối Lượng Riêng',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  lessonBadge: 'B13 · Khối lượng riêng',
  themeKey: 'workshop',
  storyIntro:
    'Nhà kho vật liệu nhận về một thỏi kim loại không có nhãn. Cân cho m = 156 g, bình chia độ cho V = 20 cm³. Hãy dùng công thức D = m/V để nhận diện thỏi kim loại này là gì!',
  goal: 'Đo m, V và tính khối lượng riêng D để nhận diện thỏi kim loại từ bảng KLR.',
  knowledgeIds: ['K_VAT_B13'],
  currentQuestId: 'QUEST_VAT_B13',
  objects: [
    {
      objectId: 'O_VL13_THOI_KIM_LOAI',
      type: 'collectible',
      name: 'Thỏi Kim Loại Không Nhãn',
      description: 'Thỏi sáng màu xám, bề mặt bóng. Cân hiện m = 156 g; nhúng vào bình chia độ mực nước tăng thêm đúng 20 cm³.',
      visualIcon: '🪙',
      interactive: true,
      state: { inspected: false, mass: 156, volume: 20, measureText: 'Cân: m = 156 g · Bình chia độ: V = 20 cm³' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_B13']
    },
    {
      objectId: 'O_VL13_BANG_THER',
      type: 'inspectable',
      name: 'Bảng Khối Lượng Riêng',
      description: 'Bảng tra cứu: nước 1,0; nhôm 2,7; sắt 7,8; đồng 8,9; chì 11,3 (đơn vị g/cm³).',
      visualIcon: '📋',
      interactive: true,
      state: { inspected: false, measureText: 'Tra bảng: sắt D = 7,8 g/cm³' },
      actions: ['inspect', 'observe'],
      knowledgeIds: ['K_VAT_B13']
    },
    {
      objectId: 'O_VL13_BINH_CHIA_DO',
      type: 'measurement_tool',
      name: 'Bình Chia Độ 50 ml',
      description: 'Mực nước trước 20 ml, sau khi thả thỏi kim loại dâng lên 40 ml → thể tích vật = 20 cm³.',
      visualIcon: '🥛',
      interactive: true,
      state: { inspected: false, v1: 20, v2: 40, measureText: 'V = V2 - V1 = 40 - 20 = 20 cm³' },
      actions: ['inspect', 'measure', 'observe'],
      knowledgeIds: ['K_VAT_B13']
    }
  ],
  tools: toolsOf('T_SCALE', 'T_RULER', 'T_GRAD', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_13',
      name: 'Kỹ sư Hạo Nhiên',
      role: 'Quản lý kho vật liệu',
      avatar: '🧑‍🔧',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B13'],
      dialogues: {
        welcome: {
          speech: 'Chào kỹ sư trẻ! Thỏi kim loại này bị mất nhãn. Khối lượng riêng là "chứng minh thư" của mỗi chất — hãy đo m, đo V rồi tính D = m/V để đoán tên chất!',
          options: [{ text: 'Em sẽ cân và đo thể tích ngay!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Gợi ý: dùng Cân Kỹ Thuật và Bình Chia Độ. Nhớ đơn vị 1 g/cm³ = 1000 kg/m³ nhé!',
          options: [{ text: 'Rõ, tiến hành đo!', nextState: 'measuring' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B13: GameQuestV4 = {
  questId: 'QUEST_VAT_B13',
  title: 'Nhận Diện Thỏi Kim Loại Bí Ẩn',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  storyIntro: 'Đo D = m/V để xác định thỏi kim loại mất nhãn và quy đổi đơn vị g/cm³ sang kg/m³.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B13',
  stages: [
    {
      stageId: 'STG_VL13_1',
      stageNumber: 1,
      title: 'Khái niệm khối lượng riêng',
      storyPrompt: 'Quan sát thỏi kim loại và bảng KLR trong kho để nắm ý nghĩa của đại lượng D.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL13_THOI_KIM_LOAI',
      hint: 'Khối lượng riêng của một chất là khối lượng của một đơn vị thể tích (1 m³ hoặc 1 cm³) chất đó.',
      completed: false,
      learningObjective: 'Hiểu khái niệm khối lượng riêng và đơn vị đo',
      knowledgeId: 'K_VAT_B13',
      interactiveChallenge: {
        prompt: 'Khối lượng riêng của một chất cho biết điều gì?',
        type: 'CHOICE',
        options: [
          'Khối lượng của một đơn vị thể tích (1 m³ hoặc 1 cm³) chất đó',
          'Khối lượng tổng cộng của vật làm bằng chất đó',
          'Kích thước của vật làm bằng chất đó',
          'Độ cứng của vật làm bằng chất đó'
        ],
        correctIndex: 0,
        explanation: 'D = m/V: khối lượng riêng là khối lượng ứng với một đơn vị thể tích, đặc trưng riêng cho từng chất.'
      }
    },
    {
      stageId: 'STG_VL13_2',
      stageNumber: 2,
      title: 'Đo m và V của thỏi kim loại',
      storyPrompt: 'Dùng cân và bình chia độ để thu số liệu m = 156 g và V = 20 cm³ cho thỏi kim loại.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL13_THOI_KIM_LOAI',
      requiredToolId: 'T_SCALE',
      hint: 'Vật rắn không thấm nước thì thả vào bình chia độ: V = V2 - V1.',
      completed: false,
      learningObjective: 'Kỹ năng đo khối lượng và thể tích vật rắn',
      knowledgeId: 'K_VAT_B13',
      interactiveChallenge: {
        prompt: 'Hệ thống đo được m = 156 g, V = 20 cm³. Khối lượng riêng D của thỏi kim loại bằng bao nhiêu (g/cm³)?',
        type: 'NUMERIC_CALC',
        correctValue: 7.8,
        tolerance: 0.05,
        unit: 'g/cm³',
        explanation: 'D = m/V = 156 / 20 = 7,8 g/cm³. Tra bảng, đó chính là khối lượng riêng của sắt!'
      }
    },
    {
      stageId: 'STG_VL13_3',
      stageNumber: 3,
      title: 'Quy đổi đơn vị kg/m³',
      storyPrompt: 'Báo cáo kết quả ra đơn vị chuẩn SI để kỹ sư kho đối chiếu tài liệu.',
      requiredActionType: 'calculate',
      requiredToolId: 'T_CALC',
      hint: '1 g/cm³ = 1000 kg/m³. Nhân D (g/cm³) với 1000 để ra kg/m³.',
      completed: false,
      learningObjective: 'Quy đổi giữa g/cm³ và kg/m³',
      knowledgeId: 'K_VAT_B13',
      formulaId: 'F_LY_KHOI_LUONG_RIENG',
      interactiveChallenge: {
        prompt: 'Kết quả D = 7,8 g/cm³ tương ứng với bao nhiêu kg/m³?',
        type: 'NUMERIC_CALC',
        correctValue: 7800,
        tolerance: 50,
        unit: 'kg/m³',
        explanation: '7,8 g/cm³ = 7,8 × 1000 = 7800 kg/m³ — chính là khối lượng riêng của sắt trong bảng chuẩn SI.'
      }
    }
  ]
};

// =========================================================================
// BÀI 14 - THỰC HÀNH XÁC ĐỊNH KHỐI LƯỢNG RIÊNG (Chương III)
// =========================================================================

export const SCENE_VAT_B14: GameScene = {
  sceneId: 'SC_VAT_B14',
  title: 'Phòng Thực Hành Đo Lường',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  lessonBadge: 'B14 · Thực hành KLR',
  themeKey: 'lab',
  storyIntro:
    'Phòng thực hành có mẫu khối gỗ hình hộp chữ nhật kích thước 5 cm × 10 cm × 3 cm và một số viên sỏi. Hãy lựa chọn đúng thao tác để xác định khối lượng riêng cho từng loại vật.',
  goal: 'Thực hành đo D bằng hai cách: hình hộp (V = a.b.c) và bình chia độ (V = V2 - V1).',
  knowledgeIds: ['K_VAT_B14'],
  currentQuestId: 'QUEST_VAT_B14',
  objects: [
    {
      objectId: 'O_VL14_KHOI_GO',
      type: 'experiment_equipment',
      name: 'Khối Gỗ Hình Hộp Chữ Nhật',
      description: 'Kích thước a = 5 cm, b = 10 cm, c = 3 cm. Cân cho khối lượng m = 75 g.',
      visualIcon: '🧱',
      interactive: true,
      state: { inspected: false, a: 5, b: 10, c: 3, mass: 75, measureText: 'Thước: 5×10×3 cm · Cân: 75 g' },
      actions: ['inspect', 'measure', 'experiment'],
      knowledgeIds: ['K_VAT_B14']
    },
    {
      objectId: 'O_VL14_SOI',
      type: 'collectible',
      name: 'Viên Sỏi Không Thấm Nước',
      description: 'Viên sỏi nhỏ. Thả vào bình chia độ: mực nước từ 40 ml dâng lên 55 ml; cân được 42,5 g.',
      visualIcon: '🪨',
      interactive: true,
      state: { inspected: false, v1: 40, v2: 55, mass: 42.5, measureText: 'Bình chia độ: V = 55 - 40 = 15 ml · Cân: 42,5 g' },
      actions: ['inspect', 'measure', 'experiment'],
      knowledgeIds: ['K_VAT_B14']
    }
  ],
  tools: toolsOf('T_SCALE', 'T_RULER', 'T_GRAD', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_14',
      name: 'Cô Thanh Vân',
      role: 'Giáo viên thực hành',
      avatar: '👩‍🏫',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B14'],
      dialogues: {
        welcome: {
          speech: 'Trong bài thực hành, khối gỗ hình hộp đo thể tích bằng thước theo V = a.b.c; còn viên sỏi không thấm nước thì dùng bình chia độ V = V2 - V1. Em hãy xác định D của cả hai!',
          options: [{ text: 'Em sẽ thực hành theo đúng quy trình!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Nhớ: với vật hình hộp, đo 3 cạnh rồi nhân với nhau; với sỏi, hiệu hai mực nước chính là thể tích.',
          options: [{ text: 'Rõ, bắt đầu đo!', nextState: 'measuring' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B14: GameQuestV4 = {
  questId: 'QUEST_VAT_B14',
  title: 'Thực Hành Xác Định Khối Lượng Riêng',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  storyIntro: 'Lựa chọn thao tác đúng cho từng vật, tính D của khối gỗ và hiểu quy trình đo viên sỏi.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B14',
  stages: [
    {
      stageId: 'STG_VL14_1',
      stageNumber: 1,
      title: 'Chọn cách đo phù hợp',
      storyPrompt: 'Quan sát hai mẫu vật: khối gỗ hình hộp và viên sỏi không thấm nước.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL14_KHOI_GO',
      hint: 'Vật hình hộp dùng thước, vật không thấm nước dùng bình chia độ.',
      completed: false,
      learningObjective: 'Lựa chọn phương pháp đo thể tích phù hợp với từng loại vật',
      knowledgeId: 'K_VAT_B14',
      interactiveChallenge: {
        prompt: 'Với khối gỗ hình hộp chữ nhật, ta xác định thể tích bằng cách nào?',
        type: 'CHOICE',
        options: [
          'Đo ba cạnh bằng thước rồi tính V = a.b.c',
          'Thả vào bình chia độ và lấy hiệu mực nước',
          'Ước lượng theo khối lượng và quy đổi',
          'Đo đường chéo của khối gỗ'
        ],
        correctIndex: 0,
        explanation: 'Vật có hình dạng xác định (hình hộp) thì đo kích thước bằng thước và tính thể tích theo công thức.'
      }
    },
    {
      stageId: 'STG_VL14_2',
      stageNumber: 2,
      title: 'Tính D của khối gỗ',
      storyPrompt: 'Khối gỗ có a = 5 cm, b = 10 cm, c = 3 cm, m = 75 g. Hoàn thành phép đo thể tích và KLR.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL14_KHOI_GO',
      requiredToolId: 'T_SCALE',
      hint: 'V = 5 × 10 × 3 = 150 cm³; D = 75 / 150.',
      completed: false,
      learningObjective: 'Tính khối lượng riêng của vật hình hộp',
      knowledgeId: 'K_VAT_B14',
      interactiveChallenge: {
        prompt: 'Tính khối lượng riêng D của khối gỗ (đơn vị g/cm³).',
        type: 'NUMERIC_CALC',
        correctValue: 0.5,
        tolerance: 0.03,
        unit: 'g/cm³',
        explanation: 'V = 5.10.3 = 150 cm³ → D = 75/150 = 0,5 g/cm³ (nước có D = 1 g/cm³ nên khối gỗ sẽ nổi).'
      }
    },
    {
      stageId: 'STG_VL14_3',
      stageNumber: 3,
      title: 'Đo thể tích viên sỏi',
      storyPrompt: 'Xác định thể tích viên sỏi bằng bình chia độ với mực nước ban đầu 40 ml, sau khi thả là 55 ml.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_VL14_SOI',
      requiredToolId: 'T_GRAD',
      hint: 'V = V2 - V1 = 55 - 40.',
      completed: false,
      learningObjective: 'Sử dụng bình chia độ đo vật không thấm nước',
      knowledgeId: 'K_VAT_B14',
      interactiveChallenge: {
        prompt: 'Thể tích viên sỏi bằng bao nhiêu (ml = cm³)?',
        type: 'NUMERIC_CALC',
        correctValue: 15,
        tolerance: 0.5,
        unit: 'cm³',
        explanation: 'V = V2 - V1 = 55 - 40 = 15 cm³. Với m = 42,5 g thì D sỏi = 42,5/15 ≈ 2,83 g/cm³.'
      }
    }
  ]
};

// =========================================================================
// BÀI 15 - ÁP SUẤT TRÊN MỘT BỀ MẶT (Chương III)
// =========================================================================

export const SCENE_VAT_B15: GameScene = {
  sceneId: 'SC_VAT_B15',
  title: 'Công Trường Máy Ủi',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  lessonBadge: 'B15 · Áp suất',
  themeKey: 'workshop',
  storyIntro:
    'Chiếc máy ủi nặng 70 tấn ép lên mặt đường. Khi xới bùn lầy người ta thay bánh lốp bằng bánh xích rộng bản. Hãy phân tích áp lực F, diện tích S và áp suất p = F/S để hiểu vì sao!',
  goal: 'Tính áp suất của máy ủi lên mặt đất và giải thích cách tăng-giảm áp suất trong thực tế.',
  knowledgeIds: ['K_VAT_02'],
  currentQuestId: 'QUEST_VAT_B15',
  objects: [
    {
      objectId: 'O_VL15_MAY_UI',
      type: 'machine',
      name: 'Máy Ủi 70 Tấn',
      description: 'Trọng lượng P = 700.000 N, tổng diện tích tiếp xúc bánh xích với đất S = 2 m².',
      visualIcon: '🚜',
      interactive: true,
      state: { inspected: false, force: 700000, area: 2, measureText: 'P = 700 000 N · S tiếp xúc = 2 m²' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_02']
    },
    {
      objectId: 'O_VL15_CAY_XOI',
      type: 'experiment_equipment',
      name: 'Thí Nghiệm Kê Tấm Ván',
      description: 'Kê tấm ván dưới bánh xe mềm: S tăng lên gấp 3 lần thì áp suất giảm 3 lần.',
      visualIcon: '🪵',
      interactive: true,
      state: { inspected: false, measureText: 'Tăng S → giảm p (F không đổi)' },
      actions: ['inspect', 'decide'],
      knowledgeIds: ['K_VAT_02']
    }
  ],
  tools: toolsOf('T_SCALE', 'T_RULER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_15',
      name: 'Bác Tài Long',
      role: 'Kỹ thuật viên công trường',
      avatar: '👷',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_02'],
      dialogues: {
        welcome: {
          speech: 'Áp lực là lực ép vuông góc với mặt bị ép. Áp suất p = F/S cho biết mức độ "đâm sâu" của lực trên một đơn vị diện tích. Máy ủi của ta nặng 70 tấn đấy!',
          options: [{ text: 'Em sẽ tính áp suất máy ủi ép xuống đất!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Đổi 70 tấn ra N: F = P = 10.m. Rồi chia cho S = 2 m².',
          options: [{ text: 'Rõ!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B15: GameQuestV4 = {
  questId: 'QUEST_VAT_B15',
  title: 'Áp Suất Máy Ủi Và Mặt Đất',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  storyIntro: 'Tính p = F/S cho máy ủi, phân tích vai trò diện tích tiếp xúc và vận dụng vào tình huống bùn lầy.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 100,
  unlockedNodeId: 'K_VAT_02',
  stages: [
    {
      stageId: 'STG_VL15_1',
      stageNumber: 1,
      title: 'Phân biệt áp lực và áp suất',
      storyPrompt: 'Quan sát máy ủi và tấm ván kê để hiểu khái niệm áp lực.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL15_MAY_UI',
      hint: 'Áp lực luôn vuông góc với mặt bị ép.',
      completed: false,
      learningObjective: 'Phân biệt áp lực (lực) với áp suất (lực trên đơn vị diện tích)',
      knowledgeId: 'K_VAT_02',
      interactiveChallenge: {
        prompt: 'Áp lực là gì?',
        type: 'CHOICE',
        options: [
          'Lực ép có phương vuông góc với mặt bị ép',
          'Lực kéo song song với mặt bị ép',
          'Tổng lực hút Trái Đất tác dụng lên vật',
          'Lực ma sát khi vật trượt trên mặt phẳng'
        ],
        correctIndex: 0,
        explanation: 'Áp lực tác dụng vuông góc với mặt bị ép (mặt sàn, mặt đất).'
      }
    },
    {
      stageId: 'STG_VL15_2',
      stageNumber: 2,
      title: 'Tính áp suất của máy ủi',
      storyPrompt: 'Máy ủi có F = P = 700.000 N, S tiếp xúc đất = 2 m². Tính p.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL15_MAY_UI',
      requiredToolId: 'T_CALC',
      hint: 'p = F/S = 700.000 / 2.',
      completed: false,
      learningObjective: 'Vận dụng công thức p = F/S',
      knowledgeId: 'K_VAT_02',
      formulaId: 'F_LY_AP_SUAT_MAT',
      interactiveChallenge: {
        prompt: 'Tính áp suất của máy ủi lên mặt đất: F = 700.000 N, S = 2 m². Kết quả (Pa)?',
        type: 'NUMERIC_CALC',
        correctValue: 350000,
        tolerance: 5000,
        unit: 'Pa',
        explanation: 'p = F/S = 700.000 / 2 = 350.000 Pa (N/m²).'
      }
    },
    {
      stageId: 'STG_VL15_3',
      stageNumber: 3,
      title: 'Tăng hay giảm áp suất trên bùn lầy',
      storyPrompt: 'Máy ủi phải làm việc trên nền bùn lầy dễ lún. Quyết định phương án an toàn.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL15_CAY_XOI',
      hint: 'Giảm lún = giảm áp suất = tăng diện tích tiếp xúc S.',
      completed: false,
      learningObjective: 'Vận dụng mối quan hệ p và S trong thực tiễn',
      knowledgeId: 'K_VAT_02',
      interactiveChallenge: {
        prompt: 'Để máy ủi không lún xuống nền bùn, biện pháp hiệu quả nhất là gì?',
        type: 'CHOICE',
        options: [
          'Tăng diện tích tiếp xúc bằng bánh xích rộng bản (giảm áp suất)',
          'Thu nhỏ bánh xe lại cho nhẹ quay',
          'Tăng thêm tải trọng để ép đất chặt hơn',
          'Chỉ chạy ở chế độ ga lớn nhất'
        ],
        correctIndex: 0,
        explanation: 'p = F/S: khi S tăng, áp suất giảm → máy không bị lún vào nền đất yếu.'
      }
    }
  ]
};

// =========================================================================
// BÀI 16 - ÁP SUẤT CHẤT LỎNG VÀ CHẤT KHÍ (Chương III)
// =========================================================================

export const SCENE_VAT_B16: GameScene = {
  sceneId: 'SC_VAT_B16',
  title: 'Trạm Nâng Tải Thủy Lực',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  lessonBadge: 'B16 · Áp suất chất lỏng & khí',
  themeKey: 'underwater',
  storyIntro:
    'Trạm nâng tải dùng máy nén thủy lực: áp suất do pit-tông nhỏ tạo ra được truyền nguyên vẹn mọi hướng trong chất lỏng. Dưới lòng hồ, áp suất còn tăng theo độ sâu p = d.h.',
  goal: 'Hiểu nguyên lí máy nén thủy lực và tính áp suất chất lỏng theo độ sâu.',
  knowledgeIds: ['K_VAT_B16', 'K_VAT_02'],
  currentQuestId: 'QUEST_VAT_B16',
  objects: [
    {
      objectId: 'O_VL16_PISTON',
      type: 'machine',
      name: 'Máy Nén Thủy Lực Nâng Tải',
      description: 'Pit-tông nhỏ tiết diện S1 = 20 cm² chịu lực F1 = 200 N; pit-tông lớn S2 = 200 cm².',
      visualIcon: '⚙️',
      interactive: true,
      state: { inspected: false, s1: 20, s2: 200, f1: 200, measureText: 'S1 = 20 cm² · F1 = 200 N · S2 = 200 cm²' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_B16']
    },
    {
      objectId: 'O_VL16_HO_CHUA',
      type: 'environment',
      name: 'Hồ Chứa Kỹ Thuật (h = 25 m)',
      description: 'Áp kế đo áp suất nước ở độ sâu 25 m. Trọng lượng riêng nước d = 10.000 N/m³.',
      visualIcon: '🌊',
      interactive: true,
      state: { inspected: false, depth: 25, d: 10000, measureText: 'h = 25 m · d = 10 000 N/m³' },
      actions: ['inspect', 'measure'],
      knowledgeIds: ['K_VAT_B16']
    }
  ],
  tools: toolsOf('T_BARO', 'T_SPRING', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_16',
      name: 'Kỹ sư Quang Thủy',
      role: 'Trưởng trạm thủy lực',
      avatar: '🧑‍🔧',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B16'],
      dialogues: {
        welcome: {
          speech: 'Nguyên lí Pascal: áp suất truyền nguyên vẹn trong chất lỏng mọi hướng. Với diện tích pit-tông, chất lỏng như "nhân sức mạnh" lên gấp nhiều lần!',
          options: [{ text: 'Em muốn kiểm tra khả năng nâng tải rồi tính áp suất hồ!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Lực nâng F2 = F1 × (S2/S1). Sau đó thử tính áp suất ở đáy hồ p = d.h.',
          options: [{ text: 'Rõ, tính ngay!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B16: GameQuestV4 = {
  questId: 'QUEST_VAT_B16',
  title: 'Máy Nén Thủy Lực Và Đáy Hồ',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  storyIntro: 'Áp suất chất lỏng truyền nguyên vẹn mọi hướng và tăng theo độ sâu theo p = d.h.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 100,
  unlockedNodeId: 'K_VAT_B16',
  stages: [
    {
      stageId: 'STG_VL16_1',
      stageNumber: 1,
      title: 'Nguyên lí truyền áp suất của chất lỏng',
      storyPrompt: 'Quan sát máy nén thủy lực với hai pit-tông diện tích khác nhau.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL16_PISTON',
      hint: 'Áp suất phụ thuộc diện tích: cùng một áp suất, pit-tông to thì lực lớn hơn.',
      completed: false,
      learningObjective: 'Hiểu sự truyền nguyên vẹn áp suất trong chất lỏng',
      knowledgeId: 'K_VAT_B16',
      interactiveChallenge: {
        prompt: 'Khi tác dụng lực F1 lên pit-tông nhỏ, áp suất do F1 gây ra được truyền trong chất lỏng như thế nào?',
        type: 'CHOICE',
        options: [
          'Truyền nguyên vẹn theo mọi phương tới mọi điểm trong chất lỏng',
          'Chỉ truyền thẳng xuống đáy bình',
          'Bị giảm dần khi đi xa pit-tông',
          'Truyền ngược lên mặt thoáng rồi biến mất'
        ],
        correctIndex: 0,
        explanation: 'Chất lỏng truyền nguyên vẹn áp suất theo mọi hướng — cơ sở của máy nén thủy lực.'
      }
    },
    {
      stageId: 'STG_VL16_2',
      stageNumber: 2,
      title: 'Tính lực nâng của máy thủy lực',
      storyPrompt: 'F1 = 200 N, S1 = 20 cm², S2 = 200 cm². Tính lực nâng tối đa F2.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL16_PISTON',
      requiredToolId: 'T_CALC',
      hint: 'F2 = F1 × (S2/S1) = 200 × (200/20).',
      completed: false,
      learningObjective: 'Vận dụng nguyên lí cân bằng áp suất trong máy nén thủy lực',
      knowledgeId: 'K_VAT_B16',
      interactiveChallenge: {
        prompt: 'Lực nâng F2 tối đa của máy nén thủy lực này bằng bao nhiêu (N)?',
        type: 'NUMERIC_CALC',
        correctValue: 2000,
        tolerance: 50,
        unit: 'N',
        explanation: 'Áp suất p = F1/S1; F2 = p.S2 = 200/20 × 200 = 2000 N — lực được nhân lên 10 lần.'
      }
    },
    {
      stageId: 'STG_VL16_3',
      stageNumber: 3,
      title: 'Áp suất ở độ sâu 25 m',
      storyPrompt: 'Tính áp suất do nước gây ra ở đáy hồ kỹ thuật nơi đặt trạm.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL16_HO_CHUA',
      requiredToolId: 'T_BARO',
      hint: 'p = d.h = 10.000 × 25.',
      completed: false,
      learningObjective: 'Tính áp suất chất lỏng theo độ sâu p = d.h',
      knowledgeId: 'K_VAT_02',
      formulaId: 'F_LY_AP_SUAT_MAT',
      interactiveChallenge: {
        prompt: 'Áp suất nước ở độ sâu 25 m (d = 10.000 N/m³) bằng bao nhiêu Pa?',
        type: 'NUMERIC_CALC',
        correctValue: 250000,
        tolerance: 5000,
        unit: 'Pa',
        explanation: 'p = d.h = 10.000 × 25 = 250.000 Pa — càng xuống sâu, áp suất càng lớn.'
      }
    }
  ]
};

// =========================================================================
// BÀI 17 - LỰC ĐẨY ARCHIMEDES (Chương III)
// =========================================================================

export const SCENE_VAT_B17: GameScene = {
  sceneId: 'SC_VAT_B17',
  title: 'Xưởng Đóng Tàu & Tàu Ngầm',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  lessonBadge: 'B17 · Lực đẩy Archimedes',
  themeKey: 'underwater',
  storyIntro:
    'Trong xưởng, chiếc tàu ngầm mô hình có thể tích chìm V = 1,5 m³. Lực đẩy Archimedes FA = d.V đẩy vật thẳng đứng lên trên. Tàu nổi hay chìm tùy vào so sánh P và FA!',
  goal: 'Tính FA = d.V và biện luận điều kiện vật nổi, chìm, lơ lửng.',
  knowledgeIds: ['K_VAT_03'],
  currentQuestId: 'QUEST_VAT_B17',
  objects: [
    {
      objectId: 'O_VL17_TAU_NGAM',
      type: 'machine',
      name: 'Tàu Ngầm Mô Hình',
      description: 'Thể tích phần chìm V = 1,5 m³. Trọng lượng riêng nước biển d = 10.300 N/m³.',
      visualIcon: '🚢',
      interactive: true,
      state: { inspected: false, volume: 1.5, d: 10300, measureText: 'V chìm = 1,5 m³ · d nước biển = 10 300 N/m³' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_03']
    },
    {
      objectId: 'O_VL17_KET_DAN',
      type: 'machine',
      name: 'Két Nước Dằn',
      description: 'Bơm nước vào hoặc xả nước ra để thay đổi trọng lượng P của tàu ngầm.',
      visualIcon: '⚙️',
      interactive: true,
      state: { inspected: false, measureText: 'Bơm nước vào → P tăng → tàu lặn' },
      actions: ['inspect', 'decide', 'repair'],
      knowledgeIds: ['K_VAT_03']
    }
  ],
  tools: toolsOf('T_SPRING', 'T_GRAD', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_17',
      name: 'Thuyền trưởng Minh Tuấn',
      role: 'Chỉ huy xưởng tàu',
      avatar: '👨‍✈️',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_03'],
      dialogues: {
        welcome: {
          speech: 'Archimedes dạy rằng: vật nhúng trong chất lỏng chịu lực đẩy hướng thẳng đứng lên trên, bằng trọng lượng chất lỏng bị chiếm chỗ: FA = d.V.',
          options: [{ text: 'Em sẽ tính FA rồi biện luận tàu nổi hay chìm!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Khi P > FA vật chìm, P < FA vật nổi, P = FA vật lơ lửng.',
          options: [{ text: 'Rõ, tính ngay!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B17: GameQuestV4 = {
  questId: 'QUEST_VAT_B17',
  title: 'Thả Nổi Tàu Ngầm Bằng Archimedes',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối lượng riêng và Áp suất',
  storyIntro: 'Tính FA = d.V và dùng két nước dằn để điều khiển tàu ngầm nổi - chìm.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 100,
  unlockedNodeId: 'K_VAT_03',
  stages: [
    {
      stageId: 'STG_VL17_1',
      stageNumber: 1,
      title: 'Đặc điểm lực đẩy Archimedes',
      storyPrompt: 'Quan sát tàu ngầm mô hình nổi trên mặt nước trong bể thử.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL17_TAU_NGAM',
      hint: 'Lực đẩy có phương thẳng đứng, chiều từ dưới lên.',
      completed: false,
      learningObjective: 'Hiểu đặc điểm lực đẩy Archimedes',
      knowledgeId: 'K_VAT_03',
      interactiveChallenge: {
        prompt: 'Lực đẩy Archimedes tác dụng lên vật nhúng trong chất lỏng có hướng như thế nào?',
        type: 'CHOICE',
        options: [
          'Phương thẳng đứng, chiều từ dưới lên trên',
          'Phương ngang, hướng ra ngoài mặt nước',
          'Phương thẳng đứng, chiều từ trên xuống',
          'Không có phương xác định'
        ],
        correctIndex: 0,
        explanation: 'FA hướng thẳng đứng từ dưới lên, độ lớn bằng trọng lượng chất lỏng bị vật chiếm chỗ.'
      }
    },
    {
      stageId: 'STG_VL17_2',
      stageNumber: 2,
      title: 'Tính lực đẩy FA',
      storyPrompt: 'Tàu ngầm chìm V = 1,5 m³ trong nước biển d = 10.300 N/m³. Tính FA.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL17_TAU_NGAM',
      requiredToolId: 'T_CALC',
      hint: 'FA = d.V = 10.300 × 1,5.',
      completed: false,
      learningObjective: 'Vận dụng công thức FA = d.V',
      knowledgeId: 'K_VAT_03',
      formulaId: 'F_LY_ARCHIMEDES',
      interactiveChallenge: {
        prompt: 'Tính lực đẩy Archimedes lên tàu ngầm khi chìm V = 1,5 m³ trong nước biển (d = 10.300 N/m³). Kết quả (N)?',
        type: 'NUMERIC_CALC',
        correctValue: 15450,
        tolerance: 300,
        unit: 'N',
        explanation: 'FA = d.V = 10.300 × 1,5 = 15.450 N.'
      }
    },
    {
      stageId: 'STG_VL17_3',
      stageNumber: 3,
      title: 'Điều khiển tàu ngầm nổi - chìm',
      storyPrompt: 'Cần đưa tàu ngầm lặn xuống. Chọn thao tác với két nước dằn.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL17_KET_DAN',
      hint: 'Lặn xuống khi P > FA — cần tăng trọng lượng của tàu.',
      completed: false,
      learningObjective: 'Vận dụng điều kiện vật nổi-chìm-lơ lửng',
      knowledgeId: 'K_VAT_03',
      interactiveChallenge: {
        prompt: 'Để tàu ngầm lặn xuống sâu, thuyền trưởng cần làm gì?',
        type: 'CHOICE',
        options: [
          'Bơm nước biển vào két dằn để tăng P cho đến khi P > FA',
          'Xả nước ra khỏi két dằn để giảm P',
          'Giảm thể tích phần chìm xuống',
          'Thả neo ở mọi độ sâu'
        ],
        correctIndex: 0,
        explanation: 'Khi P > FA vật chìm xuống. Bơm thêm nước vào két dằn làm tăng P, tàu ngầm lặn.'
      }
    }
  ]
};

// =========================================================================
// BÀI 18 - TÁC DỤNG LÀM QUAY CỦA LỰC · MOMENT LỰC (Chương IV)
// =========================================================================

export const SCENE_VAT_B18: GameScene = {
  sceneId: 'SC_VAT_B18',
  title: 'Xưởng Cơ Khí Cờ Lê Lực',
  domain: 'VAT_LI',
  chapterTitle: 'Chương IV: Tác dụng làm quay của lực',
  lessonBadge: 'B18 · Moment lực',
  themeKey: 'workshop',
  storyIntro:
    'Một bu lông bị siết quá chặt. Moment lực M = F.d mô tả khả năng làm vật quay quanh trục: lực càng lớn, cánh tay đòn càng dài thì càng dễ xoay. Hãy chọn cách tác dụng cờ lê hiệu quả nhất!',
  goal: 'Tính M = F.d và vận dụng để giảm lực khi vặn bu lông.',
  knowledgeIds: ['K_VAT_B18'],
  currentQuestId: 'QUEST_VAT_B18',
  objects: [
    {
      objectId: 'O_VL18_BULONG',
      type: 'machine',
      name: 'Bu Lông Bị Kẹt',
      description: 'Cần moment xoay M = 15 N.m để bung ra. Lực kế đo lực tác dụng lên cờ lê.',
      visualIcon: '🔩',
      interactive: true,
      state: { inspected: false, moment: 15, measureText: 'Cần M = 15 N.m để bung bu lông' },
      actions: ['inspect', 'measure', 'repair'],
      knowledgeIds: ['K_VAT_B18']
    },
    {
      objectId: 'O_VL18_CO_LE',
      type: 'measurement_tool',
      name: 'Cờ Lê Dài 30 cm',
      description: 'Cánh tay đòn d = 30 cm. Nếu tay bấm lực F = 50 N vuông góc với cờ lê.',
      visualIcon: '🛠️',
      interactive: true,
      state: { inspected: false, arm: 0.3, force: 50, measureText: 'd = 30 cm · F = 50 N' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_B18']
    }
  ],
  tools: toolsOf('T_SPRING', 'T_RULER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_18',
      name: 'Anh Phúc Workshop',
      role: 'Thợ cả xưởng cơ khí',
      avatar: '🧑‍🏭',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B18'],
      dialogues: {
        welcome: {
          speech: 'Moment lực M = F.d: d là cánh tay đòn, khoảng cách từ trục quay đến giá của lực. Cờ lê càng dài, d càng lớn, lực cần dùng càng nhỏ!',
          options: [{ text: 'Em sẽ tính moment và tìm cách mở bu lông!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Đổi d = 30 cm ra 0,3 m rồi nhân với F = 50 N.',
          options: [{ text: 'Rõ!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B18: GameQuestV4 = {
  questId: 'QUEST_VAT_B18',
  title: 'Mở Bu Lông Bằng Moment Lực',
  domain: 'VAT_LI',
  chapterTitle: 'Chương IV: Tác dụng làm quay của lực',
  storyIntro: 'Tính M = F.d để đánh giá khả năng xoay bu lông và chọn cách giảm lực cần thiết.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B18',
  stages: [
    {
      stageId: 'STG_VL18_1',
      stageNumber: 1,
      title: 'Khái niệm moment lực',
      storyPrompt: 'Quan sát bu lông kẹt và chiếc cờ lê để hiểu yếu tố quyết định vật quay.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL18_BULONG',
      hint: 'Moment lực = lực × cánh tay đòn.',
      completed: false,
      learningObjective: 'Hiểu khái niệm moment lực và cánh tay đòn',
      knowledgeId: 'K_VAT_B18',
      interactiveChallenge: {
        prompt: 'Moment lực M = F.d đặc trưng cho điều gì?',
        type: 'CHOICE',
        options: [
          'Khả năng làm vật quay quanh một trục',
          'Khả năng làm vật trượt trên mặt phẳng',
          'Khối lượng của vật cần quay',
          'Tốc độ chuyển động của vật'
        ],
        correctIndex: 0,
        explanation: 'Moment lực mô tả tác dụng làm quay; càng lớn thì càng dễ làm vật quay quanh trục.'
      }
    },
    {
      stageId: 'STG_VL18_2',
      stageNumber: 2,
      title: 'Tính moment lực của tay bấm',
      storyPrompt: 'Tay bấm F = 50 N vuông góc với cờ lê dài 30 cm. Tính M.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL18_CO_LE',
      requiredToolId: 'T_CALC',
      hint: 'd = 30 cm = 0,3 m; M = F.d = 50 × 0,3.',
      completed: false,
      learningObjective: 'Vận dụng công thức moment lực M = F.d',
      knowledgeId: 'K_VAT_B18',
      formulaId: 'F_LY_MOMENT_LUC',
      interactiveChallenge: {
        prompt: 'Tính moment lực M khi bấm cờ lê với F = 50 N tại cánh tay đòn d = 30 cm. Kết quả (N.m)?',
        type: 'NUMERIC_CALC',
        correctValue: 15,
        tolerance: 0.5,
        unit: 'N.m',
        explanation: 'M = F.d = 50 × 0,3 = 15 N.m — đúng bằng moment cần để bung bu lông.'
      }
    },
    {
      stageId: 'STG_VL18_3',
      stageNumber: 3,
      title: 'Giảm lực khi mở bu lông',
      storyPrompt: 'Bu lông vẫn chưa bung. Chọn cách làm giảm công sức bấm.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL18_BULONG',
      hint: 'Với cùng moment M, cánh tay đòn d lớn thì F nhỏ.',
      completed: false,
      learningObjective: 'Vận dụng M = F.d để tối ưu lực tác dụng',
      knowledgeId: 'K_VAT_B18',
      interactiveChallenge: {
        prompt: 'Muốn giảm lực bấm F khi mở bu lông mà vẫn giữ moment M, ta nên làm gì?',
        type: 'CHOICE',
        options: [
          'Nối dài cán cờ lê (tăng cánh tay đòn d)',
          'Bấm ngay sát trục quay để d nhỏ lại',
          'Dùng cờ lê ngắn hơn cho gọn tay',
          'Bấm các điểm khác nhau trên cùng khoảng cách ngắn'
        ],
        correctIndex: 0,
        explanation: 'M không đổi thì F = M/d: tăng d làm F giảm — vì vậy người ta hay nối dài tay đòn cờ lê.'
      }
    }
  ]
};

// =========================================================================
// BÀI 19 - ĐÒN BẨY (Chương IV)
// =========================================================================

export const SCENE_VAT_B19: GameScene = {
  sceneId: 'SC_VAT_B19',
  title: 'Công Trường Xà Beng',
  domain: 'VAT_LI',
  chapterTitle: 'Chương IV: Tác dụng làm quay của lực',
  lessonBadge: 'B19 · Đòn bẩy',
  themeKey: 'workshop',
  storyIntro:
    'Xà beng nhấc hòn đá nặng 300 N. Điểm tựa đặt cách hòn đá 0,2 m, tay ấn cách điểm tựa 1,2 m. Đòn bẩy cân bằng khi F1.d1 = F2.d2. Hãy tìm lực cần ấn!',
  goal: 'Áp dụng quy tắc đòn bẩy F1.d1 = F2.d2 và phân loại đòn bẩy trong tự nhiên.',
  knowledgeIds: ['K_VAT_04'],
  currentQuestId: 'QUEST_VAT_B19',
  objects: [
    {
      objectId: 'O_VL19_HON_DA',
      type: 'environment',
      name: 'Hòn Đá Nặng 300 N',
      description: 'Trọng lượng P = F2 = 300 N. Cần nhấc lên để mở đường.',
      visualIcon: '🪨',
      interactive: true,
      state: { inspected: false, f2: 300, measureText: 'P = 300 N' },
      actions: ['inspect', 'measure'],
      knowledgeIds: ['K_VAT_04']
    },
    {
      objectId: 'O_VL19_XA_BENG',
      type: 'machine',
      name: 'Xà Beng Và Điểm Tựa',
      description: 'Điểm tựa O cách hòn đá d2 = 0,2 m; tay ấn cách O một đoạn d1 = 1,2 m.',
      visualIcon: '⛏️',
      interactive: true,
      state: { inspected: false, d2: 0.2, d1: 1.2, measureText: 'd2 = 0,2 m · d1 = 1,2 m' },
      actions: ['inspect', 'calculate', 'decide'],
      knowledgeIds: ['K_VAT_04']
    }
  ],
  tools: toolsOf('T_SPRING', 'T_RULER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_19',
      name: 'Bác Sáu Công Trường',
      role: 'Chỉ huy nâng hạ',
      avatar: '👷',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_04'],
      dialogues: {
        welcome: {
          speech: 'Đòn bẩy có điểm tựa O, điểm đặt lực tác dụng và điểm đặt tải. Cân bằng khi F1.d1 = F2.d2.',
          options: [{ text: 'Em sẽ tính lực ấn và suy nghĩ về các loại đòn bẩy!', nextState: 'guide' }]
        },
        guide: {
          speech: 'F1 = F2 × (d2/d1) = 300 × 0,2/1,2.',
          options: [{ text: 'Rõ!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B19: GameQuestV4 = {
  questId: 'QUEST_VAT_B19',
  title: 'Nhấc Hòn Đá Bằng Đòn Bẩy',
  domain: 'VAT_LI',
  chapterTitle: 'Chương IV: Tác dụng làm quay của lực',
  storyIntro: 'Áp dụng F1.d1 = F2.d2 để tính lực ấn và nhận diện các loại đòn bẩy.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_04',
  stages: [
    {
      stageId: 'STG_VL19_1',
      stageNumber: 1,
      title: 'Cấu tạo đòn bẩy',
      storyPrompt: 'Quan sát xà beng: điểm tựa, điểm đặt lực, điểm đặt tải.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL19_XA_BENG',
      hint: 'Đò bẩy có 3 vị trí đặc biệt trên thanh cứng.',
      completed: false,
      learningObjective: 'Nhận biết các bộ phận của đòn bẩy',
      knowledgeId: 'K_VAT_04',
      interactiveChallenge: {
        prompt: 'Một chiếc đòn bẩy hoạt động dựa trên bộ phận nào dưới đây?',
        type: 'CHOICE',
        options: [
          'Điểm tựa, điểm đặt lực tác dụng và điểm đặt lực cản (tải)',
          'Một ròng rọc và một sợi dây',
          'Một mặt phẳng nghiêng cố định',
          'Một nam châm và một thanh sắt'
        ],
        correctIndex: 0,
        explanation: 'Đò bẩy là thanh cứng quay quanh điểm tựa, chịu lực tác dụng và lực cản ở hai đầu.'
      }
    },
    {
      stageId: 'STG_VL19_2',
      stageNumber: 2,
      title: 'Tính lực ấn xà beng',
      storyPrompt: 'F2 = 300 N, d2 = 0,2 m, d1 = 1,2 m. Tính lực tối thiểu F1 cần ấn.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL19_XA_BENG',
      requiredToolId: 'T_CALC',
      hint: 'F1 = F2 × (d2/d1) = 300 × 0,2/1,2.',
      completed: false,
      learningObjective: 'Vận dụng quy tắc cân bằng đòn bẩy',
      knowledgeId: 'K_VAT_04',
      formulaId: 'F_LY_DON_BAY',
      interactiveChallenge: {
        prompt: 'Tính lực tối thiểu F1 để nhấc hòn đá 300 N (d2 = 0,2 m, d1 = 1,2 m). Kết quả (N)?',
        type: 'NUMERIC_CALC',
        correctValue: 50,
        tolerance: 2,
        unit: 'N',
        explanation: 'F1 = F2.d2/d1 = 300 × 0,2/1,2 = 50 N — đòn bẩy giúp giảm lực 6 lần.'
      }
    },
    {
      stageId: 'STG_VL19_3',
      stageNumber: 3,
      title: 'Đòn bẩy trong cơ thể người',
      storyPrompt: 'So sánh các loại đòn bẩy và vận dụng vào cẳng tay người.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL19_HON_DA',
      hint: 'Khi cầm vật, bắp tay kéo ở gần điểm tựa (khuỷu tay).',
      completed: false,
      learningObjective: 'Phân loại đòn bẩy và nhận diện ứng dụng trong cơ thể',
      knowledgeId: 'K_VAT_04',
      interactiveChallenge: {
        prompt: 'Cẳng tay người khi gập vào giữ vật là đòn bẩy loại nào (điểm tựa là khuỷu tay, bắp tay kéo ở giữa)?',
        type: 'CHOICE',
        options: [
          'Đò bẩy loại 3 — lợi về tốc độ, thiệt về lực',
          'Đò bẩy loại 1 — lợi về lực',
          'Đò bẩy loại 2 — luôn lợi về lực',
          'Không phải đòn bẩy'
        ],
        correctIndex: 0,
        explanation: 'Lực từ bắp tay đặt giữa điểm tựa và tải → loại 3: đánh đổi lực để lấy tốc độ và tầm với.'
      }
    }
  ]
};

// =========================================================================
// BÀI 20 - NGHIỄN ĐIỆN DO CỌ XÁT (Chương V)
// =========================================================================

export const SCENE_VAT_B20: GameScene = {
  sceneId: 'SC_VAT_B20',
  title: 'Phòng Thí Nghiệm Tĩnh Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B20 · Nhiễm điện do cọ xát',
  themeKey: 'electric',
  storyIntro:
    'Cọ xát đũa thủy tinh với mảnh vải lụa rồi đưa lại gần giấy vụn (hoặc quả bóng bay với áo len) — các vật hút nhau. Đó là hiện tượng nhiễm điện do cọ xát. Vật nhiễm điện có thể hút vật nhẹ!',
  goal: 'Nắm hiện tượng nhiễm điện do cọ xát và quy tắc tương tác giữa hai loại điện tích.',
  knowledgeIds: ['K_VAT_B20'],
  currentQuestId: 'QUEST_VAT_B20',
  objects: [
    {
      objectId: 'O_VL20_DUA_THUY_TINH',
      type: 'experiment_equipment',
      name: 'Đũa Thủy Tinh & Vải Lụa',
      description: 'Sau khi cọ xát, đũa thủy tinh nhiễm điện hút các mảnh giấy vụn nhẹ.',
      visualIcon: '🥢',
      interactive: true,
      state: { inspected: false, measureText: 'Đũa thủy tinh sau cọ xát hút giấy vụn' },
      actions: ['inspect', 'experiment', 'observe'],
      knowledgeIds: ['K_VAT_B20']
    },
    {
      objectId: 'O_VL20_DIEN_NGHIEM',
      type: 'measurement_tool',
      name: 'Điện Nghiệm Lá Vàng',
      description: 'Hai lá kim loại trong bình thủy tinh; khi chạm vật nhiễm điện chúng xòe ra (nhiễm điện cùng dấu đẩy nhau).',
      visualIcon: '🔋',
      interactive: true,
      state: { inspected: false, measureText: 'Lá vàng xòe ra khi vật nhiễm điện chạm vào' },
      actions: ['inspect', 'observe', 'experiment'],
      knowledgeIds: ['K_VAT_B20']
    }
  ],
  tools: toolsOf('T_THERMO', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_20',
      name: 'Cô Linh Điện',
      role: 'Phụ trách thí nghiệm tĩnh điện',
      avatar: '👩‍🔬',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B20'],
      dialogues: {
        welcome: {
          speech: 'Hiện tượng này gọi là nhiễm điện do cọ xát. Có hai loại điện tích: điện tích dương (+) và điện tích âm (-). Hai điện tích cùng dấu thì đẩy nhau, trái dấu thì hút nhau.',
          options: [{ text: 'Em sẽ thử nghiệm với đũa thủy tinh và điện nghiệm!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Nhớ: vật nhiễm điện hút các vật nhẹ không nhiễm điện.',
          options: [{ text: 'Rõ!', nextState: 'experimenting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B20: GameQuestV4 = {
  questId: 'QUEST_VAT_B20',
  title: 'Thám Hiểm Tĩnh Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Khám phá nhiễm điện do cọ xát và quy luật tương tác giữa hai loại điện tích.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B20',
  stages: [
    {
      stageId: 'STG_VL20_1',
      stageNumber: 1,
      title: 'Nhận biết vật nhiễm điện',
      storyPrompt: 'Cọ xát đũa thủy tinh với vải lụa rồi đưa lại gần nước chảy mảnh hoặc giấy vụn.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_VL20_DUA_THUY_TINH',
      hint: 'Vật nhiễm điện có khả năng hút các vật nhẹ, không nhiễm điện.',
      completed: false,
      learningObjective: 'Nhận biết hiện tượng một vật bị nhiễm điện do cọ xát',
      knowledgeId: 'K_VAT_B20',
      interactiveChallenge: {
        prompt: 'Sau khi cọ xát, đũa thủy tinh hút các mảnh giấy vụn. Điều đó chứng tỏ gì?',
        type: 'CHOICE',
        options: [
          'Đũa thủy tinh đã bị nhiễm điện do cọ xát',
          'Đũa thủy tinh trở nên nóng hơn giấy vụn',
          'Đũa thủy tinh có dính keo tự nhiên',
          'Giấy vụn tự chuyển động không cần vật khác'
        ],
        correctIndex: 0,
        explanation: 'Vật nhiễm điện có khả năng hút các vật nhẹ — dấu hiệu nhận biết nhiễm điện.'
      }
    },
    {
      stageId: 'STG_VL20_2',
      stageNumber: 2,
      title: 'Hai loại điện tích',
      storyPrompt: 'Dùng điện nghiệm để kiểm tra sự tương tác của các vật sau khi cọ xát.',
      requiredActionType: 'observe',
      targetObjectId: 'O_VL20_DIEN_NGHIEM',
      hint: 'Khi đưa hai vật nhiễm điện cùng loại lại gần, chúng đẩy nhau.',
      completed: false,
      learningObjective: 'Phân biệt hai loại điện tích và quy tắc tương tác',
      knowledgeId: 'K_VAT_B20',
      interactiveChallenge: {
        prompt: 'Hai điện tích cùng dấu đặt gần nhau sẽ như thế nào?',
        type: 'CHOICE',
        options: [
          'Đẩy nhau',
          'Hút nhau',
          'Không tương tác',
          'Kết hợp thành điện tích trung hòa'
        ],
        correctIndex: 0,
        explanation: 'Cùng dấu → đẩy nhau; trái dấu → hút nhau.'
      }
    },
    {
      stageId: 'STG_VL20_3',
      stageNumber: 3,
      title: 'Vận dụng hiện tượng cọ xát',
      storyPrompt: 'Giải thích hiện tượng chải tóc: lược nhựa cọ xát tóc hút tóc.',
      requiredActionType: 'decide',
      hint: 'Áp dụng quy luật tương tác điện tích để giải thích.',
      completed: false,
      learningObjective: 'Vận dụng nhiễm điện do cọ xát vào giải thích hiện tượng trong đời sống',
      knowledgeId: 'K_VAT_B20',
      interactiveChallenge: {
        prompt: 'Khi chải, lược nhựa cọ xát với tóc và có thể hút các sợi tóc khô. Vì sao?',
        type: 'CHOICE',
        options: [
          'Lược nhựa bị nhiễm điện do cọ xát với tóc, có thể hút vật nhẹ đặt gần',
          'Tóc được phủ một lớp màng bôi trơn',
          'Lược nhựa nóng lên làm tóc dính vào',
          'Tóc và lược cùng mang điện tích trái dấu nên hút'
        ],
        correctIndex: 0,
        explanation: 'Cọ xát làm lược nhiễm điện, có khả năng hút vật nhẹ (tóc) đặt gần nó.'
      }
    }
  ]
};

// =========================================================================
// BÀI 21 - DÒNG ĐIỆN VÀ NGUỒN ĐIỆN (Chương V)
// =========================================================================

export const SCENE_VAT_B21: GameScene = {
  sceneId: 'SC_VAT_B21',
  title: 'Bàn Mạch Pin & Vật Dẫn',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B21 · Dòng điện & nguồn điện',
  themeKey: 'electric',
  storyIntro:
    'Dòng điện là dòng chuyển dời có hướng của các hạt mang điện trong vật dẫn. Nguồn điện (pin, acquy, ổ điện) duy trì dòng điện. Chất dẫn điện cho dòng điện đi qua, chất cách điện thì không.',
  goal: 'Phân biệt dòng điện - nguồn điện, vật dẫn điện - vật cách điện.',
  knowledgeIds: ['K_VAT_B21'],
  currentQuestId: 'QUEST_VAT_B21',
  objects: [
    {
      objectId: 'O_VL21_PIN',
      type: 'machine',
      name: 'Pin Con Thỏ Trên Bàn',
      description: 'Nguồn điện cung cấp năng lượng duy trì dòng điện trong mạch kín.',
      visualIcon: '🔋',
      interactive: true,
      state: { inspected: false, measureText: 'Pin có hai cực: dương (+) và âm (-)' },
      actions: ['inspect', 'measure', 'observe'],
      knowledgeIds: ['K_VAT_B21']
    },
    {
      objectId: 'O_VL21_TEST_BOARD',
      type: 'experiment_equipment',
      name: 'Bảng Thử Vật Dẫn - Cách Điện',
      description: 'Các mẫu vật liệu: thanh đồng, lá nhôm, đoạn dây nhựa, đoạn tre khô, miếng cao su.',
      visualIcon: '🧪',
      interactive: true,
      state: { inspected: false, measureText: 'Đồng, nhôm: dẫn điện · nhựa, tre khô, cao su: cách điện' },
      actions: ['inspect', 'experiment', 'decide'],
      knowledgeIds: ['K_VAT_B21']
    }
  ],
  tools: toolsOf('T_AMMETER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_21',
      name: 'Thầy Đức Mạch',
      role: 'Giáo viên vật lí điện học',
      avatar: '👨‍🏫',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B21'],
      dialogues: {
        welcome: {
          speech: 'Dòng điện là gì? Là dòng chuyển dời có hướng của các hạt mang điện! Nguồn điện là thiết bị cung cấp năng lượng điện để duy trì dòng điện.',
          options: [{ text: 'Em sẽ phân loại vật liệu dẫn điện và cách điện!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Kim loại (đồng, nhôm) dẫn điện tốt. Nhựa, cao su, tre khô không cho dòng điện đi qua.',
          options: [{ text: 'Rõ!', nextState: 'experimenting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B21: GameQuestV4 = {
  questId: 'QUEST_VAT_B21',
  title: 'Dòng Điện Và Vật Liệu',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Hiểu bản chất dòng điện, vai trò nguồn điện và phân loại vật dẫn - cách điện.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B21',
  stages: [
    {
      stageId: 'STG_VL21_1',
      stageNumber: 1,
      title: 'Bản chất dòng điện',
      storyPrompt: 'Quan sát pin và mạch đèn nhỏ để hiểu nguồn điện duy trì dòng điện.',
      requiredActionType: 'observe',
      targetObjectId: 'O_VL21_PIN',
      hint: 'Hạt mang điện chuyển dời có hướng tạo thành dòng điện.',
      completed: false,
      learningObjective: 'Hiểu bản chất của dòng điện và vai trò nguồn điện',
      knowledgeId: 'K_VAT_B21',
      interactiveChallenge: {
        prompt: 'Dòng điện trong kim loại là gì?',
        type: 'CHOICE',
        options: [
          'Dòng chuyển dời có hướng của các electron tự do',
          'Dòng chuyển động hỗn loạn của các nguyên tử kim loại',
          'Dòng chuyển dời có hướng của các phân tử nước trong kim loại',
          'Không có dòng chuyển dời nào'
        ],
        correctIndex: 0,
        explanation: 'Trong kim loại, các electron tự do chuyển dời có hướng tạo thành dòng điện.'
      }
    },
    {
      stageId: 'STG_VL21_2',
      stageNumber: 2,
      title: 'Phân loại vật liệu',
      storyPrompt: 'Thử lần lượt các mẫu vật liệu trên bảng thử để lắp mạch đèn sáng.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_VL21_TEST_BOARD',
      requiredToolId: 'T_AMMETER',
      hint: 'Vật nào làm đèn sáng (ampe kế có chỉ số) là vật dẫn điện.',
      completed: false,
      learningObjective: 'Phân biệt vật dẫn điện và vật cách điện',
      knowledgeId: 'K_VAT_B21',
      interactiveChallenge: {
        prompt: 'Vật liệu nào sau đây là vật dẫn điện (đèn trong mạch sẽ sáng)?',
        type: 'CHOICE',
        options: [
          'Lá nhôm / dây đồng',
          'Đoạn ống nhựa',
          'Thanh tre khô',
          'Miếng cao su tẩy'
        ],
        correctIndex: 0,
        explanation: 'Kim loại (đồng, nhôm) dẫn điện tốt; nhựa, tre khô, cao su là chất cách điện.'
      }
    },
    {
      stageId: 'STG_VL21_3',
      stageNumber: 3,
      title: 'Vai trò nguồn điện',
      storyPrompt: 'Giải thích vì sao cần nguồn điện để đèn nhỏ sáng liên tục.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL21_PIN',
      hint: 'Nguồn điện tạo ra và duy trì dòng điện trong mạch.',
      completed: false,
      learningObjective: 'Hiểu nguồn điện cung cấp năng lượng để duy trì dòng điện',
      knowledgeId: 'K_VAT_B21',
      interactiveChallenge: {
        prompt: 'Vai trò của nguồn điện (pin) trong mạch điện là gì?',
        type: 'CHOICE',
        options: [
          'Cung cấp năng lượng để duy trì dòng điện trong mạch',
          'Làm mạch nóng thêm, không liên quan dòng điện',
          'Chỉ để nối dây mạch cho đẹp',
          'Tự sinh ra dòng điện không cần mạch kín'
        ],
        correctIndex: 0,
        explanation: 'Nguồn điện cung cấp năng lượng làm các hạt mang điện chuyển dời, duy trì dòng điện.'
      }
    }
  ]
};

// =========================================================================
// BÀI 22 - MẠCH ĐIỆN ĐƠN GIẢN (Chương V)
// =========================================================================

export const SCENE_VAT_B22: GameScene = {
  sceneId: 'SC_VAT_B22',
  title: 'Tổng Đài Mạch Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B22 · Mạch điện đơn giản',
  themeKey: 'electric',
  storyIntro:
    'Mạch điện đơn giản gồm: nguồn điện, dây dẫn, công tắc và thiết bị tiêu thụ (bóng đèn, chuông điện). Đèn chỉ sáng khi mạch kín. Chiều dòng điện quy ước chảy từ cực dương (+) qua mạch về cực âm (-).',
  goal: 'Đọc vẽ sơ đồ mạch điện và hiểu điều kiện mạch kín, vai trò cầu chì - rơle.',
  knowledgeIds: ['K_VAT_B22'],
  currentQuestId: 'QUEST_VAT_B22',
  objects: [
    {
      objectId: 'O_VL22_MACH_DEN',
      type: 'machine',
      name: 'Mạch Đèn Bàn Mô Hình',
      description: 'Pin, hai dây dẫn, công tắc và bóng đèn. Đèn sáng khi công tắc đóng (mạch kín).',
      visualIcon: '💡',
      interactive: true,
      state: { inspected: false, closed: false, measureText: 'Mạch kín → đèn sáng' },
      actions: ['inspect', 'decide', 'repair'],
      knowledgeIds: ['K_VAT_B22']
    },
    {
      objectId: 'O_VL22_SO_DO',
      type: 'inspectable',
      name: 'Bảng Kí Hiệu Mạch Điện',
      description: 'Sơ đồ quy ước: nguồn điện, công tắc, bóng đèn, ampe kế, vôn kế, chuông điện, điện trở.',
      visualIcon: '📐',
      interactive: true,
      state: { inspected: false, measureText: 'Bảng kí hiệu chuẩn quốc tế cho sơ đồ mạch' },
      actions: ['inspect', 'observe'],
      knowledgeIds: ['K_VAT_B22']
    }
  ],
  tools: toolsOf('T_AMMETER', 'T_VOLTMETER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_22',
      name: 'Kỹ sư Hải Lưu',
      role: 'Trưởng trạm điện tổng đài',
      avatar: '🧑‍🔧',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B22'],
      dialogues: {
        welcome: {
          speech: 'Mạch điện chỉ làm việc khi kín: dòng điện đi từ cực dương của nguồn qua dây dẫn, công tắc, tới thiết bị rồi về cực âm.',
          options: [{ text: 'Em sẽ kiểm tra mạch đèn và đọc bảng kí hiệu!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Nhớ chiều dòng điện qui ước: từ (+) tới (-).',
          options: [{ text: 'Rõ!', nextState: 'inspecting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B22: GameQuestV4 = {
  questId: 'QUEST_VAT_B22',
  title: 'Mạch Điện Đơn Giản',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Hiểu điều kiện mạch kín, chiều dòng điện và kí hiệu mạch điện.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B22',
  stages: [
    {
      stageId: 'STG_VL22_1',
      stageNumber: 1,
      title: 'Điều kiện đèn sáng',
      storyPrompt: 'Quan sát mạch đèn bàn: pin, dây dẫn, công tắc, bóng đèn.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL22_MACH_DEN',
      hint: 'Dòng điện chỉ lưu thông trong mạch kín.',
      completed: false,
      learningObjective: 'Hiểu điều kiện để mạch điện hoạt động',
      knowledgeId: 'K_VAT_B22',
      interactiveChallenge: {
        prompt: 'Khi nào bóng đèn trong mạch điện sáng?',
        type: 'CHOICE',
        options: [
          'Khi mạch điện là mạch kín (công tắc đóng) và có nguồn điện',
          'Khi công tắc mở nhưng nguồn lớn',
          'Luôn sáng ngay khi có pin dù mạch hở',
          'Chỉ sáng khi có hai công tắc mở đồng thời'
        ],
        correctIndex: 0,
        explanation: 'Mạch kín mới cho dòng điện chạy qua bóng đèn, làm đèn sáng.'
      }
    },
    {
      stageId: 'STG_VL22_2',
      stageNumber: 2,
      title: 'Đọc bảng kí hiệu mạch',
      storyPrompt: 'Đối chiếu bảng kí hiệu để nhận diện các linh kiện trong sơ đồ mạch.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL22_SO_DO',
      hint: 'Mỗi linh kiện có một kí hiệu qui ước riêng trong sơ đồ.',
      completed: false,
      learningObjective: 'Đọc và vẽ đúng kí hiệu các bộ phận mạch điện',
      knowledgeId: 'K_VAT_B22',
      interactiveChallenge: {
        prompt: 'Dụng cụ nào trong sơ đồ mạch dùng để đo cường độ dòng điện, được mắc nối tiếp vào mạch?',
        type: 'CHOICE',
        options: [
          'Ampe kế',
          'Vôn kế',
          'Chuông điện',
          'Cầu chì'
        ],
        correctIndex: 0,
        explanation: 'Ampe kế đo cường độ dòng điện và mắc nối tiếp trong mạch.'
      }
    },
    {
      stageId: 'STG_VL22_3',
      stageNumber: 3,
      title: 'Chiều dòng điện',
      storyPrompt: 'Kiểm tra chiều dòng điện trong mạch khi đóng công tắc.',
      requiredActionType: 'repair',
      targetObjectId: 'O_VL22_MACH_DEN',
      hint: 'Chiều dòng điện quy ước từ cực + sang cực - bên ngoài nguồn.',
      completed: false,
      learningObjective: 'Xác định chiều dòng điện trong mạch kín',
      knowledgeId: 'K_VAT_B22',
      interactiveChallenge: {
        prompt: 'Theo quy ước, chiều dòng điện trong mạch ngoài được chảy như thế nào?',
        type: 'CHOICE',
        options: [
          'Từ cực dương (+) qua dây dẫn tới cực âm (-) của nguồn',
          'Từ cực âm (-) qua dây dẫn tới cực dương (+)',
          'Chỉ đi trong lòng nguồn điện, không chạy ở mạch ngoài',
          'Ngẫu nhiên, đổi chiều liên tục khi mạch kín'
        ],
        correctIndex: 0,
        explanation: 'Quy ước chiều dòng điện là chiều từ cực dương (+) qua mạch ngoài về cực âm (-).'
      }
    }
  ]
};

// =========================================================================
// BÀI 23 - TÁC DỤNG CỦA DÒNG ĐIỆN (Chương V)
// =========================================================================

export const SCENE_VAT_B23: GameScene = {
  sceneId: 'SC_VAT_B23',
  title: 'Xưởng Mạ Điện & Bóng Đèn',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B23 · Tác dụng của dòng điện',
  themeKey: 'electric',
  storyIntro:
    'Dòng điện có 4 tác dụng chính: tác dụng nhiệt (bóng đèn nóng sáng), phát sáng (đèn LED), hóa học (mạ đồng lên kim loại trong dung dịch CuSO4) và sinh lí (co cơ). Hãy hoàn thiện phân xưởng mạ đồng!',
  goal: 'Nhận biết các tác dụng nhiệt, phát sáng, hóa học và sinh lí của dòng điện.',
  knowledgeIds: ['K_VAT_B23'],
  currentQuestId: 'QUEST_VAT_B23',
  objects: [
    {
      objectId: 'O_VL23_BONG_DEN',
      type: 'machine',
      name: 'Đèn LED Và Đèn Sợi Đốt',
      description: 'Đèn sợi đốt nóng đỏ (tác dụng nhiệt); đèn LED phát sáng với dòng điện nhỏ (tác dụng phát sáng).',
      visualIcon: '💡',
      interactive: true,
      state: { inspected: false, measureText: 'Dòng điện gây tác dụng nhiệt và phát sáng' },
      actions: ['inspect', 'observe'],
      knowledgeIds: ['K_VAT_B23']
    },
    {
      objectId: 'O_VL23_BE_MA_DONG',
      type: 'experiment_equipment',
      name: 'Bể Mạ Đồng',
      description: 'Dung dịch CuSO4, hai điện cực nối với nguồn. Dòng điện làm đồng bám lên thanh kim loại (tác dụng hóa học).',
      visualIcon: '🏺',
      interactive: true,
      state: { inspected: false, measureText: 'Đồng từ CuSO4 bám lên cực âm' },
      actions: ['inspect', 'experiment', 'observe'],
      knowledgeIds: ['K_VAT_B23']
    }
  ],
  tools: toolsOf('T_AMMETER', 'T_VOLTMETER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_23',
      name: 'Chị Ngọc Mạ',
      role: 'Kỹ thuật viên xưởng mạ',
      avatar: '👩‍🔧',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B23'],
      dialogues: {
        welcome: {
          speech: 'Chào em! Dòng điện qua bóng đèn làm dây tóc nóng tới trắng — đó là tác dụng nhiệt. Dòng điện qua dung dịch CuSO4 tách đồng bám vào cực — tác dụng hóa học. Đa dạng lắm!',
          options: [{ text: 'Em sẽ quan sát các tác dụng rồi hoàn thiện bể mạ đồng!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Đồng bám vào điện cực nối với cực âm của nguồn.',
          options: [{ text: 'Rõ!', nextState: 'experimenting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B23: GameQuestV4 = {
  questId: 'QUEST_VAT_B23',
  title: 'Bốn Tác Dụng Của Dòng Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Nhận biết tác dụng nhiệt, phát sáng, hóa học, sinh lí và vận dụng vào mạ điện.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B23',
  stages: [
    {
      stageId: 'STG_VL23_1',
      stageNumber: 1,
      title: 'Tác dụng nhiệt của dòng điện',
      storyPrompt: 'Quan sát bóng đèn sợi đốt: dây tóc nóng sáng trắng khi có dòng điện.',
      requiredActionType: 'observe',
      targetObjectId: 'O_VL23_BONG_DEN',
      hint: 'Khi bóng đèn sáng, dây tóc nóng lên rất mạnh.',
      completed: false,
      learningObjective: 'Nhận biết tác dụng nhiệt của dòng điện',
      knowledgeId: 'K_VAT_B23',
      interactiveChallenge: {
        prompt: 'Khi có dòng điện chạy qua, dây tóc bóng đèn nóng tới nhiệt độ cao và phát sáng. Đó là tác dụng gì của dòng điện?',
        type: 'CHOICE',
        options: [
          'Tác dụng nhiệt',
          'Tác dụng từ',
          'Tác dụng hóa học',
          'Tác dụng sinh lí'
        ],
        correctIndex: 0,
        explanation: 'Dòng điện làm dây dẫn nóng lên: khi đủ nóng, dây tóc phát sáng — tác dụng nhiệt.'
      }
    },
    {
      stageId: 'STG_VL23_2',
      stageNumber: 2,
      title: 'Tác dụng hóa học - mạ điện',
      storyPrompt: 'Vận hành bể mạ đồng với dung dịch CuSO4 để phủ đồng lên kim loại.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_VL23_BE_MA_DONG',
      requiredToolId: 'T_AMMETER',
      hint: 'Đồng nguyên chất tách từ CuSO4 bám vào cực nối với cực âm.',
      completed: false,
      learningObjective: 'Nhận biết tác dụng hóa học của dòng điện và ứng dụng mạ điện',
      knowledgeId: 'K_VAT_B23',
      interactiveChallenge: {
        prompt: 'Nhúng hai thanh kim loại vào dung dịch CuSO4 rồi cho dòng điện chạy qua. Hiện tượng gì xảy ra?',
        type: 'CHOICE',
        options: [
          'Đồng tách ra khỏi dung dịch, bám vào điện cực nối với cực âm',
          'Dung dịch hóa rắn toàn bộ thành khối đồng',
          'Không có gì xảy ra với dụng dịch',
          'Nước sôi lên trong bể'
        ],
        correctIndex: 0,
        explanation: 'Dòng điện gây tác dụng hóa học: làm dung dịch CuSO4 phân li, đồng bám vào điện cực — ứng dụng mạ điện.'
      }
    },
    {
      stageId: 'STG_VL23_3',
      stageNumber: 3,
      title: 'Vận dụng an toàn điện',
      storyPrompt: 'Đánh giá nguy cơ khi dòng điện qua cơ thể: tác dụng sinh lí.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL23_BONG_DEN',
      hint: 'Dòng điện qua cơ thể gây co cơ, nguy hiểm — cần cách li và an toàn điện.',
      completed: false,
      learningObjective: 'Nhận biết tác dụng sinh lí và biện pháp an toàn điện',
      knowledgeId: 'K_VAT_B23',
      interactiveChallenge: {
        prompt: 'Khi dòng điện đi qua cơ thể người gây co cơ, tê liệt dây thần kinh. Đó là tác dụng nào và cần lưu ý gì?',
        type: 'CHOICE',
        options: [
          'Tác dụng sinh lí — phải tuân thủ an toàn điện, không chạm vào nguồn hở',
          'Tác dụng nhiệt — chỉ gây ấm nhẹ',
          'Tác dụng hóa học — không gây nguy hiểm',
          'Tác dụng phát sáng — cơ thể phát sáng là bình thường'
        ],
        correctIndex: 0,
        explanation: 'Dòng điện có tác dụng sinh lí lên cơ thể; càng lớn càng nguy hiểm, nên cần các biện pháp an toàn điện.'
      }
    }
  ]
};

// =========================================================================
// BÀI 24 - CƯỜNG ĐỘ DÒNG ĐIỆN VÀ HIỆU ĐIỆN THẾ (Chương V)
// =========================================================================

export const SCENE_VAT_B24: GameScene = {
  sceneId: 'SC_VAT_B24',
  title: 'Bàn Đo Điện Yang Hồ',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B24 · CĐDĐ & HĐT',
  themeKey: 'electric',
  storyIntro:
    'Cường độ dòng điện (I) đặc trưng cho độ mạnh yếu của dòng điện, đơn vị ampe (A): 1 A = 1000 mA. Hiệu điện thế (U) đặc trưng cho khả năng tạo dòng điện của nguồn, đơn vị vôn (V): 1 kV = 1000 V, 1 V = 1000 mV.',
  goal: 'Chuyển đổi đơn vị A-mA, V-mV, kV và biết cách mắc ampe kế, vôn kế.',
  knowledgeIds: ['K_VAT_B24'],
  currentQuestId: 'QUEST_VAT_B24',
  objects: [
    {
      objectId: 'O_VL24_AMPE',
      type: 'measurement_tool',
      name: 'Ampe Kế Mắc Nối Tiếp',
      description: 'Được mắc nối tiếp vào mạch. Phân vạch GHĐ 0,5 A, ĐCNN 0,01 A.',
      visualIcon: '🔌',
      interactive: true,
      state: { inspected: false, measureText: 'Ampe kế mắc nối tiếp với bóng đèn' },
      actions: ['inspect', 'measure', 'decide'],
      knowledgeIds: ['K_VAT_B24']
    },
    {
      objectId: 'O_VL24_VONKE',
      type: 'measurement_tool',
      name: 'Vôn Kế Mắc Song Song',
      description: 'Được mắc song song với hai đầu bóng đèn. GHĐ 6 V, ĐCNN 0,1 V.',
      visualIcon: '🔋',
      interactive: true,
      state: { inspected: false, measureText: 'Vôn kế mắc song song để đo HĐT hai đầu đèn' },
      actions: ['inspect', 'measure', 'decide'],
      knowledgeIds: ['K_VAT_B24']
    },
    {
      objectId: 'O_VL24_2_PIN',
      type: 'machine',
      name: 'Đôi Pin 1,5 V Mắc Nối Tiếp',
      description: 'Hai pin 1,5 V mắc nối tiếp nhau cung cấp hiệu điện thế cộng dồn.',
      visualIcon: '🔋',
      interactive: true,
      state: { inspected: false, voltage: 3, measureText: '2 pin × 1,5 V nối tiếp = 3 V' },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_B24']
    }
  ],
  tools: toolsOf('T_AMMETER', 'T_VOLTMETER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_24',
      name: 'Cô Phượng Đo',
      role: 'Giáo viên đo lường điện',
      avatar: '👩‍🏫',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B24'],
      dialogues: {
        welcome: {
          speech: 'Em hãy nhớ: trong mạch nối tiếp, các nguồn cộng hiệu điện thế: hai pin 1,5 V cho tổng 3 V. Ampe kế mắc nối tiếp, vôn kế mắc song song!',
          options: [{ text: 'Em sẽ đổi đơn vị và lắp mạch đo đúng cách!', nextState: 'guide' }]
        },
        guide: {
          speech: '1 A = 1000 mA; 1 kV = 1000 V; 1 V = 1000 mV.',
          options: [{ text: 'Rõ!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B24: GameQuestV4 = {
  questId: 'QUEST_VAT_B24',
  title: 'Ampe, Vôn Và Cách Mắc',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Chuyển đổi đơn vị CĐDĐ - HĐT, cách mắc ampe kế - vôn kế và tính HĐT của bộ nguồn.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B24',
  stages: [
    {
      stageId: 'STG_VL24_1',
      stageNumber: 1,
      title: 'Đổi đơn vị cường độ dòng điện',
      storyPrompt: 'Đọc số liệu ampe kế hiển thị rồi quy đổi sang đơn vị thích hợp.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL24_AMPE',
      requiredToolId: 'T_AMMETER',
      hint: '1 A = 1000 mA. Nhân giá trị (A) với 1000 để ra mA.',
      completed: false,
      learningObjective: 'Chuyển đổi giữa ampe và miliampe',
      knowledgeId: 'K_VAT_B24',
      interactiveChallenge: {
        prompt: 'Ampe kế chỉ 0,75 A. Giá trị đó bằng bao nhiêu mA?',
        type: 'NUMERIC_CALC',
        correctValue: 750,
        tolerance: 5,
        unit: 'mA',
        explanation: '0,75 A = 0,75 × 1000 = 750 mA.'
      }
    },
    {
      stageId: 'STG_VL24_2',
      stageNumber: 2,
      title: 'Cách mắc dụng cụ đo',
      storyPrompt: 'Lắp lại mạch để đo CĐDĐ qua đèn bằng ampe kế.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL24_AMPE',
      hint: 'Ampe kế phải mắc nối tiếp với bóng đèn trong mạch.',
      completed: false,
      learningObjective: 'Biết cách mắc ampe kế và vôn kế trong mạch điện',
      knowledgeId: 'K_VAT_B24',
      interactiveChallenge: {
        prompt: 'Muốn đo cường độ dòng điện chạy qua bóng đèn, ampe kế phải được mắc như thế nào?',
        type: 'CHOICE',
        options: [
          'Mắc nối tiếp với bóng đèn',
          'Mắc song song với bóng đèn',
          'Mắc trực tiếp vào hai đầu nguồn cùng lúc',
          'Đặt ampe kế cách xa mạch, không nối dây'
        ],
        correctIndex: 0,
        explanation: 'Cường độ dòng điện là đại lượng "chảy qua", nên ampe kế mắc nối tiếp trong mạch.'
      }
    },
    {
      stageId: 'STG_VL24_3',
      stageNumber: 3,
      title: 'Hiệu điện thế của bộ nguồn',
      storyPrompt: 'Tính tổng hiệu điện thế khi mắc hai pin 1,5 V nối tiếp.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL24_2_PIN',
      requiredToolId: 'T_CALC',
      hint: 'Mạch nối tiếp cộng HĐT: 1,5 + 1,5.',
      completed: false,
      learningObjective: 'Tính HĐT của bộ nguồn mắc nối tiếp',
      knowledgeId: 'K_VAT_B24',
      interactiveChallenge: {
        prompt: 'Hai pin 1,5 V mắc nối tiếp tạo ra hiệu điện thế tổng bằng bao nhiêu (V)?',
        type: 'NUMERIC_CALC',
        correctValue: 3,
        tolerance: 0.1,
        unit: 'V',
        explanation: 'Nối tiếp → cộng dồn: U = 1,5 + 1,5 = 3 V.'
      }
    }
  ]
};

// =========================================================================
// BÀI 25 - THỰC HÀNH ĐO CĐDĐ VÀ HĐT (Chương V)
// =========================================================================

export const SCENE_VAT_B25: GameScene = {
  sceneId: 'SC_VAT_B25',
  title: 'Phòng Thực Hành Đo Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  lessonBadge: 'B25 · Thực hành đo điện',
  themeKey: 'electric',
  storyIntro:
    'Phòng thực hành đo CĐDĐ và HĐT với ampe kế GHĐ 0,5 A (ĐCNN 0,01 A) và vôn kế GHĐ 6 V (ĐCNN 0,1 V). Nguồn dùng pin 1,5 V / 3 V / 6 V. Hãy đọc đúng số chỉ dụng cụ!',
  goal: 'Chọn GHĐ/ĐCNN phù hợp, đọc số chỉ ampe kế - vôn kế và lắp mạch đo chuẩn.',
  knowledgeIds: ['K_VAT_B25'],
  currentQuestId: 'QUEST_VAT_B25',
  objects: [
    {
      objectId: 'O_VL25_MACH_6V',
      type: 'experiment_equipment',
      name: 'Mạch Nguồn 6 V',
      description: '4 pin 1,5 V mắc nối tiếp tạo 6 V, cấp cho mạch bóng đèn.',
      visualIcon: '🔋',
      interactive: true,
      state: { inspected: false, measureText: 'Nguồn 6 V' },
      actions: ['inspect', 'measure'],
      knowledgeIds: ['K_VAT_B25']
    },
    {
      objectId: 'O_VL25_DONG_HO',
      type: 'measurement_tool',
      name: 'Vôn Kế GHĐ 6 V - ĐCNN 0,1 V',
      description: 'Kim chỉ vạch số 35 (mỗi vạch bằng 0,1 V) trên thang 6 V.',
      visualIcon: '📟',
      interactive: true,
      state: { inspected: false, measureText: 'Kim vôn kế chỉ 3,5 V' },
      actions: ['inspect', 'measure', 'record'],
      knowledgeIds: ['K_VAT_B25']
    }
  ],
  tools: toolsOf('T_AMMETER', 'T_VOLTMETER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_25',
      name: 'Thầy Khánh Ampe',
      role: 'Giáo viên thực hành điện',
      avatar: '👨‍🏫',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B25'],
      dialogues: {
        welcome: {
          speech: 'Khi đo, phải chọn GHĐ lớn hơn ước lượng, ĐCNN càng nhỏ thì càng chính xác. Đọc vôn kế 6 V chia 0,1 V: nếu kim rơi vào giữa vạch 3,5 thì đọc 3,5 V.',
          options: [{ text: 'Em sẽ lắp mạch và đọc các dụng cụ đúng cách!', nextState: 'guide' }]
        },
        guide: {
          speech: 'GHĐ là giá trị lớn nhất của thang đo, ĐCNN là khoảng cách giữa hai vạch chia liền nhau.',
          options: [{ text: 'Rõ!', nextState: 'measuring' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B25: GameQuestV4 = {
  questId: 'QUEST_VAT_B25',
  title: 'Đọc Đúng Các Dụng Cụ Đo Điện',
  domain: 'VAT_LI',
  chapterTitle: 'Chương V: Điện',
  storyIntro: 'Chọn GHĐ/ĐCNN, đọc số chỉ vôn kế - ampe kế và vận dụng an toàn thực hành.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B25',
  stages: [
    {
      stageId: 'STG_VL25_1',
      stageNumber: 1,
      title: 'Chọn thang đo phù hợp',
      storyPrompt: 'Dự đoán dòng điện qua đèn nhỏ khoảng 0,4 A. Chọn ampe kế và thang đo thích hợp.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL25_MACH_6V',
      requiredToolId: 'T_AMMETER',
      hint: 'GHĐ phải lớn hơn giá trị cần đo để kim không vượt quá thang.',
      completed: false,
      learningObjective: 'Chọn ampe kế có GHĐ và ĐCNN phù hợp',
      knowledgeId: 'K_VAT_B25',
      interactiveChallenge: {
        prompt: 'Dự kiến dòng điện qua mạch khoảng 0,4 A. Nên chọn ampe kế nào an toàn và thích hợp nhất?',
        type: 'CHOICE',
        options: [
          'Ampe kế có GHĐ 0,5 A và ĐCNN 0,01 A',
          'Ampe kế có GHĐ 0,2 A (nhỏ hơn dòng cần đo)',
          'Ampe kế có GHĐ 100 A (quá lớn)',
          'Ampe kế GHĐ 0,001 A'
        ],
        correctIndex: 0,
        explanation: 'GHĐ 0,5 A vừa đủ lớn hơn 0,4 A, ĐCNN 0,01 A đủ chính xác cho thí nghiệm.'
      }
    },
    {
      stageId: 'STG_VL25_2',
      stageNumber: 2,
      title: 'Đọc số chỉ vôn kế',
      storyPrompt: 'Vôn kế GHĐ 6 V, ĐCNN 0,1 V. Đọc đúng giá trị mà kim đang chỉ.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL25_DONG_HO',
      requiredToolId: 'T_VOLTMETER',
      hint: 'Kim nằm giữa vạch 3 và vạch 4, chỉ đúng vạch 3,5 -> 3,5 V.',
      completed: false,
      learningObjective: 'Đọc đúng số chỉ của vôn kế theo GHĐ và ĐCNN',
      knowledgeId: 'K_VAT_B25',
      interactiveChallenge: {
        prompt: 'Vôn kế GHĐ 6 V, ĐCNN 0,1 V; kim chỉ vạch số 35 từ vạch 0. Số chỉ của vôn kế là bao nhiêu?',
        type: 'NUMERIC_CALC',
        correctValue: 3.5,
        tolerance: 0.1,
        unit: 'V',
        explanation: 'Mỗi vạch 0,1 V × 35 = 3,5 V.'
      }
    },
    {
      stageId: 'STG_VL25_3',
      stageNumber: 3,
      title: 'Đo HĐT hai đầu bóng đèn',
      storyPrompt: 'Lắp mạch để đo hiệu điện thế hai đầu bóng đèn trong mạch 6 V.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL25_DONG_HO',
      hint: 'HĐT hai đầu một bộ phận đo bằng vôn kế mắc song song.',
      completed: false,
      learningObjective: 'Cách lắp vôn kế đo HĐT và hiểu ý nghĩa GHĐ - ĐCNN',
      knowledgeId: 'K_VAT_B25',
      interactiveChallenge: {
        prompt: 'Để đo hiệu điện thế giữa hai đầu bóng đèn, em cần làm gì?',
        type: 'CHOICE',
        options: [
          'Mắc vôn kế song song với hai đầu bóng đèn',
          'Mắc vôn kế nối tiếp với bóng đèn',
          'Ngắt vôn kế ra khỏi mạch rồi nhìn chỉ số',
          'Mắc vôn kế nối tiếp vào cực âm của nguồn'
        ],
        correctIndex: 0,
        explanation: 'Vôn kế đo HĐT giữa hai điểm nên mắc song song với đoạn mạch cần đo.'
      }
    }
  ]
};

// =========================================================================
// BÀI 26 - NĂNG LƯỢNG NHIỆT VÀ NỘI NĂNG (Chương VI)
// =========================================================================

export const SCENE_VAT_B26: GameScene = {
  sceneId: 'SC_VAT_B26',
  title: 'Bếp Thí Nghiệm Nhiệt',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  lessonBadge: 'B26 · Nội năng & nhiệt lượng',
  themeKey: 'thermo',
  storyIntro:
    'Nội năng của vật là tổng động năng và thế năng của các phân tử cấu tạo nên vật. Nhiệt độ tăng thì nội năng tăng. Đun nóng 1,5 kg nước thêm 20 °C với nhiệt dung riêng 4200 J/kg.K — hãy tính nhiệt lượng cần cung cấp!',
  goal: 'Hiểu nội năng, sự thay đổi nội năng và tính nhiệt lượng Q = m.c.Δt.',
  knowledgeIds: ['K_VAT_B26'],
  currentQuestId: 'QUEST_VAT_B26',
  objects: [
    {
      objectId: 'O_VL26_NOI_NUOC',
      type: 'experiment_equipment',
      name: 'Ấm Đun Thí Nghiệm',
      description: 'Chứa m = 1,5 kg nước. Nhiệt kế theo dõi độ tăng nhiệt độ Δt = 20 °C.',
      visualIcon: '🫖',
      interactive: true,
      state: { inspected: false, mass: 1.5, deltaT: 20, measureText: 'm = 1,5 kg · Δt = 20 °C' },
      actions: ['inspect', 'measure', 'experiment'],
      knowledgeIds: ['K_VAT_B26']
    },
    {
      objectId: 'O_VL26_THI_NGHIEM_PHAN_TU',
      type: 'experiment_equipment',
      name: 'Mô Hình Chuyển Động Phân Tử',
      description: 'Bình mực nước: nhiệt độ càng cao, các phân tử chuyển động càng nhanh, nội năng càng lớn.',
      visualIcon: '🌀',
      interactive: true,
      state: { inspected: false, measureText: 'Nhiệt độ tăng → phân tử chuyển động nhanh hơn' },
      actions: ['inspect', 'observe'],
      knowledgeIds: ['K_VAT_B26']
    }
  ],
  tools: toolsOf('T_THERMO', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_26',
      name: 'Cô Hạnh Nhiệt',
      role: 'Giáo viên nhiệt học',
      avatar: '👩‍🔬',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B26'],
      dialogues: {
        welcome: {
          speech: 'Nội năng gắn với nhiệt độ: tạt nóng, phân tử chuyển động nhanh, nội năng tăng. Nhiệt lượng Q = m.c.Δt cho biết năng lượng cần truyền.',
          options: [{ text: 'Em sẽ theo dõi thí nghiệm rồi tính Q!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Nước: c = 4200 J/kg.K. Đổi Δt = 20 °C.',
          options: [{ text: 'Rõ!', nextState: 'calculating' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B26: GameQuestV4 = {
  questId: 'QUEST_VAT_B26',
  title: 'Nội Năng Và Nhiệt Lượng',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  storyIntro: 'Hiểu nội năng, nguyên nhân thay đổi nội năng và tính Q = m.c.Δt.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B26',
  stages: [
    {
      stageId: 'STG_VL26_1',
      stageNumber: 1,
      title: 'Khái niệm nội năng',
      storyPrompt: 'Quan sát mô hình chuyển động phân tử và ấm đun thí nghiệm.',
      requiredActionType: 'observe',
      targetObjectId: 'O_VL26_THI_NGHIEM_PHAN_TU',
      hint: 'Nội năng gồm động năng và thế năng của các phân tử.',
      completed: false,
      learningObjective: 'Hiểu khái niệm nội năng và sự phụ thuộc vào nhiệt độ',
      knowledgeId: 'K_VAT_B26',
      interactiveChallenge: {
        prompt: 'Nội năng của một vật là gì?',
        type: 'CHOICE',
        options: [
          'Tổng động năng và thế năng của các phân tử cấu tạo nên vật',
          'Chỉ có thế năng hấp dẫn của vật',
          'Động năng chuyển động của cả vật',
          'Công sinh ra khi vật chuyển động'
        ],
        correctIndex: 0,
        explanation: 'Nội năng = tổng động năng + thế năng của các phân tử; tăng khi nhiệt độ tăng.'
      }
    },
    {
      stageId: 'STG_VL26_2',
      stageNumber: 2,
      title: 'Nhiệt độ và nội năng',
      storyPrompt: 'Đun nóng nước, quan sát nhiệt kế tăng dần 20 °C.',
      requiredActionType: 'measure',
      targetObjectId: 'O_VL26_NOI_NUOC',
      requiredToolId: 'T_THERMO',
      hint: 'Nhiệt độ tăng → phân tử chuyển động nhanh hơn → nội năng tăng.',
      completed: false,
      learningObjective: 'Liên hệ nhiệt độ với sự thay đổi nội năng',
      knowledgeId: 'K_VAT_B26',
      interactiveChallenge: {
        prompt: 'Khi nhiệt độ của một vật tăng lên, nội năng của vật thay đổi như thế nào?',
        type: 'CHOICE',
        options: [
          'Nội năng tăng do các phân tử chuyển động nhanh hơn',
          'Nội năng giảm do phân tử đứng im',
          'Nội năng không đổi',
          'Nội năng phụ thuộc ngẫu nhiên, không xác định'
        ],
        correctIndex: 0,
        explanation: 'Nhiệt độ càng cao, phân tử chuyển động càng nhanh, động năng phân tử tăng → nội năng tăng.'
      }
    },
    {
      stageId: 'STG_VL26_3',
      stageNumber: 3,
      title: 'Tính nhiệt lượng cần đun',
      storyPrompt: 'Tính nhiệt lượng cần cung cấp để 1,5 kg nước tăng 20 °C (c = 4200 J/kg.K).',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL26_NOI_NUOC',
      requiredToolId: 'T_CALC',
      hint: 'Q = m.c.Δt = 1,5 × 4200 × 20.',
      completed: false,
      learningObjective: 'Vận dụng công thức Q = m.c.Δt',
      knowledgeId: 'K_VAT_B26',
      formulaId: 'F_LY_NHIET_LUONG',
      interactiveChallenge: {
        prompt: 'Tính nhiệt lượng Q cần cung cấp để đun 1,5 kg nước tăng thêm 20 °C (c nước = 4200 J/kg.K). Kết quả (J)?',
        type: 'NUMERIC_CALC',
        correctValue: 126000,
        tolerance: 2000,
        unit: 'J',
        explanation: 'Q = m.c.Δt = 1,5 × 4200 × 20 = 126.000 J.'
      }
    }
  ]
};

// =========================================================================
// BÀI 27 - THỰC HÀNH ĐO NĂNG LƯỢNG NHIỆT BẰNG JOULMETER (Chương VI)
// =========================================================================

export const SCENE_VAT_B27: GameScene = {
  sceneId: 'SC_VAT_B27',
  title: 'Phòng Thí Nghiệm Joulemeter',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  lessonBadge: 'B27 · Đo nhiệt bằng joulemeter',
  themeKey: 'thermo',
  storyIntro:
    'Dùng joulemeter đếm chính xác năng lượng (J) cấp cho nước trong nhiệt lượng kế. Số liệu thực từ giáo án: nước m = 86 g cần 692 J (Δ3°), 1570 J (Δ6°), 3620 J (Δ9°); nước m = 182 g cần 1750 J (Δ3°), 4850 J (Δ6°), 7960 J (Δ9°).',
  goal: 'Đọc bảng số liệu joulemeter, nhận quy luật Q tăng theo m và Δt.',
  knowledgeIds: ['K_VAT_B27'],
  currentQuestId: 'QUEST_VAT_B27',
  objects: [
    {
      objectId: 'O_VL27_JOULER',
      type: 'measurement_tool',
      name: 'Joulemeter',
      description: 'Hiển thị năng lượng cung cấp (J) cho nước trong nhiệt lượng kế trong từng mức đun.',
      visualIcon: '⚡',
      interactive: true,
      state: { inspected: false, measureText: 'J = 1750 J khi đun 182 g nước tăng 3 °C' },
      actions: ['inspect', 'measure', 'record'],
      knowledgeIds: ['K_VAT_B27']
    },
    {
      objectId: 'O_VL27_BANG_DATA',
      type: 'inspectable',
      name: 'Bảng Số Liệu Thí Nghiệm',
      description: 'm=86g: 692 / 1570 / 3620 J cho Δ3°/6°/9°. m=182g: 1750 / 4850 / 7960 J.',
      visualIcon: '📋',
      interactive: true,
      state: { inspected: false, measureText: 'Bảng data: Q(J) = [m; 3°; 6°; 9°] = [86g; 692; 1570; 3620] ; [182g; 1750; 4850; 7960]' },
      actions: ['inspect', 'observe', 'record'],
      knowledgeIds: ['K_VAT_B27']
    }
  ],
  tools: toolsOf('T_JOULER', 'T_THERMO', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_27',
      name: 'Phó giáo sư Nhiệt Sơn',
      role: 'Trưởng phòng thí nghiệm nhiệt lượng',
      avatar: '🧑‍🔬',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B27'],
      dialogues: {
        welcome: {
          speech: 'Chào nhà khoa học! Bảng số liệu của chúng tôi: cùng khối lượng, nước càng nóng thêm nhiều thì năng lượng càng lớn; nhiệt độ tăng gấp đôi thì năng lượng gần gấp đôi. Em hãy phân tích!',
          options: [{ text: 'Em sẽ đọc bảng và đối chiếu joulemeter!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Tra bảng: với m = 86 g, Δt = 6 °C cho 1570 J.',
          options: [{ text: 'Rõ!', nextState: 'recording' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B27: GameQuestV4 = {
  questId: 'QUEST_VAT_B27',
  title: 'Đọc Bảng Năng Lượng Nhiệt',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  storyIntro: 'Phân tích bảng số liệu joulemeter thực và rút ra quy luật Q tỉ lệ với m và Δt.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 100,
  unlockedNodeId: 'K_VAT_B27',
  stages: [
    {
      stageId: 'STG_VL27_1',
      stageNumber: 1,
      title: 'Quan sát thiết bị thí nghiệm',
      storyPrompt: 'Quan sát joulemeter và nhiệt lượng kế. Đọc ý nghĩa số chỉ J.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL27_JOULER',
      hint: 'Số chỉ joulemeter chính là năng lượng điện chuyển thành nhiệt cấp cho nước.',
      completed: false,
      learningObjective: 'Hiểu vai trò joulemeter trong việc đo năng lượng nhiệt',
      knowledgeId: 'K_VAT_B27',
      interactiveChallenge: {
        prompt: 'Trong thí nghiệm, joulemeter dùng để làm gì?',
        type: 'CHOICE',
        options: [
          'Đo năng lượng (J) cung cấp cho nước trong nhiệt lượng kế',
          'Đo khối lượng nước',
          'Đo thể tích bình thủy tinh',
          'Đo áp suất không khí trong phòng'
        ],
        correctIndex: 0,
        explanation: 'Joulemeter đếm chính xác năng lượng truyền vào nước trong quá trình đun.'
      }
    },
    {
      stageId: 'STG_VL27_2',
      stageNumber: 2,
      title: 'Đọc số liệu từ bảng',
      storyPrompt: 'Tra bảng số liệu: với m = 86 g và Δt = 6 °C, joulemeter chỉ bao nhiêu Jun?',
      requiredActionType: 'record',
      targetObjectId: 'O_VL27_BANG_DATA',
      requiredToolId: 'T_JOULER',
      hint: 'Cột ứng với Δt = 6 °C, hàng m = 86 g.',
      completed: false,
      learningObjective: 'Đọc và khai thác bảng số liệu thực nghiệm',
      knowledgeId: 'K_VAT_B27',
      interactiveChallenge: {
        prompt: 'Theo bảng số liệu, đun 86 g nước nóng thêm 6 °C cần năng lượng bao nhiêu (J)?',
        type: 'NUMERIC_CALC',
        correctValue: 1570,
        tolerance: 30,
        unit: 'J',
        explanation: 'Bảng ghi [86 g; Δ6°] = 1570 J.'
      }
    },
    {
      stageId: 'STG_VL27_3',
      stageNumber: 3,
      title: 'Rút ra quy luật',
      storyPrompt: 'So sánh cột Δt = 9 °C của hai khối lượng nước để rút ra kết luận.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL27_BANG_DATA',
      requiredToolId: 'T_JOULER',
      hint: 'Cùng m, Δt lớn hơn thì Q lớn hơn. So sánh Q khi Δt từ 3°→ 9°.',
      completed: false,
      learningObjective: 'Rút ra quy luật tỉ lệ thuận giữa Q với m và Δt',
      knowledgeId: 'K_VAT_B27',
      interactiveChallenge: {
        prompt: 'Với cùng khối lượng nước, khi Δt tăng gấp 3 lần (từ 3 °C lên 9 °C), năng lượng Q thay đổi thế nào theo bảng?',
        type: 'CHOICE',
        options: [
          'Gần như tăng gấp 3 (ví dụ 692 J → 3620 J xấp xỉ 3 lần)',
          'Không đổi',
          'Giảm 3 lần',
          'Chỉ tăng rất nhỏ'
        ],
        correctIndex: 0,
        explanation: 'Q tỉ lệ thuận với Δt: 3620/692 ≈ 5,2 — hơi lớn hơn 3 do tổn hao nhiệt ra môi trường, nhưng xu hướng Q tăng khi Δt tăng là rõ ràng.'
      }
    }
  ]
};

// =========================================================================
// BÀI 28 - SỰ TRUYỀN NHIỆT (Chương VI)
// =========================================================================

export const SCENE_VAT_B28: GameScene = {
  sceneId: 'SC_VAT_B28',
  title: 'Phích Nước & Nhà Kính',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  lessonBadge: 'B28 · Sự truyền nhiệt',
  themeKey: 'thermo',
  storyIntro:
    'Nhiệt truyền theo ba cách: dẫn nhiệt (qua chất rắn), đối lưu (chất lỏng và khí), bức xạ nhiệt (qua chân không, từ Mặt Trời). Chiếc phích nước giữ nóng bằng cách chặn cả ba hình thức truyền nhiệt.',
  goal: 'Phân biệt dẫn nhiệt - đối lưu - bức xạ nhiệt và giải thích cấu tạo phích, hiệu ứng nhà kính.',
  knowledgeIds: ['K_VAT_B28'],
  currentQuestId: 'QUEST_VAT_B28',
  objects: [
    {
      objectId: 'O_VL28_PHICH',
      type: 'machine',
      name: 'Phích Nước Cấu Tạo Riêng',
      description: 'Nút bịt miệng chặn đối lưu, lớp chân không giữa hai thành chặn dẫn nhiệt, lớp tráng bạc phản xạ bức xạ.',
      visualIcon: '🫙',
      interactive: true,
      state: { inspected: false, measureText: 'Phích chặn cả 3 hình thức truyền nhiệt' },
      actions: ['inspect', 'decide', 'repair'],
      knowledgeIds: ['K_VAT_B28']
    },
    {
      objectId: 'O_VL28_DEN_DAU',
      type: 'environment',
      name: 'Đèn Dầu Trong Phòng',
      description: 'Ngồi gần đèn dầu thấy ấm: nhiệt truyền qua không gian (không cần môi trường dẫn) — bức xạ nhiệt.',
      visualIcon: '🕯️',
      interactive: true,
      state: { inspected: false, measureText: 'Nhiệt từ ngọn lửa truyền ra xung quanh qua bức xạ' },
      actions: ['inspect', 'observe'],
      knowledgeIds: ['K_VAT_B28']
    }
  ],
  tools: toolsOf('T_THERMO', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_28',
      name: 'Cô Mai Phích',
      role: 'Chuyên gia vật lí nhiệt',
      avatar: '👩‍🔬',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B28'],
      dialogues: {
        welcome: {
          speech: 'Dẫn nhiệt xảy ra tốt ở chất rắn, đối lưu cần chất lỏng/khí chuyển động, còn bức xạ nhiệt (như ánh nắng Mặt Trời) không cần môi trường vật chất.',
          options: [{ text: 'Em sẽ phân tích phích nước và các hiện tượng thực tế!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Từng bộ phận phích ứng với một hình thức truyền nhiệt bị chặn.',
          options: [{ text: 'Rõ!', nextState: 'inspecting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B28: GameQuestV4 = {
  questId: 'QUEST_VAT_B28',
  title: 'Ba Hình Thức Truyền Nhiệt',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  storyIntro: 'Phân biệt dẫn nhiệt, đối lưu, bức xạ và giải thích nguyên lí giữ nhiệt của phích nước.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 90,
  unlockedNodeId: 'K_VAT_B28',
  stages: [
    {
      stageId: 'STG_VL28_1',
      stageNumber: 1,
      title: 'Ba hình thức truyền nhiệt',
      storyPrompt: 'Quan sát đèn dầu và phích nước để nhận diện các hình thức truyền nhiệt.',
      requiredActionType: 'observe',
      targetObjectId: 'O_VL28_DEN_DAU',
      hint: 'Chất rắn dẫn nhiệt tốt; lỏng - khí đối lưu; chân không thì bức xạ.',
      completed: false,
      learningObjective: 'Nhận biết ba hình thức truyền nhiệt',
      knowledgeId: 'K_VAT_B28',
      interactiveChallenge: {
        prompt: 'Ngồi gần bếp lửa, ta cảm thấy ấm; nhiệt từ ngọn lửa tới người chủ yếu bằng hình thức nào?',
        type: 'CHOICE',
        options: [
          'Bức xạ nhiệt (truyền qua không gian, không cần môi trường dẫn)',
          'Chỉ bằng dẫn nhiệt qua không khí',
          'Đối lưu trong chân không',
          'Không có hình thức nào truyền nhiệt'
        ],
        correctIndex: 0,
        explanation: 'Nhiệt từ ngọn lửa chủ yếu truyền bằng bức xạ nhiệt theo mọi hướng.'
      }
    },
    {
      stageId: 'STG_VL28_2',
      stageNumber: 2,
      title: 'Phân tích phích nước',
      storyPrompt: 'Kiểm tra từng bộ phận của phích để giải thích chúng chặn hình thức truyền nhiệt nào.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL28_PHICH',
      hint: 'Lớp chân không chống dẫn nhiệt; lớp bạc phản xạ bức xạ; nút chặn đối lưu.',
      completed: false,
      learningObjective: 'Vận dụng kiến thức truyền nhiệt giải thích cấu tạo phích nước',
      knowledgeId: 'K_VAT_B28',
      interactiveChallenge: {
        prompt: 'Vì sao phích nước dùng lớp chân không giữa hai thành bình?',
        type: 'CHOICE',
        options: [
          'Chân không không dẫn nhiệt — chặn sự dẫn nhiệt qua thành bình',
          'Chân không giúp nước nhanh sôi hơn',
          'Chân không tạo áp suất lớn giữ nước',
          'Chân không phản xạ ánh sáng chiếu vào'
        ],
        correctIndex: 0,
        explanation: 'Không có phân tử nào truyền nhiệt trong chân không → chặn dẫn nhiệt và đối lưu.'
      }
    },
    {
      stageId: 'STG_VL28_3',
      stageNumber: 3,
      title: 'Hiệu ứng nhà kính',
      storyPrompt: 'Giải thích vì sao nhiệt độ trong nhà kính tăng khi ánh nắng chiếu qua kính.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VL28_DEN_DAU',
      hint: 'Kính cho bức xạ Mặt Trời vào nhưng cản nhiệt thoát ra.',
      completed: false,
      learningObjective: 'Vận dụng bức xạ nhiệt giải thích hiệu ứng nhà kính',
      knowledgeId: 'K_VAT_B28',
      interactiveChallenge: {
        prompt: 'Vì sao nhiệt độ bên trong nhà kính (hoặc xe ô tô đóng kín dưới nắng) cao hơn ngoài trời?',
        type: 'CHOICE',
        options: [
          'Kính cho bức xạ Mặt Trời vào, nhưng cản phần lớn nhiệt bức xạ thoát ra ngoài',
          'Kính tự sinh ra nhiệt năng',
          'Không khí trong kính không truyền nhiệt cho vách kính',
          'Kính ngăn hoàn toàn mọi bức xạ mặt trời'
        ],
        correctIndex: 0,
        explanation: 'Hiệu ứng nhà kính: bức xạ vào dễ, nhiệt thoát ra khó → nhiệt độ bên trong tăng.'
      }
    }
  ]
};

// =========================================================================
// BÀI 29 - SỰ NỞ VÌ NHIỆT (Chương VI)
// =========================================================================

export const SCENE_VAT_B29: GameScene = {
  sceneId: 'SC_VAT_B29',
  title: 'Nhà Ga & Băng Kép',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  lessonBadge: 'B29 · Sự nở vì nhiệt',
  themeKey: 'thermo',
  storyIntro:
    'Các chất nở vì nhiệt khác nhau. Bảng giáo án (cm/m/100 °C): thép 1,1; sắt 1,2; đồng thau 1,9; nhôm 2,5. Nhôm nở nhiều nhất → các đầu ray đường sắt phải chừa khe hở để khỏi cong vênh ngày nóng.',
  goal: 'So sánh độ nở của các chất, tính chênh lệch giãn nở và giải thích khe hở ray, băng kép.',
  knowledgeIds: ['K_VAT_B29'],
  currentQuestId: 'QUEST_VAT_B29',
  objects: [
    {
      objectId: 'O_VL29_RAY_SAT',
      type: 'environment',
      name: 'Đường Ray & Khe Hở',
      description: 'Hai đầu ray để hở (khe co giãn). Nhôm dãn 2,5 cm/m/100 °C, sắt dãn 1,2 cm/m/100 °C.',
      visualIcon: '🛤️',
      interactive: true,
      state: { inspected: false, measureText: 'Khe hở ray cho phép ray nở ra khi nóng' },
      actions: ['inspect', 'measure', 'decide'],
      knowledgeIds: ['K_VAT_B29']
    },
    {
      objectId: 'O_VL29_BANG_KEP',
      type: 'experiment_equipment',
      name: 'Băng Kép',
      description: 'Thanh gồm thép và đồng thau hàn với nhau; khi đun nóng cong về phía kim loại nở ít hơn (thép).',
      visualIcon: '⚙️',
      interactive: true,
      state: { inspected: false, measureText: 'Đun nóng → băng kép cong về phía thép (nở ít hơn)' },
      actions: ['inspect', 'experiment', 'observe'],
      knowledgeIds: ['K_VAT_B29']
    }
  ],
  tools: toolsOf('T_THERMO', 'T_RULER', 'T_CALC', 'T_NB'),
  npcs: [
    {
      npcId: 'NPC_29',
      name: 'Ông Ga Mở Rộng',
      role: 'Kỹ sư cầu đường sắt',
      avatar: '👷',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_B29'],
      dialogues: {
        welcome: {
          speech: 'Mùa hè trời nóng 100 °C so với mùa đông, mỗi mét thanh ray nhôm dãn 2,5 cm, thanh sắt dãn 1,2 cm. Nhờ khe hở mà đường ray không bị cong lên!',
          options: [{ text: 'Em sẽ so sánh độ nở và kiểm tra băng kép!', nextState: 'guide' }]
        },
        guide: {
          speech: 'Bảng nở: nhôm 2,5 > đồng thau 1,9 > sắt 1,2 > thép 1,1 cm/m/100°C.',
          options: [{ text: 'Rõ!', nextState: 'inspecting' }]
        }
      }
    }
  ]
};

export const QUEST_VAT_B29: GameQuestV4 = {
  questId: 'QUEST_VAT_B29',
  title: 'Đường Ray Nở Trong Nắng',
  domain: 'VAT_LI',
  chapterTitle: 'Chương VI: Nhiệt',
  storyIntro: 'So sánh độ nở vì nhiệt của các chất rắn, tính chênh lệch giãn nở và giải thích băng kép.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 100,
  unlockedNodeId: 'K_VAT_B29',
  stages: [
    {
      stageId: 'STG_VL29_1',
      stageNumber: 1,
      title: 'So sánh độ nở của các chất',
      storyPrompt: 'Đọc bảng độ nở vì nhiệt gắn cạnh thanh ray để so sánh các kim loại.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_VL29_RAY_SAT',
      hint: 'Số càng lớn, chất càng nở nhiều khi nhiệt độ tăng.',
      completed: false,
      learningObjective: 'So sánh mức độ nở vì nhiệt của các chất rắn khác nhau',
      knowledgeId: 'K_VAT_B29',
      interactiveChallenge: {
        prompt: 'Theo bảng: nhôm 2,5; đồng thau 1,9; sắt 1,2; thép 1,1 (cm/m/100 °C). Chất nào dãn nở nhiều nhất?',
        type: 'CHOICE',
        options: [
          'Nhôm',
          'Đồng thau',
          'Sắt',
          'Thép'
        ],
        correctIndex: 0,
        explanation: 'Nhôm có hệ số dãn nở lớn nhất 2,5 cm/m/100 °C trong bảng.'
      }
    },
    {
      stageId: 'STG_VL29_2',
      stageNumber: 2,
      title: 'Tính chênh lệch giãn nở',
      storyPrompt: 'Một thanh nhôm và một thanh sắt cùng dài 1 m được nung nóng thêm 100 °C. Tính độ dài chênh lệch.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_VL29_RAY_SAT',
      requiredToolId: 'T_CALC',
      hint: 'Nhôm dãn 2,5 cm, sắt dãn 1,2 cm; lấy hiệu hai giá trị.',
      completed: false,
      learningObjective: 'Áp dụng bảng số liệu để tính chênh lệch giãn nở',
      knowledgeId: 'K_VAT_B29',
      interactiveChallenge: {
        prompt: 'Ở cùng 1 m chiều dài ban đầu và nóng thêm 100 °C, thanh nhôm dài hơn thanh sắt bao nhiêu cm?',
        type: 'NUMERIC_CALC',
        correctValue: 1.3,
        tolerance: 0.1,
        unit: 'cm',
        explanation: '2,5 - 1,2 = 1,3 cm/m/100 °C.'
      }
    },
    {
      stageId: 'STG_VL29_3',
      stageNumber: 3,
      title: 'Băng kép và khe hở ray',
      storyPrompt: 'Giải thích vì sao băng kép cong và vì sao ray để hở.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_VL29_BANG_KEP',
      requiredToolId: 'T_THERMO',
      hint: 'Kim loại nở ít hơn "giữ" thanh cong về phía nó.',
      completed: false,
      learningObjective: 'Vận dụng sự nở vì nhiệt khác nhau của hai kim loại',
      knowledgeId: 'K_VAT_B29',
      interactiveChallenge: {
        prompt: 'Vì sao khi đun nóng, băng kép (gồm thép nở ít và đồng thau nở nhiều) lại cong về phía thép?',
        type: 'CHOICE',
        options: [
          'Đồng thau nở nhiều hơn nên bị thép "níu" lại, khiến băng kép cong về phía thép',
          'Thép tự co lại khi nóng',
          'Cả hai kim loại nở như nhau nên thanh thẳng',
          'Băng kép luôn cong về phía kim loại nặng hơn'
        ],
        correctIndex: 0,
        explanation: 'Kim loại nở ít (thép) nằm phía trong của đường cong khi đồng thau nở nhiều hơn — nguyên lí băng kép.'
      }
    }
  ]
};

// =========================================================================
// ĐĂNG KÝ TẬP DỮ LIỆU VẬT LÍ
// =========================================================================

export const VAT_PHYSICS_SCENES: Record<string, GameScene> = {
  SC_VAT_B13: SCENE_VAT_B13,
  SC_VAT_B14: SCENE_VAT_B14,
  SC_VAT_B15: SCENE_VAT_B15,
  SC_VAT_B16: SCENE_VAT_B16,
  SC_VAT_B17: SCENE_VAT_B17,
  SC_VAT_B18: SCENE_VAT_B18,
  SC_VAT_B19: SCENE_VAT_B19,
  SC_VAT_B20: SCENE_VAT_B20,
  SC_VAT_B21: SCENE_VAT_B21,
  SC_VAT_B22: SCENE_VAT_B22,
  SC_VAT_B23: SCENE_VAT_B23,
  SC_VAT_B24: SCENE_VAT_B24,
  SC_VAT_B25: SCENE_VAT_B25,
  SC_VAT_B26: SCENE_VAT_B26,
  SC_VAT_B27: SCENE_VAT_B27,
  SC_VAT_B28: SCENE_VAT_B28,
  SC_VAT_B29: SCENE_VAT_B29
};

export const VAT_PHYSICS_QUESTS: Record<string, GameQuestV4> = {
  QUEST_VAT_B13: QUEST_VAT_B13,
  QUEST_VAT_B14: QUEST_VAT_B14,
  QUEST_VAT_B15: QUEST_VAT_B15,
  QUEST_VAT_B16: QUEST_VAT_B16,
  QUEST_VAT_B17: QUEST_VAT_B17,
  QUEST_VAT_B18: QUEST_VAT_B18,
  QUEST_VAT_B19: QUEST_VAT_B19,
  QUEST_VAT_B20: QUEST_VAT_B20,
  QUEST_VAT_B21: QUEST_VAT_B21,
  QUEST_VAT_B22: QUEST_VAT_B22,
  QUEST_VAT_B23: QUEST_VAT_B23,
  QUEST_VAT_B24: QUEST_VAT_B24,
  QUEST_VAT_B25: QUEST_VAT_B25,
  QUEST_VAT_B26: QUEST_VAT_B26,
  QUEST_VAT_B27: QUEST_VAT_B27,
  QUEST_VAT_B28: QUEST_VAT_B28,
  QUEST_VAT_B29: QUEST_VAT_B29
};