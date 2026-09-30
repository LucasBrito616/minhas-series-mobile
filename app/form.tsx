import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';

export default function FormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = id !== undefined; // /form?id=3 → editar | /form → cadastrar

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState(''); // TextInput sempre entrega string
  const [nota, setNota] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  // No modo edição, carrega a série e preenche os campos
  useEffect(() => {
    if (!editando) return;

    async function carregar() {
      const serie = await SerieRepository.getSerieById(Number(id));
      if (serie === null) {
        setErro('Série não encontrada.');
        return;
      }
      setTitulo(serie.titulo);
      setPlataforma(serie.plataforma);
      setTemporadas(String(serie.temporadas));
      setNota(serie.nota);
    }
    carregar();
  }, [id, editando]);

  // Tocar na nota já selecionada remove a nota
  function escolherNota(valor: number) {
    setNota(nota === valor ? null : valor);
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    const plataformaLimpa = plataforma.trim();
    const numTemporadas = Number(temporadas);

    if (tituloLimpo === '' || plataformaLimpa === '') {
      setErro('Preencha o título e a plataforma.');
      return;
    }
    if (
      temporadas.trim() === '' ||
      !Number.isInteger(numTemporadas) ||
      numTemporadas < 0
    ) {
      setErro('Temporadas precisa ser um número inteiro maior ou igual a 0.');
      return;
    }

    const input = {
      titulo: tituloLimpo,
      plataforma: plataformaLimpa,
      temporadas: numTemporadas,
      nota,
    };

    if (editando) {
      await SerieRepository.updateSerie(Number(id), input);
    } else {
      await SerieRepository.createSerie(input);
    }
    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-4">
      <Stack.Screen options={{ title: editando ? 'Editar série' : 'Nova série' }} />

      <Text className="font-semibold text-gray-700 mb-1">Título</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Ex.: Breaking Bad"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text className="font-semibold text-gray-700 mb-1">Plataforma</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Ex.: Netflix"
        value={plataforma}
        onChangeText={setPlataforma}
      />

      <Text className="font-semibold text-gray-700 mb-1">Temporadas assistidas</Text>
      <TextInput
        className="bg-white border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="0"
        keyboardType="numeric"
        value={temporadas}
        onChangeText={setTemporadas}
      />

      <Text className="font-semibold text-gray-700 mb-2">Nota</Text>
      <View className="flex-row mb-1">
        {[1, 2, 3, 4, 5].map((valor) => (
          <TouchableOpacity key={valor} onPress={() => escolherNota(valor)} className="mr-2">
            <Text className="text-4xl text-amber-500">
              {nota !== null && valor <= nota ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text className="text-gray-400 text-xs mb-6">
        {nota === null ? 'Sem nota — toque em uma estrela' : 'Toque de novo na mesma estrela para remover'}
      </Text>

      {erro !== '' && (
        <Text className="text-red-600 mb-4 font-semibold">{erro}</Text>
      )}

      <TouchableOpacity onPress={salvar} className="bg-indigo-600 p-4 rounded-xl">
        <Text className="text-white text-center font-bold text-base">
          {editando ? 'Salvar alterações' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}