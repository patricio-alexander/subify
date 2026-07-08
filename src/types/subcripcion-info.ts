export interface SubscriptionInfo {
  maintenance: boolean;
  subscribed: boolean;
  subscription: {
    id: number;
    plan_name: string;
    period: "MONTHLY" | "ANNUALLY";
    status: "ACTIVE" | "EXPIRED" | "CANCELED";
    start_at: string;
    expires_at: string;
    modules: {
      id: number;
      name: string;
      sections: {
        id: number;
        key: string;
        name: string;
        max_records_limit: number;
        usage_count: number;
      };
    }[];
    offers: {
      name: string;
      price: number;
      start_at: string;
      expires_at: string;
      modules: {
        id: number;
        name: string;
      }[];
    };
    capabilities: Record<string, boolean>;
  };
}
