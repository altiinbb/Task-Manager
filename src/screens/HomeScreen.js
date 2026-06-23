import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    loadTasks();
    fetchTasks();
  }, []);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem("TASKS");
    if (data) setTasks(JSON.parse(data));
  };

  const saveTasks = async (items) => {
    await AsyncStorage.setItem("TASKS", JSON.stringify(items));
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://dummyjson.com/todos");
      const data = await res.json();

      const formatted = data.todos.slice(0, 5).map((t) => ({
        id: t.id.toString(),
        title: t.todo,
       
        status: t.completed ? "completed" : "active",
        createdAt: new Date().toISOString(),
      }));

      setTasks(formatted);
      saveTasks(formatted);
    } catch (e) {
      console.log("API error");
    }
  };

  const addTask = () => {
    if (!title.trim() || !description.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setTitle("");
    setDescription("");
  };

  const toggleTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: t.status === "completed" ? "active" : "completed",
          }
        : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? t.status === "active"
        : t.status === "completed";

    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Task description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TouchableOpacity onPress={addTask} style={styles.button}>
        <Text style={{ color: "#fff" }}>Add Task</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <View style={styles.filterRow}>
        {["all", "active", "completed"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterBtn,
              filter === item && styles.filterActive,
            ]}
          >
            <Text style={{ color: "#fff" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No tasks found
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Details", { task: item })
            }
            style={styles.card}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>

              <Text
                style={{
                  color:
                    item.status === "completed" ? "green" : "red",
                }}
              >
                {item.status}
              </Text>
            </View>

            <View style={{ gap: 6 }}>
              <TouchableOpacity onPress={() => toggleTask(item.id)}>
                <Text>Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#6c5ce7",
    padding: 8,
    alignItems: "left",
    borderRadius: 8,
    marginBottom: 9,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    borderRadius: 8,
  },
  title: { fontWeight: "bold" },
  desc: { fontSize: 12, color: "#666" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: "#aaa",
    padding: 6,
    borderRadius: 6,
  },
  filterActive: {
    backgroundColor: "#6c5ce7",
  },
});
