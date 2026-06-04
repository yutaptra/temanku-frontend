export default function InfoState({
  title,
  message,
  buttonText,
  onClick,
  dk,
  danger = false,
}) {
  return (
    <div
      className={`
        ${dk.card}
        rounded-2xl border shadow-sm
        p-5 text-center
        ${danger ? "border-red-200" : ""}
      `}
    >
      <p className={`font-bold ${danger ? "text-red-600" : dk.textPrimary}`}>
        {title}
      </p>

      <p className={`${dk.textSecondary} text-sm mt-1`}>{message}</p>

      <button
        type="button"
        onClick={onClick}
        className="
          mt-4 px-5 py-2 rounded-xl
          font-semibold text-white text-sm
          active:scale-95 transition-transform
        "
        style={{
          background: danger
            ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
            : "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}
