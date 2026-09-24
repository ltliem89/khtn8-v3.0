# KHTN 8 — V5.0
# XUẤT TƯ LIỆU LÝ THUYẾT GỘP NHIỀU BÀI HỌC
## WORD DOCX / PDF A4
### MASTER INSTRUCTION — DÙNG CHUNG CHO TẤT CẢ CÁC BÀI HỌC VÀ FILE NGUỒN

---

## 0. MỤC ĐÍCH CỦA V5

V5 không phải hướng dẫn sửa riêng file mẫu.

**File mẫu nhiều bài học chỉ là TEST CASE để phát hiện lỗi.**

Sau khi phát hiện lỗi trong file mẫu, AI phải chuyển lỗi đó thành **quy tắc dùng chung** và áp dụng lại cho:

- tất cả bài học hiện có;
- tất cả bài học được thêm sau này;
- tất cả bộ SGK/SGV/SBT được hệ thống xử lý;
- tất cả tài liệu lý thuyết được xuất thành DOCX/PDF A4.

### Mục tiêu cuối cùng

Từ:

```text
NHIỀU FILE / NHIỀU BÀI HỌC / DỮ LIỆU THÔ
```

tạo thành:

```text
TƯ LIỆU LÝ THUYẾT GỘP NHIỀU BÀI
        ↓
WORD DOCX CHUẨN
        +
PDF A4 CHUẨN
```

Tài liệu cuối phải có cảm giác như một **tài liệu giáo dục hoàn chỉnh được biên tập**, không phải bản sao của dữ liệu AI hoặc văn bản OCR.

---

# 1. QUY TẮC QUAN TRỌNG NHẤT

## 1.1. Không sửa riêng file mẫu

AI KHÔNG được làm:

```text
Phát hiện lỗi ở Bài 13
→ sửa riêng Bài 13
→ bỏ qua các bài khác
```

AI PHẢI làm:

```text
Phát hiện lỗi ở Bài 13
→ xác định loại lỗi
→ tạo RULE
→ quét toàn bộ tài liệu
→ áp dụng RULE cho Bài 13, 15, 16, ... và mọi bài khác
→ kiểm tra lại toàn bộ
```

---

## 1.2. File mẫu là dữ liệu kiểm thử

Ví dụ file mẫu có:

- công thức hiển thị xấu;
- `m3` thay vì `m³`;
- khoảng trắng trước dấu chấm;
- tiêu đề không đồng nhất;
- đường gạch ngang sau mỗi bài;
- công thức nằm lẫn trong đoạn văn;
- trang bị ngắt không hợp lý.

Không được coi đây là 6 lỗi riêng biệt.

Phải tạo thành 6 **quy tắc hệ thống**.

---

# 2. PIPELINE V5 BẮT BUỘC

AI phải xử lý theo thứ tự:

```text
SOURCE FILES
    ↓
SOURCE INVENTORY
    ↓
LESSON DETECTION
    ↓
CONTENT EXTRACTION
    ↓
CONTENT NORMALIZATION
    ↓
TEXT QA
    ↓
FORMULA EXTRACTION
    ↓
FORMULA QA
    ↓
UNIT QA
    ↓
DOCUMENT STRUCTURE
    ↓
DOCUMENT DESIGN
    ↓
DOCX RENDER
    ↓
PDF A4 RENDER
    ↓
VISUAL QA
    ↓
FINAL QA
    ↓
PUBLISH
```

Không được bỏ qua bước QA để xuất nhanh.

---

# 3. NGUYÊN TẮC BẢO TOÀN NGUỒN

AI phải phân biệt:

### SOURCE CONTENT
Nội dung lấy từ nguồn.

### NORMALIZATION
Sửa cách trình bày nhưng không đổi nghĩa.

### VERIFIED CORRECTION
Sửa nội dung vì đã có căn cứ xác minh.

### GENERATED CONTENT
Nội dung mới do AI tạo.

Trong tài liệu lý thuyết gộp nhiều bài, mặc định ưu tiên:

```text
SOURCE CONTENT
+
NORMALIZATION
```

Không tự biến tài liệu thành tài liệu kiến thức mở rộng.

---

# 4. KHÔNG ĐƯỢC TỰ Ý “SỬA KIẾN THỨC”

Nếu gặp:

- công thức nghi ngờ;
- ký hiệu không rõ;
- đơn vị bất thường;
- định nghĩa có khả năng sai;
- câu có khả năng OCR sai;
- nội dung mâu thuẫn giữa các nguồn;

AI phải đánh dấu:

```text
VERIFY_REQUIRED
```

và đối chiếu nguồn được chỉ định.

Không được âm thầm thay bằng kiến thức bên ngoài.

---

# 5. QUÉT TẤT CẢ BÀI TRƯỚC KHI XUẤT

Trước khi tạo DOCX/PDF, AI phải lập danh sách:

```text
Lesson 01
Lesson 02
Lesson 03
...
Lesson N
```

Sau đó kiểm tra từng bài.

Không được chỉ xử lý bài đầu tiên rồi dùng kết quả làm đại diện cho các bài còn lại.

---

# 6. CẤU TRÚC CHUẨN CỦA TÀI LIỆU

Tài liệu gộp nhiều bài nên có cấu trúc:

```text
TÊN ĐƠN VỊ / MÔN HỌC
KHTN 8

TƯ LIỆU LÝ THUYẾT
GỘP NHIỀU BÀI HỌC

Phạm vi: ...

MỤC LỤC

BÀI 13. ...
    1. Kiến thức trọng tâm
    2. Đại lượng và đơn vị
    3. Công thức cần nhớ
    4. Lưu ý
    5. Nội dung thực hành / quy trình (nếu có)

BÀI 15. ...
    ...

BÀI 16. ...
    ...

...
```

Không bắt buộc mọi bài phải có đủ mọi mục nếu nguồn không có nội dung tương ứng.

**Không được tạo mục rỗng chỉ để đủ khuôn.**

---

# 7. CHUẨN HÓA TIÊU ĐỀ TOÀN BỘ TÀI LIỆU

Chỉ sử dụng một hệ thống cấp bậc.

### Cấp 1

**TƯ LIỆU LÝ THUYẾT**

### Cấp 2

**BÀI 13. KHỐI LƯỢNG RIÊNG**

### Cấp 3

**1. KIẾN THỨC TRỌNG TÂM**

### Cấp 4

**Công thức**

Không trộn:

```text
Bài 13:
BÀI 15 -
Bài 16 —
16. ...
```

trong cùng một tài liệu.

---

# 8. XỬ LÝ ĐƯỜNG GẠCH NGANG

## Quy tắc bắt buộc

Không được sinh đường:

```text
-----------------------
```

hoặc:

```text
_______________________
```

sau mỗi bài.

### Thay thế bằng

```text
khoảng cách dàn trang
+
tiêu đề bài mới
```

hoặc ngắt trang khi phù hợp.

### Chỉ dùng đường kẻ khi

Nó có chức năng bố cục thực sự, ví dụ:

- dưới tiêu đề chính;
- trong bảng;
- phân tách một khối thông tin;
- thiết kế trang bìa.

---

# 9. CHUẨN HÓA VĂN BẢN

AI phải quét toàn bộ tài liệu để phát hiện:

- hai hoặc nhiều khoảng trắng;
- khoảng trắng trước dấu câu;
- thiếu khoảng trắng sau dấu câu;
- dấu câu lặp;
- dấu ngoặc không đóng;
- câu bị dính;
- dòng bị lặp;
- đoạn bị lặp;
- tiêu đề bị lặp;
- ký tự OCR bất thường;
- ký tự Unicode không phù hợp;
- từ bị chia sai do xuống dòng.

### Ví dụ

Sai:

```text
Khối lượng  riêng của vật là m = 200 g .
```

Chuẩn:

```text
Khối lượng riêng của vật là m = 200 g.
```

---

# 10. CHUẨN HÓA DẤU CÂU

Kiểm tra toàn bộ:

```text
.
,
;
:
?
!
()
[]
{}
```

Không được có:

```text
..
,,
;;
::
```

Không có khoảng trắng trước dấu câu.

Không tự thêm dấu câu làm thay đổi nghĩa nguồn.

---

# 11. CHUẨN HÓA KÝ HIỆU KHOA HỌC

Phải giữ nguyên bản chất ký hiệu.

Ví dụ:

```text
D
m
V
p
F
S
F_A
M
Q
Δt
```

