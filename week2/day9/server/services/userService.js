class UserService {
    async createUser(userData) {
        return { id: 'mocked-id', ...userData };
    }

    async authenticateUser(email, password) {
        return { token: 'mocked-jwt-token', user: { email } };
    }

    async getUserById(userId) {
        return { id: userId, email: 'mockuser@example.com' };
    }

    async updateUser(userId, updateData) {
        return { id: userId, ...updateData };
    }

    async deleteUser(userId) {
        return { success: true };
    }

    async logout(userId) {
        return { success: true };
    }

    async getAllUsers(filters, options) {
        return { users: [], total: 0 };
    }
}

module.exports = new UserService();
