// src/modules/DataManager.js
export class DataManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.subscribers = new Set();
    }
    
    async fetchData(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, data);
            this.notifySubscribers(endpoint, data);
            
            return data;
        } catch (error) {
            console.error('Data fetch error:', error);
            throw error;
        }
    }
    
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers(endpoint, data) {
        this.subscribers.forEach(callback => callback(endpoint, data));
    }
    
    clearCache() {
        this.cache.clear();
    }
}