import { useEffect, useState } from "react";

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export default function Avatar({ name, photoUrl, size = 96 }) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="rounded-full object-cover border-4 border-white shadow-lg"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #3F88FF 0%, #176AC3 100%)",
      }}
    >
      <span
        className="text-white font-display font-bold select-none"
        style={{ fontSize: size * 0.33 }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}
