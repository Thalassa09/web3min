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
    const usersBig = Array.isArray(lbBig) ? lbBig : lbBig?.users;
    assert(
      "Leaderboard clamps huge limit without crashing",
      !errBig && Array.isArray(usersBig),
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
    const usersNeg = Array.isArray(lbNeg) ? lbNeg : lbNeg?.users;
    assert(
      "Leaderboard handles negative bounds gracefully (clamps to valid ranges)",
      !errNeg && Array.isArray(usersNeg),
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

  // 9. Case Completion Security (Unauthenticated rejection)
  try {
    const { error: unauthCaseErr } = await supabase.rpc("complete_case", { p_case_id: "thedao" });
    assert(
      "complete_case rejects unauthenticated caller with 42501",
      unauthCaseErr && (unauthCaseErr.code === "42501" || unauthCaseErr.message.includes("Not authenticated")),
      unauthCaseErr?.message
    );
  } catch (e) {
    assert("complete_case unauthenticated check", false, e.message);
  }

  // 10. Authenticated Lifecycle & Anti-Cheat Verification
  const testUser = "sectest_" + Math.floor(Math.random() * 90000 + 10000);
  const testEmail = `${testUser}@users.web3min.vercel.app`;
  const testPassword = "SecPassword123!";

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: signUpData, error: signUpErr } = await authClient.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { username: testUser } },
  });

  if (signUpErr || !signUpData?.user) {
    console.error("Failed to sign up temporary test user for auth tests:", signUpErr);
  } else {
    // 10a. Verify Anti-Cheat in Leaderboard Claim: Spoofed rank 1 must NOT get 1000 coins!
    try {
      const { data: claimData } = await authClient.rpc("claim_weekly_leaderboard_reward", {
        p_rank: 1, // Spoofed attempt!
      });
      assert(
        "Anti-Cheat: Server ignores spoofed p_rank: 1 and computes server-authoritative rank",
        claimData && claimData.success && claimData.reward < 1000 && typeof claimData.rank === "number",
        `Expected calculated rank reward, got: ${JSON.stringify(claimData)}`
      );
    } catch (e) {
      assert("Leaderboard anti-cheat test", false, e.message);
    }

    // 10b. Verify complete_case awarding and anti-replay
    try {
      const { data: c1 } = await authClient.rpc("complete_case", { p_case_id: "curve-hack" });
      const { data: c2 } = await authClient.rpc("complete_case", { p_case_id: "curve-hack" });
      assert(
        "complete_case awards 15 XP + 5 gems on first try and 0 XP on replay",
        c1 && c1.xp === 15 && c1.gems === 5 && c1.replay === false &&
        c2 && c2.xp === 0 && c2.gems === 0 && c2.replay === true,
        `c1: ${JSON.stringify(c1)}, c2: ${JSON.stringify(c2)}`
      );
    } catch (e) {
      assert("complete_case replay prevention test", false, e.message);
    }

    // 10b2. Verify complete_case rejects malformed case ID
    try {
      const { data: cBad, error: sqlInjCaseErr } = await authClient.rpc("complete_case", {
        p_case_id: "thedao'; DROP TABLE completions; --",
      });
      assert(
        "complete_case rejects SQL injection / malformed case ID with 22023",
        sqlInjCaseErr && (sqlInjCaseErr.code === "22023" || sqlInjCaseErr.message.includes("tidak valid")),
        `Expected validation error, got: ${JSON.stringify({ data: cBad, error: sqlInjCaseErr })}`
      );
    } catch (e) {
      assert("complete_case SQL injection rejection", false, e.message);
    }

    // 10c. Verify Profile Update Immutable Fields Guard
    try {
      const { error: idTamperErr } = await authClient
        .from("profiles")
        .update({ id: "00000000-0000-0000-0000-000000000001" })
        .eq("id", signUpData.user.id);
      assert(
        "Profile trigger prevents modifying account ID",
        Boolean(idTamperErr),
        "ID modification was unexpectedly allowed!"
      );
    } catch (e) {
      assert("Profile ID protection", true);
    }

    // 10d. Verify Twitter Handle XSS / HTML Injection Guard
    try {
      const { error: twitterXssErr } = await authClient
        .from("profiles")
        .update({ twitter: "<script>alert(1)</script>" })
        .eq("id", signUpData.user.id);
      assert(
        "Profile trigger prevents XSS / invalid characters in Twitter handle",
        Boolean(twitterXssErr) && (twitterXssErr.code === "22023" || twitterXssErr.message.includes("tidak valid")),
        twitterXssErr?.message
      );
    } catch (e) {
      assert("Profile Twitter sanitization", true);
    }
  }

  // 17. Admin Key Verification Security Check
  try {
    const { data: vWrong } = await supabase.rpc("admin_verify_key", { p_key: "invalid-key-attempt" });
    assert(
      "admin_verify_key rejects unauthorized keys",
      vWrong === false,
      "Expected false"
    );
  } catch (e) {
    assert("admin_verify_key rejects unauthorized keys", false, e.message);
  }

  // 18. Admin Upsert Raffle rejects unauthenticated caller
  try {
    const { error: errUpsert } = await supabase.rpc("admin_upsert_raffle", {
      p_key: "attacker-key",
      p_id: "fake-raffle",
      p_title: "Hacked Raffle",
      p_prize: "1000 BTC",
      p_prize_detail: "Exploit attempt"
    });
    assert(
      "admin_upsert_raffle rejects unauthorized key with 42501",
      Boolean(errUpsert) && (errUpsert.code === "42501" || errUpsert.message.includes("Unauthorized")),
      errUpsert?.message
    );
  } catch (e) {
    assert("admin_upsert_raffle rejects unauthorized key", false, e.message);
  }

  // 19. Admin Delete Raffle rejects unauthenticated caller
  try {
    const { error: errDel } = await supabase.rpc("admin_delete_raffle", {
      p_key: "attacker-key",
      p_raffle_id: "raf-genesis-blobi"
    });
    assert(
      "admin_delete_raffle rejects unauthorized key with 42501",
      Boolean(errDel) && (errDel.code === "42501" || errDel.message.includes("Unauthorized")),
      errDel?.message
    );
  } catch (e) {
    assert("admin_delete_raffle rejects unauthorized key", false, e.message);
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
