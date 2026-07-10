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
    modules: { id: number; name: string; sections: string[] }[];
    offers: {
      name: string;
      price: number;
      start_at: string;
      expires_at: string;
      modules: { id: number; name: string }[];
    };
  } | null;
}
```

### `activateSubscription({ licenseKey })`

Activa una suscripción usando un license key.

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
