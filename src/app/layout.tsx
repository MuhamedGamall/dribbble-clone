import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthSessionProvider from "@/components/providers/SessionProvder";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { Toaster } from "sonner";
import LoaderWrapper from "@/components/LoaderWrapper";
const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Flexibble",
  description: "Showcase and discover remarkable developer projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontSans.className}>
        <AuthSessionProvider>
          <LoaderWrapper>
            <Navbar />
            <Toaster duration={3000} />
            <main>{children}</main>
            <Footer />
          </LoaderWrapper>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
