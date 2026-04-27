export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/20">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          
          {/* Localisation */}
          <div className="group relative">
            <div className="glass-card rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-white force-white">Localisation</h4>
              </div>
              <div className="space-y-2">
                <p className="flex items-start force-white">
                  <span className="mr-2 text-amber-300">📍</span>
                  <span>Centre Urbain Nord, Rue des Affaires</span>
                </p>
                <p className="flex items-start force-white">
                  <span className="mr-2 text-amber-300">🏢</span>
                  <span>Bloc A3, 1082 Tunis, Tunisie</span>
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="group relative">
            <div className="glass-card rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-white force-white">Contactez-nous</h4>
              </div>
              <div className="space-y-3">
                <a href="tel:+21671123456" className="flex items-center hover:text-amber-300 transition-colors duration-200 group/link force-white">
                  <span className="mr-3 text-amber-300">📞</span>
                  <span className="group-hover/link:underline font-medium">+216 71 123 456</span>
                </a>
                <a href="mailto:contact@auto-excellence.tn" className="flex items-center hover:text-amber-300 transition-colors duration-200 group/link force-white">
                  <span className="mr-3 text-amber-300">✉️</span>
                  <span className="group-hover/link:underline break-all font-medium">contact@auto-excellence.tn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div className="group relative">
            <div className="glass-card rounded-2xl p-6 hover:bg-white/25 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-xl text-white force-white">Horaires</h4>
              </div>
              <div className="space-y-2">
                <p className="flex items-center force-white">
                  <span className="mr-2 text-green-300">🕐</span>
                  <span><strong>Lun - Sam:</strong> 08h30 - 18h30</span>
                </p>
                <p className="flex items-center force-white">
                  <span className="mr-2 text-red-300">🚫</span>
                  <span><strong>Dimanche:</strong> Fermé</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur décoratif */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="glass-button px-6 py-2 rounded-full">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Copyright et logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 glass-strong rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl force-white">AE</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold force-white">
                Auto Excellence Showroom
              </p>
              <p className="text-white/70 text-xs mt-1 force-white">Votre partenaire de confiance depuis 2018</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/90 text-sm font-medium force-white">
              &copy; 2024 Auto Excellence Showroom. Tous droits réservés.
            </p>
            <p className="text-white/70 text-xs mt-1 force-white">
              Made with ❤️ in Tunisia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

