# Gửi Vân Anh — lời chúc 20/10

Thiệp tương tác viết bằng HTML, CSS và JavaScript thuần, dùng **Vite 8** làm dev server và build pipeline. Canvas tự vẽ hành tinh, vòng quỹ đạo, chữ và trái tim bằng hạt.

## Chạy trên máy tính

Cài Node.js bản LTS, mở terminal trong thư mục dự án rồi chạy:

```powershell
npm ci
npm run dev
```

Vite hiển thị địa chỉ local trong terminal. Để mở trên điện thoại cùng mạng Wi-Fi, chạy `npm run dev -- --host 0.0.0.0` rồi mở địa chỉ IP máy tính ở cổng `5173`.

## Build và xem bản production

```powershell
npm run build
npm run preview
```

Bản deploy được tạo trong `dist/`. JavaScript được bundle/minify và source map bị tắt; ảnh gốc cùng thumbnail được chép vào build để trang vẫn hoạt động đầy đủ.

## Giới hạn bảo vệ mã nguồn

Bundle minify chỉ làm mã phía trình duyệt khó đọc hơn, không thể bảo vệ tuyệt đối: người xem vẫn có thể tải và phân tích JavaScript/CSS mà website cần để chạy. Repository GitHub hiện là công khai nên các file nguồn trong repo vẫn đọc được. Muốn giữ file nguồn riêng tư, cần đặt repository ở chế độ private hoặc tách phần nguồn sang một repo private; không đưa bí mật hay khóa API vào mã frontend.

## Trình tự và điều khiển

- Các cảnh hành tinh, đếm ngược 3–2–1, “20/10”, “Mừng ngày của em”, “Anh muốn nói là…”, “Anh yêu em” và tên Vân Anh tự chuyển lần lượt.
- Chạm vào phong thư để mở. Nội dung thư được gõ dần; đọc xong, nhấn **Nhấn để tiếp tục** để đến trái tim hạt.
- Trái tim đỏ đập nhẹ. Tối đa năm ảnh kỷ niệm hiện cùng lúc; nhấn ảnh để xem lớn và nhấn **×** hoặc phím Escape để đóng. Nhấn trái tim để ảnh tan đi và trái tim tỏa hạt rồi kết lại.
- Khi bật cài đặt giảm chuyển động của thiết bị, chạm để chuyển cảnh.

## Tùy chỉnh

Sửa `CONFIG` ở đầu `script.js` để đổi màu, mật độ hạt, thời gian cảnh và nội dung thư. Ngày bắt đầu hiện là **10/06/2026 00:00:00, giờ Việt Nam**; đồng hồ trong thư tự cập nhật theo thời gian thực. Danh sách ảnh nằm ở `image/manifest.json`, ảnh thu nhỏ WebP ở `image/thumbs/`.

## Triển khai

### GitHub Pages

Workflow `.github/workflows/deploy.yml` tự build và deploy thư mục `dist/` khi push lên `main`. Lần đầu, vào **Settings → Pages** và chọn **GitHub Actions** trong mục Source. Cấu hình build này chỉ công khai bản build; file nguồn vẫn công khai trong repository.

### Vercel

Import repository; Vercel nhận diện Vite. Dùng build command `npm run build` và output directory `dist`.
