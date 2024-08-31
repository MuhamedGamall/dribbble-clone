import Footer from "@/components/Footer";
import LoaderWrapper from "@/components/LoaderWrapper";
import Navbar from "@/components/Navbar";
import AuthSessionProvider from "@/components/providers/SessionProvder";
import { getCurrentSession } from "@/lib/actions";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Flexibble",
  description: "Showcase and discover remarkable projects",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = await getCurrentSession();
  return (
    <html lang="en">
      <body className={fontSans.className}>
        <AuthSessionProvider>
          <LoaderWrapper>
            <Navbar  session={session} loading={loading}/>
            <Toaster duration={3000} />
            <main>{children}</main>
            <Footer />
          </LoaderWrapper>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
