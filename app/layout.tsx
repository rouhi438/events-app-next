import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../src/context/CartContext";
import { AuthProvider } from "../src/context/AuthContext";
import { OrderProvider } from "../src/context/OrderContext";
import Layout from "../components/layout/page.jsx";
import { SearchProvider } from "../src/context/SearchContext.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AuthProvider>
            <OrderProvider>
              <SearchProvider>
                <Layout>{children}</Layout>
              </SearchProvider>
            </OrderProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
