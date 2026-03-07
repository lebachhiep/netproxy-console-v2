# 🎛️ NetProxy Console V2

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel)

**🚀 Bảng điều khiển quản lý Proxy hiện đại cho người dùng**

[🌍 Demo](https://console.prx.network) • [🛒 Hệ thống đại lý](https://seller.prx.network/) • [📡 API](https://api.prx.network)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt Local](#-cài-đặt-local)
- [Deploy lên Vercel](#-deploy-lên-vercel)
- [Deploy lên Cloudflare Pages](#-deploy-lên-cloudflare-pages)
- [Tích hợp Hệ thống](#-tích-hợp-hệ-thống)
- [Tùy chỉnh Website](#-tùy-chỉnh-website)
- [Tech Stack](#-tech-stack)
- [Liên hệ & Hỗ trợ](#-liên-hệ--hỗ-trợ)

---

## 🎯 Giới thiệu

**NetProxy Console V2** là bảng điều khiển (dashboard) dành cho người dùng cuối, được xây dựng với công nghệ hiện đại nhất. Hệ thống cho phép người dùng quản lý proxy, nạp tiền, mua gói dịch vụ và theo dõi lịch sử sử dụng.

Website hỗ trợ **đa ngôn ngữ (14 ngôn ngữ)** với giao diện đẹp mắt, hiệu ứng mượt mà và tương thích hoàn hảo với **Vercel** và **Cloudflare Pages**.

Dự án này được thiết kế để kết hợp với:
- **[Seller Portal](https://seller.prx.network/)** - Hệ thống quản lý đại lý
- **[Landing Page](https://netproxy-index-v2.pages.dev)** - Trang giới thiệu sản phẩm
- **[API Backend](https://api.prx.network)** - API xử lý nghiệp vụ

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🔐 **Xác thực người dùng** | Đăng nhập, Đăng ký, Quên mật khẩu với reCAPTCHA v3 |
| 📊 **Dashboard** | Tổng quan sử dụng proxy, thống kê với biểu đồ Recharts |
| 🛒 **Mua Proxy** | Duyệt và mua các gói proxy theo quốc gia, thời hạn |
| 💰 **Ví điện tử** | Nạp tiền, quản lý số dư, thanh toán QR Code |
| 📜 **Lịch sử đơn hàng** | Theo dõi tất cả đơn hàng và subscription |
| 👥 **Reseller Portal** | Tính năng đặc biệt cho đại lý |
| 📚 **API Documentation** | Tài liệu API tích hợp sẵn |
| 📱 **Responsive Design** | Tương thích Desktop, Tablet, Mobile |
| 🌍 **Đa ngôn ngữ (i18n)** | Hỗ trợ 14 ngôn ngữ: VI, EN, ZH, RU, AR, HI, BN, ID, TH, TR, FA, PT, PH |
| 🎬 **Hiệu ứng mượt mà** | Framer Motion animations |

---

## 📁 Cấu trúc dự án

```
netproxy-console-v2/
│
├── 📂 src/
│   ├── 📂 components/         # 🧩 UI Components tái sử dụng
│   │   ├── app/               # App-level components (Loading, Logo)
│   │   ├── auth/              # Authentication components
│   │   ├── button/            # Button variants
│   │   ├── card/              # Card components (Balance, Pricing, Proxy)
│   │   ├── input/             # Input components (OTP, Search, API)
│   │   ├── modal/             # Modal dialogs
│   │   ├── table/             # Data tables
│   │   └── ...                # Checkbox, Select, Tabs, etc.
│   │
│   ├── 📂 pages/              # 📄 Các trang chính
│   │   ├── dashboard/         # Trang chủ Dashboard
│   │   ├── purchase/          # Mua proxy
│   │   ├── wallet/            # Quản lý ví
│   │   ├── history/           # Lịch sử đơn hàng
│   │   ├── order/             # Chi tiết đơn hàng
│   │   ├── account-profile/   # Thông tin tài khoản
│   │   ├── reseller/          # Trang đại lý
│   │   ├── api-docs/          # Tài liệu API
│   │   ├── login/             # Đăng nhập
│   │   ├── register/          # Đăng ký
│   │   └── ...
│   │
│   ├── 📂 services/           # 🔌 API Services
│   │   ├── api/               # Base API configuration
│   │   ├── auth/              # Authentication service
│   │   ├── user/              # User service
│   │   ├── payment/           # Payment service
│   │   ├── order/             # Order service
│   │   ├── subscription/      # Subscription service
│   │   ├── wallet/            # Wallet service
│   │   └── ...
│   │
│   ├── 📂 stores/             # 🗃️ Zustand State Management
│   ├── 📂 hooks/              # 🪝 Custom React Hooks
│   ├── 📂 layouts/            # 📐 Layout Components
│   ├── 📂 router/             # 🛣️ React Router Configuration
│   ├── 📂 contexts/           # 🔄 React Contexts
│   ├── 📂 utils/              # 🛠️ Utility Functions
│   ├── 📂 config/             # ⚙️ App Configuration
│   ├── 📂 types/              # 📝 TypeScript Definitions
│   └── 📂 assets/             # 🎨 Static Assets & Locales
│
├── 📂 public/
│   └── 📂 locales/            # 🌍 File ngôn ngữ (14 ngôn ngữ)
│       ├── vi/                # Tiếng Việt
│       ├── en/                # English
│       ├── zh/                # 中文
│       └── ...
│
├── .env.example               # Template biến môi trường
├── package.json               # Dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # TailwindCSS configuration
└── README.md                  # Tài liệu này
```

---

## 💻 Cài đặt Local

### ⚠️ Yêu cầu quan trọng trước khi bắt đầu

> **Lưu ý:** Để có thể đăng ký tài khoản và sử dụng hệ thống, bạn cần thực hiện **MỘT TRONG HAI** cách sau:

#### Cách 1: Chạy trên localhost (Khuyến nghị cho development)
- Chạy project trên `localhost:5192` 
- Hệ thống sẽ tự động nhận diện và cho phép đăng ký

#### Cách 2: Deploy lên domain riêng
1. Truy cập **[Seller Portal](https://seller.prx.network/)** và đăng ký tài khoản đại lý
2. Sau khi đăng nhập, vào phần **Cài đặt** → **Domain**
3. Thêm domain của bạn (ví dụ: `console.yourdomain.com`)
4. Sau khi domain được xác nhận, người dùng mới có thể đăng ký tài khoản trên domain đó

---

### 📋 Yêu cầu hệ thống

- ✅ **Node.js** 18.17 trở lên
- ✅ **Yarn** (khuyến nghị) hoặc npm
- ✅ **Git**

### 🚀 Các bước cài đặt

#### Bước 1: Clone repository

```bash
git clone https://github.com/lebachhiep/netproxy-console-v2.git
cd netproxy-console-v2
```

#### Bước 2: Cài đặt dependencies

```bash
# Sử dụng yarn (khuyến nghị)
yarn install

# Hoặc npm
npm install
```

#### Bước 3: Cấu hình môi trường

```bash
# Copy file môi trường mẫu
cp .env.example .env
```

File `.env` đã được cấu hình sẵn với các giá trị mặc định:

```env
# API endpoint cho hệ thống proxy
VITE_API_BASE_URL=https://api.prx.network

# reCAPTCHA v3 Site Key (đã cấu hình sẵn)
VITE_RECAPTCHA_SITE_KEY=6LcFazMsAAAAABLqyeCBDfdlW__pIG2pnt_gRZ4N
```

#### Bước 4: Chạy development server

```bash
yarn dev
```

#### Bước 5: Mở trình duyệt

Truy cập 👉 [http://localhost:5192](http://localhost:5192)

> **Tip:** Khi chạy trên localhost, bạn có thể đăng ký tài khoản mới ngay lập tức mà không cần cấu hình domain trên Seller Portal.

### 📜 Các lệnh có sẵn

| Lệnh | Mô tả |
|------|-------|
| `yarn dev` | Chạy development server (port 5192) |
| `yarn build` | Build production |
| `yarn preview` | Preview bản build production |
| `yarn lint` | Kiểm tra lỗi với ESLint |
| `yarn format` | Format code với Prettier |

---

## ▲ Deploy lên Vercel

### ⚠️ Bước 0: Đăng ký domain trên Seller Portal (BẮT BUỘC)

> **Quan trọng:** Trước khi deploy, bạn **BẮT BUỘC** phải đăng ký domain trên Seller Portal để người dùng có thể tạo tài khoản.

1. Truy cập 👉 **[https://seller.prx.network/](https://seller.prx.network/)**
2. Đăng ký tài khoản đại lý (nếu chưa có)
3. Đăng nhập và vào **Cài đặt** → **Domain**
4. Thêm domain bạn sẽ deploy (ví dụ: `netproxy-console-v2.vercel.app` hoặc custom domain)
5. Chờ domain được xác nhận

---

### 📌 Phương pháp 1: Kết nối GitHub (Khuyến nghị)

Đây là cách đơn giản nhất, Vercel sẽ tự động build và deploy mỗi khi bạn push code.

#### Bước 1: Đăng nhập Vercel

1. Truy cập 👉 [https://vercel.com/](https://vercel.com/)
2. Đăng nhập hoặc tạo tài khoản mới (miễn phí)

#### Bước 2: Import Project

1. Click **Add New...** → **Project**
2. Chọn **Import Git Repository**
3. Kết nối GitHub và chọn repository `netproxy-console-v2`

#### Bước 3: Cấu hình Build Settings

Điền các thông tin sau:

| Mục | Giá trị |
|-----|---------|
| **Framework Preset** | `Vite` |
| **Build Command** | `yarn build` |
| **Output Directory** | `dist` |
| **Install Command** | `yarn install` |

#### Bước 4: Thêm Environment Variables

Click **Environment Variables** và thêm:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://api.prx.network` |
| `VITE_RECAPTCHA_SITE_KEY` | `6LcFazMsAAAAABLqyeCBDfdlW__pIG2pnt_gRZ4N` |

#### Bước 5: Deploy

Click **Deploy** và đợi quá trình hoàn tất.

✅ Website sẽ có URL dạng: `https://netproxy-console-v2.vercel.app`

> **Nhớ:** Sau khi deploy xong, quay lại Seller Portal và thêm URL này vào danh sách domain được phép!

---

## ☁️ Deploy lên Cloudflare Pages

### ⚠️ Bước 0: Đăng ký domain trên Seller Portal (BẮT BUỘC)

> **Quan trọng:** Tương tự như Vercel, bạn cần đăng ký domain trên Seller Portal trước.

1. Truy cập 👉 **[https://seller.prx.network/](https://seller.prx.network/)**
2. Đăng ký/Đăng nhập tài khoản đại lý
3. Vào **Cài đặt** → **Domain** → Thêm domain (ví dụ: `netproxy-console-v2.pages.dev`)

---

### 📌 Phương pháp 1: Kết nối GitHub (Khuyến nghị)

#### Bước 1: Đăng nhập Cloudflare

1. Truy cập 👉 [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Đăng nhập hoặc tạo tài khoản mới (miễn phí)

#### Bước 2: Tạo Pages Project

1. Từ sidebar, chọn **Workers & Pages**
2. Click nút **Create**
3. Chọn tab **Pages**
4. Click **Connect to Git**

#### Bước 3: Kết nối GitHub

1. Click **Connect GitHub**
2. Authorize Cloudflare truy cập GitHub của bạn
3. Chọn repository: `lebachhiep/netproxy-console-v2`
4. Click **Begin setup**

#### Bước 4: Cấu hình Build Settings

Điền các thông tin sau:

| Mục | Giá trị |
|-----|---------|
| **Project name** | `netproxy-console-v2` |
| **Production branch** | `main` |
| **Framework preset** | `React (Vite)` |
| **Build command** | `yarn build` |
| **Build output directory** | `dist` |

#### Bước 5: Thêm Environment Variables

Click **Add variable** và thêm:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://api.prx.network` |
| `VITE_RECAPTCHA_SITE_KEY` | `6LcFazMsAAAAABLqyeCBDfdlW__pIG2pnt_gRZ4N` |

#### Bước 6: Deploy

Click **Save and Deploy** và đợi quá trình hoàn tất.

✅ Website sẽ có URL dạng: `https://netproxy-console-v2.pages.dev`

> **Nhớ:** Sau khi deploy xong, quay lại Seller Portal và thêm URL này vào danh sách domain được phép!

### 📌 Phương pháp 2: Wrangler CLI

Nếu bạn muốn deploy thủ công từ local:

```bash
# Cài đặt Wrangler CLI
npm install -g wrangler

# Đăng nhập Cloudflare
wrangler login

# Build project
yarn build

# Deploy lên Cloudflare Pages
wrangler pages deploy dist --project-name=netproxy-console-v2
```

---

## 🔗 Tích hợp Hệ thống

### Hệ sinh thái NetProxy

```
┌─────────────────────────────────────────────────────────────────┐
│                        NetProxy Ecosystem                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐     ┌─────────────────┐                   │
│   │  Landing Page   │     │  Console V2     │ ◄── Bạn đang ở đây│
│   │  (Index V2)     │     │  (Dashboard)    │                   │
│   │                 │     │                 │                   │
│   │  - Giới thiệu   │     │  - Mua proxy    │                   │
│   │  - Pricing      │     │  - Quản lý ví   │                   │
│   │  - FAQ          │     │  - Lịch sử      │                   │
│   └────────┬────────┘     └────────┬────────┘                   │
│            │                       │                             │
│            └───────────┬───────────┘                             │
│                        │                                         │
│                        ▼                                         │
│            ┌─────────────────────┐                               │
│            │    API Backend      │                               │
│            │  api.prx.network    │                               │
│            └──────────┬──────────┘                               │
│                       │                                          │
│                       ▼                                          │
│            ┌─────────────────────┐                               │
│            │   Seller Portal     │                               │
│            │ seller.prx.network  │                               │
│            │                     │                               │
│            │  - Quản lý đại lý   │                               │
│            │  - Tạo gói proxy    │                               │
│            │  - Thống kê doanh thu│                              │
│            └─────────────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Tùy chỉnh Website

### Thay đổi nội dung đa ngôn ngữ

Chỉnh sửa file JSON trong thư mục `public/locales/[lang]/`:

```
public/locales/
├── vi/translation.json    # Tiếng Việt
├── en/translation.json    # English
├── zh/translation.json    # 中文
└── ...
```

### Thay đổi theme và màu sắc

Chỉnh sửa file `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
      },
    },
  },
}
```

### Thay đổi Logo

Thay thế file `src/logo.svg` bằng logo của bạn.

### Cấu hình API

Chỉnh sửa file `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-key
```

---

## 🛠️ Tech Stack

| Danh mục | Công nghệ |
|----------|-----------|
| **Framework** | React 19.2 |
| **Build Tool** | Vite 6.2 |
| **Ngôn ngữ** | TypeScript 5.8 |
| **Styling** | TailwindCSS 4.0, SASS |
| **State Management** | Zustand 5.0 |
| **Server State** | React Query 5.x |
| **Routing** | React Router DOM 6.2 |
| **Forms** | React Hook Form + Zod |
| **HTTP Client** | Axios |
| **i18n** | i18next |
| **Charts** | Recharts |
| **Animation** | Framer Motion |
| **Icons** | React Icons, Custom SVG |
| **Code Quality** | ESLint, Prettier, Husky, Commitlint |

---

## 📞 Liên hệ & Hỗ trợ

Nếu bạn cần hỗ trợ hoặc có câu hỏi:

| Kênh | Liên kết |
|------|----------|
| 📧 **Email** | ketoan@upgo.io |
| 💬 **Telegram** | [@NetProxy_Support](https://t.me/NetProxy_Support) |
| 🌐 **Seller Portal** | [seller.prx.network](https://seller.prx.network/) |
| 📚 **API Docs** | [api.prx.network/docs](https://api.prx.network/docs) |

---

<div align="center">

**Made with ❤️ by NetProxy Team**

© 2024 NetProxy. All rights reserved.

</div>
