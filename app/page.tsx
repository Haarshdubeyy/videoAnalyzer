import VideoAnalyzer from './components/VideoAnalyzer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-black">
            YouTube Video Transcript Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Enter a YouTube URL to extract and analyze its transcript
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <VideoAnalyzer />
        </div>
      </div>
    </main>
  );
}
