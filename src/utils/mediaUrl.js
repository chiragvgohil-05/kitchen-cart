import api from "./api";

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

const resolveApiOrigin = () => {
    const baseURL = api.defaults.baseURL || "";

    if (!baseURL) {
        return "";
    }

    try {
        return new URL(baseURL).origin;
    } catch {
        return baseURL.replace(/\/api(?:\/v\d+)?\/?$/, "");
    }
};

const API_ORIGIN = resolveApiOrigin();

export const getProductImageUrl = (imagePath) => {
    if (!imagePath) {
        return "";
    }

    if (ABSOLUTE_URL_PATTERN.test(imagePath)) {
        return imagePath;
    }

    const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_ORIGIN}${normalizedPath}`;
};
