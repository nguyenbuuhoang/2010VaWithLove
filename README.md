# Gửi Vân Anh — lời chúc 20/10

Thiệp tương tác viết bằng HTML, CSS và JavaScript thuần. Canvas tự vẽ hành tinh, vòng quỹ đạo, chữ và trái tim bằng hạt; nhạc nền là giai điệu tạo trực tiếp bằng Web Audio, không dùng video hay tệp nhạc dựng sẵn.

## Chạy trên máy tính

Mở PowerShell trong thư mục dự án và chạy:

```powershell
py -m http.server 8000 --bind 0.0.0.0
```

Mở `http://localhost:8000`. Để xem trên điện thoại cùng mạng Wi-Fi, mở `http://IP-máy-tính:8000`.

## Trình tự và điều khiển

- Các cảnh hành tinh, đếm ngược 3–2–1, “20/10”, “Mừng ngày của em”, “Anh muốn nói là…”, “Anh yêu em” và tên Vân Anh tự chuyển lần lượt.
- Chạm vào phong thư để mở. Nội dung thư được gõ dần; đọc xong, nhấn **Nhấn để tiếp tục** để đến trái tim hạt.
- Trái tim đỏ đập nhẹ. Tối đa năm ảnh kỷ niệm hiện cùng lúc; nhấn ảnh để xem lớn và nhấn **×** hoặc phím Escape để đóng. Nhấn trái tim để ảnh tan đi và trái tim tỏa hạt rồi kết lại.
- Trình duyệt thường chặn âm thanh tự phát. Nhạc bắt đầu ở lần chạm/click đầu tiên; nút **Nhạc** ở góc trên bên phải dùng để tắt hoặc bật lại.
- Khi bật cài đặt giảm chuyển động của thiết bị, chạm để chuyển cảnh.

## Tùy chỉnh

Sửa `CONFIG` ở đầu `script.js` để đổi màu, mật độ hạt, thời gian cảnh, ngày bắt đầu và nội dung thư. Ngày bắt đầu hiện là **10/06/2026 00:00:00, giờ Việt Nam**; đồng hồ trong thư tự cập nhật theo thời gian thực. Danh sách ảnh nằm ở `image/manifest.json`, ảnh thu nhỏ WebP ở `image/thumbs/`.

## Triển khai

### GitHub Pages

Trong repository, vào **Settings → Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi lưu. Trang được phục vụ từ `index.html`.

### Vercel

Import repository, chọn **Other** làm framework preset, để trống build command và đặt output directory là `.` rồi nhấn **Deploy**.
