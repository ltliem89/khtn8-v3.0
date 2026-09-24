import {
  GameScene,
  GameQuestV4,
  InteractiveObject,
  ToolItem,
  NPCEntity,
  GameInventoryItem,
  NotebookEntry
} from '../types/blueprint';
import {
  VAT_PHYSICS_SCENES,
  VAT_PHYSICS_QUESTS
} from './gameV4PhysicsData';

/**
 * MASTER GAME SPEC v4.0 - GAMEPLAY-FIRST ENGINE DATA PACK
 * Clean separation: Content Pack <-> Game Pack connected via Knowledge IDs
 */

export const V4_INITIAL_TOOLS: ToolItem[] = [
  {
    toolId: 'T_SCALE',
    type: 'scale',
    name: 'Cân Điện Tử Phân Tích',
    icon: '⚖️',
    description: 'Đo khối lượng chính xác đến 0.01g, hỗ trợ tính số mol và khối lượng chất tan.',
    allowedActions: ['measure', 'record', 'calculate'],
    knowledgeIds: ['K_HOA_03', 'K_HOA_04'],
    active: true
  },
  {
    toolId: 'T_THERMO_BARO',
    type: 'pressure_gauge',
    name: 'Áp Kế & Nhiệt Kế Hiện Trường',
    icon: '🌡️',
    description: 'Đo nhiệt độ (°C) và áp suất khí (bar/atm), xác định điều kiện chuẩn của chất khí.',
    allowedActions: ['measure', 'inspect', 'observe'],
    knowledgeIds: ['K_HOA_03', 'K_VAT_02'],
    active: false
  },
  {
    toolId: 'T_TITRATOR',
    type: 'titration',
    name: 'Bộ Pha Chế & Giấy Chỉ Thị pH',
    icon: '🧪',
    description: 'Ống đong, cốc chia vạch và giấy pH thử môi trường acid/base.',
    allowedActions: ['experiment', 'combine', 'measure'],
    knowledgeIds: ['K_HOA_01', 'K_HOA_04'],
    active: false
  },
  {
    toolId: 'T_CALCULATOR',
    type: 'calculator',
    name: 'Máy Tính Khoa Học KHTN',
    icon: '🧮',
    description: 'Hỗ trợ tính toán tỉ khối d, nồng độ C%, CM, áp suất p = d.h.',
    allowedActions: ['calculate', 'record'],
    knowledgeIds: ['K_HOA_03', 'K_HOA_04', 'K_VAT_02'],
    active: false
  },
  {
    toolId: 'T_MICROSCOPE',
    type: 'microscope',
    name: 'Kính Hiển Vi Quang Học',
    icon: '🔬',
    description: 'Độ phóng đại 40x - 400x, quan sát tế bào máu, mô thực vật và vi khuẩn.',
    allowedActions: ['observe', 'inspect'],
    knowledgeIds: ['K_SINH_01', 'K_SINH_02'],
    active: false
  },
  {
    toolId: 'T_NOTEBOOK',
    type: 'notebook',
    name: 'Sổ Tay Hiện Trường KHTN 8',
    icon: '📖',
    description: 'Lưu giữ dữ kiện đo đạc, công thức đã mở khóa, giả thuyết và kết luận.',
    allowedActions: ['record', 'inspect'],
    knowledgeIds: ['K_HOA_01', 'K_HOA_03', 'K_HOA_04'],
    active: false
  }
];

export const V4_INITIAL_INVENTORY: GameInventoryItem[] = [
  {
    itemId: 'INV_GLOVES',
    type: 'tool',
    name: 'Găng Tay Cách Ly Hóa Chất',
    description: 'Trang bị an toàn bắt buộc khi tiếp xúc hóa chất ăn mòn hoặc mẫu vật lạ.',
    icon: '🧤'
  },
  {
    itemId: 'INV_FLASK_250',
    type: 'tool',
    name: 'Bình Định Mức 250ml',
    description: 'Dụng cụ pha chế dung dịch chuẩn xác theo vạch định mức.',
    icon: '⚗️'
  }
];

