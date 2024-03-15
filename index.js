const express = require('express');
const PORT = process.env.PORT || 3000;
const { handler } = require("./controller")

const app = express();
app.use(express.json());

app.post("*", async (req, res) => {
    //console.log(req.body);

    res.send(await handler(req, "POST"));
})

app.get("*", async (req, res) => {
    res.send("Hello get");
    //res.send(await handler(req, "GET"));
})


app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("El puerto es: " + PORT)
}
)