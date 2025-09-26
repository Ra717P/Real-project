export default function Footer() {
  return (
    <footer className="bg-gray-100 shadow-inner mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-700">
        {/* Left */}
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} Sisi Kopi. All rights reserved.
        </p>

        {/* Right */}
        <div className="flex gap-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#d4a373] transition"
          >
            Instagram
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#d4a373] transition"
          >
            Facebook
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#d4a373] transition"
          >
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
}
