import { View, Text } from "react-native";
import React from "react";

type MyAppTextProps = {
  children: React.ReactNode;
};

const MyAppText = ({children}: MyAppTextProps) => {
  return <Text>{children}</Text>;
};

export default MyAppText;
