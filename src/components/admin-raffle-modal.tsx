import * as React from "react";
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Plus,
  Edit3,
  Award,
  Crown,
  Tag,
  Clock,
  Coins,
  Ticket,
  Check,
  AtSign,
  Globe,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { rpcAdminVerifyKey, rpcAdminUpsertRaffle, rpcAdminDeleteRaffle } from "@/lib/server-sync";

export type AdminRaffleData = {
  id: string;
  title: string;
  prize?: string;
  prizeDetail?: string;
  category: "nft" | "gems" | "outfit" | "badge" | "tickets";
  status: "live" | "verifying" | "ended" | "upcoming" | "drawn";
  endsAt: string; // ISO string or datetime-local
  ticketCost: number;
  winnerCount: number;
  imageUrl?: string;
  nftNetwork?: string;
  nftContract?: string;
  nftTokenId?: string;
  nftRarity?: "mythic" | "legendary" | "rare" | "utility";
  perks?: string[];
  slotType?: "GTD" | "WL" | "GROUP" | "ITEM" | null;
  partnerName?: string | null;
  requirementXHandle?: string | null;
  officialMintDomain?: string | null;
  mintPrice?: string | null;
  mintSchedule?: string | null;
  announcementDate?: string | null;
  itemId?: string | null;
  discordGroupLink?: string | null;
};

export const LIMITED_ITEMS_OPTIONS = [
  { id: "crown", name: "Mahkota Emas Blobi (Outfit)", kind: "outfit", total: 5, src: "/mascot/acc/crown.png" },
  { id: "badge-pioneer", name: "Lencana Kehormatan 'Pioneer Web3' (Badge)", kind: "badge", total: 10, src: "/props/shield.png" },
  { id: "star", name: "Bintang Genggam Blobi (Outfit)", kind: "outfit", total: 10, src: "/mascot/acc/star.png" },
  { id: "batik", name: "Selendang Batik Blobi (Outfit)", kind: "outfit", total: 15, src: "/mascot/acc/batik.png" },
  { id: "visor", name: "Visor Blobi (Outfit)", kind: "outfit", total: 10, src: "/mascot/acc/visor.png" },
  { id: "medal", name: "Medali Laga Blobi (Outfit)", kind: "outfit", total: 20, src: "/mascot/acc/medal.png" },
];

export const RAFFLE_IMAGE_PRESETS = [
  {
    name: "RoboHood GTD Official",
    url: "/raffles/robohood-gtd.png",
    category: "nft" as const,
  },
  {
    name: "Mahkota Emas Blobi",
    url: "/mascot/acc/crown.png",
    category: "outfit" as const,
  },
  {
    name: "Lencana Kehormatan Pioneer",
    url: "/props/shield.png",
    category: "badge" as const,
  },
  {
    name: "Maskot Blobi Utama",
    url: "/mascot/proud.png",
    category: "nft" as const,
  },
];

