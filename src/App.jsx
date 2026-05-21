import React from 'react';
import BadgeGenerator from './BadgeGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-slate-900 text-white py-4 px-6 shadow-sm mb-6">
        <h1 className="text-lg font-bold tracking-wide text-center">Live Event Live-Action RPG System made by MikeTsak.gr</h1>
      </header>
      <main>
        <BadgeGenerator />
      </main>
      
    </div>
  );
}

export default App;