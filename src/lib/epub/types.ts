export type Item = {
  href: string;
  id: string;
  mediaType: string;
  fallback: string | null;
  mediaOverlay: string | null;
  properties: string | null;
};

export type Manifest = {
  items: Array<Item>;
};

export type Metadata = {
  identifier: string;
  language: string;
  title: string;
  contributor: string | null;
  coverage: string | null;
  creator: string | null;
  date: string | null;
  description: string | null;
  format: string | null;
  publisher: string | null;
  relation: string | null;
  rights: string | null;
  source: string | null;
  subject: string | null;
  type: string | null;
};

export type ItemRef = {
  idref: string;
  id: string | null;
  linear: string | null;
  properties: string | null;
};

export type Spine = {
  itemRefs: Array<ItemRef>;
};

export type Rootfile = {
  name: string;
  manifest: Manifest;
  metadata: Metadata;
  spine: Spine;
};
