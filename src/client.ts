import type {
  NotifyPayload,
  NotifyResult,
  RaptorClient,
  RaptorClientOptions,
} from "./types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function joinUrl(base: string, ...parts: string[]): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const path = parts
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");

  return path ? `${normalizedBase}/${path}` : normalizedBase;
}

const WEBHOOK_PATH = "/raptorsolutions/api/webhooks/app-events";

function buildEventsUrl(options: RaptorClientOptions): string {
  const protocol = options.protocol ?? "http";
  const host = options.host.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const port =
    options.port !== undefined && options.port !== ""
      ? `:${options.port}`
      : "";
  const origin = `${protocol}://${host}${port}`;
  return joinUrl(origin, WEBHOOK_PATH);
}

export function createRaptorClient(
  options: RaptorClientOptions,
): RaptorClient {
  if (!options.host) {
    throw new Error("createRaptorClient: `host` is required");
  }
  if (!options.secret) {
    throw new Error("createRaptorClient: `secret` is required");
  }

  const eventsUrl = buildEventsUrl(options);
  const authorization = `Bearer ${options.secret}`;

  async function notify(payload: NotifyPayload): Promise<NotifyResult> {
    try {
      const response = await fetch(eventsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify({
          type_key: payload.type_key,
          name: payload.name,
          metadata: payload.metadata ?? {},
        }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = (await response.json()) as Record<string, unknown>;
      } catch {
        // Non-JSON responses still map to a failure below when !ok.
      }

      if (!response.ok) {
        return {
          ok: false,
          error:
            typeof data.error === "string"
              ? data.error
              : `Request failed with status ${response.status}`,
          status: response.status,
        };
      }

      return {
        ok: true,
        event_id: data.event_id as string | number,
        type_key:
          typeof data.type_key === "string" ? data.type_key : payload.type_key,
        event: data.event,
      };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error),
        status: null,
      };
    }
  }

  function fireAndForget(payload: NotifyPayload): void {
    void notify(payload);
  }

  return {
    notify,
    notifyOk(type_key, name, metadata) {
      fireAndForget({ type_key, name, metadata });
    },
    notifyFail(type_key, name, metadata) {
      fireAndForget({ type_key, name, metadata });
    },
  };
}
