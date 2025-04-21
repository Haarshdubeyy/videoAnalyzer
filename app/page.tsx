import VideoAnalyzer from './components/VideoAnalyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <nav className="border-b border-gray-100 bg-white/70 backdrop-blur-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-purple-600">
                Video<span className='bg-purple-600 text-white px-2 py-1 rounded-md'>Summary</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">Sign In</button>
              <button className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 sm:pt-24 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Analyze Videos with AI,{' '}
              <span className="text-purple-600">5X Faster</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Transform any YouTube video into detailed insights. Get summaries, key points, and analysis in seconds.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Video Analyzer Card */}
            <div className="card-modern p-4 sm:p-6 md:p-8">
              <VideoAnalyzer />
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="card-modern p-4 sm:p-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm sm:text-base text-gray-600">Get instant analysis of any YouTube video with our advanced AI.</p>
              </div>

              <div className="card-modern p-4 sm:p-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Accurate Results</h3>
                <p className="text-sm sm:text-base text-gray-600">Powered by state-of-the-art AI models for precise analysis.</p>
              </div>

              <div className="card-modern p-4 sm:p-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Structured Insights</h3>
                <p className="text-sm sm:text-base text-gray-600">Get well-organized summaries and key takeaways.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
