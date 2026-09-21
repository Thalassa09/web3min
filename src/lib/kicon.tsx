import type { ComponentType, SVGProps } from "react";
import {
  Bitcoin as BitcoinS,
  BookOpen as BookOpenS,
  Briefcase as BriefcaseS,
  Broadcast as BroadcastS,
  Building as BuildingS,
  ChartNetwork as ChartNetworkS,
  Check as CheckS,
  ChevronsLeftRight as ChevronsLeftRightS,
  CircleUser as CircleUserS,
  Coins as CoinsS,
  Compass as CompassS,
  Droplet as DropletS,
  Flag as FlagS,
  Flame as FlameS,
  Gift as GiftS,
  Globe as GlobeS,
  HandHeart as HandHeartS,
  Heart as HeartS,
  Image as ImageS,
  Key as KeyS,
  Layers as LayersS,
  Link as LinkS,
  Lock as LockS,
  MapPin as MapPinS,
  Milestone as MilestoneS,
  RefreshCw as RefreshCwS,
  Search as SearchS,
  Shield as ShieldS,
  ShoppingBag as ShoppingBagS,
  Siren as SirenS,
  Store as StoreS,
  Trophy as TrophyS,
  UserMinus as UserMinusS,
  Users as UsersS,
  Wallet as WalletS,
  Wrench as WrenchS,
  X as XS,
  Zap as ZapS,
} from "@keyline-icons/react";
import {
  Bitcoin as BitcoinF,
  BookOpen as BookOpenF,
  Briefcase as BriefcaseF,
  Broadcast as BroadcastF,
  Building as BuildingF,
  ChartNetwork as ChartNetworkF,
  Check as CheckF,
  ChevronsLeftRight as ChevronsLeftRightF,
  CircleUser as CircleUserF,
  Coins as CoinsF,
  Compass as CompassF,
  Droplet as DropletF,
  Flag as FlagF,
  Flame as FlameF,
  Gift as GiftF,
  Globe as GlobeF,
  HandHeart as HandHeartF,
  Heart as HeartF,
  Image as ImageF,
  Key as KeyF,
  Layers as LayersF,
  Link as LinkF,
  Lock as LockF,
  MapPin as MapPinF,
  Milestone as MilestoneF,
  RefreshCw as RefreshCwF,
  Search as SearchF,
  Shield as ShieldF,
  ShoppingBag as ShoppingBagF,
  Siren as SirenF,
  Store as StoreF,
  Trophy as TrophyF,
  UserMinus as UserMinusF,
  Users as UsersF,
  Wallet as WalletF,
  Wrench as WrenchF,
  X as XF,
  Zap as ZapF,
} from "@keyline-icons/react/fill";

export type IconWeight = "fill" | "bold" | "regular";
export type IconProps = Omit<SVGProps<SVGSVGElement>, "size"> & {
  className?: string;
  weight?: IconWeight;
  size?: number | string;
  strokeWidth?: number;
};
export type Icon = ComponentType<IconProps>;

function wrap(stroke: ComponentType<IconProps>, fill: ComponentType<IconProps> = stroke): Icon {
  function KIcon({ weight = "regular", size, className, ...rest }: IconProps) {
    const Cmp = weight === "fill" ? fill : stroke;
    return (
      <Cmp
        className={className}
        size={typeof size === "number" ? size : 24}
        strokeWidth={weight === "bold" ? 2.4 : 2}
        aria-hidden
        {...rest}
      />
    );
  }
  return KIcon;
}

function HexSvg({
  weight = "regular",
  size = 24,
  className,
  style,
  ...rest
}: IconProps) {
  const filled = weight === "fill";
  const box = typeof size === "number" ? size : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      width={box}
      height={box}
      className={className}
      style={style}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={weight === "bold" ? 2.4 : 2}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
      {...rest}
    >
      <path d="M7.1 4.2h9.8L21 12l-4.1 7.8H7.1L3 12z" />
    </svg>
  );
}

export const Heart = wrap(HeartS, HeartF);
export const Fire = wrap(FlameS, FlameF);
export const Compass = wrap(CompassS, CompassF);
export const BookOpenText = wrap(BookOpenS, BookOpenF);
export const Handshake = wrap(HandHeartS, HandHeartF);
export const Storefront = wrap(StoreS, StoreF);
export const UserCircle = wrap(CircleUserS, CircleUserF);
export const Lock = wrap(LockS, LockF);
export const Check = wrap(CheckS, CheckF);
export const X = wrap(XS, XF);
export const MagnifyingGlass = wrap(SearchS, SearchF);
export const Broadcast = wrap(BroadcastS, BroadcastF);
export const UsersThree = wrap(UsersS, UsersF);
export const Trophy = wrap(TrophyS, TrophyF);
export const Signpost = wrap(MilestoneS, MilestoneF);
export const Hexagon = HexSvg;
export const Globe = wrap(GlobeS, GlobeF);
export const Stack = wrap(LayersS, LayersF);
export const Link = wrap(LinkS, LinkF);
export const Bank = wrap(BuildingS, BuildingF);
export const Wallet = wrap(WalletS, WalletF);
export const Key = wrap(KeyS, KeyF);
export const MapPin = wrap(MapPinS, MapPinF);
export const CurrencyBtc = wrap(BitcoinS, BitcoinF);
export const Coins = wrap(CoinsS, CoinsF);
export const Image = wrap(ImageS, ImageF);
export const ShoppingBag = wrap(ShoppingBagS, ShoppingBagF);
export const ArrowsLeftRight = wrap(ChevronsLeftRightS, ChevronsLeftRightF);
export const GasPump = wrap(DropletS, DropletF);
export const Graph = wrap(ChartNetworkS, ChartNetworkF);
export const Shield = wrap(ShieldS, ShieldF);
export const Siren = wrap(SirenS, SirenF);
export const UserMinus = wrap(UserMinusS, UserMinusF);
export const Gift = wrap(GiftS, GiftF);
export const Flag = wrap(FlagS, FlagF);
export const Briefcase = wrap(BriefcaseS, BriefcaseF);
export const Lightning = wrap(ZapS, ZapF);
export const ArrowsClockwise = wrap(RefreshCwS, RefreshCwF);
export const Wrench = wrap(WrenchS, WrenchF);
