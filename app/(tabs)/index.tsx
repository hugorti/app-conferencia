import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Alert,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (currentNumber.length === 7) {
      handleAddNumber();
    }
  }, [currentNumber]);

    const handleAddNumber = useCallback(() => {
    if (currentNumber.length !== 7) return;
    
    const numericValue = parseInt(currentNumber, 10);
    
    // Verifica se o número começa acima de 1699999
    if (numericValue > 1699999) {
      Alert.alert('Volume inválido!', 'Bipe apenas a etiqueta laranja.');
      setCurrentNumber('');
      inputRef.current?.focus();
      return;
    }
    
    if (numbers.includes(currentNumber)) {
      Alert.alert('Número repetido', 'Este número já foi digitado anteriormente.');
      setCurrentNumber('');
      inputRef.current?.focus();
      return;
    }

    setNumbers(prev => [...prev, currentNumber]);
    setCurrentNumber('');
    inputRef.current?.focus();
  }, [currentNumber, numbers]);

     const handleFinishConference = useCallback(() => {
      if (numbers.length === 0) {
        Alert.alert('Lista vazia', 'Adicione pelo menos um número antes de finalizar');
        return;
      }

      // Validar intervalo máximo permitido (2000 números)
      const sorted = [...numbers].map(n => parseInt(n, 10)).sort((a, b) => a - b);
      const intervalo = sorted[sorted.length - 1] - sorted[0];
      
      if (intervalo > 2000) {
        Alert.alert(
          'Intervalo muito grande',
          `Você está tentando conferir um intervalo de ${intervalo} números (máximo permitido: 2000).\n\nOs volumes serão zerados para nova conferência.`,
          [
            { 
              text: 'Entendi', 
              onPress: () => {
                setNumbers([]);
                setCurrentNumber('');
                inputRef.current?.focus();
              }
            }
          ]
        );
        return;
      }

      setShowConfirmation(true);
    }, [numbers]);

  const confirmFinishConference = useCallback(() => {
    setShowConfirmation(false);
    setIsProcessing(true);
    Keyboard.dismiss();
    
    setTimeout(() => {
      setIsFinished(true);
      setIsProcessing(false);
    }, 100);
  }, []);

  const cancelFinishConference = useCallback(() => {
    setShowConfirmation(false);
    inputRef.current?.focus();
  }, []);

  const handleReset = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setNumbers([]);
      setIsFinished(false);
      setIsProcessing(false);
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleResumeConference = useCallback(() => {
    setIsFinished(false);
    inputRef.current?.focus();
  }, []);

  const handleNumberChange = useCallback((text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 7) {
      setCurrentNumber(numericText);
    }
  }, []);

  const handleOutsidePress = useCallback(() => {
    if (currentNumber.length === 0) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus();
    }
  }, [currentNumber]);

  const sortedNumbers = [...numbers]
    .map(num => parseInt(num, 10))
    .sort((a, b) => a - b);

  const findMissingNumbers = useCallback(() => {
    if (sortedNumbers.length < 2) return [];

    const first = sortedNumbers[0];
    const last = sortedNumbers[sortedNumbers.length - 1];
    const completeSequence = Array.from(
      {length: last - first + 1}, 
      (_, i) => first + i
    );
    
    return completeSequence.filter(num => !sortedNumbers.includes(num));
  }, [sortedNumbers]);

  const missingNumbers = findMissingNumbers();

   return (
    <View style={styles.mainContainer}>
      {/* Cabeçalho fixo */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/caixa.png')}
          style={styles.reactLogo}
        />
      </View>

      {/* Área de conteúdo rolável principal */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View>
            <ThemedText type="title">Volumes: {numbers.length}</ThemedText>
            
             {!isFinished ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    onChangeText={handleNumberChange}
                    value={currentNumber}
                    placeholder="Digite 7 dígitos"
                    keyboardType="number-pad"
                    maxLength={7}
                    autoFocus={true}
                    blurOnSubmit={false}
                    contextMenuHidden={true}
                    selectionColor="#007AFF"
                  />
                  <Text style={styles.counter}>
                    {currentNumber.length}/7
                  </Text>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.finishButton]}
                    onPress={handleFinishConference}
                    disabled={isProcessing || numbers.length === 0}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText}>Finalizar Conferência</Text>
                  </TouchableOpacity>
                </View>
                
                {numbers.length > 0 && (
                  <ThemedView style={styles.previewContainer}>
                    <ThemedText type="subtitle">Pré-visualização:</ThemedText>
                    <View style={styles.previewList}>
                      {numbers.map((num, index) => (
                        <ThemedText key={index}>{num.padStart(7, '0')}</ThemedText>
                      ))}
                    </View>
                  </ThemedView>
                )}
              </>
            ) : (
              <>
                {/* Botões no topo */}
                <View style={styles.topButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.resumeButton]}
                    onPress={handleResumeConference}
                    disabled={isProcessing}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText}>Voltar a Conferir</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.resetButton]}
                    onPress={handleReset}
                    disabled={isProcessing}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonText}>Nova Conferência</Text>
                  </TouchableOpacity>
                </View>

                <ThemedText type="subtitle">Conferência Finalizada</ThemedText>
                <ThemedText>Total: {sortedNumbers.length} volumes</ThemedText>
                {sortedNumbers.length > 0 && (
                  <ThemedText>
                    Intervalo: {sortedNumbers[0]?.toString().padStart(7, '0')} a {' '}
                    {sortedNumbers[sortedNumbers.length-1]?.toString().padStart(7, '0')}
                  </ThemedText>
                )}

                 {/* Números Faltantes */}
                {missingNumbers.length > 0 && (
                  <ThemedView style={styles.sectionContainer}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, styles.missingTitle]}>
                      Volumes Faltantes ({missingNumbers.length})
                    </ThemedText>
                    <View style={styles.numbersContainer}>
                      {missingNumbers.map((num, index) => (
                        <ThemedText 
                          key={index} 
                          style={[styles.numberItem, styles.missingNumber]}
                        >
                          {num.toString().padStart(7, '0')}
                        </ThemedText>
                      ))}
                    </View>
                  </ThemedView>
                )}

                {/* Números Conferidos */}
                <ThemedView style={styles.sectionContainer}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Volumes Conferidos ({sortedNumbers.length})
                  </ThemedText>
                  <View style={styles.numbersContainer}>
                    {sortedNumbers.map((num, index) => (
                      <ThemedText 
                        key={index} 
                        style={styles.numberItem}
                      >
                        {num.toString().padStart(7, '0')}
                      </ThemedText>
                    ))}
                  </View>
                </ThemedView>

               
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelFinishConference}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Confirmar Finalização
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Você está prestes a finalizar a conferência com {numbers.length} volumes.
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Deseja continuar?
            </ThemedText>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={cancelFinishConference}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmFinishConference}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    backgroundColor: '#865BA6',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  reactLogo: {
    height: 178,
    width: 290,
     bottom: 0,
    left: -95,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  counter: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#ff4444',
  },
  resetButton: {
    backgroundColor: '#34C759',
  },
  resumeButton: {
    backgroundColor: '#FF9500',
  },
  previewContainer: {
    marginBottom: 16,
    gap: 8,
  },
  previewList: {
    maxHeight: 300,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 22,
    fontWeight: 'bold',
  },
  missingTitle: {
    color: 'red',
  },
  numbersContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  numberItem: {
    padding: 8,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  missingNumber: {
    color: 'red',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
  },
  modalConfirmButton: {
    backgroundColor: '#ff4444',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});