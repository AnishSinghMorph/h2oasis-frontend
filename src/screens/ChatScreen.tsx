import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
  TextInput,
  ListRenderItem,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { ChatScreenStyles } from "../styles/ChatScreenStyles";

type QuestionType = "options" | "text";

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
}

interface Message {
  from: "bot" | "user";
  text: string;
  qid: number;
}

const questions: Question[] = [
  {
    id: 1,
    type: "options",
    text: "How active are you?",
    options: ["Sedentary", "Lightly Active", "Active"],
  },
  {
    id: 2,
    type: "text",
    text: "How often do you exercise?",
  },
  {
    id: 3,
    type: "text",
    text: "What is your typical exercise schedule?",
  },
  {
    id: 4,
    type: "options",
    text: "What is your sleep schedule?",
    options: ["6 Hours", "7 Hours", "8 Hours"],
  },
  {
    id: 5,
    type: "text",
    text: "What is your meal schedule?",
  },
  {
    id: 6,
    type: "options",
    text: "Have you ever experimented with hot and cold therapy?",
    options: [
      "I am new to contrast therapy",
      "I have tried it before",
      "I regularly cold plunge and sauna",
      "I have extensive experience",
    ],
  },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: questions[0].text, qid: 1 },
  ]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const flatListRef = React.useRef<FlatList<Message>>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleAnswer = (answer: string) => {
    const qid = questions[currentQIndex].id;

    if (questions[currentQIndex].type === "text") {
      setMessages((prev) => [...prev, { from: "user", text: answer, qid }]);
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [qid]: answer,
    }));

    const nextIndex = currentQIndex + 1;
    if (nextIndex < questions.length) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: questions[nextIndex].text,
          qid: questions[nextIndex].id,
        },
      ]);
      setCurrentQIndex(nextIndex);
    }

    setInputValue("");
  };

  // ✅ Single correct renderMessage
  const renderMessage: ListRenderItem<Message> = ({ item }) => {
    const question = questions.find((q) => q.id === item.qid);

    return (
      <View>
        <View
          style={[
            ChatScreenStyles.message,
            item.from === "user"
              ? ChatScreenStyles.userMessage
              : ChatScreenStyles.botMessage,
          ]}
        >
          <Text
            style={
              item.from === "user"
                ? ChatScreenStyles.userText
                : ChatScreenStyles.botText
            }
          >
            {item.text}
          </Text>
        </View>

        {/* Keep options under the bot message */}
        {item.from === "bot" && question?.type === "options" && (
          <View style={ChatScreenStyles.optionsBox}>
            {question.options?.map((opt, i) => {
              const isSelected = selectedAnswers[question.id] === opt;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    ChatScreenStyles.optionButton,
                    isSelected && ChatScreenStyles.optionSelected,
                  ]}
                  onPress={() => {
                    if (!selectedAnswers[question.id]) {
                      handleAnswer(opt);
                    }
                  }}
                >
                  <Text
                    style={[
                      ChatScreenStyles.optionText,
                      isSelected && ChatScreenStyles.optionSelectedText,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const currentQ = questions[currentQIndex];

  return (
    <View style={globalStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={require("../../assets/gradient_bg_1.png")}
        style={ChatScreenStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={ChatScreenStyles.overlay}>
          <View style={ChatScreenStyles.logoSection}>
            <Image
              source={require("../../assets/evy.png")}
              style={ChatScreenStyles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={ChatScreenStyles.container}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ padding: 10 }}
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Input box only for text questions */}
          {currentQ?.type === "text" && (
            <View style={ChatScreenStyles.inputBox}>
              <TextInput
                style={ChatScreenStyles.textInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Type your answer..."
              />
              <TouchableOpacity
                style={ChatScreenStyles.sendButton}
                onPress={() => {
                  if (inputValue.trim()) {
                    handleAnswer(inputValue.trim());
                  }
                }}
              >
                <Text style={ChatScreenStyles.sendText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ChatScreen;
