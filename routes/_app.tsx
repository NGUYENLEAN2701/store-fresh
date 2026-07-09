import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="GreenGear Store - Bàn phím cơ, Gaming Gear và Mô hình trang trí chính hãng."
        />
        <title>GreenGear Store</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body class="antialiased">
        <Component />
      </body>
    </html>
  );
});
