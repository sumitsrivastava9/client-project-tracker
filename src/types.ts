/** Shape of a user returned by jsonplaceholder.typicode.com/users */
export interface Client {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/** Shape of a post returned by jsonplaceholder.typicode.com/posts */
export interface Project {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/** A project created locally through the New Project form */
export interface LocalProject {
  id: number;
  clientId: number;
  title: string;
  deadline: string;
}
