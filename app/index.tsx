import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';

const FILTROS: { valor: SerieFilter; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

export default function ListaScreen() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  // Recarrega sempre que a tela ganha foco (inclusive ao voltar do form)
  // e sempre que o filtro muda.
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const dados = await SerieRepository.getSeries(filtro);
        setSeries(dados);
      }
      carregar();
    }, [filtro]),
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Filtros */}
      <View className="flex-row mb-4">
        {FILTROS.map((f) => {
          const ativo = filtro === f.valor;
          return (
            <TouchableOpacity
              key={f.valor}
              onPress={() => setFiltro(f.valor)}
              className={`flex-1 py-2 mx-1 rounded-lg border ${
                ativo
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  ativo ? 'text-white' : 'text-gray-700'
                }`}
              >
                {f.rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista */}
      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const concluida = item.concluida === 1;
          return (
            <TouchableOpacity
              onPress={() => router.push(`/detalhe?id=${item.id}`)}
              className={`p-4 rounded-xl mb-3 border ${
                concluida
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className="flex-row justify-between items-center">
                <Text
                  className={`text-lg font-bold ${
                    concluida ? 'text-green-800' : 'text-gray-800'
                  }`}
                >
                  {item.titulo}
                </Text>
                {concluida && (
                  <Text className="text-green-700 text-xs font-bold">
                    ✓ CONCLUÍDA
                  </Text>
                )}
              </View>
              <Text className="text-gray-500 mt-1">
                {item.plataforma} · {item.temporadas} temporada(s)
              </Text>
              <Text className="text-amber-500 mt-1">
                {item.nota === null ? 'Sem nota' : '★'.repeat(item.nota)}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-12">
            Nenhuma série por aqui ainda.
          </Text>
        }
      />

      {/* Botão de cadastro */}
      <TouchableOpacity
        onPress={() => router.push('/form')}
        className="bg-indigo-600 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-bold text-base">
          + Nova série
        </Text>
      </TouchableOpacity>
    </View>
  );
}