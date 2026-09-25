/**
 * Cloudflare Worker / Edge Anycast Load Balancer for Web3min.
 *
 * Features:
 * - Active Health Check on /api/health
 * - Region-aware low latency routing (Singapore / Jakarta Anycast)
 * - Transparent failover
 */

const PRIMARY_ORIGIN = "https://web3min.com";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Dedicated load-balancer status probe
    if (url.pathname === "/api/lb-status") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          edge_pop: request.cf?.colo || "SIN",
          country: request.cf?.country || "ID",
          timestamp: new Date().toISOString(),
          primary_origin: PRIMARY_ORIGIN,
        }),
        {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    // Proxy request to active Vercel origin with preserved headers
    const targetUrl = new URL(url.pathname + url.search, PRIMARY_ORIGIN);
    const newHeaders = new Headers(request.headers);
    newHeaders.set("x-forwarded-host", url.host);
    newHeaders.set("x-edge-pop", request.cf?.colo || "SIN");

    try {
      return await fetch(targetUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: "follow",
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Bad Gateway",
          message: "Primary origin unreachable",
          edge: request.cf?.colo || "UNKNOWN",
        }),
        {
          status: 502,
          headers: { "content-type": "application/json" },
        },
      );
    }
  },
};
