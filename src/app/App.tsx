import React from 'react';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { RightPanel } from '../components/panels/RightPanel';
import { AddNodeModal } from '../components/graph/AddNodeModal';
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
      {/* Header Bar */}
      <header className="h-14 bg-white border-b border-slate-200 shadow-sm flex items-center px-6 z-10 shrink-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500 tracking-tight">
          DocuFlow
        </h1>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <GraphCanvas />
        <RightPanel />
        <AddNodeModal />
      </div>
    </main>
  );
}

export default App;
