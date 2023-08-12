

const usersData = [
  // {
  //   userEmail: "login@user.com",
  //   userId: 999,
  //   userMsgs: [],
  //   userName: "John Doe",
  //   userPass: "123",
  // },
];
let userUniqueId = 999;
let userMsgId = 2345234;



//logged user
app.get("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log(userId);
  const usersInfo = usersData.find((user) => {
    return userId === user.userId;
  });

  if (!usersInfo) {
    res.status(404).json({ error: "No users found!" });
    return;
  } else {
    res.status(200).json({
      userid: usersInfo.userId,
      email: usersInfo.userEmail,
      name: usersInfo.userName,
      messages: usersInfo.userMsgs,
    });
  }
});

app.post("/login", (req, res) => {
  const verifyUser = usersData.find((user) => {
    return (
      user.userEmail === req.body.userEmail &&
      user.userPass === req.body.userPass
    );
  });
  if (verifyUser) {
    res.status(200).json({
      message: "Login successful!",
      name: verifyUser.userName,
      userId: verifyUser.userId,
      messages: verifyUser.userMsgs,
    });
  } else if (verifyUser === undefined) {
    res.status(400).json({ error: "Wrong credentials!" });
    return;
  }
});

//Create Message
app.post("/:userId/message", (req, res) => {
  const userId = parseInt(req.params.userId);
  const findUser = usersData.find((user) => {
    return user.userId === userId;
  });

  if (!findUser) {
    res.status(404).json({ error: "User not found!" });
    return;
  } else {
    const newMessage = {
      messageId: userMsgId,
      title: req.body.title,
      message: req.body.message,
    };
    findUser.userMsgs.push(newMessage);
    userMsgId++;
    res
      .status(200)
      .json({ user: findUser.userName, message: findUser.userMsgs });
  }
});

//Update
app.put("/:userId/:messageId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const messageId = parseInt(req.params.messageId);

  const findUser = usersData.find((user) => {
    return user.userId === userId;
  });

  if (!findUser) {
    res.status(404).json({
      error: "User does not exist or has no permission to access this message",
    });
    return;
  } else {
    const findMessage = findUser.userMsgs.find((message) => {
      return message.messageId === messageId;
    });

    if (!findMessage) {
      res.status(404).json({ error: "Message does not exist" });
      return;
    } else {
      const updateTitle = req.body.title;
      const updateMsg = req.body.message;
      findMessage.title = updateTitle;
      findMessage.message = updateMsg;
    }
    res
      .status(200)
      .json({ user: findUser.userName, message: findUser.userMsgs });
  }
});

app.delete("/:userId/:messageId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const messageId = parseInt(req.params.messageId);

  const findUser = usersData.find((user) => {
    return user.userId === userId;
  });

  if (!findUser) {
    res.status(404).json({
      message:
        "User does not exist or has no permission to access this message",
    });
  } else {
    const findMessage = findUser.userMsgs.findIndex((message) => {
      return message.messageId === messageId;
    });

    if (findMessage < 0) {
      res.status(404).json({ error: "Message does not exist" });
      return;
    } else {
      findUser.userMsgs.splice(findMessage, 1);
    }
    res
      .status(200)
      .json({ user: findUser.userName, message: findUser.userMsgs });
  }
});

app.listen(3000, () => {
  console.log("Connected!");
  console.log("Node API running on port 3000");
});
