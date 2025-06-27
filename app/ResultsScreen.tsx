// ResultsScreen.tsx
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ResultsScreen({ 
  sortedNumbers, 
  missingNumbers, 
  onReset 
}: {
  sortedNumbers: number[],
  missingNumbers: number[],
  onReset: () => void
}) {
  const isNumberMissing = (num: number) => {
    return missingNumbers.includes(num);
  };

  return (
    <ThemedView style={styles.container}>
      {/* <ThemedText type="title">Conferência Finalizada</ThemedText> */}
      <ThemedText type="title">Total de Volumes: {sortedNumbers.length}</ThemedText>
      
      <ThemedView style={styles.resultsContainer}>
        <ThemedText type="subtitle">Volumes:</ThemedText>
        
        <ScrollView style={styles.numbersScroll}>
          {sortedNumbers.map((num, index) => {
            const isMissing = isNumberMissing(num);
            return (
              <ThemedText 
                key={index} 
                style={[
                  styles.numberItem,
                  isMissing && styles.missingNumber
                ]}
              >
                {num.toString().padStart(7, '0')}
                {isMissing && ' (quebra de sequência)'}
              </ThemedText>
            );
          })}
        </ScrollView>
      </ThemedView>

      {missingNumbers.length > 0 && (
        <ThemedView style={styles.missingContainer}>
          <ThemedText type="subtitle" style={styles.missingTitle}>
            Números faltantes ({missingNumbers.length}):
          </ThemedText>
          <ScrollView horizontal style={styles.missingScroll}>
            <ThemedText style={styles.missingNumbers}>
              {missingNumbers.map(n => n.toString().padStart(7, '0')).join(', ')}
            </ThemedText>
          </ScrollView>
        </ThemedView>
      )}
      
      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={onReset}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Nova Conferência</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  resultsContainer: {
    flex: 1,
    gap: 8,
  },
  numbersScroll: {
    height: 300, // Altura fixa de 300
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  numberItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
  },
  missingNumber: {
    color: 'red',
    fontWeight: 'bold',
  },
  missingContainer: {
    gap: 8,
    padding: 12,
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffdddd',
  },
  missingTitle: {
    color: 'red',
    fontSize: 16,
  },
  missingScroll: {
    maxHeight: 60,
  },
  missingNumbers: {
    color: 'red',
    fontSize: 14,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF', // Cor padrão do botão
  },
  resetButton: { // Adicione esta definição
    backgroundColor: '#34C759', // Cor verde para o botão de reset
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});