// ----------------------------------------------------------------------
// ADMIN LOGIN AUTH MODAL (STANDALONE DIALOG)
// ----------------------------------------------------------------------
export function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (key: string) => void;
}) {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Kunci admin wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const isValid = await rpcAdminVerifyKey(password.trim());
      if (isValid) {
        const key = password.trim();
        sessionStorage.setItem(
          "web3min_admin_auth",
          JSON.stringify({
            key,
            authAt: Date.now(),
          })
        );
        onSuccess(key);
        onClose();
      } else {
        setErrorMsg("Kunci admin salah! Akses ditolak.");
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Gagal memverifikasi kunci admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
          aria-label="Tutup"
        >
          <X className="size-4.5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-2xl bg-amber-400 border-2 border-choco-900 flex items-center justify-center shadow-[0_3px_0_#3B2218]">
            <Lock className="size-6 text-choco-900" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-choco-900 font-pixel text-[9px] font-bold uppercase text-amber-800">
              Otoritas Terbatas
            </span>
            <h3 className="font-pixel text-lg font-bold text-choco-900 leading-tight mt-0.5">
              Login Admin Undian
            </h3>
          </div>
        </div>

        <p className="text-xs font-semibold text-choco-700 mb-4 leading-relaxed">
          Masukkan Kunci Rahasia Admin untuk mengelola katalog Undian Hadiah Web3min.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-pixel font-bold uppercase text-choco-800 mb-1.5">
              Kunci Rahasia Admin
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="web3min-secret-..."
                autoFocus
                className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border-2 border-choco-900 text-choco-900 font-mono text-sm placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-choco-500 hover:text-choco-900 p-1 cursor-pointer"
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <Shield className="size-4" />
                  <span>Masuk Sebagai Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADMIN RAFFLE FORM MODAL (TAMBAH / EDIT)
// ----------------------------------------------------------------------
export function AdminRaffleModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
  adminKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: AdminRaffleData | null;
  adminKey: string;
}) {
  const isEditing = Boolean(initialData?.id);

  const [id, setId] = React.useState(initialData?.id || "");
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slotType, setSlotType] = React.useState<"GTD" | "WL" | "GROUP" | "ITEM" | "">(
    initialData?.slotType || ""
  );
  const [partnerName, setPartnerName] = React.useState(initialData?.partnerName || "");
  const [requirementXHandle, setRequirementXHandle] = React.useState(
    initialData?.requirementXHandle || ""
  );
  const [officialMintDomain, setOfficialMintDomain] = React.useState(
    initialData?.officialMintDomain || ""
  );
  const [mintPrice, setMintPrice] = React.useState(initialData?.mintPrice || "");
  const [mintSchedule, setMintSchedule] = React.useState(initialData?.mintSchedule || "");
  const [announcementDate, setAnnouncementDate] = React.useState(
    initialData?.announcementDate || ""
  );
  const [itemId, setItemId] = React.useState(initialData?.itemId || "");

  const [prize, setPrize] = React.useState(initialData?.prize || "");
  const [prizeDetail, setPrizeDetail] = React.useState(initialData?.prizeDetail || "");
  const [category, setCategory] = React.useState<AdminRaffleData["category"]>(
    initialData?.category || "nft"
  );
  const [status, setStatus] = React.useState<AdminRaffleData["status"]>(
    initialData?.status || "live"
  );
  const [ticketCost, setTicketCost] = React.useState<number>(initialData?.ticketCost || 1);
  const [winnerCount, setWinnerCount] = React.useState<number>(initialData?.winnerCount || 1);
  const [endsAt, setEndsAt] = React.useState<string>(() => {
    if (initialData?.endsAt) {
      const d = new Date(initialData.endsAt);
      return !isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : "";
    }
    return "";
  });

  const [perksText, setPerksText] = React.useState(
    initialData?.perks ? initialData.perks.join(", ") : ""
  );

  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl || "");
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Escape key handler
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  // Synchronize on open / initialData change
  React.useEffect(() => {
    if (initialData) {
      setId(initialData.id || "");
      setTitle(initialData.title || "");
      setSlotType(initialData.slotType || "");
      setPartnerName(initialData.partnerName || "");
      setRequirementXHandle(initialData.requirementXHandle || "");
      setOfficialMintDomain(initialData.officialMintDomain || "");
      setMintPrice(initialData.mintPrice || "");
      setMintSchedule(initialData.mintSchedule || "");
      setAnnouncementDate(initialData.announcementDate || "");
      setItemId(initialData.itemId || "");

      setPrize(initialData.prize || "");
      setPrizeDetail(initialData.prizeDetail || "");
      setCategory(initialData.category || "nft");
      setStatus(initialData.status || "live");
      setTicketCost(initialData.ticketCost || 1);
      setWinnerCount(initialData.winnerCount || 1);
      if (initialData.endsAt) {
        const d = new Date(initialData.endsAt);
        setEndsAt(!isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : "");
      } else {
        setEndsAt("");
      }
      setPerksText(initialData.perks ? initialData.perks.join(", ") : "");
      setImageUrl(initialData.imageUrl || "");
    } else {
      setId(`raf-${Date.now().toString(36)}`);
      setTitle("");
      setSlotType("GTD");
      setPartnerName("");
      setRequirementXHandle("");
      setOfficialMintDomain("");
      setMintPrice("");
      setMintSchedule("");
      setAnnouncementDate("");
      setItemId("");

      setPrize("");
      setPrizeDetail("");
      setCategory("nft");
      setStatus("live");
      setTicketCost(1);
      setWinnerCount(1);
      setEndsAt("");
      setPerksText("");
      setImageUrl("");
    }
    setFormError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const setQuickSchedule = (days: number) => {
    const target = new Date(Date.now() + days * 86400000);
    setEndsAt(target.toISOString().slice(0, 16));
  };

  const handleSelectPresetImage = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError("Judul Undian wajib diisi!");
      return;
    }

    if (!endsAt) {
      setFormError("Batas waktu undian (ends_at) wajib diisi!");
      return;
    }

    if (!winnerCount || Number(winnerCount) <= 0) {
      setFormError("Jumlah pemenang harus lebih besar dari 0!");
      return;
    }

    if (prize.trim()) {
      const slotMatch = prize.trim().match(/\b(\d+)\s*(?:slot|tiket|pemenang|winner|kuota)\b/i);
      if (slotMatch && Number(slotMatch[1]) !== Number(winnerCount)) {
        setFormError(`Angka kuota pada teks hadiah (${slotMatch[1]} ${slotMatch[2] || "slot"}) harus sama dengan Jumlah Pemenang (${winnerCount})!`);
        return;
      }
    }

    if (imageUrl && imageUrl.trim().startsWith("data:")) {
      setFormError("Upload gambar ke storage lalu tempel URL-nya. Base64 data: URL dilarang.");
      return;
    }

    if (slotType !== "ITEM" && !imageUrl.trim()) {
      setFormError("URL Gambar wajib diisi untuk slot GTD, WL, dan GROUP.");
      return;
    }

    if (requirementXHandle.trim()) {
      const cleanHandle = requirementXHandle.trim();
      if (!/^@?[A-Za-z0-9_]{1,15}$/.test(cleanHandle)) {
        setFormError("Format akun X tidak valid! Gunakan 1-15 karakter (contoh: @BlobiMitra).");
        return;
      }
    }

    if (officialMintDomain.trim()) {
      const cleanDomain = officialMintDomain.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
      if (cleanDomain.includes("/") || !cleanDomain) {
        setFormError("Domain situs mint resmi harus tanpa https:// atau path (contoh: mint.mitra.xyz).");
        return;
      }
    }

    if (slotType === "ITEM") {
      if (!itemId) {
        setFormError("Item Blobi limited wajib dipilih!");
        return;
      }
      const itemOpt = LIMITED_ITEMS_OPTIONS.find((o) => o.id === itemId);
      if (itemOpt && Number(winnerCount) > itemOpt.total) {
        setFormError(`Sisa edisi item hanya ${itemOpt.total}.`);
        return;
      }
    }

    setSubmitting(true);
    setFormError(null);

    const perksArray = perksText
      .split(/[,;\n]/)
      .map((p) => p.trim())
      .filter(Boolean);

    const endsAtIso = new Date(endsAt).toISOString();

    const cleanDomain = officialMintDomain.trim()
      ? officialMintDomain.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "")
      : null;

    let cleanHandle = requirementXHandle.trim() || null;
    if (cleanHandle && !cleanHandle.startsWith("@")) {
      cleanHandle = `@${cleanHandle}`;
    }

    const calculatedPrize = prize.trim() || (
      slotType === "GTD"
        ? `${winnerCount} Slot GTD`
        : slotType === "WL"
        ? `${winnerCount} Slot WL`
        : slotType === "GROUP"
        ? `${winnerCount} Slot Grup Komunitas`
        : slotType === "ITEM"
        ? `${winnerCount}x ${LIMITED_ITEMS_OPTIONS.find((i) => i.id === itemId)?.name || "Item Limited"}`
        : title
    );

    const result = await rpcAdminUpsertRaffle({
      key: adminKey,
      id: id.trim() || `raf-${Date.now().toString(36)}`,
      title: title.trim(),
      prize: calculatedPrize,
      prizeDetail: prizeDetail.trim(),
      category: slotType === "ITEM" ? "outfit" : "nft",
      status,
      endsAt: endsAtIso,
      ticketCost: Number(ticketCost) || 1,
      winnerCount: Number(winnerCount) || 1,
      imageUrl: imageUrl.trim() || (slotType === "ITEM" ? LIMITED_ITEMS_OPTIONS.find((i) => i.id === itemId)?.src || "" : ""),
      nftNetwork: "Base",
      nftRarity: slotType === "GTD" ? "legendary" : slotType === "WL" ? "rare" : slotType === "ITEM" ? "mythic" : "utility",
      perks: perksArray,
      isSimulation: false,
      slotType: (slotType as "GTD" | "WL" | "GROUP" | "ITEM") || null,
      partnerName: partnerName.trim() || null,
      requirementXHandle: cleanHandle,
      officialMintDomain: cleanDomain,
      mintPrice: mintPrice.trim() || null,
      mintSchedule: mintSchedule.trim() || null,
      announcementDate: announcementDate.trim() || null,
      itemId: slotType === "ITEM" ? itemId : null,
    });

    setSubmitting(false);

    if (result.success) {
      onSaved();
      onClose();
    } else {
      setFormError(result.error || "Gagal menyimpan undian ke database.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[28px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b-2 border-choco-900/15 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-candy-500 border-2 border-choco-900 text-white flex items-center justify-center shadow-[0_2px_0_#3B2218]">
              {isEditing ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-candy-100 border border-choco-900 font-pixel text-[9px] font-bold text-candy-700 uppercase">
                Panel Admin Web3min
              </span>
              <h3 className="font-pixel text-lg sm:text-xl font-bold text-choco-900">
                {isEditing ? "Edit Undian Hadiah" : "Tambah Undian Baru"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1.5px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
            aria-label="Tutup modal"
          >
            <X className="size-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:p-6 space-y-5 overscroll-contain tactile-scrollbar">
          {/* Warning for raffle without slot_type */}
          {isEditing && !slotType && (
            <div className="p-3.5 rounded-2xl bg-amber-100 border-2 border-choco-900 text-choco-900 text-xs font-bold flex items-center gap-2.5 shadow-[0_2px_0_#3B2218]">
              <AlertTriangle className="size-5 text-amber-700 shrink-0" />
              <span>Raffle ini belum punya jenis hadiah. Pilih GTD / WL / GROUP / ITEM.</span>
            </div>
          )}

          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-[0_2px_0_#991B1B]">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form id="raffle-admin-form" onSubmit={handleSubmit} className="space-y-5 pb-4">
            {/* 1. JENIS HADIAH (SLOT TYPE) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3">
              <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                <Crown className="size-4 text-amber-600" />
                <span>Jenis Hadiah Undian (Wajib)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "GTD", label: "Slot GTD", sub: "Dijamin Mint", color: "border-candy-500 bg-candy-50 text-candy-900" },
                  { id: "WL", label: "Slot WL", sub: "Allowlist", color: "border-lemon bg-lemon/30 text-choco-900" },
                  { id: "GROUP", label: "Slot Grup", sub: "Komunitas Discord", color: "border-purple-500 bg-purple-50 text-purple-900" },
                  { id: "ITEM", label: "Item Limited", sub: "Outfit / Lencana", color: "border-emerald-500 bg-emerald-50 text-emerald-900" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSlotType(s.id as "GTD" | "WL" | "GROUP" | "ITEM");
                      if (s.id === "ITEM" && !itemId) setItemId("crown");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      slotType === s.id
                        ? `${s.color} border-choco-900 shadow-[0_3px_0_#3B2218]`
                        : "border-choco-900/20 bg-cream/40 text-choco-700 hover:bg-cream"
                    }`}
                  >
                    <div className="font-pixel text-xs font-bold">{s.label}</div>
                    <div className="text-[10px] font-medium text-choco-600 truncate">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. ITEM SELECTOR (IF SLOT TYPE = ITEM) */}
            {slotType === "ITEM" && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3">
                <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                  <Tag className="size-4 text-emerald-600" />
                  <span>Katalog Item Blobi Limited (Wajib)</span>
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                >
                  <option value="">-- Pilih Item dari Katalog --</option>
                  {LIMITED_ITEMS_OPTIONS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} • Edisi Terbatas: {item.total} Buah
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-medium text-choco-600">
                  Item limited tidak dijual di Toko dan langsung dikirim ke Ruang Ganti pemenang setelah pengundian.
                </p>
              </div>
            )}

            {/* 3. PARTNER & MINT SPEC (IF GTD, WL, GROUP) */}
            {slotType !== "ITEM" && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3.5">
                <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                  <Globe className="size-4 text-candy-700" />
                  <span>Informasi Proyek Mitra & Minting</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-choco-800 mb-1">
                      Nama Proyek Mitra
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Contoh: RoboHood NFT"
                      className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-choco-800 mb-1">
                      Domain Situs Mint Resmi (Tanpa http/path)
                    </label>
                    <input
                      type="text"
                      value={officialMintDomain}
                      onChange={(e) => setOfficialMintDomain(e.target.value)}
                      placeholder="robonft.xyz"
                      className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-choco-800 mb-1">
                      Harga Mint (Contoh: TBA / 0.02 ETH / Free)
                    </label>
                    <input
                      type="text"
                      value={mintPrice}
                      onChange={(e) => setMintPrice(e.target.value)}
                      placeholder="TBA atau Free Mint"
                      className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-choco-800 mb-1">
                      Jadwal Mint (Contoh: 10 Okt 2026 / TBA)
                    </label>
                    <input
                      type="text"
                      value={mintSchedule}
                      onChange={(e) => setMintSchedule(e.target.value)}
                      placeholder="10 Oktober 2026 atau TBA"
                      className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SYARAT X & JADWAL PENGUMUMAN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3.5">
              <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                <AtSign className="size-4 text-sky-600" />
                <span>Syarat Follow X & Pengumuman</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Syarat Follow Akun X (Opsional)
                  </label>
                  <input
                    type="text"
                    value={requirementXHandle}
                    onChange={(e) => setRequirementXHandle(e.target.value)}
                    placeholder="@RoboHoodNFT"
                    className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                  />
                  <p className="text-[10px] text-choco-500 mt-1">
                    Jika diisi, peserta wajib mengisi akun X mereka saat mendaftar.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Tanggal Pengumuman & Cek Follow
                  </label>
                  <input
                    type="text"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                    placeholder="1 Oktober 2026"
                    className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-semibold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                  />
                </div>
              </div>
            </div>

            {/* 5. GAMBAR / ARTWORK */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                  <ImageIcon className="size-4 text-candy-700" />
                  <span>URL Gambar / Artwork {slotType === "ITEM" && "(Opsional)"}</span>
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-[10px] font-pixel text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/raffles/robohood-gtd.png atau https://..."
                className="w-full px-3 py-2.5 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono text-choco-900 placeholder:text-choco-400 shadow-[0_1.5px_0_#3B2218]"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-choco-500">Preset Cepat:</span>
                {RAFFLE_IMAGE_PRESETS.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => handleSelectPresetImage(p.url)}
                    className="px-2 py-0.5 rounded-md bg-cream text-[10px] font-semibold text-choco-800 border border-choco-900/30 hover:bg-candy-100 cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. IDENTITAS & KUOTA UNDIAN */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218] space-y-3.5">
              <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                <Award className="size-4 text-amber-600" />
                <span>Identitas & Kuota Undian</span>
              </label>

              <div>
                <label className="block text-[11px] font-bold text-choco-800 mb-1">
                  Judul Undian (Wajib)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: RoboHood — 5 Slot GTD"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Kuota Pemenang (Wajib)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={winnerCount}
                    onChange={(e) => setWinnerCount(parseInt(e.target.value) || 1)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Biaya per Tiket (Koin)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ticketCost}
                    onChange={(e) => setTicketCost(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-choco-800 mb-1">
                    Status Undian
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AdminRaffleData["status"])}
                    className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                  >
                    <option value="live">BERLANGSUNG (LIVE)</option>
                    <option value="verifying">MENUNGGU VERIFIKASI</option>
                    <option value="upcoming">AKAN DATANG</option>
                    <option value="ended">SELESAI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-choco-800 mb-1">
                  Keterangan Hadiah Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="Keterangan opsional jika ingin mengubah tampilan teks hadiah"
                  className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-choco-800">
                    Batas Waktu Berakhir (ends_at - Wajib)
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setQuickSchedule(3)}
                      className="px-2 py-0.5 rounded bg-cream hover:bg-candy-100 border border-choco-900/30 font-semibold cursor-pointer"
                    >
                      +3 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSchedule(7)}
                      className="px-2 py-0.5 rounded bg-cream hover:bg-candy-100 border border-choco-900/30 font-semibold cursor-pointer"
                    >
                      +7 Hari
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickSchedule(14)}
                      className="px-2 py-0.5 rounded bg-cream hover:bg-candy-100 border border-choco-900/30 font-semibold cursor-pointer"
                    >
                      +14 Hari
                    </button>
                  </div>
                </div>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs font-mono font-bold text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-choco-800 mb-1">
                  Keistimewaan Tambahan (Perks, pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={perksText}
                  onChange={(e) => setPerksText(e.target.value)}
                  placeholder="Akses channel privat, Discord role khusus"
                  className="w-full px-3 py-2 rounded-xl bg-cream/30 border-2 border-choco-900 text-xs text-choco-900 shadow-[0_1.5px_0_#3B2218]"
                />
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 px-6 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_3px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                {submitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Check className="size-4" />
                    <span>{isEditing ? "Simpan Perubahan" : "Publikasikan Undian"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADMIN DELETE CONFIRMATION MODAL
// ----------------------------------------------------------------------
export function AdminDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  raffleTitle,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  raffleTitle: string;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
          aria-label="Tutup"
        >
          <X className="size-4.5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="size-12 rounded-2xl bg-rose-100 border-2 border-choco-900 flex items-center justify-center shadow-[0_3px_0_#3B2218]">
            <AlertTriangle className="size-6 text-rose-600" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-choco-900 font-pixel text-[9px] font-bold uppercase text-rose-800">
              Konfirmasi Hapus
            </span>
            <h3 className="font-pixel text-lg font-bold text-choco-900 leading-tight mt-0.5">
              Hapus Undian?
            </h3>
          </div>
        </div>

        <p className="text-xs font-semibold text-choco-700 mb-6 leading-relaxed">
          Apakah kamu yakin ingin menghapus undian{" "}
          <strong className="text-choco-900">"{raffleTitle}"</strong>? Seluruh data tiket yang
          terpasang akan dibatalkan secara permanen.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-full bg-white hover:bg-cream text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="py-2.5 px-5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#991B1B] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            {loading ? "Menghapus..." : "Ya, Hapus Undian"}
          </button>
        </div>
      </div>
    </div>
  );
}
