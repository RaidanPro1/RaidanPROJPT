
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';

const TerminalConsole: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const webglAddonRef = useRef<WebglAddon | null>(null);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      theme: {
        background: 'transparent',
        foreground: '#e2e8f0', 
        cursor: '#D4AF37', 
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
      scrollback: 1000,
    });
    termInstance.current = term;

    const fit = new FitAddon();
    fitAddon.current = fit;
    term.loadAddon(fit);

    try {
      const webgl = new WebglAddon();
      webglAddonRef.current = webgl;
      term.loadAddon(webgl);
    } catch (e) {
      console.warn('WebGL fallback to canvas render.');
    }
    
    term.open(terminalRef.current);
    
    // SAFE DIMENSIONS CHECK
    const safeFit = () => {
        if (!fitAddon.current || !termInstance.current || !terminalRef.current) return;
        try {
            const hasDimensions = terminalRef.current.clientWidth > 0 && terminalRef.current.clientHeight > 0;
            if (hasDimensions && termInstance.current.element) {
                fitAddon.current.fit();
            }
        } catch (e) {
            console.debug('Terminal fit suppressed during transition');
        }
    };

    setTimeout(safeFit, 200);
    term.focus();

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${window.location.host}/api/v1/terminal/session`;
    
    try {
        socket.current = new WebSocket(wsUrl);
        socket.current.onopen = () => {
          term.writeln('\x1b[1;33m[SYSTEM_INIT] Sovereign Shell Established.\x1b[0m');
          term.writeln('\x1b[1;34mKernel: RaidanPro v4.5 | HW_ACCEL: ACTIVE\x1b[0m');
        };
        socket.current.onmessage = (event) => term.write(event.data);
        socket.current.onclose = () => term.writeln('\n\x1b[1;31m[SESSION_END] Kernel signal lost.\x1b[0m');
    } catch (e) {
        term.writeln('\n\x1b[1;31m[ERROR] Deployment Agent Unreachable.\x1b[0m');
    }

    term.onData((data) => {
      if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(data);
    });

    const resizeObserver = new ResizeObserver(() => safeFit());
    if (terminalRef.current) resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      socket.current?.close();
      webglAddonRef.current?.dispose();
      fitAddon.current?.dispose();
      setTimeout(() => term.dispose(), 50);
      termInstance.current = null;
    };
  }, []);

  return (
    <div className="h-full w-full bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-800 overflow-hidden">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
};

export default TerminalConsole;
