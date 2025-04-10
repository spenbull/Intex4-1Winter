export interface User {
    user_id: number;
    name: string;
    phone?: string;
    email?: string;
    age?: string;
    gender?: string;
    Netflix: boolean;
    AmazonPrime: boolean;
    DisneyPlus: boolean;
    ParamountPlus: boolean;
    Max: boolean;
    Hulu: boolean;
    AppleTVPlus: boolean;
    Peacock: boolean;
    city?: string;
    state?: string;
    zip?: string;
  }