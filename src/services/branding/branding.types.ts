export interface LogoURLs {
  original: string;
  variants?: Record<string, string>;
}

export interface BrandingLogos {
  logo_light: LogoURLs | null;
  logo_dark: LogoURLs | null;
  icon_light: LogoURLs | null;
  icon_dark: LogoURLs | null;
}

export interface OgMetadata {
  title: string;
  description: string;
  image_url: string;
}

export interface BrandingResponse {
  business_name: string;
  logos: BrandingLogos | null;
  og_metadata: OgMetadata | null;
}
