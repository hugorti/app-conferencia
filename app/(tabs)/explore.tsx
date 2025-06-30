import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Desenvolvido por: Hugo Rodrigues</ThemedText>
      </ThemedView>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Funcionalidades:
      </ThemedText>
      <ThemedText>• Bipar caixa a caixa</ThemedText>
      <ThemedText>• Saber os volumes bipados</ThemedText>
      <ThemedText>• Verificar os volumes faltantes</ThemedText>

      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Regras:
      </ThemedText>
      <ThemedText>• Conferente só pode bipar uma caixa uma única vez</ThemedText>
      <ThemedText>• Não é permitido bipar a mesma caixa duas vezes</ThemedText>
      <ThemedText>• Volumes faltantes acima de 2000 não são permitidos</ThemedText>
      <ThemedText>• Tentativas de burlar o sistema serão bloqueadas</ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
});