export const V4_INITIAL_NOTEBOOK: NotebookEntry[] = [
  {
    entryId: 'NB_001',
    timestamp: Date.now() - 3600000,
    type: 'observation',
    title: 'Ghi chú ban đầu: Điều kiện chuẩn chất khí (ĐKC)',
    content: 'Theo SGK mới (GDPT 2018): Ở 25 °C và 1 bar, 1 mol chất khí bất kì đều chiếm thể tích đúng bằng 24,79 lít.',
    knowledgeId: 'K_HOA_03'
  }
];

// =========================================================================
// SCENE 1 (HÓA HỌC - VERTICAL SLICE MASTER SCENE)
// =========================================================================

export const SCENE_CHEMISTRY_LAB: GameScene = {
  sceneId: 'SC_HOA_01',
  title: 'Phòng Thí Nghiệm Hóa Học 8 - Sự Cố Viện Nghiên Cứu',
  domain: 'HOA_HOC',
  chapterTitle: 'Chương I: Phản Ứng Hóa Học & Chất Khí',
  storyIntro:
    'Còi báo động vang lên! Tại khu vực tổng hợp mẫu, một van bình khí bị rò rỉ kèm nguy cơ làm đổ khay hóa chất. Bạn cùng GS. Minh An cần dùng dụng cụ đo đạc, xác định loại khí thoát ra để xử lý an toàn và pha chế dung dịch trung hòa khẩn cấp!',
  goal: 'Đo đạc dữ kiện khí, tính tỉ khối, quyết định hướng thoát khí và pha chế dung dịch NaOH 2% để trung hòa.',
  knowledgeIds: ['K_HOA_01', 'K_HOA_03', 'K_HOA_04'],
  currentQuestId: 'QUEST_V4_01',
  objects: [
    {
      objectId: 'O_GAS_CYLINDER',
      type: 'measurement_tool',
      name: 'Bình Khí Rò Rỉ (Ký hiệu Bình X)',
      description: 'Bình thép chứa khí không màu, van xả đang có dấu hiệu xì nhẹ. Nhãn mác ghi khối lượng khí thoát ra xấp xỉ 44 gam.',
      visualIcon: '🛢️',
      interactive: true,
      state: {
        inspected: false,
        massGas: 44, // 44g
        volumeGas: 24.79, // 24.79 lít ở đkc -> n = 1 mol -> M = 44 (CO2)
        measured: false
      },
      actions: ['inspect', 'measure', 'repair'],
      knowledgeIds: ['K_HOA_03']
    },
    {
      objectId: 'O_VENTILATION_SYSTEM',
      type: 'machine',
      name: 'Hệ Thống Quạt Thông Gió An Toàn',
      description: 'Bảng điều khiển khí độc: Có công tắc Quạt Hút Sàn Nhà (thích hợp khí nặng hơn không khí) và Quạt Hút Trần Nhà (thích hợp khí nhẹ).',
      visualIcon: '🌀',
      interactive: true,
      state: {
        activated: false,
        mode: null // 'FLOOR' | 'CEILING'
      },
      actions: ['inspect', 'decide'],
      knowledgeIds: ['K_HOA_03']
    },
    {
      objectId: 'O_SOLUTION_BENCH',
      type: 'experiment_equipment',
      name: 'Bàn Pha Chế Dung Dịch Trung Hòa',
      description: 'Chứa lọ tinh thể NaOH rắn, bình nước cất, cốc thủy tinh và cân điện tử. Cần pha dung dịch 2% để hấp thụ khí có tính acid.',
      visualIcon: '🧪',
      interactive: true,
      state: {
        prepared: false,
        soluteMass: 0,
        solutionMass: 0
      },
      actions: ['inspect', 'measure', 'experiment'],
      knowledgeIds: ['K_HOA_04']
    }
  ],
  tools: V4_INITIAL_TOOLS,
  npcs: [
    {
      npcId: 'NPC_PROF_AN',
      name: 'GS. Minh An',
      role: 'Trưởng Phòng Thí Nghiệm KHTN',
      avatar: '👨‍🔬',
      dialogueState: 'welcome',
      knowledgeIds: ['K_HOA_01', 'K_HOA_03', 'K_HOA_04'],
      dialogues: {
        welcome: {
          speech:
            'Chào nhà khoa học trẻ! Bình chứa khí X đang bị xì van. Chúng ta không được hoảng loạn! Đầu tiên, hãy dùng Áp kế và Cân điện tử để xác định chính xác thể tích và khối lượng khí thoát ra!',
          options: [
            {
              text: 'Dạ, em sẽ kiểm tra bình khí X ngay bằng dụng cụ đo!',
              nextState: 'stage1_guide'
            }
          ]
        },
        stage1_guide: {
          speech:
            'Gợi ý: Hãy mở Túi Dụng Cụ, chọn Áp kế hoặc Cân điện tử, sau đó chạm vào Bình Khí X để tiến hành đo đạc!',
          options: [
            {
              text: 'Đã rõ, em bắt đầu đo đạc ngay.',
              nextState: 'measuring'
            }
          ]
        },
        after_measure: {
          speech:
            'Tuyệt vời! Cân báo khối lượng m = 44 gam, còn áp kế và lưu lượng kế đo được V = 24,79 lít ở điều kiện chuẩn (25 °C, 1 bar). Bây giờ hãy dùng máy tính để tính số mol và khối lượng mol M của khí X!',
          options: [
            {
              text: 'Em sẽ tính khối lượng mol M và tỉ khối so với không khí!',
              nextState: 'calculating'
            }
          ]
        },
        hint_density: {
          speech:
            'Nhớ nhé: Không khí có khối lượng mol trung bình là 29 g/mol. Tỉ khối d = M_X / 29. Nếu d > 1 khí sẽ chìm xuống sàn nhà; nếu d < 1 khí sẽ bay lên trần!',
          options: [
            {
              text: 'Cảm ơn Thầy, em đã hiểu nguyên tắc thông gió!',
              nextState: 'after_measure'
            }
          ]
        }
      }
    }
  ]
};

