export interface Person {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export interface PersonUpdate {
  id: string;
  username?: string;
  age?: number;
  hobbies?: Array<string>;
}
