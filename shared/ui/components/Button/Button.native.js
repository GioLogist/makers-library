import React from 'react';
import { TouchableOpacity } from 'react-native'

function Button({children, onClick }){
  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.4}>{children}</TouchableOpacity>
  )
}

export default Button