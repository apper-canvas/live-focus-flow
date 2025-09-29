// User service for managing assignee lookup data
import { toast } from 'react-toastify';

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  { Id: 1, name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Project Manager" },
  { Id: 2, name: "Mike Chen", email: "mike.chen@company.com", role: "Developer" },
  { Id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@company.com", role: "Designer" },
  { Id: 4, name: "David Kim", email: "david.kim@company.com", role: "QA Engineer" },
  { Id: 5, name: "Lisa Wang", email: "lisa.wang@company.com", role: "Business Analyst" },
  { Id: 6, name: "Alex Thompson", email: "alex.thompson@company.com", role: "Developer" },
  { Id: 7, name: "Maria Garcia", email: "maria.garcia@company.com", role: "Product Manager" },
  { Id: 8, name: "James Wilson", email: "james.wilson@company.com", role: "Tech Lead" }
];

// Simulate API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const userService = {
  async getAll() {
    await delay(200);
    return [...mockUsers];
  },

  async getByName(name) {
    await delay(100);
    const user = mockUsers.find(user => user.name === name);
    return user || null;
  }
};