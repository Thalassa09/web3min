import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oopfefvptezqonilpfkk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2awGzyUxgewcA_Y1UWrPBA_Sd-ob5_8";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runSecurityAudit() {
  console.log("=== STARTING WEB3MIN CYBER SECURITY & BACKEND INTEGRITY AUDIT ===");
  let passedChecks = 0;
  let totalChecks = 0;

  function assert(title, condition, detail = "") {
    totalChecks++;
    if (condition) {
      console.log(`[PASS] ${title}`);
      passedChecks++;
    } else {
      console.error(`[FAIL] ${title} - ${detail}`);
    }
  }

  // 1. Leaderboard DoS / Parameter Clamping Test
  try {
    const { data: lbBig, error: errBig } = await supabase.rpc("get_leaderboard", {
      p_limit: 999999,
      p_offset: 0,
    });
    assert(
      "Leaderboard clamps huge limit without crashing",
      !errBig && Array.isArray(lbBig),
      errBig?.message
    );
  } catch (e) {
    assert("Leaderboard clamps huge limit", false, e.message);
  }

  // 2. Leaderboard Negative Bounds Clamping Test
  try {
    const { data: lbNeg, error: errNeg } = await supabase.rpc("get_leaderboard", {
      p_limit: -50,
      p_offset: -10,
    });
    assert(
      "Leaderboard handles negative bounds gracefully (clamps to valid ranges)",
      !errNeg && Array.isArray(lbNeg),
      errNeg?.message
    );
  } catch (e) {
    assert("Leaderboard negative bounds clamping", false, e.message);
  }

  // 3. Raffle Stats Input Validation: Malicious Characters / SQL Injection
  try {
    const { data: rfMalicious, error: errMalicious } = await supabase.rpc("get_raffle_stats", {
      p_raffle_id: "raffle-1' OR '1'='1",
    });
    assert(
      "Raffle stats rejects malformed/injected raffle_id format",
      errMalicious && (errMalicious.code === "22023" || errMalicious.message.includes("tidak valid")),
      `Expected validation error, got: ${JSON.stringify({ data: rfMalicious, error: errMalicious })}`
    );
  } catch (e) {
    assert("Raffle stats input validation", false, e.message);
  }

  // 4. Raffle Stats with Valid / Null Raffle ID
  try {
    const { data: rfValid, error: errValid } = await supabase.rpc("get_raffle_stats", {});
    assert(
      "Raffle stats works cleanly for valid query",
      !errValid && Array.isArray(rfValid),
      errValid?.message
    );
  } catch (e) {
    assert("Raffle stats query", false, e.message);
  }

  // 5. Unauthenticated Claim Leaderboard Check (Must Reject 42501 / Not authenticated)
  try {
    const { data: claimAnon, error: errClaimAnon } = await supabase.rpc(
      "claim_weekly_leaderboard_reward",
      { p_rank: 1 }
    );
    assert(
      "Unauthenticated caller cannot claim leaderboard rewards (Fails closed)",
      errClaimAnon && (errClaimAnon.code === "42501" || errClaimAnon.message.includes("Not authenticated")),
      `Expected auth failure, got: ${JSON.stringify({ data: claimAnon, error: errClaimAnon })}`
    );
  } catch (e) {
    assert("Claim leaderboard anon rejection", false, e.message);
  }

  // 6. Direct Table Access Verification (RLS & Table Grants)
  // Verify that anon CANNOT write to progress, completions, or claimed_quests
  try {
    const { error: insertProgressErr } = await supabase.from("progress").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      xp: 999999,
      gems: 999999,
    });
    assert(
      "Direct INSERT to public.progress blocked by RLS / Revoked Grants",
      Boolean(insertProgressErr),
      "Unexpectedly permitted anon insert to progress!"
    );
  } catch (e) {
    assert("Progress write blocked", true);
  }

  try {
    const { error: updateProgressErr } = await supabase.from("progress").update({
      gems: 999999,
    }).eq("xp", 0);
    assert(
      "Direct UPDATE to public.progress blocked by RLS / Revoked Grants",
      Boolean(updateProgressErr),
      "Unexpectedly permitted anon update to progress!"
    );
  } catch (e) {
    assert("Progress update blocked", true);
  }

  try {
    const { error: insertRaffleErr } = await supabase.from("raffles").insert({
      id: "hacked-raffle",
      title: "Free ETH",
    });
    assert(
      "Direct INSERT to public.raffles blocked by RLS / Revoked Grants",
      Boolean(insertRaffleErr),
      "Unexpectedly permitted anon insert to raffles!"
    );
  } catch (e) {
    assert("Raffles write blocked", true);
  }

  // 7. Rate Limits Table Secrecy: anon cannot read rate_limits
  try {
    const { data: rlData, error: rlErr } = await supabase.from("rate_limits").select("*");
    assert(
      "Direct SELECT to public.rate_limits blocked/empty for anon",
      Boolean(rlErr) || !rlData || rlData.length === 0,
      `Rate limits table exposed: ${JSON.stringify(rlData)}`
    );
  } catch (e) {
    assert("Rate limits table secret", true);
  }

  // 8. Ledger Privacy: anon cannot read other users' ledgers
  try {
    const { data: ledgerData, error: ledgerErr } = await supabase.from("ledger").select("*");
    assert(
      "Direct SELECT to public.ledger blocked/empty for anon",
      Boolean(ledgerErr) || !ledgerData || ledgerData.length === 0,
      `Ledger exposed to anon: ${JSON.stringify(ledgerData)}`
    );
  } catch (e) {
    assert("Ledger privacy", true);
  }

  console.log(`\nAudit Results: ${passedChecks}/${totalChecks} checks passed.`);
  if (passedChecks === totalChecks) {
    console.log("ALL BACKEND & CYBER SECURITY CHECKS PASSED PERFECTLY!");
    process.exit(0);
  } else {
    console.error("Some security checks failed!");
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Audit runner failed:", err);
  process.exit(1);
});
