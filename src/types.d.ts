declare module '@editorjs/embed' {
    import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';
    const Embed: ToolConstructable | ToolSettings;
    export default Embed;
}
declare module '@editorjs/table';
declare module '@editorjs/list';
declare module '@editorjs/quote';
declare module '@editorjs/header';
declare module '@editorjs/delimiter';
declare module '@editorjs/image';

export interface EditorJSBlock {
  type: string;
  data: Record<string, any>;
}

export interface EditorJSContent {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  published_at: string;
  updated_at?: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string; // Ajout de la description de la catégorie
    heroImage?: string; // Ajout de l'image de la catégorie
    main_category?: string;
  };
  content: string | EditorJSContent;
  reading_time?: number; // Ajout du temps de lecture
  author?: {
    username: string;
  };
  tags?: string[];
  type: 'article'; // Discriminant
}

export type ArticleCreate = {
  title: string;
  slug: string;
  category_id: number;
  content: EditorJSContent;
  status: 'published' | 'draft' | 'archived';
  image?: string;
  author_id?: string;
  reading_time?: number;
  source?: 'website' | 'n8n';
  source_url?: string;
  published_at?: string;
};

export type ArticleUpdate = Partial<ArticleCreate>;

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  heroImage?: string;
  main_category?: string;
}

export type Profile = {
  id: string;
  created_at: string;
  username: string;
  avatar_url: string;
  role: 'user' | 'super_admin' | 'editor' | 'premium' | 'vendor';
  plan: UserPlan;
  bio?: string;
  location?: string;
  website?: string;
};

export type PageProps<T = any> = {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_urls: string[];
  vendors: { name: string }[];
  category_id: number;
}

export interface ForumTopic {
  id: number;
  created_at: string;
  user_id: string;
  category_id: number;
  title: string;
  slug: string;
  is_locked: boolean;
  is_pinned: boolean;
  updated_at: string;
  views?: number;
  author?: {
    username: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  type: 'topic'; // Discriminant
}

export type HomepageItem = (Article | ForumTopic) & { sort_date: string };

export interface ForumPost {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  topic_id: number;
  content: string;
  author?: Profile;
}

// Dating Section Types
export type Gender = string;
export type Orientation = string;
export type UserPlan = 'free' | 'premium';

export interface Interest {
  id: number;
  name: string;
  icon: string;
  category?: string;
}

export interface DatingProfile {
  user_id: string;
  user?: { username: string };
  gender: Gender;
  orientation: Orientation;
  birth_date: string; // ISO 8601 format
  city: string;
  description: string;
  profile_picture_url?: string;
  interests: Interest[];
  is_validated: boolean;
  charter_signed_at?: string; // ISO 8601 format
  message_daily_count: number;
  last_message_reset?: string; // ISO 8601 format
  created_at: string; // ISO 8601 format
  updated_at?: string; // ISO 8601 format
  height?: number;
  religion?: string;
  education?: string;
  occupation?: string;
  dating_intent?: string;
  answers?: DatingQuestionAnswer[];
  // Joined data from profiles table
  username?: string;
  age?: number;
  plan?: UserPlan;
  photos?: DatingPhoto[];
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  compatibility?: number;
}

export interface DatingPhoto {
  id: number;
  image_url: string;
  sort_order: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DatingQuestionAnswer {
  id: number;
  profile_id: string;
  question_key: string;
  answer: string;
}

export interface Reaction {
  user_id: string;
  emoji: string;
}

export interface Message {
  id: number;
  from_user_id: string;
  to_user_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  reactions?: Reaction[];
}
