export const AREAS = ["Python", "React", "Desenvolvimento", "Dados", "Comunidade"] as const;
export const REGIOES = ["Rio de Janeiro", "Remoto", "Outros"] as const;

export type Area = (typeof AREAS)[number];
export type Regiao = (typeof REGIOES)[number];

export const API_URL = "http://localhost:8000";
export const CACHE_KEY = "vagas_cache";
