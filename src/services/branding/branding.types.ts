export interface LogoURLs {
  original: string;
  variants?: Record<string, string>;
}

export interface BrandingLogos {
  logo: LogoURLs | null;
  logo_icon: LogoURLs | null;
  og_image: LogoURLs | null;
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
