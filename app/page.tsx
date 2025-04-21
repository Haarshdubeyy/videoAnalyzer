import VideoAnalyzer from './components/VideoAnalyzer';

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">YouTube Video Analyzer</h1>
          <p className="text-gray-600">Enter a YouTube URL to get started</p>
        </div>
        <VideoAnalyzer />
      </div>
    </main>
  );
}
