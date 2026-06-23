import React from "react";
import { View, Text } from "react-native";

export default function DetailsScreen({ route }) {
  const { task } = route.params;

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 14 }}>{task.title}</Text>
      <Text style={{ marginTop: 10 }}>{task.description}</Text>
      <Text>Status: {task.status}</Text>
      <Text>Created: {new Date(task.createdAt).toLocaleString()}</Text>
    </View>
  );
}