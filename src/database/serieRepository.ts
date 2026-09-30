import { getDatabase } from './database';
import {
  Serie,
  CreateSerieInput,
  UpdateSerieInput,
  SerieFilter,
} from '../types/serie';

// Lista as séries conforme o filtro, da mais recente para a mais antiga.
// O filtro é resolvido no SQL (WHERE), não com .filter() no JavaScript.
export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();

  if (filtro === 'todas') {
    return db.getAllAsync<Serie>(
      'SELECT * FROM series ORDER BY createdAt DESC',
    );
  }

  const concluida = filtro === 'concluidas' ? 1 : 0;
  return db.getAllAsync<Serie>(
    'SELECT * FROM series WHERE concluida = ? ORDER BY createdAt DESC',
    concluida,
  );
}

// Busca uma série pelo id. Devolve null se não existir.
export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Serie>('SELECT * FROM series WHERE id = ?', id);
}

// Cadastra uma série nova e devolve ela já com o id gerado.
export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, 0, ?)',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    createdAt,
  );

  const serie = await getSerieById(result.lastInsertRowId);
  if (serie === null) {
    throw new Error('Série criada, mas não encontrada no banco.');
  }
  return serie;
}

// Atualiza os campos editáveis de uma série.
export async function updateSerie(
  id: number,
  input: UpdateSerieInput,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ? WHERE id = ?',
    input.titulo,
    input.plataforma,
    input.temporadas,
    input.nota,
    id,
  );
}

// Alterna entre assistindo (0) e concluída (1).
export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET concluida = 1 - concluida WHERE id = ?',
    id,
  );
}

// Exclui uma série.
export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', id);
}