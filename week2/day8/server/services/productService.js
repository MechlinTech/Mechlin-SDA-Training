class ProductService {
    async initialize() {
        console.log('ProductService initialized');
    }

    // Dummy methods for now
    async getProducts() { return []; }
}

module.exports = new ProductService();
