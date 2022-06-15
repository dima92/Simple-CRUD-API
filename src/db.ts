import { UserDTO } from './interface/UserDTO';
import { userSchema } from './utils/schema';
import { Person } from './interface/Person';

export class DB {
  users: Array<Person> = [];

  checkUserData(data: Omit<Person, 'id'>, schema: Map<string, string>) {
    const keys = Array.from(schema.keys()).filter((key) => !data[key]);
    return !!keys.length;
  }

  async getUsers() {
    return this.users;
  }

  async getUser(id: string) {
    const found = await this.users.find((user) => user.id === id);
    return found || null;
  }

  async addUser(payload: Omit<Person, 'id'>) {
    const isValid = this.checkUserData(payload, userSchema);
    if (isValid) {
      return {
        data: null,
        error: 'Request does not contain required fields'
      };
    }
    const newItem = new UserDTO(payload) as Person;
    this.users.push(newItem);
    return {
      data: newItem,
      error: ''
    };
  }

  async updateUser(id: string, data: Partial<Omit<Person, 'id'>>) {
    const found = this.users.findIndex((user) => user.id === id);

    if (found < 0) {
      return {
        data: null,
        error: 'Record does not exist'
      };
    }

    this.users[found] = { ...this.users[found], ...data };

    return {
      user: this.users.find((user) => user.id === id),
      error: ''
    };
  }

  async deleteUser(id: string) {
    const found = !!await this.users.find((user) => user.id === id);
    this.users = this.users.filter((user) => user.id !== id);
    return found;
  }
}

export const db = new DB();
