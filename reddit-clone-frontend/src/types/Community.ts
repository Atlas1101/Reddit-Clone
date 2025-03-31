export type Community = {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    banner?: string;
    createdBy: string; // או אם יש לך טיפוס User - תשתמש בו
    members: string[]; // כנ״ל
    rules?: string[];
    createdAt: string;
    updatedAt?: string;
  };