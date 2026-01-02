export interface BrandingLogos {
  logo: string;
  logo_icon: string;
  og_image: string;
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
