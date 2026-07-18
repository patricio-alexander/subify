import { afterEach, describe, expect, it, vi } from "vitest";
import { createRaptorClient } from "../src";

describe("createRaptorClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("requires host and secret", () => {
    expect(() =>
      createRaptorClient({ host: "", secret: "s" }),
    ).toThrow(/host/);
    expect(() =>
      createRaptorClient({ host: "localhost", secret: "" }),
    ).toThrow(/secret/);
  });

  it("POSTs notify payload with Bearer auth", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        ok: true,
        event_id: 42,
        type_key: "order.created",
        event: { id: 42 },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const raptor = createRaptorClient({
      host: "localhost",
      port: 8080,
      secret: "GESTOR_SYNC_SECRET",
    });

    const result = await raptor.notify({
      type_key: "order.created",
      name: "Pedido #1042",
      metadata: { orderId: 1042 },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/raptorsolutions/api/webhooks/app-events",
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer GESTOR_SYNC_SECRET",
      },
      body: JSON.stringify({
        type_key: "order.created",
        name: "Pedido #1042",
        metadata: { orderId: 1042 },
      }),
    },
    );

    expect(result).toEqual({
      ok: true,
      event_id: 42,
      type_key: "order.created",
      event: { id: 42 },
    });
  });

  it("returns ok:false with error on HTTP 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "Failed to persist event" }),
      }),
    );

    const raptor = createRaptorClient({
      host: "webhook.example.com",
      secret: "bad",
      protocol: "https",
    });

    const result = await raptor.notify({
      type_key: "order.create_failed",
      name: "Error",
    });

    expect(result).toEqual({
      ok: false,
      error: "Failed to persist event",
      status: 500,
    });
  });

  it("notifyOk and notifyFail fire-and-forget without awaiting", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        ok: true,
        event_id: 1,
        type_key: "x",
        event: { id: 1 },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const raptor = createRaptorClient({
      host: "127.0.0.1",
      port: "3000",
      secret: "secret",
    });

    raptor.notifyOk("order.created", "Pedido #1042", { orderId: 1042 });
    raptor.notifyFail("order.create_failed", "Error al crear pedido", {
      message: "...",
    });

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "http://127.0.0.1:3000/raptorsolutions/api/webhooks/app-events",
    );
    expect(JSON.parse(fetchMock.mock.calls[1]?.[1].body)).toEqual({
      type_key: "order.create_failed",
      name: "Error al crear pedido",
      metadata: { message: "..." },
    });
  });
});