Nếu đã chọn một ký hiệu cho tài liệu thì dùng nhất quán.

Không để:

```text
F_A
FA
Fđ
F(a)
```

cùng chỉ một đại lượng nếu nguồn không yêu cầu.

---

# 12. QUY TẮC CÔNG THỨC V5

## 12.1. Công thức là một đối tượng riêng

Không coi công thức chỉ là chuỗi text.

Mỗi công thức phải có tối thiểu:

```text
formula_id
formula_name
latex
plain_text
variables
units
conditions
source
verification_status
```

---

## 12.2. Ví dụ

```json
{
  "formula_id": "F001",
  "formula_name": "Khối lượng riêng",
  "latex": "D=\\frac{m}{V}",
  "plain_text": "D = m / V",
  "variables": [
    {
      "symbol": "D",
      "name": "Khối lượng riêng",
      "unit": "kg/m³"
    },
    {
      "symbol": "m",
      "name": "Khối lượng",
      "unit": "kg"
    },
    {
      "symbol": "V",
      "name": "Thể tích",
      "unit": "m³"
    }
  ],
  "verification_status": "VERIFY"
}
```

---

# 13. CÔNG THỨC PHẢI ĐƯỢC RENDER ĐẸP

Không xuất bản:

```text
D=m/V
```

như cách trình bày duy nhất.

Ưu tiên:

\[
D=\frac{m}{V}
\]

Nếu có công thức biến đổi:

\[
m=DV
\]

\[
V=\frac{m}{D}
\]

Mỗi công thức quan trọng phải có khoảng cách đủ để đọc khi in A4.

---

# 14. KIỂM TRA 7 LỚP CHO MỖI CÔNG THỨC

### FORM-01 — Cú pháp
Có mất phân số, chỉ số, số mũ, ngoặc không?

### FORM-02 — Ký hiệu
Các ký hiệu có được định nghĩa không?

### FORM-03 — Đơn vị
Đơn vị có phù hợp với công thức không?

### FORM-04 — Đại số
Công thức biến đổi có đúng không?

### FORM-05 — Điều kiện
Có điều kiện áp dụng nào cần giữ không?

### FORM-06 — Nguồn
Công thức có truy được về nguồn không?

### FORM-07 — Render
Khi xuất DOCX/PDF có hiển thị đúng không?

---

# 15. PHÂN LOẠI LỖI CÔNG THỨC

| Mã | Ý nghĩa | Cách xử lý |
|---|---|---|
| FORM-ERROR | Sai toán học | BLOCK/VERIFY |
| FORM-AMBIGUOUS | Cách viết gây hiểu nhầm | VERIFY |
| FORM-SOURCE | Khác nguồn | VERIFY |
| FORM-UNIT | Đơn vị không phù hợp | VERIFY |
| FORM-CONDITION | Thiếu điều kiện | VERIFY |
| FORM-RENDER | Render sai | AUTO-FIX |
| FORM-TYPO | Lỗi ký tự rõ ràng | AUTO-FIX nếu chắc chắn |

---

# 16. ĐƠN VỊ

Chuẩn hóa cách hiển thị:

```text
m²
m³
kg/m³
N/m²
°C
```

Không để:

```text
m2
m3
kg/m3
N/m2
oC
```

trong bản in nếu hệ thống có khả năng render Unicode đúng.

### Lưu ý

Không tự đổi giá trị vật lý chỉ vì đổi cách hiển thị đơn vị.

---

# 17. DẤU NHÂN VÀ PHÂN SỐ

Ưu tiên:

\[
Q=mc\Delta t
\]

thay vì chuỗi ký tự khó đọc.

Đối với phân số:

\[
p=\frac{F}{S}
\]

Không kéo dài thành:

```text
p = F / S
```

nếu trình render công thức có hỗ trợ phân số.

---

# 18. BẢNG ĐẠI LƯỢNG

Khi bài có nhiều đại lượng, tạo bảng:

| Đại lượng | Ký hiệu | Đơn vị |
|---|---:|---|
| Khối lượng | \(m\) | kg |
| Thể tích | \(V\) | m³ |
| Khối lượng riêng | \(D\) | kg/m³ |

Không để bảng quá rộng.

Không để công thức dài trong cột hẹp.

---