// =========================================================================
// QUEST 1 (HÓA HỌC - 7 STAGES COMPREHENSIVE PLAYABLE QUEST)
// =========================================================================

export const QUEST_CHEMISTRY_V4: GameQuestV4 = {
  questId: 'QUEST_V4_01',
  title: 'Khắc Phục Sự Cố Khí Rò Rỉ & Nồng Độ Dung Dịch',
  domain: 'HOA_HOC',
  chapterTitle: 'Chương I: Phản ứng hóa học & Nồng độ dung dịch',
  storyIntro:
    'Nhiệm vụ 7 bước: Quan sát hiện trường → Đo thông số khí → Tính khối lượng mol & tỉ khối → Đưa ra quyết định thoát khí an toàn → Pha chế dung dịch trung hòa 2% → Sửa chữa van an toàn → Thu thập Evidence.',
  currentStageIndex: 0,
  status: 'IN_PROGRESS',
  rewardXP: 150,
  unlockedNodeId: 'K_HOA_05',
  rewardCardId: 'CARD_GAS_DENSITY',
  stages: [
    {
      stageId: 'STAGE_1_INSPECT',
      stageNumber: 1,
      title: 'Giai đoạn 1: Khám phá & Quan sát hiện trường',
      storyPrompt:
        'Quan sát bình khí rò rỉ O_GAS_CYLINDER. Chạm vào vật thể để kiểm tra nhãn mác, dấu hiệu ăn mòn và trạng thái vật lý.',
      requiredActionType: 'inspect',
      targetObjectId: 'O_GAS_CYLINDER',
      hint: 'Hãy bấm vào vật thể "Bình Khí Rò Rỉ" trên màn hình phòng thí nghiệm.',
      completed: false,
      learningObjective: 'Nhận biết hiện tượng vật lí và quy tắc an toàn khi phát hiện rò rỉ hóa chất',
      knowledgeId: 'K_HOA_01',
      interactiveChallenge: {
        prompt:
          'Khi phát hiện có mùi lạ hoặc tiếng xì khí trong phòng thí nghiệm, thao tác ban đầu an toàn nhất là gì?',
        type: 'CHOICE',
        options: [
          'Chạy lại hít thật sâu để đoán xem là khí gì',
          'Báo ngay cho giáo viên/phụ trách, mở thoáng khí, không bật tia lửa điện',
          'Đổ ngay xô nước vào bình khí',
          'Khóa kín tất cả cửa sổ lại rồi bỏ đi'
        ],
        correctIndex: 1,
        explanation:
          'Tuyệt đối không bật tia lửa điện và giữ thông thoáng phòng, báo ngay người phụ trách.'
      }
    },
    {
      stageId: 'STAGE_2_MEASURE',
      stageNumber: 2,
      title: 'Giai đoạn 2: Đo lường thông số khí với dụng cụ chuyên dụng',
      storyPrompt:
        'Chọn Cân điện tử (⚖️) hoặc Áp kế (🌡️) từ Thanh Dụng Cụ, sau đó chạm vào Bình Khí X để lấy số liệu thực tế.',
      requiredActionType: 'measure',
      targetObjectId: 'O_GAS_CYLINDER',
      requiredToolId: 'T_SCALE',
      hint: 'Mở Túi dụng cụ ở dưới màn hình -> Bấm chọn "Cân Điện Tử" hoặc "Áp Kế" -> Bấm "Thực hiện đo đạc".',
      completed: false,
      learningObjective: 'Sử dụng thiết bị đo đạc để thu thập dữ kiện số mol và thể tích ở điều kiện chuẩn',
      knowledgeId: 'K_HOA_03',
      interactiveChallenge: {
        prompt:
          'Dụng cụ đo ghi nhận: Khối lượng khí thoát ra là 44 gam; thể tích chiếm chỗ ở 25 °C, 1 bar là 24,79 lít. Vậy số mol (n) của lượng khí thoát ra là bao nhiêu?',
        type: 'NUMERIC_CALC',
        correctValue: 1,
        tolerance: 0.05,
        unit: 'mol',
        explanation:
          'Ở điều kiện chuẩn (25 °C, 1 bar), 1 mol khí chiếm đúng 24,79 lít. Vì V = 24,79 lít nên n = V / 24,79 = 1,0 mol.'
      }
    },
    {
      stageId: 'STAGE_3_CALCULATE',
      stageNumber: 3,
      title: 'Giai đoạn 3: Tính toán khối lượng mol (M) và Tỉ khối (d)',
      storyPrompt:
        'Sử dụng công thức khối lượng mol M = m / n và tỉ khối d = M / 29 để phân tích tính chất khí X.',
      requiredActionType: 'calculate',
      requiredToolId: 'T_CALCULATOR',
      hint: 'm = 44 g, n = 1 mol -> M = 44 g/mol. Tỉ khối so với không khí d = 44 / 29 ≈ ?',
      completed: false,
      learningObjective: 'Vận dụng công thức khối lượng mol và tỉ khối chất khí KHTN 8',
      knowledgeId: 'K_HOA_03',
      formulaId: 'F_HOA_04',
      interactiveChallenge: {
        prompt:
          'Tính tỉ khối của khí X (M = 44 g/mol) so với không khí (M_kk = 29 g/mol). Giá trị d bằng bao nhiêu và kết luận gì?',
        type: 'CHOICE',
        options: [
          'd ≈ 1,52 > 1 → Khí X nặng hơn không khí, có xu hướng chìm xuống thấp',
          'd ≈ 0,66 < 1 → Khí X nhẹ hơn không khí, bay lơ lửng lên trần',
          'd = 1,00 → Khí X có khối lượng bằng không khí',
          'd ≈ 2,50 → Khí X nhẹ hơn khí Hydro'
        ],
        correctIndex: 0,
        explanation:
          'd = 44 / 29 ≈ 1,517 (khoảng 1,52) > 1. Khí X (CO2) nặng gấp 1,52 lần không khí nên sẽ chìm và tích tụ ở sát mặt sàn.'
      }
    },
    {
      stageId: 'STAGE_4_DECIDE',
      stageNumber: 4,
      title: 'Giai đoạn 4: Đưa ra quyết định an toàn (Hậu quả thế giới thực)',
      storyPrompt:
        'Chạm vào "Hệ Thống Quạt Thông Gió" và quyết định phương án bật quạt để cứu viện nghiên cứu khỏi ngạt khí.',
      requiredActionType: 'decide',
      targetObjectId: 'O_VENTILATION_SYSTEM',
      hint: 'Khí X nặng hơn không khí và lắng dưới sàn. Bật quạt nào sẽ hút sạch khí ra ngoài hiệu quả nhất?',
      completed: false,
      learningObjective: 'Chuyển giao kiến thức tỉ khối vào quyết định giải quyết vấn đề đời sống',
      knowledgeId: 'K_HOA_03',
      interactiveChallenge: {
        prompt:
          'Bạn sẽ kích hoạt chế độ thông gió nào để đẩy khí rò rỉ ra ngoài an toàn nhất?',
        type: 'CHOICE',
        options: [
          'Bật quạt hút sát sàn nhà (Floor Extraction Vent) để gom lớp khí nặng lắng bên dưới',
          'Chỉ bật quạt thông gió gắn trên nóc trần nhà (Ceiling Fan)',
          'Đóng tất cả quạt thông gió lại để chờ khí tự tan',
          'Xịt khí Nitơ lỏng khắp phòng'
        ],
        correctIndex: 0,
        explanation:
          'Vì CO2 nặng hơn không khí nên tích tụ ở sát sàn nhà; bật quạt hút sàn sẽ gom và tống khí ra ngoài nhanh nhất, tránh gây ngạt cho người trong phòng.'
      }
    },
    {
      stageId: 'STAGE_5_PREPARE_SOL',
      stageNumber: 5,
      title: 'Giai đoạn 5: Pha chế dung dịch NaOH 2% trung hòa khí dư',
      storyPrompt:
        'Đến Bàn Pha Chế Dung Dịch (O_SOLUTION_BENCH). Tính toán lượng nước cần lấy để hòa tan 4g NaOH thành 200g dung dịch 2%.',
      requiredActionType: 'experiment',
      targetObjectId: 'O_SOLUTION_BENCH',
      requiredToolId: 'T_TITRATOR',
      hint: 'm_dd = m_ct + m_dm (nước) -> m_nước = 200g - 4g = ?',
      completed: false,
      learningObjective: 'Nắm vững công thức nồng độ phần trăm C% và quy trình pha chế dung dịch KHTN 8',
      knowledgeId: 'K_HOA_04',
      formulaId: 'F_HOA_05',
      interactiveChallenge: {
        prompt:
          'Để pha được 200 gam dung dịch NaOH nồng độ 2% từ 4 gam NaOH rắn, bạn cần cân đúng bao nhiêu gam nước cất?',
        type: 'NUMERIC_CALC',
        correctValue: 196,
        tolerance: 1,
        unit: 'gam',
        explanation:
          'Áp dụng định luật bảo toàn khối lượng dung dịch: m_dd = m_ct + m_dung_moi → m_nước = m_dd - m_NaOH = 200 - 4 = 196 gam nước.'
      }
    },
    {
      stageId: 'STAGE_6_REPAIR',
      stageNumber: 6,
      title: 'Giai đoạn 6: Sửa chữa van an toàn & Kiểm tra nồng độ môi trường',
      storyPrompt:
        'Dùng găng tay an toàn và cờ-lê định lực siết chặt van bình khí, dùng giấy quỳ tím/chỉ thị pH kiểm tra không khí xung quanh.',
      requiredActionType: 'repair',
      targetObjectId: 'O_GAS_CYLINDER',
      hint: 'Sau khi trung hòa, giấy pH phải chuyển về vùng trung tính (màu vàng nhạt/xanh nhẹ pH ≈ 7).',
      completed: false,
      learningObjective: 'Kỹ năng khắc phục lỗi kỹ thuật và nghiệm thu an toàn phòng thí nghiệm',
      knowledgeId: 'K_HOA_01',
      interactiveChallenge: {
        prompt:
          'Sau khi xịt dung dịch trung hòa và sửa van, nhúng giấy chỉ thị pH vào vũng dung dịch thấy giấy có màu xanh lá (pH = 7). Kết luận gì?',
        type: 'CHOICE',
        options: [
          'Hệ thống đã đạt trạng thái trung hòa an toàn, sự cố đã được khắc phục hoàn toàn!',
          'Dung dịch vẫn còn tính acid cực mạnh nguy hiểm',
          'Dung dịch biến thành acid sulfuric đậm đặc',
          'Cần phải sơ tán toàn bộ tòa nhà ngay lập tức'
        ],
        correctIndex: 0,
        explanation:
          'pH = 7 biểu thị môi trường trung tính, phản ứng trung hòa đã kết thúc thắng lợi.'
      }
    },
    {
      stageId: 'STAGE_7_CONFIRM',
      stageNumber: 7,
      title: 'Giai đoạn 7: Xác nhận Bằng Chứng Học Tập (Evidence) & Mở Khóa',
      storyPrompt:
        'Xem lại chuỗi Evidence vừa tạo ra trong Sổ Tay Hiện Trường. Đúc kết bài học về Mol, Tỉ Khối và Nồng Độ Dung Dịch.',
      requiredActionType: 'record',
      requiredToolId: 'T_NOTEBOOK',
      hint: 'Bấm nút "Nghiệm thu nhiệm vụ & Nhận Thẻ Khoa Học" để hoàn tất.',
      completed: false,
      learningObjective: 'Tích hợp toàn diện kiến thức Chương I và nâng hạng Nhà Khoa Học',
      knowledgeId: 'K_HOA_03',
      interactiveChallenge: {
        prompt:
          'Tổng kết: Đại lượng nào sau đây quyết định việc một chất khí sẽ bay lên hay chìm xuống trong khí quyển Trái Đất?',
        type: 'CHOICE',
        options: [
          'Tỉ khối của khí đó so với không khí (d = M / 29)',
          'Màu sắc của chất khí',
          'Độ dẫn điện của chất khí',
          'Thể tích của bình chứa'
        ],
        correctIndex: 0,
        explanation:
          'Tỉ khối d = M / 29 phản ánh mật độ phân tử khối: d > 1 khí chìm xuống, d < 1 khí bay lên cao.'
      }
    }
  ]
};

