import { Inter } from "next/font/google";
import "./globals.css";
import ButtonBer from "./Components/Shared/ButtonBer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Meet New People",
  description: "Here is a new world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-screen h-screen overflow-hidden">
          {children}
          <ButtonBer />
        </div>
      </body>
    </html>
  );
}