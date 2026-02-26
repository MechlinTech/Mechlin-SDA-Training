# JavaScript Performance Guide

## Optimization Techniques
- **Debouncing Execution**: 
  - Rapid-fire events like `window.resize` crash frame rates if recalculations occur per-pixel. We utilize a timeout closure (Debounce) to enforce a rate-limit on layout recalculations, maintaining 60 FPS.
- **Passive Event Listeners**: 
  - Adding `{ passive: true }` to `touchstart` and `scroll` bindings tells the modern browser compositor thread that `Event.preventDefault()` will NEVER be called. The browser can immediately paint scrolls without blocking the main JS thread for callbacks.
- **Local Storage Quota Management**: 
  - Browsers enforce strictly limited `localStorage` domains (~5MB). Overstuffing telemetry strings causes catastrophic exceptions. By shifting metrics via `.splice()` and capping at 100 historical logs, we ensure infinite uptimes.

## Memory Management
- **Event Listener Cleanups**: 
  - Detaching explicit generic event handlers is crucial. When a module unmounts or chart changes, lingering event bindings will prevent Garbage Collection (GC).
- **Graceful Degradation (Try/Catch)**: 
  - Modern web profiling endpoints (`PerformanceObserver`) are not universal (e.g., Safari private browsing, or Firefox enterprise limits). Broad `try/catch` checks handle the variance transparently instead of crashing the dashboard loop.