// =========================================================================
// SCENE 2 (VẬT LÍ - ÁP SUẤT CHẤT LỎNG & TÀU NGẦM ĐÁY BIỂN)
// =========================================================================

export const SCENE_PHYSICS_SUBMARINE: GameScene = {
  sceneId: 'SC_VAT_01',
  title: 'Trạm Nghiên Cứu Hải Dương KHTN - Thám Hiểm Rãnh Biển',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối Lượng Riêng & Áp Suất',
  storyIntro:
    'Tàu lặn thám hiểm đang khảo sát rãnh biển sâu. Càng lặn xuống sâu, áp suất nước biển càng tăng vọt ép lên vỏ tàu! Bạn cần tính toán độ sâu an toàn, vận hành bơm cân bằng áp suất để tránh vỡ vỏ tàu.',
  goal: 'Áp dụng công thức p = d.h để tính áp suất đáy biển, quyết định độ sâu tối đa và van xả an toàn.',
  knowledgeIds: ['K_VAT_02', 'K_VAT_03'],
  currentQuestId: 'QUEST_V4_PHYSICS',
  objects: [
    {
      objectId: 'O_DEPTH_SONAR',
      type: 'measurement_tool',
      name: 'Thước Đo Độ Sâu Sonar',
      description: 'Phát sóng âm phản hồi đáy biển, hiển thị độ sâu hiện tại h = 25 mét.',
      visualIcon: '📡',
      interactive: true,
      state: { depth: 25 },
      actions: ['inspect', 'measure'],
      knowledgeIds: ['K_VAT_02']
    },
    {
      objectId: 'O_PRESSURE_CHAMBER',
      type: 'machine',
      name: 'Khoang Chịu Lực Tàu Lặn',
      description: 'Đồng hồ áp kế gắn ngoài vỏ tàu. Giới hạn chịu tải an toàn là 400.000 N/m² (Pa).',
      visualIcon: '🚢',
      interactive: true,
      state: { currentPressure: 257500, maxSafePressure: 400000 },
      actions: ['inspect', 'measure', 'calculate'],
      knowledgeIds: ['K_VAT_02']
    },
    {
      objectId: 'O_BALLAST_VALVE',
      type: 'machine',
      name: 'Hệ Thống Két Nước Dằn Tàu',
      description: 'Bơm xả nước biển để điều chỉnh lực đẩy Archimedes giúp tàu nổi lên hoặc lặn xuống.',
      visualIcon: '⚙️',
      interactive: true,
      state: { buoyancyBalanced: true },
      actions: ['inspect', 'decide', 'repair'],
      knowledgeIds: ['K_VAT_03']
    }
  ],
  tools: V4_INITIAL_TOOLS,
  npcs: [
    {
      npcId: 'NPC_CAPT_TUAN',
      name: 'Thuyền Trưởng Minh Tuấn',
      role: 'Chỉ Huy Tàu Lặn Nghiên Cứu',
      avatar: '👨‍✈️',
      dialogueState: 'welcome',
      knowledgeIds: ['K_VAT_02', 'K_VAT_03'],
      dialogues: {
        welcome: {
          speech:
            'Báo cáo kỹ sư! Tàu đang ở độ sâu 25m trong lòng biển. Trọng lượng riêng của nước biển là d = 10.300 N/m³. Hãy tính áp suất tác dụng lên thành tàu ngay!',
          options: [
            {
              text: 'Tôi sẽ tính áp suất chất lỏng theo công thức p = d . h!',
              nextState: 'calculating'
            }
          ]
        }
      }
    }
  ]
};

