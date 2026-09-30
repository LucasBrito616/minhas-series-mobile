// A série completa, exatamente como está salva no banco
export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null; // 1 a 5, ou null se a pessoa não deu nota
  concluida: number; // 0 = assistindo, 1 = concluída (SQLite não tem booleano)
  createdAt: string; // data em formato ISO 8601
}

// O que o usuário informa ao cadastrar.
// Sem id e createdAt (o banco e o repositório geram)
// e sem concluida (toda série nova começa como "assistindo").
export interface CreateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}

// O que o formulário de edição altera.
// Sem id, porque ele vai separado: updateSerie(id, input).
export interface UpdateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}

// Os três filtros possíveis da lista
export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';