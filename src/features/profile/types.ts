// src/features/profile/types.ts
export interface Job {
    id?: number;
    jobTitle: string;
    employer: string;
    description?: string;
    startDate: string;
    endDate: string;
    city: string;
  }
  
  export interface Education {
    id?: number;
    school: string;
    degree: string;
    field: string;
    description?: string;
    startDate: string;
    endDate: string;
    city: string;
  }
  
  export interface ProfileFormValues {
    firstname: string;
    lastname: string;
    email: string;
    contactno: string;
    country: string;
    city: string;
    jobs: Job[];
    educations: Education[];
  }
  
  export interface Profile extends ProfileFormValues {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }