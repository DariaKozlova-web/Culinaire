import { useEffect } from "react";

type MetaProps = {
  title: string;
  description?: string;
  image?: string;
};

function upsertMeta(
  selector: string,
  attributes: Record<string, string>
) {
  let element = document.head.querySelector(
    selector
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

export function usePageMeta({ title, description, image }: MetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | Culinaire`;
    document.title = fullTitle;

    // description
    if (description) {
      upsertMeta('meta[name="description"]', {
        name: "description",
        content: description,
      });

      upsertMeta('meta[property="og:description"]', {
        property: "og:description",
        content: description,
      });

      upsertMeta('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: description,
      });
    }

    // title for social
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });

    // image
    if (image) {
      upsertMeta('meta[property="og:image"]', {
        property: "og:image",
        content: image,
      });

      upsertMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: image,
      });
    }
  }, [title, description, image]);
}
