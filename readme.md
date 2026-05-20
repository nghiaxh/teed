# Daily Feed - Trình đọc tin tức trên dòng lệnh

Daily Feed là công cụ dòng lệnh giúp bạn tìm kiếm và đọc tin tức từ các nguồn phổ biến (VnExpress, Tuổi Trẻ, Thanh Niên, 24h,...) ngay trong terminal.

## Yêu cầu

- Node.js >= 18
- npm hoặc yarn

# Cài đặt
```bash
npm install -g @nghiaxh/daily-feed
```


## Phát triển

```bash
# Clone repository
git clone https://github.com/nghiaxh/daily-feed
cd daily-feed

# Cài đặt dependencies
npm install

# Liên kết lệnh
npm link

# Chạy chương trình
npm run dev

# Tạo một terminal khác
dfd
```

## Sử dụng

Khi khởi động, bạn sẽ thấy một giao diện tối giản với dòng nhập lệnh. Gõ một từ khoá và nhấn **Enter** để tìm kiếm tin tức.

### Các lệnh

| Lệnh               | Mô tả                                   |
|--------------------|----------------------------------------|
| `/list`            | Xem danh sách các nguồn RSS hiện có     |
| `/add <url>`       | Thêm một nguồn RSS mới                  |
| `/remove <url\|*>` | Xoá một nguồn RSS hoặc dùng `*` để xoá tất cả nguồn tự thêm |
| `/exit`            | Thoát chương trình                      |
| `Ctrl+C`           | Thoát nhanh                             |

## Quản lý nguồn tin

- Mặc định, nó sử dụng hơn 70 nguồn từ các trang báo lớn.
- Bạn có thể thêm nguồn mới bằng lệnh `/add <url>`. Nguồn thêm vào sẽ được lưu vĩnh viễn.
- Dùng `/remove <url>` để xoá một nguồn cụ thể, hoặc `/remove *` để quay về danh sách mặc định.

## Cấu trúc dự án

```
daily-feed/
├── source/
│   ├── app.tsx               # Giao diện chính
│   ├── cli.tsx               # Điểm khởi chạy
│   ├── config.ts             # Quản lý file cấu hình feeds
│   └── feeds/
│       ├── aggregator.ts     # Tổng hợp tin theo từ khoá
│       └── rss.ts            # Xử lý RSS, tìm kiếm, loại bỏ stopword
├── package.json
└── README.md
```

## Gỡ cài đặt

```bash
npm uninstall -g @nghiaxh/daily-feed
```
