import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';

const TerminalConsole: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef(new FitAddon());
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      theme: {
        background: 'transparent',
        foreground: '#e2e8f0', // slate-200
        cursor: '#D4AF37', // yemenGold
        selectionBackground: 'rgba(212, 175, 55, 0.3)',
        black: '#0f172a',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#64748b',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#f472b6',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });
    termInstance.current = term;

    // Load addons
    term.loadAddon(fitAddon.current);
    try {
      const webglAddon = new WebglAddon();
      term.loadAddon(webglAddon);
    } catch (e) {
      console.warn('WebGL addon failed to load, falling back to canvas renderer.', e);
    }
    
    term.open(terminalRef.current);
    fitAddon.current.fit();
    term.focus();

    // Setup WebSocket connection
    const wsUrl = `ws://127.0.0.1:8000/ws/v1/terminal/session`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      term.writeln('\x1b[1;33m[RAIDAN_PRO] Sovereign Terminal Connection Established.\x1b[0m');
      term.writeln('\x1b[1;34mWelcome, Root Administrator. Gemini AI Assistant is available via `ai` command.\x1b[0m');
      term.writeln('');
    };

    socket.current.onmessage = (event) => {
      term.write(event.data);
    };

    socket.current.onclose = () => {
      term.writeln('\n\x1b[1;31m[RAIDAN_PRO] Connection to server lost.\x1b[0m');
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      term.writeln('\n\x1b[1;31m[RAIDAN_PRO] WebSocket connection error.\x1b[0m');
    };

    // Forward user input to WebSocket
    term.onData((data) => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(data);
      }
    });

    // Handle resizing
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.current.fit();
      } catch (e) {
        console.log("Terminal fit error:", e);
      }
    });
    if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
    }

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      socket.current?.close();
      term.dispose();
      termInstance.current = null;
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={terminalRef} className="terminal-container" />
    </div>
  );
};

export default TerminalConsole;
