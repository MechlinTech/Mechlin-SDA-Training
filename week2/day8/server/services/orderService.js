class OrderService {
    async initialize() {
        console.log('OrderService initialized');
    }

    // Dummy methods for now
    async getOrders() { return []; }
}

module.exports = new OrderService();
