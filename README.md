# subify

SDK para interactuar con la API de gestor de proyectos.

## Instalación

```bash
npm install git+ssh://git@github.com:patricio-alexander/subify.git
```

## Uso

```ts
import Subify from "subify";

Subify.configure({ apiKey: "tu-api-key" });

const subscription = await Subify.getSubscriptionInfo();
if (subscription.error) {
  console.error(subscription.error);
} else {
  console.log(subscription.data);
}

const result = await Subify.activateSubscription({
  licenseKey: "XXXX-XXXX-XXXX",
});
```

## Ejemplo con React + Custom Hook

```jsx
// App.jsx — configurar al inicio
import Subify from "subify";
Subify.configure({ apiKey: import.meta.env.VITE_SUBSCRIPTION_API_KEY });

// hooks/useSubscription.js
import { useState, useEffect } from "react";
import Subify from "subify";

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Subify.getSubscriptionInfo()
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setSubscription(res.data);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { subscription, loading, error };
}

// pages/Dashboard.jsx
import { useSubscription } from "../hooks/useSubscription";

export default function Dashboard() {
  const { subscription, loading, error } = useSubscription();

  if (loading) return <p>Verificando suscripción...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!subscription?.subscribed) return <p>Sin suscripción activa</p>;

  return <p>Plan: {subscription.subscription.plan_name}</p>;
}
```

## API

### `configure({ apiKey })`

Configura la API key para las peticiones.

### `getSubscriptionInfo()`

Obtiene la información de la suscripción activa.

```ts
interface SubscriptionInfo {
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
        is_trial: boolean;
        start_trial: string;
        limit_days_trial: string;
        end_trial: string;
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
  } | null;
}
```

### `activateSubscription({ licenseKey })`

Activa una suscripción usando un license key.

### `startTrialModule(moduleId)`

Inicia el periodo de prueba de un módulo.

```ts
interface TrialModuleInfo {
  start_trial: string;
  end_trial: string;
  is_started: boolean;
}
```

```ts
const result = await Subify.startTrialModule(1);

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data.is_started); // true
}
```

### `capture(typeKey, name, metadata)`

Registra un evento en la plataforma.

```ts
interface CaptureEventInfo {
  type: string;
  captured: boolean;
}
```

```ts
const result = await Subscription.capture(
  "customer_register",
  "Registra usuario",
  { screen: "Pantalla de clientes" },
);

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data.captured); // true
}
```

### `getPlans()`

Obtiene los planes disponibles con sus precios y módulos.

```ts
interface Price {
  prices: number;
  period: "MONTHLY" | "ANNUALLY";
}

interface Module {
  name: string;
  description: string;
}

interface PlanInfo {
  name: string;
  prices: Price[];
  modules: Module[] | null;
}
```

```ts
const result = await Subify.getPlans();

if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data.name);       // "Plan Básico"
  console.log(result.data.prices);     // [{ prices: 9.99, period: "MONTHLY" }, ...]
  console.log(result.data.modules);    // [{ name: "Módulo X", description: "..." }, ...]
}
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `TEST_API_KEY` | API key para tests de integración |


## Scripts

| Comando | Descripción |
|---|---|
| `npm run build` | Compila el SDK con tsup |
| `npm test` | Ejecuta tests con Vitest |

## Tests

```bash
npm test
```

Requiere la variable `TEST_API_KEY` configurada en el entorno.
