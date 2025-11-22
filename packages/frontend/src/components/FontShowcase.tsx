// Font Showcase Component - For testing the spooky font theme
// You can temporarily add this to any page to see how fonts look

const FontShowcase = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Headings */}
      <div className="space-y-4">
        <h1 className="font-spooky text-6xl text-black">
          Spooky Resume Builder 👻
        </h1>
        <h2 className="font-spooky text-5xl text-black">
          Welcome Back!
        </h2>
        <h3 className="font-spooky text-4xl text-black">
          Your Dashboard
        </h3>
        <h4 className="font-spooky text-3xl text-black">
          Recent Resumes
        </h4>
      </div>

      {/* Body Text */}
      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          This is body text using Inter font. It's clean, readable, and professional.
          Perfect for long-form content and descriptions.
        </p>
        <p className="text-base text-gray-600">
          Regular paragraph text at 16px. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="text-sm text-gray-500">
          Small text at 14px for captions and secondary information.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button className="btn-primary">
          Generate Resume
        </button>
        <button className="btn-secondary">
          View History
        </button>
        <button className="btn-ghost">
          Cancel
        </button>
      </div>

      {/* Card Example */}
      <div className="card">
        <h3 className="font-spooky text-2xl text-black mb-3">
          Spooky Card Title
        </h3>
        <p className="text-gray-700 mb-4">
          This card combines the spooky Creepster font for headings with clean 
          Inter font for body text. The contrast creates visual interest while 
          maintaining readability.
        </p>
        <button className="btn-primary">
          Learn More
        </button>
      </div>

      {/* Font Comparison */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-spooky text-xl text-black mb-2">
            Creepster Font
          </h4>
          <p className="text-sm text-gray-600">
            Used for headings and titles. Spooky, playful, memorable.
          </p>
        </div>
        <div className="card">
          <h4 className="font-sans text-xl font-bold text-black mb-2">
            Inter Font
          </h4>
          <p className="text-sm text-gray-600">
            Used for body text and UI. Clean, modern, professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontShowcase;
