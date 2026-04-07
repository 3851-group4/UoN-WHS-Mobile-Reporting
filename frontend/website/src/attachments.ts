const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "heic",
  "heif",
]);

export const isImageFile = (file: File) => file.type.startsWith("image/");

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export const isImageAttachment = (url: string, attachmentType?: string) => {
  if (attachmentType?.startsWith("image/")) {
    return true;
  }

  if (url.startsWith("data:image/")) {
    return true;
  }

  const cleanUrl = url.split("?")[0].split("#")[0];
  const ext = cleanUrl.includes(".")
    ? cleanUrl.substring(cleanUrl.lastIndexOf(".") + 1).toLowerCase()
    : "";

  return IMAGE_EXTENSIONS.has(ext);
};

export const getAttachmentName = (
  url: string,
  attachmentNames?: Record<string, string>,
) => {
  const explicitName = attachmentNames?.[url];
  if (explicitName) {
    return explicitName;
  }

  if (url.startsWith("data:")) {
    return "Attachment";
  }

  const cleanUrl = url.split("?")[0].split("#")[0];
  const segments = cleanUrl.split("/");
  const lastSegment = segments[segments.length - 1];

  return decodeURIComponent(lastSegment || "Attachment");
};

export const getAttachmentType = (
  url: string,
  attachmentTypes?: Record<string, string>,
) => {
  const explicitType = attachmentTypes?.[url];
  if (explicitType) {
    return explicitType;
  }

  if (url.startsWith("data:")) {
    const match = url.match(/^data:([^;]+);/);
    return match?.[1] || "";
  }

  return "";
};
