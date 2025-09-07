
const chats = [
  {
    isGroupChat: false,
    users: [
      { name: "Ali Khan", email: "ali@example.com", _id: "u1" },
      { name: "Ahmed Raza", email: "ahmed@example.com", _id: "u2" },
    ],
    _id: "c1",
    chatName: "Ali Khan",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Fatima Bano", email: "fatima@example.com", _id: "u3" },
      { name: "Sara Khan", email: "sara@example.com", _id: "u4" },
    ],
    _id: "c2",
    chatName: "Fatima Bano",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Hassan Ali", email: "hassan@example.com", _id: "u5" },
      { name: "Bilal Ahmed", email: "bilal@example.com", _id: "u6" },
    ],
    _id: "c3",
    chatName: "Hassan Ali",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Ayesha Malik", email: "ayesha@example.com", _id: "u7" },
      { name: "Zain Khan", email: "zain@example.com", _id: "u8" },
    ],
    _id: "c4",
    chatName: "Ayesha Malik",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Hamza Shah", email: "hamza@example.com", _id: "u9" },
      { name: "Sana Ali", email: "sana@example.com", _id: "u10" },
    ],
    _id: "c5",
    chatName: "Hamza Shah",
  },
  {
    isGroupChat: true,
    users: [
      { name: "Ali Khan", email: "ali@example.com", _id: "u1" },
      { name: "Ahmed Raza", email: "ahmed@example.com", _id: "u2" },
      { name: "Fatima Bano", email: "fatima@example.com", _id: "u3" },
      { name: "Sara Khan", email: "sara@example.com", _id: "u4" },
    ],
    _id: "c6",
    chatName: "Family Group",
    groupAdmin: { name: "Ali Khan", email: "ali@example.com", _id: "u1" },
  },
  {
    isGroupChat: false,
    users: [
      { name: "Usman Qureshi", email: "usman@example.com", _id: "u11" },
      { name: "Noor Fatima", email: "noor@example.com", _id: "u12" },
    ],
    _id: "c7",
    chatName: "Usman Qureshi",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Irfan Malik", email: "irfan@example.com", _id: "u13" },
      { name: "Hira Khan", email: "hira@example.com", _id: "u14" },
    ],
    _id: "c8",
    chatName: "Irfan Malik",
  },
  {
    isGroupChat: false,
    users: [
      { name: "Adeel Ahmed", email: "adeel@example.com", _id: "u15" },
      { name: "Maham Ali", email: "maham@example.com", _id: "u16" },
    ],
    _id: "c9",
    chatName: "Adeel Ahmed",
  },
  {
    isGroupChat: true,
    users: [
      { name: "Hamza Shah", email: "hamza@example.com", _id: "u9" },
      { name: "Sana Ali", email: "sana@example.com", _id: "u10" },
      { name: "Usman Qureshi", email: "usman@example.com", _id: "u11" },
      { name: "Noor Fatima", email: "noor@example.com", _id: "u12" },
    ],
    _id: "c10",
    chatName: "Friends Group",
    groupAdmin: { name: "Sana Ali", email: "sana@example.com", _id: "u10" },
  },
 
];

export default chats;
