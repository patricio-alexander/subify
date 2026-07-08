interface SubscriptionInfo {
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
            sections: string[];
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

interface ExchangedLicense {
    id: number;
    app_hash: string;
    plan_price_id: number;
    start_at: string;
    expires_at: string;
    status: "ACTIVE";
    license_key: string;
}

interface SubcriptionSDKI {
    configure({ apiKey }: {
        apiKey: string;
    }): void;
    activateSubscription({ licenseKey, }: {
        licenseKey: string;
    }): Promise<{
        error: null;
        data: ExchangedLicense;
    } | {
        error: string;
        data: null;
    }>;
    getSubscriptionInfo(): Promise<{
        error: null;
        data: SubscriptionInfo;
    } | {
        error: string;
        data: null;
    }>;
}
declare class Subscription implements SubcriptionSDKI {
    private apikey;
    private apiUrl;
    configure({ apiKey }: {
        apiKey: string;
    }): void;
    activateSubscription({ licenseKey }: {
        licenseKey: string;
    }): Promise<{
        error: null;
        data: any;
    } | {
        error: string;
        data: null;
    }>;
    getSubscriptionInfo(): Promise<{
        error: null;
        data: any;
    } | {
        error: string;
        data: null;
    }>;
}

declare const _default: Subscription;

export { _default as default };
