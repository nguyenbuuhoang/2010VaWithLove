# Gửi Vân Anh — lời chúc 20/10

Thiệp tương tác chạy bằng HTML, CSS và JavaScript thuần, không cần cài thư viện hoặc backend. Canvas tạo hành tinh, chữ hạt và trái tim đỏ; chạm màn hình tạo sóng sáng. Ở cảnh cuối, ảnh kỷ niệm lần lượt bay ra; đủ 10 ảnh thì ảnh cũ bắt đầu mờ dần.

## Chạy trên máy tính

Mở PowerShell trong thư mục dự án và chạy:

```powershell
py -m http.server 8000 --bind 0.0.0.0
```

Mở `http://localhost:8000`. Để xem trên điện thoại cùng mạng Wi-Fi, mở `http://IP-máy-tính:8000`.

## Triển khai

### GitHub Pages

Repository đã có mã nguồn và ảnh trong thư mục `image/`. Vào **Settings → Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi lưu. Trang sẽ được phục vụ từ `index.html`.

### Vercel

Import repository, chọn **Other** làm framework preset, để trống build command và đặt output directory là `.` rồi nhấn **Deploy**.

## Điều khiển

- Các cảnh mở đầu tự chạy; nút **Tiếp** cho phép chuyển cảnh sớm.
- Phong thư và nút **Nhấn để tiếp tục** điều khiển phần mở và kết thúc lá thư.
- **Phát lại** khởi động thiệp từ đầu.
- Ở cảnh cuối, click để hạt tim tỏa ra rồi kết lại.
- Khi thiết bị bật giảm chuyển động, cảnh dừng tự chuyển và dùng nút điều khiển để tiếp tục.

## Tùy chỉnh

Sửa `CONFIG` ở đầu `script.js` để chỉnh màu hạt, mật độ (`particleScale`), tốc độ chuyển cảnh và nội dung lời chúc. Thời điểm bắt đầu yêu nhau hiện đặt là **10/06/2026 00:00:00, giờ Việt Nam**. Danh sách ảnh dùng trong hiệu ứng nằm ở `image/manifest.json`.
