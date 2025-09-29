import { toast } from 'react-toastify';

export const projectService = {
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "milestone_c"}},
          {"field": {"Name": "assignee_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "milestone_c"}},
          {"field": {"Name": "assignee_c"}}
        ]
      };

      const response = await apperClient.getRecordById('project_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: projectData.name || projectData.name_c,
          name_c: projectData.name || projectData.name_c,
          description_c: projectData.description || projectData.description_c || "",
          status_c: projectData.status || projectData.status_c || "planning",
          milestone_c: projectData.milestone || projectData.milestone_c || "",
          assignee_c: projectData.assignee && projectData.assignee !== "" ? 
            (typeof projectData.assignee === 'object' ? projectData.assignee.Id : parseInt(projectData.assignee)) : null
        }]
      };

      const response = await apperClient.createRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create project:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create project");
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error.message);
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
        Id: parseInt(id)
      };

      // Map field names and handle lookups
      if (updates.name !== undefined) updateData.name_c = updates.name;
      if (updates.name_c !== undefined) updateData.name_c = updates.name_c;
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
      
      if (updates.status !== undefined) updateData.status_c = updates.status;
      if (updates.status_c !== undefined) updateData.status_c = updates.status_c;
      
      if (updates.milestone !== undefined) updateData.milestone_c = updates.milestone;
      if (updates.milestone_c !== undefined) updateData.milestone_c = updates.milestone_c;

      if (updates.assignee !== undefined) {
        updateData.assignee_c = updates.assignee && updates.assignee !== "" ? 
          (typeof updates.assignee === 'object' ? updates.assignee.Id : parseInt(updates.assignee)) : null;
      }
      if (updates.assignee_c !== undefined) {
        updateData.assignee_c = updates.assignee_c && updates.assignee_c !== "" ? 
          (typeof updates.assignee_c === 'object' ? updates.assignee_c.Id : parseInt(updates.assignee_c)) : null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update project:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update project");
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete project:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete project");
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};