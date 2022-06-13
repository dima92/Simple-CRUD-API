import { v4 } from 'uuid';

export class Person {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;

  constructor(data: Omit<Person, 'id'>) {
    this.username = data.username;
    this.age = data.age;
    this.hobbies = data.hobbies;
    this.id = v4();
  }
}
