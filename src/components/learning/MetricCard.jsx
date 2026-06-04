export default function MetricCard({ label, value, icon, dk }) {
  return (
    <div
      className={`${dk.card} flex-1 rounded-2xl border shadow-sm p-3 flex flex-col items-center gap-1.5`}
    >
      {icon}

      <p
        className={`${dk.textSecondary} text-[11px] font-medium text-center leading-tight`}
      >
        {label}
      </p>

      <p
        className={`font-display font-extrabold ${dk.textPrimary} text-xl leading-none`}
      >
        {value}
      </p>
    </div>
  );
}
