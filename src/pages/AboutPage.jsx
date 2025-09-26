export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] px-6 py-16 flex flex-col items-center">
      {/* Judul */}
      <h1 className="text-4xl sm:text-5xl font-dancing text-[#6b4226] mb-8">
        Tentang Kami
      </h1>

      {/* Konten */}
      <div className="max-w-4xl flex flex-col md:flex-row items-center gap-10 text-gray-700">
        {/* Gambar */}
        <img
          src="https://source.unsplash.com/500x400/?coffee,cafe"
          alt="Cafe interior"
          className="rounded-2xl shadow-md object-cover w-full md:w-1/2"
        />

        {/* Deskripsi */}
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Selamat datang di <span className="font-semibold">Sisi Kopi</span>,
            tempat di mana aroma kopi menyatu dengan cerita hangat.
          </p>
          <p>
            Kami percaya setiap cangkir kopi punya kisahnya sendiri. Dengan biji
            pilihan dan teknik seduh yang penuh cinta, kami ingin menghadirkan
            rasa otentik untuk menemani momenmu.
          </p>
          <p>
            Misi kami sederhana: menciptakan ruang nyaman, rasa yang tulus,
            serta pelayanan yang ramah untuk setiap pengunjung.
          </p>
        </div>
      </div>
    </div>
  );
}
