# JavaScript Architecture Guide

## Module System
- ES6 modules with `import`/`export` to cleanly isolate logic, prevent polluting the global window object, and manage dependencies explicitly.
- **Single Responsibility Principle**:
  - `DataManager`: Exclusively manages network logic, fetch states, AbortControllers, and Cache invalidation. It has no DOM awareness.
  - `ChartManager`: Orchestrates Canvas mounting, Chart.js lifecycle management, and UI reactivity tracking. It depends on `DataManager` to provide JSON.
  - `PerformanceMonitor`: Hooks into raw browser heuristics to record runtime telemetry without muddying feature logic.

## Design Patterns
- **Observer/PubSub**: 
  - `DataManager.subscribe(callback)` allows `ChartManager` and any future UI panel to listen for network state drops safely. 
  - `PerformanceMonitor.subscribe(callback)` emits metrics to UI panels without being hardcoded to HTML IDs.
- **Singleton Execution**: 
  - By instantiating `new DataManager()` once inside `app.js` and passing it to dependencies, we guarantee a single source of truth for caching.

## Performance Optimization
- **Data Caching / Time-to-Live (TTL)**: 
  - Prevents repetitive network hits when data is fresh.
- **AbortController / Edge Cancellation**: 
  - Ensures we do not process outdated HTTP promises or overlapping requests from eager users.
- **Canvas Lifecycle Management**: 
  - Rebuilding charts natively onto existing canvases without wiping leaves ghost contexts and leaks memory. Calling `.destroy()` intercepts this.
