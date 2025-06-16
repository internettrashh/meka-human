import { Background } from '@/components/background'

function MekaCityPage() {
  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12 max-w-4xl mx-auto">
          {/* Title */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-4xl sm:text-5xl lg:text-6xl tracking-[2px] lg:tracking-[3px] leading-normal">
              MEKA CITY
            </h1>
            <div 
              className="w-full max-w-[400px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
              style={{ 
                backgroundSize: 'contain',
                filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
              }}
            />
          </div>

          {/* City Description */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <h2 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-2xl sm:text-3xl lg:text-4xl tracking-[1px] lg:tracking-[2px] leading-normal">
              EXPLORE THE METROPOLIS
            </h2>
            <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
              Enter the digital metropolis of MEKA HUMAN. A revolutionary virtual city experience awaits your exploration.
            </p>
          </div>

          {/* Enter Button */}
          <div className="mt-12 sm:mt-14 lg:mt-16">
            <a 
              href="https://arweave.net/usD333oUxSqjRhggrxqLNXHHwFMnsCab1hZJyISChVs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <div className="relative px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-[#fcee0a] to-[#f0dc00] hover:from-[#f0dc00] hover:to-[#fcee0a] rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(252,238,10,0.5)]">
                <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                  <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-black text-lg sm:text-xl lg:text-2xl tracking-[1px] lg:tracking-[2px] leading-normal">
                    ENTER MEKA CITY
                  </span>
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-black transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

        
        </div>
      </div>
    </Background>
  )
}

export default MekaCityPage 