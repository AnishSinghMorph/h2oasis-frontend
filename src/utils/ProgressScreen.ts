export const SESSIONS = [  
{
    id: "1",
    type: "Cold Plunge",
    date: "07:12 AM, Apr 30, 2024",
    duration: "02:00",
    temperature: "5",
  },
  {
    id: "2",
    type: "Hot Tub",
    date: "07:12 AM, Apr 30, 2024",
    duration: "10:00",
    temperature: "39",
  },
  {
    id: "3",
    type: "Sauna",
    date: "06:40 PM, Apr 29, 2024",
    duration: "15:00",
    temperature: "70",
  },
];

export const SESSION_ICONS: Record<string, any> = {
  "Cold Plunge": require("../../assets/icons/cold_plunge.png"),
  "Hot Tub": require("../../assets/icons/hot_tub.png"),
  "Sauna": require("../../assets/icons/sauna.png"),
};

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const METRICS = [
  {
    key: "stress",
    label: "Stress",
    value: "40%",
    icon: require("../../assets/progress/stress.png"),
  },
  {
    key: "sleep",
    label: "Sleep",
    value: "7 Hr",
    icon: require("../../assets/progress/sleep.png"),
  },
  {
    key: "heartRate",
    label: "Resting Heart Rate",
    value: "78 Bpm",
    icon: require("../../assets/progress/heart_rate.png"),
    highlight: true,
  },
];