// src/types/index.ts
export interface Order {
    _id: string;      // Ensure this is defined
    title: string;
    status: string;
    userId: string;   // Include any other relevant properties
}
