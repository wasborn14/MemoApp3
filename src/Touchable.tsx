import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleProp, ViewStyle} from 'react-native';

type Props = {
  name?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  unlock?: boolean;
  disabled?: boolean;
  activeOpacity?: number;
  key?: string | number;
};

export default function Touchable({
  children,
  style,
  onPress,
  onLongPress,
  unlock = false,
  disabled = false,
  activeOpacity,
  key,
}: React.PropsWithChildren<Props>) {
  const [lock, setLock] = useState(false);

  const press = useCallback(() => {
    if (!unlock) {
      if (lock) return;

      setLock(true);

      setTimeout(() => {
        setLock(false);
      }, 1500);
    }

    onPress && onPress();
  }, [onPress, unlock, lock]);

  return (
    <TouchableOpacity
      key={key}
      onPress={press}
      onLongPress={onLongPress}
      style={style}
      disabled={disabled || lock}
      activeOpacity={activeOpacity}
    >
      {children}
    </TouchableOpacity>
  );
}