# 19. QUY TẮC KHÔNG LÀM BIẾN DẠNG NỘI DUNG

AI không được:

- tự rút gọn đến mức mất ý;
- tự mở rộng kiến thức;
- đổi tên khái niệm;
- thay thuật ngữ bằng từ dễ hiểu hơn nếu làm mất thuật ngữ chuẩn;
- thêm ví dụ ngoài nguồn mà không đánh dấu;
- tự tạo kết luận không có căn cứ.

Nếu cần biên tập ngắn gọn, chỉ được **chuẩn hóa và cô đọng**, không thay đổi ý nghĩa.

---

# 20. QUY TẮC GỘP NHIỀU BÀI

Khi gộp:

```text
Bài A
Bài B
Bài C
...
```

phải giữ:

- thứ tự bài;
- tên bài;
- nội dung riêng của từng bài;
- công thức riêng;
- thuật ngữ;
- cấu trúc logic.

Không trộn nội dung của Bài A sang Bài B chỉ vì hai bài có cùng chủ đề.

---

# 21. KHÔNG ĐỂ BÀI NÀY “KÉO FORMAT” BÀI KHÁC

Một lỗi thường gặp của hệ thống là:

```text
Bài 1 có bảng
→ tất cả bài đều bị ép thành bảng.

Bài 1 có công thức
→ mọi đoạn đều bị biến thành công thức.

Bài 1 có gạch ngang
→ gạch ngang xuất hiện sau mọi bài.
```

V5 cấm hành vi này.

**Template chung chỉ quy định phong cách, không ép nội dung phải giống nhau.**

---

# 22. QUY TẮC DÀN TRANG A4

Mặc định:

```text
Paper: A4
Orientation: Portrait
Margins: khoảng 2–2,5 cm
Body font: Times New Roman
Body size: khoảng 13–14 pt
Line spacing: khoảng 1,15–1,3
```

Có thể thay đổi theo yêu cầu của người dùng hoặc mẫu nhà trường.

---

# 23. CẤU TRÚC TRANG

Ưu tiên:

```text
TIÊU ĐỀ
↓
ĐOẠN GIỚI THIỆU
↓
MỤC
↓
NỘI DUNG
↓
CÔNG THỨC
↓
GIẢI THÍCH
```

Không để:

```text
TIÊU ĐỀ
```

ở cuối trang.

Không để:

```text
CÔNG THỨC
```

ở cuối trang nhưng phần “Trong đó...” sang trang sau.

---

# 24. KEEP-TOGETHER

Các thành phần sau phải được giữ gần nhau:

```text
Tên công thức
+
Công thức
+
Trong đó
+
Đơn vị
```

Một bảng không nên bị tách thành phần khó đọc.

Tiêu đề mục phải đi cùng ít nhất một đoạn nội dung phía sau.

---

# 25. HEADER / FOOTER

Tài liệu nhiều bài nên có:

### Header
Tên tài liệu hoặc môn học.

### Footer
Số trang.

Không đưa thông tin thừa vào header/footer.

Trang bìa có thể không hiển thị số trang nếu thiết kế yêu cầu.

---

# 26. MỤC LỤC

Nếu tài liệu đủ dài, hệ thống nên tạo mục lục tự động dựa trên Heading.

Không tạo mục lục bằng cách gõ thủ công số trang.

Khi nội dung thay đổi, mục lục phải có khả năng cập nhật.

---

# 27. TẠO DOCX

DOCX phải có:

- Heading hierarchy;
- paragraph styles;
- bảng đúng cấu trúc;
- công thức được render phù hợp;
- page break hợp lý;
- header/footer;
- số trang;
- không có text box thừa;
- không có đường kẻ sinh tự động ngoài ý muốn.

---

# 28. TẠO PDF

PDF phải được tạo từ bản đã layout.

Không lấy text thô rồi “đóng gói” thành PDF.

Sau khi xuất PDF phải kiểm tra:

- font;
- công thức;
- ký hiệu;
- dấu tiếng Việt;
- bảng;
- ngắt trang;
- lề;
- header/footer;
- trang trắng;
- đường kẻ;
- lỗi ký tự.

---

# 29. VISUAL QA — BẮT BUỘC

Không coi DOCX/PDF đã xuất là đạt chỉ vì file mở được.

Phải kiểm tra trực quan các trang:

### Trang đầu
- tiêu đề;
- lề;
- font;
- bố cục.

### Trang có công thức
- phân số;
- chỉ số;
- số mũ;
- khoảng cách.

### Trang có bảng
- bảng không tràn;
- chữ không bị cắt.

### Trang chuyển bài
- không có đường gạch ngang thừa;
- tiêu đề bài mới rõ;
- khoảng cách hợp lý.

### Trang cuối
- không có vùng trắng bất thường;
- không mất nội dung.

---

# 30. AUTO-FIX VÀ VERIFY

## AUTO-FIX — Có thể sửa tự động

Ví dụ:

- nhiều khoảng trắng;
- khoảng trắng trước dấu câu;
- `m2` → `m²` khi chắc chắn là đơn vị;
- `m3` → `m³`;
- đường gạch ngang separator không cần thiết;
- style tiêu đề không đồng nhất;
- công thức render sai do mất định dạng nhưng dữ liệu gốc rõ ràng.

## VERIFY — Không được tự sửa âm thầm

Ví dụ:

- công thức có vẻ sai;
- định nghĩa có vẻ sai;
- số liệu nghi ngờ;
- ký hiệu không rõ;
- nội dung giữa SGK và nguồn khác nhau;
- điều kiện áp dụng không rõ.

---

# 31. BỘ MÃ LỖI CHUNG

```text
TXT-001  Khoảng trắng
TXT-002  Câu bị dính
TXT-003  Câu bị lặp
TXT-004  Từ bị lỗi OCR

PUN-001  Dấu câu
PUN-002  Dấu câu lặp
PUN-003  Khoảng trắng quanh dấu

FORM-001 Công thức lỗi
FORM-002 Phân số lỗi
FORM-003 Chỉ số lỗi
FORM-004 Số mũ lỗi
FORM-005 Công thức biến đổi lỗi
FORM-006 Thiếu điều kiện

UNIT-001 Đơn vị lỗi
UNIT-002 Đơn vị không nhất quán
UNIT-003 Chuyển đổi đơn vị cần kiểm tra

STRUCT-001 Tiêu đề không nhất quán
STRUCT-002 Sai thứ tự bài
STRUCT-003 Thiếu mục

LAYOUT-001 Đường gạch ngang thừa
LAYOUT-002 Tiêu đề cuối trang
LAYOUT-003 Công thức bị tách
LAYOUT-004 Bảng tràn
LAYOUT-005 Khoảng trắng bất thường
LAYOUT-006 Trang trắng

SOURCE-001 Không xác định nguồn
SOURCE-002 Nội dung cần xác minh
SOURCE-003 Nội dung khác nguồn
```

---

# 32. BẢNG QA CHO TỪNG BÀI

Trước khi xuất, AI phải có trạng thái:

| Bài | Text | Formula | Unit | Structure | Layout | Source | Status |
|---|---|---|---|---|---|---|---|
| Bài 13 | PASS | PASS | PASS | PASS | PASS | PASS | READY |
| Bài 15 | PASS | VERIFY | PASS | PASS | PASS | PASS | VERIFY |
| Bài 16 | PASS | PASS | PASS | PASS | PASS | PASS | READY |

Không được đánh dấu toàn tài liệu `READY` nếu còn bài `BLOCK`.

---

# 33. PUBLISH GATE

Chỉ xuất bản khi:

```text
TEXT QA       = PASS
FORMULA QA    = PASS
UNIT QA       = PASS
STRUCTURE QA  = PASS
LAYOUT QA     = PASS
SOURCE QA     = PASS
VISUAL QA     = PASS
```

Nếu có:

```text
BLOCK
```

→ không được gắn `READY_TO_PRINT`.

Nếu có:

```text
VERIFY
```

→ phải thể hiện rõ trạng thái và xử lý theo quy trình xác minh.

---

# 34. CHECKLIST CUỐI CÙNG

