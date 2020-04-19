import React from "react";
import {Text} from "react-native";

const defaultStyle = {
  fontFamily: "IconFont",
};

export const IconFont = {
  Circle({style}) {
    const style = props.style;
    const glyph = String.fromCharCode(parseInt("0xf101", 16));
    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;
  },

  Polygon({style}) {
    const style = props.style;
    const glyph = String.fromCharCode(parseInt("0xf102", 16));
    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;
  },

  Rectangle({style}) {
    const style = props.style;
    const glyph = String.fromCharCode(parseInt("0xf103", 16));
    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;
  },

  Star({style}) {
    const style = props.style;
    const glyph = String.fromCharCode(parseInt("0xf104", 16));
    return <Text {...props} style={{...style, ...defaultStyle}}>{glyph}</Text>;
  },
}