declare module 'next-auth' {
  interface User {
    id: string; // Ensure id is defined
    isAdmin?: boolean; // Optional property
  }

  interface Session {
    user: User; // Ensure user includes the extended User type
  }
}