```text
[ ] Đủ tất cả các bài được yêu cầu
[ ] Đúng thứ tự
[ ] Không mất đoạn
[ ] Không lặp đoạn
[ ] Không có lỗi OCR rõ ràng
[ ] Dấu câu sạch
[ ] Khoảng trắng sạch
[ ] Tiêu đề đồng nhất
[ ] Không có separator sau mỗi bài
[ ] Công thức là object riêng
[ ] Phân số hiển thị đẹp
[ ] Chỉ số hiển thị đúng
[ ] Số mũ hiển thị đúng
[ ] Đơn vị đúng
[ ] Ký hiệu nhất quán
[ ] Công thức có định nghĩa đại lượng
[ ] Công thức có nguồn
[ ] Công thức cần xác minh đã được đánh dấu
[ ] Không tự thêm kiến thức ngoài nguồn
[ ] Bảng không tràn
[ ] Không có tiêu đề cô lập cuối trang
[ ] Không có công thức cô lập cuối trang
[ ] Không có trang trắng bất thường
[ ] Header/footer đúng
[ ] Số trang đúng
[ ] DOCX mở được
[ ] PDF mở được
[ ] PDF A4 đúng
[ ] Đã visual QA
```

---

# 35. LỆNH HỆ THỐNG DÀNH CHO AI

Khi nhận yêu cầu xuất tư liệu lý thuyết gộp nhiều bài:

> **Hãy xử lý TOÀN BỘ các bài học được cung cấp, không chỉ file mẫu.**
>
> File mẫu chỉ được dùng làm dữ liệu kiểm thử để phát hiện các lỗi mang tính hệ thống.
>
> Mọi lỗi văn bản, dấu câu, khoảng trắng, công thức, đơn vị, ký hiệu và dàn trang phát hiện trong một bài phải được chuyển thành quy tắc và quét lại trên TẤT CẢ các bài còn lại.
>
> Không được sửa kiến thức âm thầm. Nội dung phải bám nguồn được chỉ định. Nếu phát hiện nội dung hoặc công thức nghi ngờ, phải đánh dấu VERIFY và đối chiếu nguồn trước khi sửa.
>
> Khi xuất bản, không sử dụng văn bản thô làm bản in. Phải tạo cấu trúc tài liệu, style, formula object, bảng, heading, page break và layout A4.
>
> Không tạo đường gạch ngang sau mỗi bài.
>
> Công thức phải được trình bày bằng dạng toán học phù hợp với DOCX/PDF, có ký hiệu, định nghĩa đại lượng, đơn vị và điều kiện áp dụng khi nguồn có nêu.
>
> Sau khi tạo DOCX/PDF phải thực hiện kiểm tra nội dung và kiểm tra trực quan trước khi đánh dấu READY_TO_PRINT.

---

# 36. KIẾN TRÚC V5

```text
                 ┌──────────────────────┐
                 │   SGK / SGV / SBT    │
                 │     / SOURCE FILES   │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │   SOURCE EXTRACTOR   │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │ CONTENT NORMALIZER   │
                 │ TEXT / PUNCT / SPACE │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │  FORMULA ENGINE      │
                 │ FORMULA / UNIT / QA  │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │ DOCUMENT BUILDER     │
                 │ HEADING / TABLE /    │
                 │ PARAGRAPH / FORMULA  │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │ PRINT LAYOUT ENGINE  │
                 │       A4 / DOCX      │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │    PDF RENDERER      │
                 └──────────┬───────────┘
                            ↓
                 ┌──────────────────────┐
                 │     VISUAL QA        │
                 └──────────┬───────────┘
                            ↓
                   ┌────────────────┐
                   │ READY_TO_PRINT │
                   └────────────────┘
```

---

# 37. TIÊU CHUẨN THÀNH CÔNG CỦA V5

V5 đạt yêu cầu khi người dùng có thể đưa vào hệ thống:

```text
5 bài
10 bài
20 bài
50 bài
100 bài
```

và hệ thống vẫn:

1. phát hiện lỗi trên **tất cả bài**;
2. áp dụng cùng một bộ quy tắc;
3. giữ đúng nội dung nguồn;
4. chuẩn hóa văn bản;
5. chuẩn hóa công thức;
6. chuẩn hóa đơn vị;
7. loại bỏ lỗi layout lặp;
8. tạo DOCX A4;
9. tạo PDF A4;
10. kiểm tra lại trước khi xuất.

**Không được thiết kế V5 chỉ để làm đẹp file mẫu.**

V5 phải là **ENGINE RULESET dùng chung cho toàn bộ hệ thống xuất tư liệu lý thuyết KHTN 8.**
