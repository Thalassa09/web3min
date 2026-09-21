import { DuoButton } from "@/components/duo-button";
import { Face } from "@/components/social/face";
import { lookOf, twitterUrl } from "@/lib/people";

export function PersonRow({
  name,
  blurb,
  now,
  twitter,
  following,
  onFollow,
  you,
}: {
  name: string;
  blurb: string;
  now: string;
  twitter: string;
  following: boolean;
  onFollow: () => void;
  you?: boolean;
}) {
  const look = lookOf(name);
  return (
    <li className={`social-trainer ${look.skin}`}>
      <Face name={name} size={56} you={you} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">@{name}</p>
        <p className="route-kind mt-1">{now}</p>
        <p className="mt-1 truncate text-sm leading-5 text-muted">{blurb}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <DuoButton size="sm" variant={following ? "ghost" : "primary"} onClick={onFollow}>
          {following ? "Mengikuti" : "Ikuti di web3min"}
        </DuoButton>
        {twitter ? (
          <a href={twitterUrl(twitter)} target="_blank" rel="noreferrer" className="min-h-11 px-1 text-sm font-bold text-primary-deep">
            Lihat profil X
          </a>
        ) : null}
      </div>
    </li>
  );
}
