import { Text, type TextProps, StyleSheet } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'greeting'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'viewAll';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'greeting',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        type === 'greeting' ? styles.greeting : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'viewAll' ? styles.viewAll : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 18,
    color: '#0A2533',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    color: '#0A2533',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 22,
    color: '#0A2533',
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 16,
    color: '#70B9BE',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0A2533',
  },
});
