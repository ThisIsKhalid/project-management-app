import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../theme/colors';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 8,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        multiline={multiline}
        style={{
          backgroundColor: colors.dark[700],
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          color: colors.text.primary,
          fontSize: 15,
          borderWidth: 1,
          borderColor: colors.dark[500],
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
};
