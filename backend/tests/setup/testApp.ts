import app from "../../src/app";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Test server running on port 3000");
});