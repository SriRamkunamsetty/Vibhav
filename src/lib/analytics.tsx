"use client";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag("config", GA_ID as string, {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

// Ecommerce Event Helpers
export const trackEvent = (action: string, params: object) => {
  if (window.gtag) {
    window.gtag("event", action, params);
  }
};

export const trackSearch = (term: string) => {
  trackEvent("search", { search_term: term });
};

export const trackProductView = (product: any) => {
  trackEvent("view_item", {
    currency: "USD",
    value: product.price,
    items: [{
      item_id: product.objectID || product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price
    }]
  });
};

export const trackAddToCart = (product: any) => {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: product.price,
    items: [{
      item_id: product.objectID || product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: 1
    }]
  });
};
