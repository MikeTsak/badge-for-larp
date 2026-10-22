import React from 'react';
import BadgeGenerator from './BadgeGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-slate-900 text-white py-4 px-6 shadow-sm mb-6">
        <h1 className="text-lg font-bold tracking-wide text-center">Live Event Live Action RPG System made by MikeTsak.gr</h1>
      </header>
      <main>
        <BadgeGenerator />
      </main>
      <footer className="mt-12 py-6 border-t border-gray-300 text-center text-xs text-gray-600 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <a href="https://agileadvisors.gr/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gray-900 transition-colors">
            <img src="/img/agileadvisors.png" alt="Agile Advisors" className="h-5 w-5 object-contain" />
            <span className="font-semibold">This software is owned by Agile Advisors</span>
          </a>
        </div>
        <p className="text-[11px] text-gray-500">Live Event Badge System by <a href="https://miketsak.gr" target="_blank" rel="noreferrer" className="underline hover:text-gray-700">MikeTsak</a></p>
      </footer>
      
    </div>
  );
}

export default App;