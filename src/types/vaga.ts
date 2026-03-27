export interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  link: string;
  localizacao: string;
  modalidade: string;
  area: string;
  data_postagem: string;
  status: 'Novo' | 'Candidatado' | 'Rejeitado';
  match_score?: number;
  insights?: string;
  descricao_completa?: string;
  keywords_ats?: string;
}

export interface Curriculo {
  id: number;
  nome: string;
  data_upload: string;
  is_active: boolean;
  texto_extraido: string;
}

export type TabAtiva = 'disponiveis' | 'candidaturas' | 'perfil';
