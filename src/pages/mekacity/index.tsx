import { Background } from '@/components/background'

function MekaCityPage() {
  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-12">
          {/* Title */}
          <div className="space-y-6">
            <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-6xl tracking-[3px] leading-normal">
              MEKA CITY
            </h1>
            <div 
              className="w-[400px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat mx-auto"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
              }}
            />
          </div>

          {/* City Description */}
          <div className="space-y-6">
            <h2 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-4xl tracking-[2px] leading-normal">
              EXPLORE THE METROPOLIS
            </h2>
            <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-xl max-w-2xl mx-auto leading-relaxed">
              Enter the digital metropolis of MEKA HUMAN. A revolutionary virtual city experience awaits your exploration.
            </p>
          </div>

          {/* Enter Button */}
          <div className="mt-16">
            <a 
              href="https://arweave.net/usD333oUxSqjRhggrxqLNXHHwFMnsCab1hZJyISChVs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <div className="relative px-12 py-6 bg-gradient-to-r from-[#fcee0a] to-[#f0dc00] hover:from-[#f0dc00] hover:to-[#fcee0a] rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(252,238,10,0.5)]">
                <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-black text-2xl tracking-[2px] leading-normal">
                    ENTER MEKA CITY
                  </span>
                  <svg 
                    className="w-6 h-6 text-black transition-transform duration-300 group-hover:translate-x-1" 
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