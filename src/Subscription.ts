import { getErroMessage } from "./utils/error";
import { SubscriptionInfo } from "./types/subcripcion-info";
import { ExchangedLicense } from "./types/exchanged-license";
import { UsageInfo } from "./types/usage-info";
import { CaptureEventInfo } from "./types/capture-event";
import { TrialModuleInfo } from "./types/trial-module-info";

export interface SubcriptionSDKI {
  configure({ apiKey }: { apiKey: string }): void;
  incrementUsage({
    section,
  }: {
    section: string;
  }): Promise<{ error: null | string; data: UsageInfo | null }>;
  activateSubscription({
    licenseKey,
  }: {
    licenseKey: string;
  }): Promise<{ error: null | string; data: ExchangedLicense | null }>;
  getSubscriptionInfo(): Promise<{
    error: null | string;
    data: SubscriptionInfo | null;
  }>;

  capture(
    typeKey: string,
    name: string,
    metadata: Record<string, any>,
  ): Promise<{ error: null | string; data: CaptureEventInfo | null }>;

  startTrialModule(
    moduleId: number,
  ): Promise<{ error: null | string; data: TrialModuleInfo | null }>;
}

export class Subscription implements SubcriptionSDKI {
  private apikey: null | string = null;
  private apiUrl =
    "https://aplicaciones.marianosamaniego.edu.ec/gestor-proyectos-negocios/api";

  configure({ apiKey }: { apiKey: string }) {
    this.apikey = apiKey;
  }

  async activateSubscription({ licenseKey }: { licenseKey: string }) {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apikey}`,
        },
        body: JSON.stringify({
          license_key: licenseKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data: data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }

  async getSubscriptionInfo() {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }

      const response = await fetch(`${this.apiUrl}/subscriptions/check`, {
        headers: {
          Authorization: `Bearer ${this.apikey}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data: data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }

  async incrementUsage({ section }: { section: string }): Promise<{
    error: null | string;
    data: UsageInfo | null;
  }> {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }

      const response = await fetch(`${this.apiUrl}/sections/${section}/usage`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data: data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }

  async capture(
    typeKey: string,
    name: string,
    metadata: Record<string, any>,
  ): Promise<{ error: null | string; data: CaptureEventInfo | null }> {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }

      const response = await fetch(`${this.apiUrl}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
        },
        body: JSON.stringify({ type_key: typeKey, name, metadata }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data: data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }

  async startTrialModule(
    moduleId: number,
  ): Promise<{ error: null | string; data: TrialModuleInfo | null }> {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }
      const response = await fetch(
        `${this.apiUrl}/modules/${moduleId}/start-trial`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apikey}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return { error: null, data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }
}
