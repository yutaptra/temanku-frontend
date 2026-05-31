export default function ProfileButton({
  icon,
  label,
  onClick,
  variant = "primary",
}) {
  const baseClassName = `
    w-full flex items-center justify-center gap-2.5
    py-3.5 rounded-2xl font-semibold text-sm
    transition-all duration-200 active:scale-95
  `;

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
      boxShadow: "0 4px 14px rgba(63,136,255,0.35)",
      color: "#fff",
    },
    danger: {
      background: "linear-gradient(135deg, #EF4444 0%, #D4183D 100%)",
      boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
      color: "#fff",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClassName}
      style={variants[variant] ?? variants.primary}
    >
      {icon}
      {label}
    </button>
  );
}
