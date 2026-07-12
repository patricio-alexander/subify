// src/utils/error.ts
function getErroMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

// src/Subscription.ts
var Subscription = class {
  apikey = null;
  apiUrl = "https://aplicaciones.marianosamaniego.edu.ec/gestor-proyectos-negocios/api";
  configure({ apiKey }) {
    this.apikey = apiKey;
  }
  async activateSubscription({ licenseKey }) {
    try {
      const response = await fetch(`${this.apiUrl}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apikey}`
        },
        body: JSON.stringify({
          license_key: licenseKey
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data };
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
          Authorization: `Bearer ${this.apikey}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }
  async incrementUsage({ section }) {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }
      const response = await fetch(`${this.apiUrl}/sections/${section}/usage`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.apikey}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }
  async capture(typeKey, name, metadata) {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }
      const response = await fetch(`${this.apiUrl}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`
        },
        body: JSON.stringify({ type_key: typeKey, name, metadata })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return { error: null, data };
    } catch (error) {
      return { error: getErroMessage(error), data: null };
    }
  }
  async startTrialModule(moduleId) {
    try {
      if (!this.apikey) {
        throw new Error("No existe apiKey");
      }
      const response = await fetch(
        `${this.apiUrl}/modules/${moduleId}/start-trial`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apikey}`
          }
        }
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
};

// src/index.ts
var index_default = new Subscription();
export {
  index_default as default
};
//# sourceMappingURL=index.js.map