import { toast } from 'react-toastify';

export const taskService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "project_id_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
      throw error;
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "project_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get max order for new task
      const existingTasks = await this.getAll();
      const maxOrder = existingTasks.length > 0 ? Math.max(...existingTasks.map(task => task.order_c || 0)) : 0;

      const params = {
        records: [{
          Name: taskData.title || taskData.title_c,
          title_c: taskData.title || taskData.title_c,
          description_c: taskData.description || taskData.description_c || "",
          priority_c: taskData.priority || taskData.priority_c || "medium",
          completed_c: false,
          assignee_c: taskData.assignee && taskData.assignee !== "" ? 
            (typeof taskData.assignee === 'object' ? taskData.assignee.Id : parseInt(taskData.assignee)) : null,
          project_id_c: taskData.projectId && taskData.projectId !== "" ? 
            (typeof taskData.projectId === 'object' ? taskData.projectId.Id : parseInt(taskData.projectId)) : null,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          order_c: maxOrder + 1
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create task");
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString()
      };

      // Map field names and handle lookups
      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.title_c !== undefined) updateData.title_c = updates.title_c;
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      
      if (updates.priority !== undefined) updateData.priority_c = updates.priority;
      if (updates.priority_c !== undefined) updateData.priority_c = updates.priority_c;
      
      if (updates.completed !== undefined) updateData.completed_c = updates.completed;
      if (updates.completed_c !== undefined) updateData.completed_c = updates.completed_c;
      
      if (updates.order !== undefined) updateData.order_c = updates.order;
      if (updates.order_c !== undefined) updateData.order_c = updates.order_c;

      if (updates.assignee !== undefined) {
        updateData.assignee_c = updates.assignee && updates.assignee !== "" ? 
          (typeof updates.assignee === 'object' ? updates.assignee.Id : parseInt(updates.assignee)) : null;
      }
      if (updates.assignee_c !== undefined) {
        updateData.assignee_c = updates.assignee_c && updates.assignee_c !== "" ? 
          (typeof updates.assignee_c === 'object' ? updates.assignee_c.Id : parseInt(updates.assignee_c)) : null;
      }

      if (updates.projectId !== undefined) {
        updateData.project_id_c = updates.projectId && updates.projectId !== "" ? 
          (typeof updates.projectId === 'object' ? updates.projectId.Id : parseInt(updates.projectId)) : null;
      }
      if (updates.project_id_c !== undefined) {
        updateData.project_id_c = updates.project_id_c && updates.project_id_c !== "" ? 
          (typeof updates.project_id_c === 'object' ? updates.project_id_c.Id : parseInt(updates.project_id_c)) : null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update task");
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete task");
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async updateOrder(taskIds) {
    try {
      const updates = taskIds.map((id, index) => ({
        Id: parseInt(id),
        order_c: index + 1,
        updated_at_c: new Date().toISOString()
      }));

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: updates
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error updating task order:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getStats() {
    try {
      const tasks = await this.getAll();
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed_c).length;
      const activeTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        total: totalTasks,
        completed: completedTasks,
        active: activeTasks,
        completionRate
      };
    } catch (error) {
      console.error("Error getting task stats:", error?.response?.data?.message || error.message);
      return {
        total: 0,
        completed: 0,
        active: 0,
        completionRate: 0
      };
    }
  }
};