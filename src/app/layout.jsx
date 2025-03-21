import { Inter } from "next/font/google";
import "./globals.css";
import { FileJson } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevUtils - Developer Tools",
  description: "A collection of useful tools for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <FileJson className="h-8 w-8 text-indigo-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      DevUtils
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
