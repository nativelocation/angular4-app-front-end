export class Task {
  constructor(
    public _id?: string,
    public name: string = '',
    public description: string = '',
    public instructions: string = '',
    public imageId?: string,
    public userId?: string,
    public workId?: string,
    public deleted?: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static fromJSON({ _id, name, description, instructions, imageId, userId, workId, deleted, createdAt, updatedAt }) {
    return new Task(_id, name, description, instructions, imageId, userId, workId, deleted, createdAt, updatedAt);
  }

  static fromJSONArray(json: any[]): Task[] {
    return json.map(Task.fromJSON);
  }
}


