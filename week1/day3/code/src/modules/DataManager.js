// src/modules/DataManager.js
export class DataManager {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.subscribers = new Set();
    }
    
    async fetchData(endpoint) {

    // simulate network delay
    await new Promise(r => setTimeout(r, 500));

    const mockDB = {
        '/api/users': {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            values: [120,150,180,220,260,300]
        },

        '/api/revenue': {
            labels: ['Jan','Feb','Mar','Apr','May','Jun'],
            values: [2000,2400,3000,3800,4200,5000]
        },

        '/api/orders': {
            labels: ['Pending','Shipped','Delivered','Returned'],
            values: [40,90,120,20]
        }
    };

    const data = mockDB[endpoint];

    if(!data) throw new Error("Mock endpoint not found");

    this.notifySubscribers(endpoint, data);
    return data;
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