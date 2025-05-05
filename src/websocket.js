exports.setupWebsocket = (server, connection) => {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    try {
      const posts = await connection("posts").orderBy("publishedAt", "desc");

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        author: {
          avatarUrl: post.avatarUrl,
          name: post.authorName,
          role: post.authorRole,
        },
        content: JSON.parse(post.content),
        publishedAt: new Date(post.publishedAt),
      }));

      socket.emit("listaPosts", formattedPosts);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    }

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
