import { defineEventHandler, setResponseHeaders } from "h3";

export default defineEventHandler(async () => {
  const start = Date.now();

  // Load balancer health probe response
  const payload = {
    status: "healthy",
    service: "web3min-gateway",
    region: process.env.VERCEL_REGION || process.env.REGION || "sin1",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    latencyMs: Date.now() - start,
  };

  return payload;
});
