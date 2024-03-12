const RealTimeDB=(app,io)=>{
  io.on('connection', (socket) => {
    console.log("New connection: " + socket.id);
    socket.on("/login", (roomName) => {
      socket.join(roomName);
      socket.emit("roomName", roomName);
      io.to(roomName).emit("joined","done");
    });

    socket.on("location", (data) => {
      try {
        const parsedData = JSON.parse(data);
        console.log("Received location data:", parsedData);
        io.to(parsedData.roomName).emit("location", parsedData);
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
    });
});
}

module.exports = {RealTimeDB};