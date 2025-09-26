import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fdfbf7] font-sans">
      {/* Tengah */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
        <p className="text-[#d4a373] text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
          Welcome to
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-dancing text-gray-800">
          Sisi Kopi
        </h1>
      </div>

      {/* Bagian bawah */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 lg:px-20 mb-10 gap-6">
        {/* Teks */}
        <div className="text-center sm:text-left">
          <p className="text-gray-800 text-lg sm:text-2xl font-medium">
            Choose your menu
          </p>
          <p className="text-gray-800 text-lg sm:text-2xl font-medium">
            Slide in now!
          </p>
        </div>

        {/* Tombol ke Menu */}
        <Link to="/menu" className="flex justify-center">
          <button
            aria-label="Pergi ke halaman menu"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#e0b882] rounded-full flex items-center justify-center hover:bg-[#d4a373] transition"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
          </button>
        </Link>
      </div>
    </div>
  );
}
