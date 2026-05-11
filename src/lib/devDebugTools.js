const MAX_BUFFER = 1000;
const TOOLBAR_STORAGE_KEY = "hush:debug-toolbar-pos";

function timestamp() {
  return new Date().toISOString().slice(11, 23);
}

function serializeLogValue(value, depth = 0) {
  if (depth > 4) return "[...]";
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (value instanceof Error) {
    const parts = [value.name || "Error", value.message];
    if (value.stack) parts.push(`\n${value.stack}`);
    for (const key of Object.getOwnPropertyNames(value)) {
      if (!["name", "message", "stack"].includes(key)) {
        try {
          parts.push(`  ${key}: ${serializeLogValue(value[key], depth + 1)}`);
        } catch {
          parts.push(`  ${key}: [unserializable]`);
        }
      }
    }
    return parts.join(" | ");
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeLogValue(item, depth + 1)).join(", ")}]`;
  }

  if (typeof value === "object") {
    try {
      const keys = Object.keys(value);
      if (keys.length === 0) return "{}";
      return `{ ${keys.map((key) => {
        try {
          return `${key}: ${serializeLogValue(value[key], depth + 1)}`;
        } catch {
          return `${key}: [unserializable]`;
        }
      }).join(", ")} }`;
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function installConsoleBuffer(logBuffer) {
  for (const level of ["log", "warn", "error", "info", "debug"]) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      const line = `[${timestamp()}] [${level.toUpperCase()}] ${args
        .map((arg) => serializeLogValue(arg))
        .join(" ")}`;
      logBuffer.push(line);
      if (logBuffer.length > MAX_BUFFER) logBuffer.shift();
      original(...args);
    };
  }

  window.addEventListener("error", (event) => {
    logBuffer.push(
      `[${timestamp()}] [UNCAUGHT] ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
    );
  });
  window.addEventListener("unhandledrejection", (event) => {
    logBuffer.push(`[${timestamp()}] [UNHANDLED_REJECTION] ${serializeLogValue(event.reason)}`);
  });
}

function installGlobalDebugActions(logBuffer) {
  window.__copyConsole = async () => {
    const text = logBuffer.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert(`Copied ${logBuffer.length} log entries`);
    } catch {
      prompt("Copy all:", text);
    }
  };

  window.__clearBrowser = async () => {
    try {
      const databases = await indexedDB.databases();
      databases.forEach((db) => indexedDB.deleteDatabase(db.name));
    } catch {
      // Older browsers do not expose indexedDB.databases().
    }
    sessionStorage.clear();
    localStorage.clear();
    alert("Cleared. Reloading...");
    location.reload();
  };
}

function createToolbarButton(label, isDraggingRef, didDragRef, handler) {
  const button = document.createElement("button");
  button.textContent = label;
  Object.assign(button.style, {
    padding: "6px 10px",
    fontSize: "11px",
    fontFamily: "monospace",
    background: "transparent",
    color: "var(--muted-foreground)",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    touchAction: "manipulation",
  });
  button.addEventListener("pointerdown", (event) => event.stopPropagation());
  button.addEventListener("pointerup", (event) => {
    event.stopPropagation();
    if (!isDraggingRef.current && !didDragRef.current) handler();
  });
  button.addEventListener("mouseenter", () => {
    button.style.color = "var(--foreground)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.color = "var(--muted-foreground)";
  });
  return button;
}

function installToolbar() {
  document.addEventListener("DOMContentLoaded", () => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem(TOOLBAR_STORAGE_KEY));
      } catch {
        return null;
      }
    })();

    const bar = document.createElement("div");
    Object.assign(bar.style, {
      position: "fixed",
      left: saved?.x != null ? `${saved.x}px` : "4px",
      top: saved?.y != null ? `${saved.y}px` : "auto",
      bottom: saved?.y != null ? "auto" : "70px",
      zIndex: "99999",
      display: "flex",
      gap: "4px",
      opacity: "0.55",
      padding: "4px 6px",
      background: "var(--popover)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      cursor: "grab",
      userSelect: "none",
      touchAction: "none",
    });

    const isDraggingRef = { current: false };
    const didDragRef = { current: false };
    let dragOffset = { x: 0, y: 0 };

    bar.addEventListener("mouseenter", () => {
      bar.style.opacity = "1";
    });
    bar.addEventListener("mouseleave", () => {
      if (!isDraggingRef.current) bar.style.opacity = "0.55";
    });

    bar.addEventListener("pointerdown", (event) => {
      if (event.target?.tagName === "BUTTON") return;
      isDraggingRef.current = true;
      didDragRef.current = false;
      const rect = bar.getBoundingClientRect();
      dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      bar.style.cursor = "grabbing";
      bar.style.opacity = "1";
      bar.setPointerCapture(event.pointerId);
    });

    bar.addEventListener("pointermove", (event) => {
      if (!isDraggingRef.current) return;
      didDragRef.current = true;
      const x = Math.max(0, Math.min(event.clientX - dragOffset.x, window.innerWidth - bar.offsetWidth));
      const y = Math.max(0, Math.min(event.clientY - dragOffset.y, window.innerHeight - bar.offsetHeight));
      bar.style.left = `${x}px`;
      bar.style.top = `${y}px`;
      bar.style.bottom = "auto";
    });

    bar.addEventListener("pointerup", () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      bar.style.cursor = "grab";
      bar.style.opacity = "0.55";
      try {
        localStorage.setItem(TOOLBAR_STORAGE_KEY, JSON.stringify({
          x: parseInt(bar.style.left, 10),
          y: parseInt(bar.style.top, 10),
        }));
      } catch {
        // Ignore storage quota / private-mode failures.
      }
    });

    const grip = document.createElement("span");
    grip.textContent = "\u2630";
    Object.assign(grip.style, {
      fontSize: "11px",
      color: "var(--muted-foreground)",
      marginRight: "2px",
    });

    bar.appendChild(grip);
    bar.appendChild(createToolbarButton("Copy Log", isDraggingRef, didDragRef, () => window.__copyConsole()));
    bar.appendChild(createToolbarButton("Wipe & Reload", isDraggingRef, didDragRef, () => window.__clearBrowser()));
    document.body.appendChild(bar);
  });
}

export async function installDevDebugTools({ enableToolbar, enableEruda }) {
  const logBuffer = [];
  installConsoleBuffer(logBuffer);
  installGlobalDebugActions(logBuffer);
  if (enableToolbar) installToolbar();
  if (enableEruda) {
    const { default: eruda } = await import("eruda");
    eruda.init();
  }
}
