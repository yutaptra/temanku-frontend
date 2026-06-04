export default function Thumbnail({ item, variant = "card" }) {
  const isPreview = variant === "preview";

  if (!item.image) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary-500">
        <span className="text-white text-2xl font-bold">
          {item.name?.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={`Isyarat ${item.name}`}
      className={`w-full h-full object-center ${
        isPreview ? "object-contain" : "object-cover"
      }`}
    />
  );
}
