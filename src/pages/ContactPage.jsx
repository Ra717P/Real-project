export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] px-6 py-16 flex flex-col items-center">
      {/* Judul */}
      <h1 className="text-4xl sm:text-5xl font-dancing text-[#6b4226] mb-8">
        Hubungi Kami
      </h1>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10">
        {/* Info Kontak */}
        <div className="space-y-6 text-gray-700 text-lg">
          <p>
            Ingin reservasi, tanya menu, atau sekadar menyapa? Kami selalu
            terbuka untukmu.
          </p>

          <div className="space-y-3">
            <p>
              📍 <span className="font-semibold">Alamat:</span> Jl. Kopi No.
              123, Jakarta
            </p>
            <p>
              📞 <span className="font-semibold">Telepon/WA:</span>{" "}
              0812-3456-7890
            </p>
            <p>
              ✉️ <span className="font-semibold">Email:</span>{" "}
              sisikopi@example.com
            </p>
          </div>

          {/* Sosial Media */}
          <div className="flex gap-6 mt-4">
            <a
              href="#"
              className="hover:text-[#d4a373] transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="#"
              className="hover:text-[#d4a373] transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="#"
              className="hover:text-[#d4a373] transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-64 md:h-auto rounded-2xl overflow-hidden shadow-md">
          <iframe
            title="Lokasi Sisi Kopi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.833294270167!2d106.81666631535406!3d-6.200000095511496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1610000000000!5m2!1sen!2sid"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
