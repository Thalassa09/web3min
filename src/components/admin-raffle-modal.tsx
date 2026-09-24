import * as React from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  AlertTriangle,
  Lock,
  Trash2,
  Edit3,
  Plus,
  Sparkles,
  Link as LinkIcon,
  Shield,
  Layers,
  Crown,
  Clock,
  Ticket,
} from "lucide-react";
import { rpcAdminVerifyKey, rpcAdminUpsertRaffle, rpcAdminDeleteRaffle } from "@/lib/server-sync";

export type AdminRaffleData = {
  id: string;
  title: string;
  prize: string;
  prizeDetail: string;
  category: "nft" | "gems" | "outfit" | "badge" | "tickets";
  status: "live" | "upcoming" | "ended" | "drawn";
  endsAt: string; // ISO string or datetime-local
  ticketCost: number;
  winnerCount: number;
  imageUrl?: string;
  nftNetwork?: string;
  nftContract?: string;
  nftTokenId?: string;
  nftRarity?: "mythic" | "legendary" | "rare" | "utility";
  perks?: string[];
};

export function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const webp = canvas.toDataURL("image/webp", quality);
          if (webp.startsWith("data:image/webp")) {
            resolve(webp);
            return;
          }
        } catch {}
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ----------------------------------------------------------------------
// ADMIN LOGIN MODAL
// ----------------------------------------------------------------------
export function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (key: string) => void;
}) {
  const [adminKey, setAdminKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setErrorMsg("Kunci admin wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const isValid = await rpcAdminVerifyKey(adminKey.trim());
      if (isValid) {
        localStorage.setItem("web3min_admin_auth", JSON.stringify({
          key: adminKey.trim(),
          authAt: Date.now(),
        }));
        onSuccess(adminKey.trim());
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
          Masukkan Kunci Rahasia Admin untuk menambah, mengubah, atau menghapus katalog Undian NFT Web3min.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-100 border-2 border-rose-500/50 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1.5">
              Kunci Rahasia Admin
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Masukkan password admin..."
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-choco-900 text-choco-900 font-mono text-sm placeholder:text-choco-400 shadow-[0_2px_0_#3B2218] focus:outline-none focus:ring-2 focus:ring-candy-500"
            />
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
// ADMIN RAFFLE FORM MODAL (TAMBAH / EDIT + IMAGE UPLOAD SPACE)
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
    const defaultEnd = new Date(Date.now() + 7 * 86400000);
    return defaultEnd.toISOString().slice(0, 16);
  });

  const [nftNetwork, setNftNetwork] = React.useState(initialData?.nftNetwork || "Base");
  const [nftContract, setNftContract] = React.useState(initialData?.nftContract || "");
  const [nftTokenId, setNftTokenId] = React.useState(initialData?.nftTokenId || "");
  const [nftRarity, setNftRarity] = React.useState<AdminRaffleData["nftRarity"]>(
    initialData?.nftRarity || "rare"
  );
  const [perksText, setPerksText] = React.useState(
    initialData?.perks ? initialData.perks.join(", ") : "Akses Artefak Eksklusif, Buff XP"
  );

  // Image Upload State
  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialData) {
      setId(initialData.id || "");
      setTitle(initialData.title || "");
      setPrize(initialData.prize || "");
      setPrizeDetail(initialData.prizeDetail || "");
      setCategory(initialData.category || "nft");
      setStatus(initialData.status || "live");
      setTicketCost(initialData.ticketCost || 1);
      setWinnerCount(initialData.winnerCount || 1);
      if (initialData.endsAt) {
        const d = new Date(initialData.endsAt);
        setEndsAt(!isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : "");
      }
      setNftNetwork(initialData.nftNetwork || "Base");
      setNftContract(initialData.nftContract || "");
      setNftTokenId(initialData.nftTokenId || "");
      setNftRarity(initialData.nftRarity || "rare");
      setPerksText(initialData.perks ? initialData.perks.join(", ") : "");
      setImageUrl(initialData.imageUrl || "");
    } else {
      setId(`raf-nft-${Date.now().toString(36)}`);
      setTitle("");
      setPrize("");
      setPrizeDetail("");
      setCategory("nft");
      setStatus("live");
      setTicketCost(1);
      setWinnerCount(1);
      const defaultEnd = new Date(Date.now() + 7 * 86400000);
      setEndsAt(defaultEnd.toISOString().slice(0, 16));
      setNftNetwork("Base");
      setNftContract("");
      setNftTokenId("");
      setNftRarity("rare");
      setPerksText("Akses Artefak Eksklusif, Buff XP");
      setImageUrl("");
    }
    setFormError(null);
    setUploadError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }
    setIsUploading(true);
    setUploadError(null);
    try {
      const dataUrl = await compressImageFile(file, 900, 900, 0.85);
      setImageUrl(dataUrl);
    } catch (err: unknown) {
      setUploadError((err as Error)?.message || "Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prize.trim()) {
      setFormError("Judul Undian dan Nama Hadiah wajib diisi!");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const perksArray = perksText
      .split(/[,;\n]/)
      .map((p) => p.trim())
      .filter(Boolean);

    const endsAtIso = endsAt ? new Date(endsAt).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString();

    const result = await rpcAdminUpsertRaffle({
      key: adminKey,
      id: id.trim() || `raf-${Date.now().toString(36)}`,
      title: title.trim(),
      prize: prize.trim(),
      prizeDetail: prizeDetail.trim(),
      category,
      status,
      endsAt: endsAtIso,
      ticketCost: Number(ticketCost) || 1,
      winnerCount: Number(winnerCount) || 1,
      imageUrl: imageUrl.trim(),
      nftNetwork: nftNetwork.trim() || "Base",
      nftContract: nftContract.trim(),
      nftTokenId: nftTokenId.trim(),
      nftRarity,
      perks: perksArray,
      isSimulation: true,
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
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-[28px] bg-cream border-3 border-choco-900 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b-2 border-choco-900/15 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-candy-500 border-2 border-choco-900 text-white flex items-center justify-center shadow-[0_2px_0_#3B2218]">
              {isEditing ? <Edit3 className="size-5" /> : <Plus className="size-5" />}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-candy-100 border border-choco-900 font-pixel text-[9px] font-bold text-candy-700 uppercase">
                Panel Admin Undian
              </span>
              <h3 className="font-pixel text-lg sm:text-xl font-bold text-choco-900">
                {isEditing ? "Edit Undian NFT" : "Tambah Undian Baru"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border-2 border-choco-900 bg-white text-choco-900 shadow-[0_1px_0_#3B2218] hover:bg-candy-100 active:translate-y-0.5 cursor-pointer transition-all"
            aria-label="Tutup"
          >
            <X className="size-4.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form id="raffle-admin-form" onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Upload & Preview Image Space */}
            <div className="p-4 rounded-2xl bg-white border-2 border-choco-900 shadow-[0_3px_0_#3B2218]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-pixel font-bold uppercase text-choco-900 flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-candy-600" />
                  <span>Gambar / Artwork NFT & Project</span>
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-[10px] font-pixel text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer"
                  >
                    Hapus Gambar
                  </button>
                )}
              </div>

              {/* Upload Dropzone & Live Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {imageUrl ? (
                  <div className="relative w-full h-36 rounded-xl border-2 border-choco-900 overflow-hidden bg-choco-900/5 shadow-inner flex items-center justify-center group">
                    <img
                      src={imageUrl}
                      alt="NFT Preview"
                      className="w-full h-full object-contain object-center"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-choco-900/80 text-white font-pixel text-[8px] font-bold">
                      PREVIEW LIVE
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-xl border-2 border-dashed border-choco-400 hover:border-candy-500 bg-candy-50/40 hover:bg-candy-50 flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all"
                  >
                    <Upload className="size-6 text-candy-600 mb-1 animate-pulse" />
                    <span className="font-pixel text-xs font-bold text-choco-900">
                      Klik / Drop Foto NFT
                    </span>
                    <span className="text-[10px] text-choco-500 font-semibold mt-0.5">
                      PNG, JPG, WEBP, GIF
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-2 px-3 rounded-xl bg-candy-100 hover:bg-candy-200 border-2 border-choco-900 text-candy-800 font-pixel text-xs font-bold shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="size-3.5" />
                    <span>{isUploading ? "Mengompres..." : "Pilih File Gambar"}</span>
                  </button>

                  <div className="relative">
                    <div className="text-[10px] font-bold text-choco-500 mb-1 flex items-center gap-1">
                      <LinkIcon className="size-3" />
                      <span>Atau Masukkan URL Gambar:</span>
                    </div>
                    <input
                      type="url"
                      value={imageUrl.startsWith("data:") ? "" : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://.../nft.png"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-choco-900 text-xs font-mono text-choco-900 placeholder:text-choco-400 focus:outline-none focus:ring-1 focus:ring-candy-500"
                    />
                  </div>
                </div>
              </div>

              {uploadError && (
                <p className="text-[11px] text-rose-600 font-bold mt-2">{uploadError}</p>
              )}
            </div>

            {/* 2. Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  ID Unik Undian
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={isEditing}
                  placeholder="raf-genesis-blobi"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 font-mono text-xs shadow-[0_1.5px_0_#3B2218] disabled:bg-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Judul Undian *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Genesis Blobi #002 (Mythic NFT)"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 text-xs font-semibold shadow-[0_1.5px_0_#3B2218]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Nama Hadiah / Item *
                </label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  required
                  placeholder="1/1 Mythic NFT + 0.1 ETH Grant"
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 text-xs font-semibold shadow-[0_1.5px_0_#3B2218]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Deskripsi & Cerita Hadiah
                </label>
                <textarea
                  value={prizeDetail}
                  onChange={(e) => setPrizeDetail(e.target.value)}
                  rows={2}
                  placeholder="Rincian utilitas, lore, atau hak pemegang artefak ini..."
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 text-xs font-medium shadow-[0_1.5px_0_#3B2218]"
                />
              </div>
            </div>

            {/* 3. Category, Network, & Rarity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AdminRaffleData["category"])}
                  className="w-full px-2 py-2 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold"
                >
                  <option value="nft">NFT Artifact</option>
                  <option value="gems">Koin/Gems</option>
                  <option value="outfit">Outfit Blobi</option>
                  <option value="badge">Badge Gelar</option>
                  <option value="tickets">Tiket Bonus</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdminRaffleData["status"])}
                  className="w-full px-2 py-2 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold"
                >
                  <option value="live">🟢 Live Aktif</option>
                  <option value="upcoming">🟡 Segera Datang</option>
                  <option value="ended">⚪ Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Rarity NFT
                </label>
                <select
                  value={nftRarity}
                  onChange={(e) => setNftRarity(e.target.value as AdminRaffleData["nftRarity"])}
                  className="w-full px-2 py-2 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold"
                >
                  <option value="mythic">Mythic 1/1</option>
                  <option value="legendary">Legendary</option>
                  <option value="rare">Rare</option>
                  <option value="utility">Utility</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Jaringan
                </label>
                <input
                  type="text"
                  value={nftNetwork}
                  onChange={(e) => setNftNetwork(e.target.value)}
                  placeholder="Ethereum / Base"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border-2 border-choco-900 text-xs font-semibold"
                />
              </div>
            </div>

            {/* 4. Numbers & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Biaya Tiket
                </label>
                <input
                  type="number"
                  min={1}
                  value={ticketCost}
                  onChange={(e) => setTicketCost(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Jumlah Pemenang
                </label>
                <input
                  type="number"
                  min={1}
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-choco-800 uppercase font-pixel mb-1">
                  Batas Waktu (WIB)
                </label>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl bg-white border-2 border-choco-900 text-xs font-semibold"
                />
              </div>
            </div>

            {/* 5. Perks & Contract */}
            <div>
              <label className="block text-[11px] font-bold text-choco-800 uppercase font-pixel mb-1">
                Keistimewaan / Perks (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={perksText}
                onChange={(e) => setPerksText(e.target.value)}
                placeholder="Akses Alpha Discord, Buff +50% XP, Gas Voucher"
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-choco-900 text-choco-900 text-xs font-medium"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t-2 border-choco-900/15 bg-cream-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="raffle-admin-form"
            disabled={submitting}
            className="py-2.5 px-6 rounded-full bg-candy-500 hover:bg-candy-600 disabled:opacity-50 text-white font-pixel font-bold text-xs sm:text-sm border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
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
  title,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-cream border-3 border-choco-900 p-5 sm:p-6 shadow-[0_8px_0_#3B2218] text-choco-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="size-11 rounded-2xl bg-rose-500 border-2 border-choco-900 text-white flex items-center justify-center shadow-[0_3px_0_#3B2218]">
            <Trash2 className="size-5" />
          </div>
          <div>
            <span className="font-pixel text-[9px] font-bold text-rose-700 bg-rose-100 border border-choco-900 px-2 py-0.5 rounded-full uppercase">
              Hapus Undian
            </span>
            <h4 className="font-pixel text-base font-bold text-choco-900 mt-0.5">
              Konfirmasi Penghapusan
            </h4>
          </div>
        </div>

        <p className="text-xs font-semibold text-choco-700 leading-relaxed mb-4">
          Apakah kamu yakin ingin menghapus undian <strong className="text-choco-900">"{title}"</strong>? Semua riwayat tiket pada undian ini akan dihapus dari sistem.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-2.5 px-4 rounded-full bg-white hover:bg-cream-100 text-choco-900 font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_2px_0_#3B2218] active:translate-y-0.5 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="py-2.5 px-5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-pixel font-bold text-xs border-2 border-choco-900 shadow-[0_4px_0_#3B2218] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5"
          >
            {loading ? (
              <span>Menghapus...</span>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Ya, Hapus</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
