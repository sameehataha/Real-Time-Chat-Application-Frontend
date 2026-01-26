export const sampleChats = [{
    avatar:["https://example.com/avatar1.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members:["1","2"],
},
{
    avatar:["https://example.com/avatar1.png"],
    name: "John nopoi",
    _id: "2",
    groupChat: true,
    members:["1","2"],
},
]

export const sampleUsers = [
{
    avatar:"https://example.com/avatar1.png",
    name: "John Doe",
    _id: "1",
},  
{
    avatar:"https://example.com/avatar2.png",
    name: "Jane Smith",
    _id: "2",
},
]

export const sampleNotifications = [
    {
    sender:{
        avatar:"https://example.com/avatar1.png",
        name: "John Doe",
    },
    _id: "1",
},  
{
    sender:{
        avatar:"https://example.com/avatar1.png",
        name: "John Doe",
    },
    _id: "2",
},  
]

export const sampleMessagel = [
    {
        attachments: [
            {
                public_id: "vdvv",
                url: "https://www.w3schools.com/howto/image_avatar.png"
            }
        ],
        content: "my message 1",
        _id: "dchdchdscdsck",
        sender:{
            _id: "user._id",
            name: "toyto",  
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    },
     {
        attachments: [
            {
                public_id: "vdvv2",
                url:"https://www.w3schools.com/howto/image_avatar.png"
            }
        ],
        content: "my message 2",
        _id: "dchdchdzsdadsasascdsck",
        sender:{
            _id: "adsadsadd",
            name: "toyto 3",  
        },
        chat:"chatId",
        createdAt:"2024-02-12T10:41:30.630Z"
    }
]

export const dashBoardData = {
    users: [
        {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "John Doe",
            _id: "1",
            username: "john_doe",
            friends: 20,
            groups: 5
        },  
        {
            avatar: "https://www.w3schools.com/howto/img_avatar2.png",
            name: "Jane Smith",
            _id: "2",
            username: "jane_doe",
            friends: 20,
            groups: 5
        },       
    ],
    chats: [
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "Team Alpha",
            _id: "1",
            groupChat: true,
            members: [
                { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
                { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar2.png" }
            ],
            totalMembers: 2,
            totalMessages: 45,
            creator: {
                name: "John Doe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            }
        },
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
            name: "Private Chat",
            _id: "2",
            groupChat: false,
            members: [
                { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
                { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar2.png" }
            ],
            totalMembers: 2,
            totalMessages: 120,
            creator: {
                name: "Jane Smith",
                avatar: "https://www.w3schools.com/howto/img_avatar2.png"
            }
        },
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "Project Discussion",
            _id: "3",
            groupChat: true,
            members: [
                { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
                { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar2.png" }
            ],
            totalMembers: 2,
            totalMessages: 89,
            creator: {
                name: "John Doe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            }
        }
    ],
    messages: [
        {
            attachments: [],
            content: "Hello everyone!",
            _id: "msg1",
            sender: {
                _id: "1",
                name: "John Doe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            },
            chat: "Team Alpha",
            groupChat: true,
            createdAt: "2024-02-12T10:41:30.630Z"
        },
        {
            attachments: [],
            content: "How's the project going?",
            _id: "msg2",
            sender: {
                _id: "2",
                name: "Jane Smith",
                avatar: "https://www.w3schools.com/howto/img_avatar2.png"
            },
            chat: "Private Chat",
            groupChat: false,
            createdAt: "2024-02-12T11:15:22.630Z"
        },
        {
            attachments: [
                {
                    public_id: "vdvv2",
                    url: "https://www.w3schools.com/howto/img_avatar.png"
                }
            ],
            content: "Check out this image",
            _id: "msg3",
            sender: {
                _id: "1",
                name: "John Doe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png"
            },
            chat: "Project Discussion",
            groupChat: true,
            createdAt: "2024-02-12T14:30:45.630Z"
        },
    ]
}