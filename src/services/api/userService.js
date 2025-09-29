import { toast } from 'react-toastify';

export const userService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('user_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByName(name) {
    try {
      const users = await this.getAll();
      const user = users.find(user => user.name_c === name || user.Name === name);
      return user || null;
    } catch (error) {
      console.error("Error finding user by name:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}}
        ]
      };

      const response = await apperClient.getRecordById('user_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }
};