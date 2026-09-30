import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';
import { Serie } from '../src/types/serie';

export default function DetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [serie, setSerie] = useState<Serie | null>(null);

  // Recarrega ao ganhar foco: ao voltar da edição, os dados já aparecem atualizados
  const carregar = useCallback(async () => {
    setSerie(await SerieRepository.getSerieById(Number(id)));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  async function alternarConcluida() {
    await SerieRepository.toggleSerieConcluida(Number(id));
    await carregar();
  }

  async function excluir() {
    await SerieRepository.deleteSerie(Number(id));
    router.back();
  }

  function confirmarExclusao() {
    // No navegador o Alert.alert do React Native não aparece,
    // então usamos o confirm do próprio navegador.
    if (Platform.OS === 'web') {
      if (window.confirm('Excluir esta série?')) {
        excluir();
      }
      return;
    }

    Alert.alert('Excluir série', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  }

  if (serie === null) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">Carregando...</Text>
      </View>
    );
  }

  const concluida = serie.concluida === 1;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">{serie.titulo}</Text>

        <Text
          className={`self-start mt-2 px-3 py-1 rounded-full text-xs font-bold ${
            concluida ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'
          }`}
        >
          {concluida ? '✓ Concluída' : '▶ Assistindo'}
        </Text>

        <Text className="text-gray-600 mt-4">📺 {serie.plataforma}</Text>
        <Text className="text-gray-600 mt-1">
          🎞️ {serie.temporadas} temporada(s) assistida(s)
        </Text>
        <Text className="text-amber-500 text-xl mt-1">
          {serie.nota === null ? 'Sem nota' : '★'.repeat(serie.nota) + '☆'.repeat(5 - serie.nota)}
        </Text>
        <Text className="text-gray-400 text-xs mt-3">
          Cadastrada em {new Date(serie.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <TouchableOpacity
        onPress={alternarConcluida}
        className={`p-4 rounded-xl mb-3 ${concluida ? 'bg-indigo-600' : 'bg-green-600'}`}
      >
        <Text className="text-white text-center font-bold">
          {concluida ? '↩ Voltar para assistindo' : '✓ Marcar como concluída'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/form?id=${serie.id}`)}
        className="p-4 rounded-xl mb-3 bg-white border border-gray-300"
      >
        <Text className="text-gray-800 text-center font-bold">✏️ Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={confirmarExclusao}
        className="p-4 rounded-xl bg-white border border-red-300"
      >
        <Text className="text-red-600 text-center font-bold">🗑️ Excluir</Text>
      </TouchableOpacity>
    </View>
  );
}