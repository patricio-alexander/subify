import { beforeAll, describe, it, expect } from "vitest";
import Subscription from "../../src/";

describe("Intregacion: SDK", () => {
  Subscription.configure({
    apiKey: process.env.TEST_API_KEY!,
  });

  // it("Activa la subscripcion con la licencia con activateSubscription()", async () => {
  //   const subscription = await Subscription.activateSubscription({
  //     licenseKey: "b6dc0994-8e86-49e9-875a-ece9de52bef3",
  //   });
  //   expect(subscription.error).toBeNull();
  //   expect(subscription.data?.status).toBeDefined();
  // });

  // it("Devuelve error si la licencia ha sido revocada o usada con activateSubscription()", async () => {
  //   const subscription = await Subscription.activateSubscription({
  //     licenseKey: "1a3f75b8-681c-4bdc-879e-11d8a1fb2ae6",
  //   });
  //   expect(subscription.error).toBeDefined();
  //   expect(subscription.data).toBeNull();
  // });

  it("comprueba si tiene subscripcion con getSubscriptionInfo()", async () => {
    const subscription = await Subscription.getSubscriptionInfo();
    expect(subscription.error).toBeNull();
    expect(subscription.data?.subscribed).toBeTruthy();
  });

  // it("da inicio a la prueba gratis de x dias con startTrialModule()", async () => {
  //   const subscription = await Subscription.startTrialModule(6);
  //
  //   expect(subscription.error).toBeNull();
  //   expect(subscription.data?.is_started).toBeTruthy();
  // });

  // it("comprueba si tiene subscripcion con getSubscriptionInfo()", async () => {
  //   const subscription = await Subscription.getSubscriptionInfo();
  //   expect(subscription.error).toBeNull();
  //   expect(subscription.data?.subscribed).toBeTruthy();
  // });

  // it("Registra un evento", async () => {
  //   const subscription = await Subscription.capture(
  //     "customer_register",
  //     "Registra usuario",
  //     {
  //       screen: "Pantalla de clientes",
  //     },
  //   );
  //
  //   const subscription2 = await Subscription.capture(
  //     "pdf_export",
  //     "Exportar pdf de productos",
  //     {
  //       screen: "Pantalla de productos",
  //     },
  //   );
  //
  //   expect(subscription.data?.captured).toBeTruthy();
  // });
});
