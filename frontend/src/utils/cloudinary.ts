type Transform = {
  w: number;
  h?: number;
  mode?: "limit" | "fill";
};

export function cld(url: string, { w, h, mode = "limit" }: Transform) {
  // If it's not a cloudinary link, we'll return it as is.
  if (!url?.includes("/image/upload/")) return url;

  // insert transformations after /upload/
  const base = [`f_auto`, `q_auto`, `dpr_auto`, `w_${w}`];

  if (mode === "fill" && h) {
    // crop on Cloudinary (good for portraits/squares)
    base.push(`h_${h}`, `c_fill`, `g_auto:subject`);
  } else {
    // We do NOT crop, we only limit the size (better for categories)
    base.push(`c_limit`);
  }

  const tr = base.join(",");
  return url.replace("/image/upload/", `/image/upload/${tr}/`);
}