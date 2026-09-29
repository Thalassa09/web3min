import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_TARGET,
  TF_CAP_RATIO,
  allocateQuota,
  createSession,
  isFinished,
  isSessionComplete,
  makeSeed,
  markCorrect,
  markWrong,
  maxTfForSession,
  mulberry32,
  pickSessionItems,
  planQueue,
  pruneSession,
  sanitizeSession,
  seededShuffle,
  spreadReview,
  type QuizItem,
} from "./quiz-ops.ts";

/**
 * Guard mekanik kuis (Fase 2).
 *
 * Kenapa ada: tiga janji di brief tidak bisa dijaga guard gaya mana pun karena
 * semuanya soal urutan kejadian, bukan tampilan — (a) nyawa hanya berkurang pada
 * kesalahan PERTAMA per soal, (b) soal salah diulang SEKALI di akhir antrean,
 * (c) sesi di-resume harus memakai susunan soal yang sama. Ketiganya dites di
 * sini tanpa DOM, tanpa alias `@/`, tanpa env.
 */

const bank = (n: number, type = "choice"): QuizItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `q${i}`, type }));

test("seed sama = urutan sama, seed beda = urutan beda", () => {
  const items = bank(30);
  const a = seededShuffle(items, mulberry32(12345)).map((x) => x.id);
  const b = seededShuffle(items, mulberry32(12345)).map((x) => x.id);
  const c = seededShuffle(items, mulberry32(999)).map((x) => x.id);
  assert.deepEqual(a, b, "seed yang sama wajib menghasilkan urutan yang sama (resume)");
  assert.notDeepEqual(a, c, "seed berbeda harus benar-benar mengacak");
  assert.equal(new Set(a).size, items.length, "pengacakan tidak boleh menghilangkan soal");
});

test("makeSeed menghasilkan bilangan bulat 32-bit yang berbeda", () => {
  const seeds = new Set([makeSeed(1, 0), makeSeed(2, 0), makeSeed(3, 0), makeSeed(4, 0)]);
  assert.equal(seeds.size, 4, "seed harus unik untuk input berbeda");
  for (const s of seeds) {
    assert.ok(Number.isInteger(s) && s >= 0 && s <= 0xffffffff, `seed di luar rentang: ${s}`);
  }
});

test("bank <= N: semua soal dipakai, tidak ada materi yang hilang", () => {
  const pool = bank(5);
  const picked = pickSessionItems(pool, 6, mulberry32(7));
  assert.equal(picked.length, 5, "bank lebih kecil dari target harus dipakai seluruhnya");
  assert.equal(new Set(picked.map((p) => p.id)).size, 5);
});

test("bank > N: tepat N soal, unik, dan tip tidak pernah disampel", () => {
  const pool = [...bank(20, "choice"), { id: "t1", type: "tip" }, { id: "t2", type: "tip" }];
  const scored = pool.filter((p) => p.type !== "tip");
  const picked = pickSessionItems(scored, 8, mulberry32(42));
  assert.equal(picked.length, 8);
  assert.equal(new Set(picked.map((p) => p.id)).size, 8, "tidak boleh ada soal dobel");
});

test("Benar/Salah dibatasi <= 25% per sesi", () => {
  // Bank penuh tf (20) + choice (20): tanpa plafon, komposisi proporsional akan
  // memberi 50% tf.
  const pool = [...bank(20, "tf"), ...bank(20, "choice").map((x) => ({ ...x, id: `c${x.id}` }))];
  for (const seed of [1, 2, 3, 4, 5]) {
    const picked = pickSessionItems(pool, 12, mulberry32(seed));
    const tf = picked.filter((p) => p.type === "tf").length;
    assert.ok(tf <= Math.floor(12 * TF_CAP_RATIO), `seed ${seed}: tf=${tf} melewati plafon 25%`);
    assert.ok(picked.some((p) => p.type === "choice"), "sesi tidak boleh isinya tf semua");
  }
});

test("komposisi tipe tetap seimbang: semua tipe kebagian kuota", () => {
  const pool: QuizItem[] = [
    ...bank(10, "choice"),
    ...bank(6, "tf").map((x) => ({ ...x, id: `t${x.id}` })),
    ...bank(4, "blank").map((x) => ({ ...x, id: `b${x.id}` })),
    ...bank(4, "match").map((x) => ({ ...x, id: `m${x.id}` })),
  ];
  const quota = allocateQuota({ choice: 10, tf: 6, blank: 4, match: 4 }, 10, 2);
  assert.equal(quota.tf, 2, "tf dibatasi plafon");
  assert.equal(Object.values(quota).reduce((a, b) => a + b, 0), 10, "kuota harus pas target");
  assert.ok((quota.blank ?? 0) >= 1 && (quota.match ?? 0) >= 1, "tipe langka tetap kebagian");
  const picked = pickSessionItems(pool, 10, mulberry32(5));
  assert.equal(new Set(picked.map((p) => p.type)).size >= 3, true, "minimal 3 tipe hadir");
});

test("bank isinya tf semua: plafon tidak bisa ditegakkan, sesi tetap jalan", () => {
  const pool = bank(10, "tf");
  const picked = pickSessionItems(pool, 6, mulberry32(3));
  assert.equal(picked.length, 6, "bank tf semua tetap menghasilkan sesi, bukan sesi kosong");
});

test("maxTfForSession: plafon 25% dibulatkan ke bawah", () => {
  assert.equal(maxTfForSession(6), 1);
  assert.equal(maxTfForSession(8), 2);
  assert.equal(maxTfForSession(0), 0);
});

