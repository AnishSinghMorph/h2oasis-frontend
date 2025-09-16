import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  time: string;
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

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: questions[0].text, qid: 1, time: getCurrentTime() },
  ]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleAnswer = (answer: string) => {
    const qid = questions[currentQIndex].id;

    if (questions[currentQIndex].type === "text") {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: answer, qid, time: getCurrentTime() },
      ]);
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
          time: getCurrentTime(),
        },
      ]);
      setCurrentQIndex(nextIndex);
    }

    setInputValue("");
  };

  const renderMessage = (message: Message) => {
    const question = questions.find((q) => q.id === message.qid);

    return (
      <View
        key={`${message.qid}-${message.from}`}
        style={ChatScreenStyles.messageWrapper}
      >
        <View
          style={[
            ChatScreenStyles.message,
            message.from === "user"
              ? ChatScreenStyles.userMessage
              : ChatScreenStyles.botMessage,
          ]}
        >
          <Text
            style={
              message.from === "user"
                ? ChatScreenStyles.userText
                : ChatScreenStyles.botText
            }
          >
            {message.text}
          </Text>
        </View>

        {/* Time (below bubble) */}
        <Text
          style={[
            ChatScreenStyles.timeText,
            message.from === "user"
              ? ChatScreenStyles.userTime
              : ChatScreenStyles.botTime,
          ]}
        >
          {message.time}
        </Text>

        {message.from === "bot" && question?.type === "options" && (
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
      <KeyboardAvoidingView
        style={ChatScreenStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={ChatScreenStyles.mainContainer}>
            {/* Background Section */}
            <ImageBackground
              source={require("../../assets/app_bg.png")}
              style={ChatScreenStyles.backgroundImage}
              resizeMode="cover"
            >
              <View style={ChatScreenStyles.logoSection}>
                <Image
                  source={require("../../assets/evy.png")}
                  style={ChatScreenStyles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Messages */}
              <View style={ChatScreenStyles.messagesContainer}>
                {messages.map((message) => renderMessage(message))}
              </View>

              {/* Input */}
              {currentQ?.type === "text" && (
                <View style={ChatScreenStyles.inputBox}>
                  <TextInput
                    style={ChatScreenStyles.textInput}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Write a message..."
                    onSubmitEditing={() => {
                      if (inputValue.trim()) {
                        handleAnswer(inputValue.trim());
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={
                      inputValue.trim()
                        ? ChatScreenStyles.sendButton
                        : ChatScreenStyles.voiceButton
                    }
                    onPress={() => {
                      if (inputValue.trim()) {
                        handleAnswer(inputValue.trim());
                      }
                      // Add voice input handling here
                    }}
                  >
                    {inputValue.trim() ? (
                      <Image
                        source={require("../../assets/send.png")}
                        style={{ width: 43, height: 43 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/mic.png")}
                        style={{ width: 43, height: 43 }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </ImageBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
