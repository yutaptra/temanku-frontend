const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (!API_BASE_URL) {
    return imageUrl;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;
}

export function mapDictionaryItem(item) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    image: getImageUrl(item.image_url),
  };
}

export function sortDictionary(items) {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, "id", {
      sensitivity: "base",
    }),
  );
}

export function getErrorMessage(err, fallback = "Terjadi kesalahan.") {
  const detail = err.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(", ");
  }

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  return fallback;
}
