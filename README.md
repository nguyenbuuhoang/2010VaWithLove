# Gửi Vân Anh — lời chúc 20/10

Trang thiệp tương tác chạy hoàn toàn ở phía trình duyệt. Hạt được lấy mẫu từ canvas chữ, hội tụ bằng vận tốc có giảm chấn, dao động theo quỹ đạo, kết thành hành tinh và lời chúc; không dùng video hay thư viện hiệu ứng bên ngoài.

## Chạy trên máy tính

Mở `index.html` trong trình duyệt. Để kiểm tra giống môi trường triển khai hơn, chạy máy chủ tĩnh trong thư mục này:

```bash
python -m http.server 8000
```

Sau đó mở [http://localhost:8000](http://localhost:8000). Có thể dùng `npx serve .` nếu đã cài Node.js.

## Triển khai

### Vercel

Đưa ba tệp `index.html`, `style.css`, `script.js` (cùng README tùy chọn) lên repository. Trong Vercel, import repository, chọn **Other** làm framework preset, để trống build command và đặt output directory là `.`. Nhấn **Deploy**.

### GitHub Pages

Đưa các tệp lên nhánh `main`. Trong repository, mở **Settings → Pages**, chọn **Deploy from a branch**, chọn `main` và thư mục `/ (root)`, rồi lưu. GitHub Pages sẽ phục vụ `index.html`.

## Tùy chỉnh

Sửa `CONFIG` ở đầu `script.js` để thay lời chúc, màu hạt, tốc độ tự chuyển cảnh hoặc mật độ hạt. Chọn `particleScale` từ `0.6` đến `1.2` để tinh chỉnh hiệu năng. Trang tự giới hạn device pixel ratio; `prefers-reduced-motion` được tôn trọng bằng cách tắt tự chuyển cảnh và giảm chuyển động CSS.

Chạm/click vào nền để tạo sóng sáng và chuyển cảnh; nút mũi tên chuyển cảnh; nút **Phát lại** quay về đầu. Font có fallback hệ thống nếu không có kết nối mạng.