export const QUEST_PHYSICS_V4: GameQuestV4 = {
  questId: 'QUEST_V4_PHYSICS',
  title: 'Chinh Phục Áp Suất Rãnh Biển Sâu',
  domain: 'VAT_LI',
  chapterTitle: 'Chương III: Khối Lượng Riêng & Áp Suất',
  storyIntro:
    'Sử dụng công thức p = d.h và lực đẩy Archimedes để đưa tàu ngầm thám hiểm xuống rãnh biển và trở về mặt nước an toàn.',
  currentStageIndex: 0,
  status: 'AVAILABLE',
  rewardXP: 140,
  unlockedNodeId: 'K_VAT_04',
  rewardCardId: 'CARD_OCEAN_PRESSURE',
  stages: [
    {
      stageId: 'STG_PHY_1',
      stageNumber: 1,
      title: 'Đo lường độ sâu và áp suất lòng biển',
      storyPrompt: 'Dùng Sonar đo độ sâu h = 25m. Trọng lượng riêng của nước biển d = 10.300 N/m³.',
      requiredActionType: 'measure',
      targetObjectId: 'O_DEPTH_SONAR',
      hint: 'Áp dụng công thức p = d . h.',
      completed: false,
      learningObjective: 'Hiểu bản chất áp suất chất lỏng tác dụng lên mọi phương',
      knowledgeId: 'K_VAT_02',
      formulaId: 'F_VAT_02',
      interactiveChallenge: {
        prompt:
          'Tính áp suất chất lỏng p do nước biển gây ra ở độ sâu h = 25m (với d_nước biển = 10.300 N/m³).',
        type: 'NUMERIC_CALC',
        correctValue: 257500,
        tolerance: 500,
        unit: 'Pa',
        explanation: 'p = d . h = 10.300 × 25 = 257.500 Pa (N/m²).'
      }
    },
    {
      stageId: 'STG_PHY_2',
      stageNumber: 2,
      title: 'Xác định giới hạn độ sâu an toàn',
      storyPrompt:
        'Vỏ tàu ngầm chỉ chịu được áp suất tối đa là 412.000 Pa. Tính độ sâu tối đa h_max mà tàu có thể lặn.',
      requiredActionType: 'calculate',
      targetObjectId: 'O_PRESSURE_CHAMBER',
      hint: 'h = p / d = 412.000 / 10.300 = ? mét.',
      completed: false,
      learningObjective: 'Kỹ năng biến đổi công thức tính chiều cao / độ sâu từ áp suất',
      knowledgeId: 'K_VAT_02',
      formulaId: 'F_VAT_02',
      interactiveChallenge: {
        prompt:
          'Tàu có thể lặn sâu tối đa bao nhiêu mét trước khi đạt giới hạn nguy hiểm 412.000 Pa?',
        type: 'NUMERIC_CALC',
        correctValue: 40,
        tolerance: 0.5,
        unit: 'mét',
        explanation: 'h_max = p_max / d = 412.000 / 10.300 = 40 mét.'
      }
    }
  ]
};

// All available scenes in v4 (Hóa Học + Vật lí theo từng bài B13-B29)
export const ALL_V4_SCENES: Record<string, GameScene> = {
  SC_HOA_01: SCENE_CHEMISTRY_LAB,
  SC_VAT_01: SCENE_PHYSICS_SUBMARINE,
  ...VAT_PHYSICS_SCENES
};

export const ALL_V4_QUESTS: Record<string, GameQuestV4> = {
  QUEST_V4_01: QUEST_CHEMISTRY_V4,
  QUEST_V4_PHYSICS: QUEST_PHYSICS_V4,
  ...VAT_PHYSICS_QUESTS
};
