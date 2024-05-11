
// avatar = [],
// name,
// _id,
// groupChat = false,
// sameSender,
// isOnline,
// newMessagesAlert,

// index = 0,
// handleDeleteChatOpen,
import Img from "../../src/assets/image/birthdaylogo.png"
export const sampleChats = [

    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Prakash Kush",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },

    {
        avatar: [
            "https://www.w3schools.com/howto/img_avatar.png",

        ],
        name: "Pra Kush",
        _id: "2",
        groupChat: true,
        members: ["1", "2"],
    },
]
export const sampleUsers = [

    {
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",

        name: "Pra Kush",
        _id: "1",
    },
    {
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",

        name: " Kush",
        _id: "2",
    }

]


export const sampleNotifications = [

    {
        sender: {
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",

            name: " Kush",
        },

        _id: "1",
    },
    {
        sender: {
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",

            name: " Kush",
        },
        _id: "2",
    }

]

export const sampleMessage = [
    {
        attachments: [
            {
                public_id: "1",
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",
            },
        ],

        content: "bhai ka message",
        _id: "ha;pguelhuha",

        sender: {

            _id: "user_id",
            name: " Kush",
        },
        chat: "chatId",
        createdAt: "2024-01-01T00:00:00.000Z",
    },
        {
        attachments: [
            {
                public_id: "2",
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nvlmwygLKlmp7aC6rEIPSgNEcTLbi1TV5P1gVU-LSwImRRp9CzMZywB1PPC9JjeFWNU&usqp=CAU",
            },
        ],

        content: "bhai ka aya message",
        _id: "ha;pguelhuh44a",

        sender: {

            _id: "pkbhail",
            name: " Kush2",
        },
        chat: "chatId2",
        createdAt: "2024-01-01T00:00:00.000Z",
        }
    
]

export const dashboardData = {

    users:[
        {
          name: "prakash",
          avatar: "https://www.w3schools.com/howto/img_avatar.png",

          _id: "1",
          username: "bld",
          friends: 20,
          groups: 5,
        },
        {
            name: "prakash",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
  
            _id: "2",
            username: "bldv",
            friends: 25,
            groups: 2,
          },
          {
            name: "abhi",
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
  
            _id: "3",
            username: "bvvd",
            friends: 10,
            groups: 12,
          },

    ],

    chats:[

        {
            name: "pk",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "4",
            groupChat: false,
            members: [{_id:"1"}, {avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id:"2"}, {avatar: "https://www.w3schools.com/howto/img_avatar.png"}],
            totalMembers: 2,
            totalMessages: 50,
            creator: {
                name: "jadu",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
               
            },
        },

        {
            name: "pkbahi",
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            _id: "6",
            groupChat: true,
            members: [{_id:"1"}, {avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id:"2"}, {avatar: "https://www.w3schools.com/howto/img_avatar.png"}, {_id:"3"}, {avatar: "https://www.w3schools.com/howto/img_avatar.png"}],
            totalMembers: 5,
            totalMessages: 100,
            creator: {
                name: "jadu kaha",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
               
            },
        },
    ],

    messages:[
        {
            attachments: [],
            content: "aur bhai l lag gye",
            _id: "dhfhklaukfaigfu",
            sender:{
                _id: "user.id",
                name: "chaman",
            },
            chat: "chatId",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
            attachments: [
                {
                    public_id: "ald2d",
                    url: "https://www.w3schools.com/howto/img_avatar.png",
                }
            ],
            content: "aur bhai lige lag gye",
            _id: "dhfhklaukfaigfkfhu",
            sender:{
                _id: "user.id",
                name: "chamanbhai",
            },
            chat: "chatId",
            createdAt: "2024-01-01T00:09:00.000Z",
        }

    ]
}