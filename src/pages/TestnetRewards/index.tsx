import React from "react";

const TestnetRewards: React.FC = () => {
  return (
    <div className="bg-default font-default text-default">
      <main className="container mx-auto p-5">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-3">
            Testnet 3 Phase 2
          </h2>
          <p className="text-default mb-3">{/* Text content here */}</p>
          <input
            type="text"
            placeholder="aleo1..."
            className="p-2 border border-gray-300 rounded text-black"
          />
          <button className="btn">Check</button>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-3">Testnet 2</h2>
          <p className="text-default mb-3">{/* Text content here */}</p>
          <input
            type="text"
            placeholder="aleo1..."
            className="p-2 border border-gray-300 rounded text-black"
          />
          <button className="btn">Check</button>
        </section>

        {/* Repeat sections for other testnets or content as needed */}
      </main>

      <footer className="fixed bottom-0 w-full bg-surface top-line">
        <div className="container flex justify-end p-5">
          <a
            href="https://www.ingonyama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <span className="text-sm mr-2">Built with:</span>
            <div className="icon logo-footer-icon w-20 h-6"></div>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default TestnetRewards;
