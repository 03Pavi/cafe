type OpeningBadgeProps = {
  label?: string;
};

export function OpeningBadge({ label = "Now Open" }: OpeningBadgeProps) {
  return (
    <span className="opening-badge" aria-label={label}>
      <span className="opening-badge__spark">New</span>
      {label}
    </span>
  );
}