test("salah pertama memakan nyawa, ulangan tidak", () => {
  let session = createSession("u3-l1", ["q1", "q2"], [], 2, 1, 1000);
  const first = markWrong(session, "q1", 1001);
  assert.equal(first.spentHeart, true, "kesalahan pertama per soal harus memakan nyawa");
  assert.equal(first.requeued, true, "soal salah harus diulang di akhir antrean");
  assert.deepEqual(first.session.queue, ["q1", "q2", "q1"], "ulangan ditaruh di akhir");
  session = first.session;

  const second = markWrong(session, "q1", 1002);
  assert.equal(second.spentHeart, false, "salah lagi pada soal yang sama tidak boleh memakan nyawa");
  assert.equal(second.requeued, false, "soal hanya diulang SEKALI, tidak menumpuk");
  assert.deepEqual(second.session.queue, ["q1", "q2", "q1"], "antrean tidak bertambah lagi");
  assert.deepEqual(second.session.wrong, ["q1"], "soal tetap tercatat salah untuk penentuan sempurna");
});

test("antrean ulang tidak bisa dipakai menguras nyawa berkali-kali", () => {
  let session = createSession("u3-l1", ["q1"], [], 1, 1, 0);
  let hearts = 5;
  for (let i = 0; i < 10; i++) {
    const res = markWrong(session, "q1", i);
    if (res.spentHeart) hearts -= 1;
    session = res.session;
  }
  assert.equal(hearts, 4, "sepuluh kali salah pada satu soal hanya boleh memakan 1 nyawa");
  assert.equal(session.queue.length, 2, "antrean hanya bertambah satu ulangan");
});

test("jawab benar setelah salah menyelesaikan soal tanpa mengulang lagi", () => {
  let session = createSession("u3-l1", ["q1", "q2"], [], 2, 1, 0);
  session = markWrong(session, "q1", 1).session;
  session = markCorrect(session, "q1", 2);
  session = markCorrect(session, "q2", 3);
  assert.equal(isSessionComplete(session), true, "semua soal benar = sesi selesai");
  assert.equal(isFinished(session), false, "indeks belum lewat akhir antrean, tapi sesi sudah tuntas");
  assert.deepEqual(session.solved.sort(), ["q1", "q2"]);
});

test("review campuran disisipkan di tengah, bukan di awal atau akhir", () => {
  const ids = planQueue(
    [{ id: "a", type: "choice" }, { id: "b", type: "choice" }, { id: "c", type: "choice" }],
    5,
    [{ id: "r1", type: "choice" }, { id: "r2", type: "tf" }],
    99,
  ).ids;
  assert.equal(ids.length, 5, "N = jumlah soal sesi termasuk soal review");
  assert.ok(!["r1", "r2"].includes(ids[0]), "review tidak boleh jadi soal pertama");
  assert.ok(!["r1", "r2"].includes(ids[ids.length - 1]), "review tidak boleh jadi soal terakhir");
  assert.ok(ids.includes("r1") && ids.includes("r2"));
});

test("tanpa data salah: review dilewati, sesi tetap jalan", () => {
  const plan = planQueue([{ id: "a", type: "choice" }, { id: "b", type: "tf" }], 6, [], 7);
  assert.deepEqual(plan.review, [], "tidak ada data = tidak ada review");
  assert.equal(plan.ids.length, 2, "sesi memakai seluruh bank yang ada");
  assert.deepEqual(spreadReview(["a"], []), ["a"], "spread tanpa review = tidak berubah");
});

test("tip selalu ikut tampil dan urutannya tetap", () => {
  const pool: QuizItem[] = [
    { id: "t1", type: "tip" },
    { id: "q1", type: "choice" },
    { id: "t2", type: "tip" },
    { id: "q2", type: "tf" },
  ];
  const plan = planQueue(pool, 6, [], 3);
  const tips = plan.ids.filter((id) => id.startsWith("t"));
  assert.deepEqual(tips, ["t1", "t2"], "tip tidak boleh hilang atau berpindah urutan");
});

test("sesi yang rusak dibuang, bukan dipakai", () => {
  assert.equal(sanitizeSession(null), null);
  assert.equal(sanitizeSession({ v: 99, lessonId: "u1-l1", queue: ["a"] }), null, "versi beda dibuang");
  assert.equal(sanitizeSession({ v: 1, lessonId: "", queue: ["a"] }), null, "tanpa lessonId dibuang");
  assert.equal(sanitizeSession({ v: 1, lessonId: "u1-l1", queue: [] }), null, "antrean kosong dibuang");
  const ok = sanitizeSession({
    v: 1,
    lessonId: "u1-l1",
    seed: 5,
    queue: ["a", "a", "b"],
    index: 99,
    solved: ["a"],
    wrong: "bukan array",
    total: 2,
  });
  assert.ok(ok, "sesi yang bentuknya benar harus lolos");
  assert.deepEqual(ok.queue, ["a", "b"], "id dobel dibuang");
  assert.equal(ok.index, 2, "indeks dijepit ke panjang antrean");
  assert.deepEqual(ok.wrong, [], "field yang salah tipe jatuh ke nilai aman");
});

test("sesi yang menunjuk soal hilang dipangkas, sisanya tetap jalan", () => {
  const session = createSession("u1-l1", ["a", "b", "c"], ["b"], 3, 1, 0);
  const pruned = pruneSession(session, new Set(["a", "c"]));
  assert.ok(pruned);
  assert.deepEqual(pruned.queue, ["a", "c"], "soal yang tidak ada lagi dibuang");
  assert.deepEqual(pruned.review, [], "review yang hilang ikut dibuang");
  assert.equal(pruneSession(session, new Set()), null, "sesi tanpa soal valid dibuang total");
});

test("DEFAULT_TARGET hanya sasaran, bukan pengubah konten", () => {
  assert.equal(DEFAULT_TARGET.lesson, 6);
  assert.equal(TF_CAP_RATIO, 0.25);
});
