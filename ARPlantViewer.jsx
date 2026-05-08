import React, { useEffect, useState } from 'react';

const ARPlantViewer = ({
  plantName = "Monstera Deliciosa",
  price = "₹599",
  glbModelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Replace with actual plant .glb
  usdzModelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.usdz", // Replace with actual plant .usdz
  fallbackImageUrl = "https://placehold.co/400x400/e2e8f0/1e293b?text=Plant+Loading"
}) => {
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const modelRef = React.useRef(null);

  useEffect(() => {
    // Dynamically inject the model-viewer script if it doesn't exist.
    // This prevents SSR errors in frameworks like Next.js and keeps the widget self-contained.
    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      script.onload = () => setIsModelViewerLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsModelViewerLoaded(true);
    }
  }, []);

  useEffect(() => {
    const model = modelRef.current;
    if (model) {
      const handleLoad = () => setIsModelLoaded(true);
      const handleError = () => setIsModelLoaded(true); // Stop loading spinner on error too

      model.addEventListener('load', handleLoad);
      model.addEventListener('error', handleError);

      return () => {
        model.removeEventListener('load', handleLoad);
        model.removeEventListener('error', handleError);
      };
    }
  }, [isModelViewerLoaded]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col relative font-sans">
      {/* Header Info */}
      <div className="p-4 border-b border-gray-50 flex justify-between items-center z-10 bg-white">
        <h3 className="text-xl font-bold text-gray-900 font-serif">{plantName}</h3>
        <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">{price}</span>
      </div>

      {/* 3D Viewer Container */}
      <div className="relative w-full aspect-square bg-slate-50">

        {/* Loading Skeleton */}
        {!isModelLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <span className="text-sm font-medium text-slate-500 animate-pulse">Loading 3D Model...</span>
          </div>
        )}

        {/* Model Viewer */}
        {isModelViewerLoaded && (
          <model-viewer
            src={glbModelUrl}
            ios-src={usdzModelUrl}
            poster={fallbackImageUrl}
            alt={`A 3D model of ${plantName}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            class="w-full h-full outline-none"
            ref={modelRef}
            style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }}
          >
            {/* Custom AR Button */}
            <button
              slot="ar-button"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2 transition-transform active:scale-95 animate-pulse z-20 whitespace-nowrap border border-emerald-500"
            >
              <span className="text-lg leading-none">🌿</span> View in your room
            </button>
          </model-viewer>
        )}
      </div>
    </div>
  );
};

export default ARPlantViewer;
