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
      is_maintainer: boolean;
      image_url: string;
      is_trial: boolean;
      start_trial: string;
      limit_days_trial: string;
      end_trial: string;

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
