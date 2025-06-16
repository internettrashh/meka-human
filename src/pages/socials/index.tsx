import { Background } from '@/components/background'

function SocialsPage() {
  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-12">
          {/* Title */}
          <div className="space-y-6">
            <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-6xl tracking-[3px] leading-normal">
              SOCIALS
            </h1>
            <div 
              className="w-[400px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat mx-auto"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
              }}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h2 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-4xl tracking-[2px] leading-normal">
              CONNECT WITH US
            </h2>
            <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-xl max-w-2xl mx-auto leading-relaxed">
              Follow MEKA HUMAN on social media for latest updates and community interactions.
            </p>
          </div>

          {/* Social Links */}
          <div className="mt-16 p-8 border border-[#646464] rounded-lg bg-black/30 backdrop-blur-sm max-w-md mx-auto">
            <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm text-center mb-6">
              Follow us on social media
            </p>
            <div className="flex justify-center">
              {/* Twitter/X Link */}
              <a 
                href="https://x.com/Meka_Human" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-[#fcee0a] rounded-full transition-all duration-300 hover:scale-110"
              >
                <svg 
                  className="w-6 h-6 text-white group-hover:text-black transition-colors duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            
            {/* Twitter Handle */}
            <div className="mt-6 text-center">
              <p className="[font-family:'Space_Grotesk',Helvetica] font-medium text-[#fcee0a] text-lg">
                @Meka_Human
              </p>
            </div>
          </div>
        </div>
      </div>
    </Background>
  )
}

export default SocialsPage 